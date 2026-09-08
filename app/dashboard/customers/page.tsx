"use client";

import { useEffect, useCallback } from "react";
import {
  FaSearch,
  FaUserShield,
  FaUserCheck,
  FaSyncAlt,
  FaUsers,
  FaSpinner,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchDashboardCustomers,
  updateCustomerRoleThunk,
  setCustomersPage,
  setCustomersPageSize,
  setCustomersSearch,
  selectPaginatedCustomers,
} from "@/store/slices/dashboardSlice";
import { PaginationControls } from "@/components/dashboard/PaginationControls";
import { TableSkeleton } from "@/components/dashboard/DashboardSkeletons";
import toast from "react-hot-toast";

export default function CustomersPage() {
  const dispatch = useAppDispatch();
  const { isAdmin, token } = useAuth();

  // Redux memoized selectors & state
  const { items: paginatedCustomers, totalCount, totalPages, currentPage, pageSize } =
    useAppSelector(selectPaginatedCustomers);
  const loading = useAppSelector((state) => state.dashboard.customers.loading);
  const updatingId = useAppSelector((state) => state.dashboard.customers.updatingId);
  const search = useAppSelector((state) => state.dashboard.customers.search);

  // Fetch customers with cache TTL check (instant load if within 2 min cache)
  useEffect(() => {
    if (!token || !isAdmin) return;
    dispatch(fetchDashboardCustomers({ token }));
  }, [isAdmin, token, dispatch]);

  const handleRefresh = useCallback(() => {
    if (!token || !isAdmin) return;
    dispatch(fetchDashboardCustomers({ token, force: true }));
  }, [isAdmin, token, dispatch]);

  const toggleRole = async (userId: string, currentRole: "USER" | "ADMIN") => {
    if (!token || !isAdmin) return;
    const newRole: "USER" | "ADMIN" = currentRole === "ADMIN" ? "USER" : "ADMIN";
    try {
      await dispatch(updateCustomerRoleThunk({ userId, role: newRole, token })).unwrap();
      toast.success(`User access updated to ${newRole}!`, {
        icon:
          newRole === "ADMIN" ? (
            <FaUserShield className="text-purple-400 text-lg shrink-0" />
          ) : (
            <FaUserCheck className="text-emerald-400 text-lg shrink-0" />
          ),
      });
    } catch {
      toast.error("Failed to update user role");
    }
  };

  const isInitialLoading = loading && paginatedCustomers.length === 0 && !search;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            User & Customer Directory
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Registered Customers & Admins
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            View accounts registered in Neon PostgreSQL, check order counts, and manage administrator access privileges.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-3 text-xs font-bold text-white transition-all backdrop-blur-xs disabled:opacity-50 cursor-pointer self-start md:self-auto"
        >
          <FaSyncAlt className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-3 w-3" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => dispatch(setCustomersSearch(e.target.value))}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-[#E5A842] focus:bg-white transition-colors"
          />
        </div>

        <div className="text-xs font-bold text-gray-500">
          Total Users: <span className="text-gray-900">{totalCount}</span>
        </div>
      </div>

      {/* Customers Table or Skeletons */}
      {isInitialLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : paginatedCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
          <FaUsers className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-gray-800">No Customers Found</h3>
          <p className="text-xs text-gray-400 mt-1">
            {search ? "No users match your search query." : "No registered accounts found in the database."}
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                  <th className="py-3 px-3">User / Customer</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Orders</th>
                  <th className="py-3 px-3">Joined Date</th>
                  <th className="py-3 px-3 text-right">Access Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedCustomers.map((c) => {
                  const isUpdating = updatingId === c.id;
                  const isUserAdmin = c.role === "ADMIN";

                  return (
                    <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-gray-900">{c.name}</div>
                        <div className="text-[11px] text-gray-400 font-mono">
                          {c.firebaseUid ? `${c.firebaseUid.slice(0, 10)}...` : c.id.slice(0, 8)}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-gray-900 font-medium">{c.email}</div>
                        <div className="text-[11px] text-gray-400">{c.phone}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            isUserAdmin
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {isUserAdmin ? <FaUserShield className="h-3 w-3" /> : <FaUserCheck className="h-3 w-3" />}
                          {c.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        {c.ordersCount}
                      </td>
                      <td className="py-3 px-3 text-gray-400">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => toggleRole(c.id, c.role)}
                          disabled={isUpdating}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-50 ${
                            isUserAdmin
                              ? "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                              : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                          }`}
                        >
                          {isUpdating ? (
                            <FaSpinner className="h-3 w-3 animate-spin" />
                          ) : isUserAdmin ? (
                            <span>Demote to User</span>
                          ) : (
                            <span>Promote to Admin</span>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Memoized Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={(p) => dispatch(setCustomersPage(p))}
            onPageSizeChange={(s) => dispatch(setCustomersPageSize(s))}
            pageSizeOptions={[10, 25, 50]}
          />
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useCallback, useState, useMemo } from "react";
import {
  Users,
  ShieldCheck,
  UserCheck,
  ShoppingBag,
  CheckCircle2,
  RotateCw,
  Search,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  User,
  Copy,
  Check,
  X,
  Star,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchDashboardCustomers,
  setCustomersPage,
  setCustomersPageSize,
  setCustomersSearch,
  selectPaginatedCustomers,
  DashboardCustomer,
} from "@/store/slices/dashboardSlice";
import { TableSkeleton } from "@/components/dashboard/DashboardSkeletons";
import toast from "react-hot-toast";

// Helper to get cartoon avatar fallback for customers
const getCartoonAvatar = (customer: DashboardCustomer) => {
  const seed = encodeURIComponent(
    customer.name?.trim() || customer.email?.trim() || customer.id || "customer"
  );
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

export default function CustomersPage() {
  const dispatch = useAppDispatch();
  const { isAdmin, token } = useAuth();

  // Redux memoized selectors & state
  const { items: paginatedCustomers, totalCount, totalPages, currentPage, pageSize } =
    useAppSelector(selectPaginatedCustomers);
  const allCustomers = useAppSelector((state) => state.dashboard.customers.items);
  const loading = useAppSelector((state) => state.dashboard.customers.loading);
  const search = useAppSelector((state) => state.dashboard.customers.search);

  // Local state for UI controls
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "USER">("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewingCustomer, setViewingCustomer] = useState<DashboardCustomer | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fetch customers with cache TTL check (instant load if cached)
  useEffect(() => {
    if (!token || !isAdmin) return;
    dispatch(fetchDashboardCustomers({ token }));
  }, [isAdmin, token, dispatch]);

  const handleRefresh = useCallback(() => {
    if (!token || !isAdmin) return;
    dispatch(fetchDashboardCustomers({ token, force: true }));
  }, [isAdmin, token, dispatch]);

  // Copy helper
  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    toast.success(`Copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // KPI Calculations
  const totalUsersCount = allCustomers.length;
  const totalRevenueSpent = useMemo(
    () => allCustomers.reduce((acc, c) => acc + (c.totalSpent || 0), 0),
    [allCustomers]
  );
  const totalReviewsCount = useMemo(
    () => allCustomers.reduce((acc, c) => acc + (c.reviewsCount || 0), 0),
    [allCustomers]
  );

  // Filtered rows by role filter on top of search
  const displayedCustomers = useMemo(() => {
    if (roleFilter === "ALL") return paginatedCustomers;
    return paginatedCustomers.filter((c) => c.role === roleFilter);
  }, [paginatedCustomers, roleFilter]);

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(displayedCustomers.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isInitialLoading = loading && allCustomers.length === 0;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 1. Header Title matching Larkon aesthetic */}
      <div className="flex items-center justify-between">
        <h1 className="text-sm sm:text-base font-extrabold tracking-wider text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2">
          <span>CUSTOMER DIRECTORY</span>
        </h1>
        <button
          onClick={handleRefresh}
          disabled={loading}
          title="Refresh customers directory"
          className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#ff6c2f]" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* 2. Larkon KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Customers */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Customers
            </span>
            <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {totalUsersCount}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Registered Accounts
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Total Spent */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Spent
            </span>
            <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              ৳{totalRevenueSpent.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">
              Cumulative purchases
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Total Reviews */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Reviews
            </span>
            <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {totalReviewsCount}
            </div>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1 block">
              Customer Feedback
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
        </div>

        {/* Metric 4: Database Sync */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Database Sync
            </span>
            <div className="text-sm font-bold text-slate-800 dark:text-white mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Live Neon DB</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-1 block">
              PostgreSQL Connected
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Main Card Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xs">
        {/* Top Header Row: Customer List (Left) & Controls (Search + Role Filter on Right) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              All Customer List
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f]">
              {totalCount}
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Search filter input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => dispatch(setCustomersSearch(e.target.value))}
                placeholder="Search name, email, phone..."
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => dispatch(setCustomersSearch(""))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Role Filter dropdown */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="h-8 px-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="USER">Customers (Users)</option>
              <option value="ADMIN">Admins Only</option>
            </select>

            {/* Page Size dropdown */}
            <select
              value={pageSize}
              onChange={(e) => dispatch(setCustomersPageSize(Number(e.target.value)))}
              className="h-8 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>

        {/* 4. Table or Loading / Empty States */}
        {isInitialLoading ? (
          <div className="py-4">
            <TableSkeleton rows={6} cols={7} />
          </div>
        ) : displayedCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-12 text-center my-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              No Customers Found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {search
                ? `No customers matched "${search}". Try searching for another name or email.`
                : "No registered accounts found in the database directory."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3 w-10">
                    <input
                      type="checkbox"
                      checked={
                        displayedCustomers.length > 0 &&
                        selectedIds.length === displayedCustomers.length
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-600 text-[#ff6c2f] focus:ring-[#ff6c2f] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Contact Info</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Total Orders</th>
                  <th className="py-3 px-3">Reviews</th>
                  <th className="py-3 px-3">Total Spent</th>
                  <th className="py-3 px-3 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {displayedCustomers.map((c) => {
                  const isUserAdmin = c.role === "ADMIN";
                  const isSelected = selectedIds.includes(c.id);

                  // Primary image source: real photoURL / avatar / image, fallback to cartoon avatar
                  const initialPhoto = c.photoURL || c.avatar || c.image;
                  const cartoonFallback = getCartoonAvatar(c);
                  const displayImage = initialPhoto || cartoonFallback;

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors ${
                        isSelected ? "bg-orange-50/30 dark:bg-orange-950/10" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(c.id)}
                          className="rounded border-slate-300 dark:border-slate-600 text-[#ff6c2f] focus:ring-[#ff6c2f] cursor-pointer"
                        />
                      </td>

                      {/* Customer Profile: Full Rounded Image + Name + UID */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          {/* Full Rounded Image with cartoon avatar fallback */}
                          <div className="relative w-10 h-10 rounded-full shrink-0 overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 bg-slate-100 dark:bg-slate-800 shadow-2xs">
                            <img
                              src={displayImage}
                              alt={c.name || "Customer Avatar"}
                              loading="lazy"
                              onError={(e) => {
                                // If custom photo fails to load, gracefully fallback to cartoon avatar
                                const target = e.currentTarget;
                                if (target.src !== cartoonFallback) {
                                  target.src = cartoonFallback;
                                }
                              }}
                              className="w-full h-full object-cover rounded-full"
                            />
                            {/* Little status badge on avatar */}
                            {isUserAdmin && (
                              <span
                                title="Admin User"
                                className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-purple-600 ring-1.5 ring-white dark:ring-slate-900 flex items-center justify-center text-[7px] text-white"
                              >
                                ★
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                                {c.name || "Anonymous User"}
                              </span>
                              <button
                                type="button"
                                onClick={() => setViewingCustomer(c)}
                                title="View Customer Details"
                                className="text-slate-400 hover:text-[#ff6c2f] dark:hover:text-[#ff6c2f] p-0.5 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                              <span>UID:</span>
                              <span className="truncate max-w-[90px]">
                                {c.firebaseUid
                                  ? `${c.firebaseUid.slice(0, 8)}...`
                                  : c.id.slice(0, 8)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-medium">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[170px]" title={c.email}>
                              {c.email || "No email registered"}
                            </span>
                          </div>
                          {c.phone ? (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              <Phone className="w-3 h-3 shrink-0" />
                              <span>{c.phone}</span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400 italic">No phone</div>
                          )}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                            isUserAdmin
                              ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {isUserAdmin ? (
                            <ShieldCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          ) : (
                            <UserCheck className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                          )}
                          <span>{c.role}</span>
                        </span>
                      </td>

                      {/* Total Orders */}
                      <td className="py-3 px-3">
                        <div className="inline-flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                          <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.ordersCount || 0}</span>
                          <span className="text-[11px] font-normal text-slate-400">
                            {c.ordersCount === 1 ? "order" : "orders"}
                          </span>
                        </div>
                      </td>

                      {/* Reviews Count */}
                      <td className="py-3 px-3">
                        <div className="inline-flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                          <Star
                            className={`w-3.5 h-3.5 ${
                              (c.reviewsCount || 0) > 0
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                          />
                          <span>{c.reviewsCount || 0}</span>
                          <span className="text-[11px] font-normal text-slate-400">
                            {(c.reviewsCount || 0) === 1 ? "review" : "reviews"}
                          </span>
                        </div>
                      </td>

                      {/* Total Spent */}
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-100">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          ৳{(c.totalSpent || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-3 text-right text-slate-500 dark:text-slate-400">
                        <div className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>
                            {c.createdAt
                              ? new Date(c.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination Footer */}
        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
            <div>
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {Math.min(currentPage * pageSize, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {totalCount}
              </span>{" "}
              customers
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => dispatch(setCustomersPage(Math.max(1, currentPage - 1)))}
                disabled={currentPage <= 1}
                className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, idx, arr) => {
                  const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && <span className="px-1 text-slate-400">...</span>}
                      <button
                        type="button"
                        onClick={() => dispatch(setCustomersPage(p))}
                        className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          currentPage === p
                            ? "bg-[#ff6c2f] text-white"
                            : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                type="button"
                onClick={() =>
                  dispatch(setCustomersPage(Math.min(totalPages, currentPage + 1)))
                }
                disabled={currentPage >= totalPages}
                className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Customer Details Quick View Modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ff6c2f]">
                  Customer Profile
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingCustomer(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Hero Card */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-md shrink-0">
                <img
                  src={
                    viewingCustomer.photoURL ||
                    viewingCustomer.avatar ||
                    viewingCustomer.image ||
                    getCartoonAvatar(viewingCustomer)
                  }
                  alt={viewingCustomer.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const cartoon = getCartoonAvatar(viewingCustomer);
                    if (target.src !== cartoon) target.src = cartoon;
                  }}
                />
              </div>

              <div className="text-center sm:text-left flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate">
                  {viewingCustomer.name || "Anonymous User"}
                </h3>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      viewingCustomer.role === "ADMIN"
                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {viewingCustomer.role === "ADMIN" ? (
                      <ShieldCheck className="w-3 h-3 text-purple-600" />
                    ) : (
                      <User className="w-3 h-3 text-slate-500" />
                    )}
                    {viewingCustomer.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Ribbon inside Modal */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Orders</span>
                <span className="text-base font-bold text-slate-800 dark:text-white mt-0.5 block">
                  {viewingCustomer.ordersCount || 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Reviews</span>
                <span className="text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {viewingCustomer.reviewsCount || 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Spent</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  ৳{(viewingCustomer.totalSpent || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="space-y-3 text-xs">
              {/* Email */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-[#ff6c2f]" />
                  <span className="font-semibold">Email:</span>
                  <span className="text-slate-800 dark:text-white font-medium">
                    {viewingCustomer.email || "N/A"}
                  </span>
                </div>
                {viewingCustomer.email && (
                  <button
                    type="button"
                    onClick={() => handleCopy(viewingCustomer.email, "email")}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-[#ff6c2f]" />
                  <span className="font-semibold">Phone:</span>
                  <span className="text-slate-800 dark:text-white font-medium">
                    {viewingCustomer.phone || "Not provided"}
                  </span>
                </div>
                {viewingCustomer.phone && (
                  <button
                    type="button"
                    onClick={() => handleCopy(viewingCustomer.phone, "phone")}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {copiedField === "phone" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Database ID / UID */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 min-w-0">
                  <User className="w-4 h-4 text-[#ff6c2f] shrink-0" />
                  <span className="font-semibold shrink-0">User ID:</span>
                  <span className="text-slate-800 dark:text-white font-mono text-[11px] truncate">
                    {viewingCustomer.firebaseUid || viewingCustomer.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      viewingCustomer.firebaseUid || viewingCustomer.id,
                      "uid"
                    )
                  }
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
                >
                  {copiedField === "uid" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Joined Date */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-[#ff6c2f]" />
                  <span className="font-semibold">Registered:</span>
                  <span className="text-slate-800 dark:text-white font-medium">
                    {viewingCustomer.createdAt
                      ? new Date(viewingCustomer.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewingCustomer(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>

              {viewingCustomer.email && (
                <a
                  href={`mailto:${viewingCustomer.email}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#ff6c2f] hover:bg-[#e0561b] text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  FaSearch,
  FaUserShield,
  FaUserCheck,
  FaSyncAlt,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

interface CustomerItem {
  id: string;
  firebaseUid?: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  ordersCount: number;
  createdAt: string;
}

export default function CustomersPage() {
  const { isAdmin, token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!token || !isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getAdminUsers(token);
      if (Array.isArray(data)) {
        const mapped = data.map((u: any) => ({
          id: u.id,
          firebaseUid: u.firebaseUid,
          name: u.displayName || u.email?.split("@")[0] || "User",
          email: u.email || "No email",
          phone: u.phoneNumber || "N/A",
          role: u.role || "USER",
          ordersCount: u._count?.orders || 0,
          createdAt: u.createdAt,
        }));
        setCustomers(mapped);
      }
    } catch (err) {
      console.error("Failed to load users from backend:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isAdmin, token]);

  const toggleRole = async (userId: string, currentRole: "USER" | "ADMIN") => {
    if (!token || !isAdmin) return;
    const newRole: "USER" | "ADMIN" = currentRole === "ADMIN" ? "USER" : "ADMIN";
    setUpdatingId(userId);
    try {
      await api.updateUserRole(userId, newRole, token);
      setCustomers((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, role: newRole } : c))
      );
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onClick={fetchUsers}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <FaSyncAlt className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E5A842]"
            />
            <FaSearch className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-gray-400" />
          </div>

          <span className="text-xs font-bold text-gray-400 self-end sm:self-auto">
            {filteredCustomers.length} Total Users Found
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading registered users from server...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center p-6">
            <FaUsers className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-800">No Users Found</h3>
            <p className="text-xs text-gray-400 mt-1">
              {isAdmin
                ? "No matching users found in the database."
                : "Sign in with an Administrator account to manage users."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-4">User</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Phone</th>
                  <th className="py-4 px-4">Orders</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-2xl bg-amber-100 text-[#E5A842] flex items-center justify-center font-black text-xs shrink-0">
                          {customer.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">{customer.name}</span>
                          <span className="text-[10px] text-gray-400 font-normal">
                            Joined {new Date(customer.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{customer.email}</td>
                    <td className="py-4 px-4 text-gray-500">{customer.phone}</td>
                    <td className="py-4 px-4 font-black text-gray-900">{customer.ordersCount} Orders</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                          customer.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {customer.role === "ADMIN" ? (
                          <>
                            <FaUserShield className="h-3 w-3" />
                            <span>ADMIN</span>
                          </>
                        ) : (
                          <>
                            <FaUserCheck className="h-3 w-3" />
                            <span>USER</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => toggleRole(customer.id, customer.role)}
                        disabled={updatingId === customer.id}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-colors cursor-pointer ${
                          customer.role === "ADMIN"
                            ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                            : "bg-amber-50 text-[#E5A842] hover:bg-amber-100"
                        }`}
                      >
                        {updatingId === customer.id
                          ? "Updating..."
                          : customer.role === "ADMIN"
                          ? "Demote to User"
                          : "Promote to Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

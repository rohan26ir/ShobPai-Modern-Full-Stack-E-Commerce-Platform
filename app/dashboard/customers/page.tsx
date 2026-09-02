"use client";

import { useState } from "react";
import {
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShoppingBag,
  FaStar,
  FaUserShield,
  FaCheck,
  FaUserCheck,
} from "react-icons/fa";

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  orders: number;
  totalSpent: string;
  status: string;
  avatar: string;
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const [customers, setCustomers] = useState<CustomerItem[]>([
    { id: "USR-001", name: "Admin Manager", email: "admin@shobpai.com", phone: "+880 1711-000000", role: "ADMIN", orders: 35, totalSpent: "$2,840.50", status: "System Admin", avatar: "AM" },
    { id: "USR-002", name: "Sophia Martinez", email: "sophia.m@example.com", phone: "+880 1812-345678", role: "USER", orders: 12, totalSpent: "$840.50", status: "VIP Customer", avatar: "SM" },
    { id: "USR-003", name: "Liam Johnson", email: "liam.j@example.com", phone: "+880 1913-456789", role: "USER", orders: 4, totalSpent: "$210.00", status: "Active User", avatar: "LJ" },
    { id: "USR-004", name: "Emma Williams", email: "emma.w@example.com", phone: "+880 1714-567890", role: "USER", orders: 18, totalSpent: "$1,450.90", status: "VIP Customer", avatar: "EW" },
    { id: "USR-005", name: "Noah Brown", email: "noah.b@example.com", phone: "+880 1615-678901", role: "USER", orders: 2, totalSpent: "$96.20", status: "Active User", avatar: "NB" },
    { id: "USR-006", name: "Olivia Miller", email: "olivia.m@example.com", phone: "+880 1516-789012", role: "USER", orders: 7, totalSpent: "$480.30", status: "Active User", avatar: "OM" },
  ]);

  const toggleRole = (userId: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === userId) {
          const newRole = c.role === "ADMIN" ? "USER" : "ADMIN";
          return {
            ...c,
            role: newRole,
            status: newRole === "ADMIN" ? "System Admin" : "Active User",
          };
        }
        return c;
      })
    );
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842]">
        <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
          Customer & Role Access Control
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
          User & Customer Management
        </h1>
        <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
          View registered accounts, manage role permissions (User / Admin), order history, and spending analytics.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-xs text-gray-800 outline-hidden focus:border-[#E5A842]"
          />
        </div>

        <p className="text-xs font-bold text-gray-500">
          Showing <span className="text-gray-900 font-black">{filteredCustomers.length}</span> registered accounts
        </p>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-100 bg-gray-50/80 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-4 px-5">User Profile</th>
                <th className="py-4 px-5">Contact Info</th>
                <th className="py-4 px-5">Access Role</th>
                <th className="py-4 px-5">Total Orders</th>
                <th className="py-4 px-5">Total Spent</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full font-black text-xs flex items-center justify-center shadow-xs ${cust.role === "ADMIN"
                            ? "bg-[#E5A842] text-gray-950"
                            : "bg-[#5FA800] text-white"
                          }`}
                      >
                        {cust.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{cust.name}</h4>
                        <span className="text-[10px] text-gray-400 font-medium">{cust.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <FaEnvelope className="h-3 w-3 text-gray-400" />
                      <span>{cust.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                      <FaPhone className="h-2.5 w-2.5" />
                      <span>{cust.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${cust.role === "ADMIN"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                    >
                      {cust.role === "ADMIN" && <FaUserShield className="h-3 w-3 text-[#E5A842]" />}
                      <span>{cust.role}</span>
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold text-gray-900">
                    <div className="flex items-center gap-1.5">
                      <FaShoppingBag className="h-3.5 w-3.5 text-[#E5A842]" />
                      <span>{cust.orders} Orders</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-black text-gray-900 text-sm">
                    {cust.totalSpent}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => toggleRole(cust.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-black cursor-pointer transition-all ${cust.role === "ADMIN"
                          ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                          : "bg-amber-50 text-amber-800 hover:bg-[#E5A842] hover:text-gray-950 border border-amber-200"
                        }`}
                    >
                      {cust.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

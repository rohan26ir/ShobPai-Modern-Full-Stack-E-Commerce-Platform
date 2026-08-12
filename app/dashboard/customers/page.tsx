"use client";

import { useState } from "react";
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaShoppingBag, FaStar } from "react-icons/fa";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const customers = [
    { id: "CUST-101", name: "Sophia Martinez", email: "sophia.m@example.com", phone: "+1 (555) 234-5678", orders: 12, totalSpent: "$840.50", status: "VIP Customer", avatar: "SM" },
    { id: "CUST-102", name: "Liam Johnson", email: "liam.j@example.com", phone: "+1 (555) 345-6789", orders: 4, totalSpent: "$210.00", status: "Active", avatar: "LJ" },
    { id: "CUST-103", name: "Emma Williams", email: "emma.w@example.com", phone: "+1 (555) 456-7890", orders: 18, totalSpent: "$1,450.90", status: "VIP Customer", avatar: "EW" },
    { id: "CUST-104", name: "Noah Brown", email: "noah.b@example.com", phone: "+1 (555) 567-8901", orders: 2, totalSpent: "$96.20", status: "Active", avatar: "NB" },
    { id: "CUST-105", name: "Olivia Miller", email: "olivia.m@example.com", phone: "+1 (555) 678-9012", orders: 7, totalSpent: "$480.30", status: "Active", avatar: "OM" },
  ];

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
          Customer Directory
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
          Customer Management
        </h1>
        <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
          View registered customer profiles, total orders, spending analytics, and contact information.
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
            placeholder="Search customer by name or email..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-xs text-gray-800 outline-hidden focus:border-[#E5A842]"
          />
        </div>

        <p className="text-xs font-bold text-gray-500">
          Showing <span className="text-gray-900 font-black">{filteredCustomers.length}</span> registered users
        </p>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-100 bg-gray-50/80 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-4 px-5">Customer</th>
                <th className="py-4 px-5">Contact</th>
                <th className="py-4 px-5">Orders</th>
                <th className="py-4 px-5">Total Spent</th>
                <th className="py-4 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#E5A842] text-gray-950 font-black text-xs flex items-center justify-center shadow-xs">
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
                  <td className="py-4 px-5 font-bold text-gray-900">
                    <div className="flex items-center gap-1.5">
                      <FaShoppingBag className="h-3.5 w-3.5 text-[#E5A842]" />
                      <span>{cust.orders} Orders</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-black text-gray-900 text-sm">
                    {cust.totalSpent}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        cust.status === "VIP Customer"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {cust.status === "VIP Customer" && <FaStar className="h-2.5 w-2.5 text-amber-500 fill-current" />}
                      <span>{cust.status}</span>
                    </span>
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

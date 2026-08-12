"use client";

import Link from "next/link";
import { FaBoxOpen, FaChartLine, FaShoppingBag, FaUsers, FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import { products } from "@/data/products";

export default function DashboardOverviewPage() {
  const stats = [
    { title: "Total Revenue", value: "$14,850.50", change: "+12.5%", isUp: true, icon: FaChartLine, color: "bg-emerald-50 text-emerald-600" },
    { title: "Total Orders", value: "384", change: "+8.2%", isUp: true, icon: FaBoxOpen, color: "bg-amber-50 text-[#E5A842]" },
    { title: "Active Products", value: products.length, change: "Updated", isUp: true, icon: FaShoppingBag, color: "bg-blue-50 text-blue-600" },
    { title: "Total Customers", value: "1,240", change: "+15.4%", isUp: true, icon: FaUsers, color: "bg-purple-50 text-purple-600" },
  ];

  const recentOrders = [
    { id: "ORD-9482", customer: "Sophia Martinez", date: "Today, 11:42 AM", amount: "$84.50", status: "Completed", items: 4 },
    { id: "ORD-9481", customer: "Liam Johnson", date: "Today, 09:15 AM", amount: "$32.00", status: "Processing", items: 2 },
    { id: "ORD-9480", customer: "Emma Williams", date: "Yesterday, 04:30 PM", amount: "$124.90", status: "Completed", items: 7 },
    { id: "ORD-9479", customer: "Noah Brown", date: "Yesterday, 02:10 PM", amount: "$56.20", status: "Shipped", items: 3 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            Management Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Welcome Back, Admin 👋
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            Here is your daily organic store performance overview, order analytics, and product inventory alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-2 rounded-xl bg-[#E5A842] hover:bg-[#d49633] px-5 py-3 text-xs font-black text-gray-950 transition-colors shadow-md cursor-pointer"
          >
            <FaPlus className="h-3.5 w-3.5" />
            <span>Manage Products</span>
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 px-5 py-3 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  {stat.title}
                </span>
                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                <div className="flex items-center gap-1 mt-2 text-xs font-bold">
                  {stat.isUp ? (
                    <span className="text-emerald-600 flex items-center gap-0.5">
                      <FaArrowUp className="h-3 w-3" /> {stat.change}
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-0.5">
                      <FaArrowDown className="h-3 w-3" /> {stat.change}
                    </span>
                  )}
                  <span className="text-gray-400 font-normal">vs last month</span>
                </div>
              </div>

              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table (Spans 2) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Recent Customer Orders</h3>
              <p className="text-xs text-gray-500">Live order statuses and payment receipts</p>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-xs font-bold text-[#E5A842] hover:underline"
            >
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-gray-900">{ord.id}</td>
                    <td className="py-3.5 px-3">{ord.customer}</td>
                    <td className="py-3.5 px-3 font-extrabold text-gray-900">{ord.amount}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.status === "Completed"
                            ? "bg-emerald-50 text-emerald-600"
                            : ord.status === "Processing"
                            ? "bg-amber-50 text-[#E5A842]"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-gray-400">{ord.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Inventory Summary Column */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">Inventory Status</h3>
            <span className="text-xs font-bold text-gray-400">Total {products.length} Products</span>
          </div>

          <div className="space-y-4">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gray-200 overflow-hidden relative shrink-0">
                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{p.name}</h4>
                    <span className="text-[11px] text-gray-500">${p.price.toFixed(2)}</span>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  FaBoxOpen,
  FaChartLine,
  FaShoppingBag,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaHeart,
  FaTruck,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaUserShield,
} from "react-icons/fa";
import { products } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function DashboardOverviewPage() {
  const { user, isAdmin } = useAuth();
  const { cartCount, wishlistCount } = useCart();

  const adminStats = [
    { title: "Total Revenue", value: "$14,850.50", change: "+12.5%", isUp: true, icon: FaChartLine, color: "bg-emerald-50 text-emerald-600" },
    { title: "Total Orders", value: "384", change: "+8.2%", isUp: true, icon: FaBoxOpen, color: "bg-amber-50 text-[#E5A842]" },
    { title: "Active Products", value: products.length, change: "Live", isUp: true, icon: FaShoppingBag, color: "bg-blue-50 text-blue-600" },
    { title: "Total Customers", value: "1,240", change: "+15.4%", isUp: true, icon: FaUsers, color: "bg-purple-50 text-purple-600" },
  ];

  const userStats = [
    { title: "My Total Orders", value: "4 Orders", change: "1 In Transit", isUp: true, icon: FaTruck, color: "bg-emerald-50 text-[#5FA800]" },
    { title: "Wishlist Items", value: `${wishlistCount} Saved`, change: "In Stock", isUp: true, icon: FaHeart, color: "bg-red-50 text-red-500" },
    { title: "Active Cart", value: `${cartCount} Items`, change: "Ready to order", isUp: true, icon: FaShoppingBag, color: "bg-amber-50 text-[#E5A842]" },
    { title: "Reward Points", value: "320 Pts", change: "$3.20 value", isUp: true, icon: FaCheckCircle, color: "bg-purple-50 text-purple-600" },
  ];

  const recentOrders = [
    { id: "ORD-9482", customer: "Sophia Martinez", date: "Today, 11:42 AM", amount: "$84.50", status: "Completed", items: 4 },
    { id: "ORD-9481", customer: "Liam Johnson", date: "Today, 09:15 AM", amount: "$32.00", status: "Processing", items: 2 },
    { id: "ORD-9480", customer: "Emma Williams", date: "Yesterday, 04:30 PM", amount: "$124.90", status: "Completed", items: 7 },
    { id: "ORD-9479", customer: "Noah Brown", date: "Yesterday, 02:10 PM", amount: "$56.20", status: "Shipped", items: 3 },
  ];

  const myOrders = [
    { id: "SHP-84920", date: "Yesterday", status: "Out for Delivery", amount: "$42.50", items: "Fresh Organic Spinach, Red Apple" },
    { id: "SHP-78391", date: "Aug 10, 2026", status: "Delivered", amount: "$89.00", items: "Dragon Fruit, Broccoli, Pure Honey" },
    { id: "SHP-62849", date: "Jul 28, 2026", status: "Delivered", amount: "$31.20", items: "Organic Strawberries, Fresh Milk" },
  ];

  return (
    <div className="space-y-8">
      {/* Dynamic Welcome Banner */}
      <div
        className={`text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
          isAdmin
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] border-[#E5A842]"
            : "bg-gradient-to-r from-emerald-950 via-gray-900 to-emerald-900 border-[#5FA800]"
        }`}
      >
        <div>
          <span
            className={`text-xs font-black uppercase tracking-widest ${
              isAdmin ? "text-[#E5A842]" : "text-[#5FA800]"
            }`}
          >
            {isAdmin ? "👑 Admin Management Console" : "🛒 Customer Account Overview"}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Welcome Back, {user?.displayName || (isAdmin ? "Admin" : "Customer")} 👋
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            {isAdmin
              ? "Live overview of platform revenue, active customers, product inventory, and customer fulfillment."
              : "Track your fresh organic grocery orders, manage your wishlist, addresses, and account security."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <>
              <Link
                href="/dashboard/admin"
                className="flex items-center gap-2 rounded-xl bg-[#E5A842] hover:bg-[#d49633] px-5 py-3 text-xs font-black text-gray-950 transition-colors shadow-md cursor-pointer"
              >
                <FaPlus className="h-3.5 w-3.5" />
                <span>Add Product</span>
              </Link>
              <Link
                href="/dashboard/customers"
                className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 px-5 py-3 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <FaUsers className="h-3.5 w-3.5" />
                <span>Customers</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="flex items-center gap-2 rounded-xl bg-[#5FA800] hover:bg-[#528f00] px-5 py-3 text-xs font-black text-white transition-colors shadow-md cursor-pointer"
              >
                <FaShoppingBag className="h-3.5 w-3.5" />
                <span>Shop Fresh Groceries</span>
              </Link>
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 px-5 py-3 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <FaTruck className="h-3.5 w-3.5" />
                <span>Track Orders</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(isAdmin ? adminStats : userStats).map((stat, idx) => {
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
                  <span className="text-gray-400 font-normal">status</span>
                </div>
              </div>

              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Spans 2) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {isAdmin ? "Recent Customer Orders" : "My Recent Purchases"}
              </h3>
              <p className="text-xs text-gray-500">
                {isAdmin
                  ? "Live order statuses and payment receipts"
                  : "Track package status and download receipt invoices"}
              </p>
            </div>
            <Link
              href="/dashboard/orders"
              className={`text-xs font-bold hover:underline ${
                isAdmin ? "text-[#E5A842]" : "text-[#5FA800]"
              }`}
            >
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            {isAdmin ? (
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
            ) : (
              <div className="space-y-3">
                {myOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-900 text-xs">{ord.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">{ord.items}</p>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <span className="font-black text-gray-900 text-sm">{ord.amount}</span>
                      <Link
                        href="/dashboard/orders"
                        className="text-xs font-bold text-[#5FA800] hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">
              {isAdmin ? "Inventory Status" : "Featured Organic Deals"}
            </h3>
            <span className="text-xs font-bold text-gray-400">
              {isAdmin ? `Total ${products.length} Products` : "Hand-picked for you"}
            </span>
          </div>

          <div className="space-y-4">
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gray-200 overflow-hidden relative shrink-0">
                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{p.name}</h4>
                    <span className="text-[11px] text-gray-500">${p.price.toFixed(2)}</span>
                  </div>
                </div>

                {isAdmin ? (
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {p.stock} left
                  </span>
                ) : (
                  <Link
                    href={`/product/${p.slug}`}
                    className="text-[11px] font-black text-white bg-[#5FA800] px-3 py-1.5 rounded-xl hover:bg-[#528f00] transition-colors"
                  >
                    Buy Now
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

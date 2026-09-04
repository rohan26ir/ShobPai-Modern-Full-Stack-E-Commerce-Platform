"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaBoxOpen,
  FaChartLine,
  FaShoppingBag,
  FaUsers,
  FaPlus,
  FaHeart,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useShopData } from "@/context/ShopDataContext";
import { api } from "@/lib/api";

export default function DashboardOverviewPage() {
  const { user, isAdmin, token } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const { products } = useShopData();

  const [loading, setLoading] = useState(true);
  const [adminOverview, setAdminOverview] = useState<{
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
    recentOrders: any[];
  } | null>(null);

  const [userOrders, setUserOrders] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    if (isAdmin && token) {
      api.getAdminOverview(token)
        .then((data) => {
          if (isMounted && data) setAdminOverview(data);
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else if (token) {
      api.getMyOrders(token)
        .then((data) => {
          if (isMounted && Array.isArray(data)) setUserOrders(data);
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isAdmin, token]);

  const adminStats = [
    {
      title: "Total Revenue",
      value: adminOverview ? `$${adminOverview.totalRevenue.toFixed(2)}` : "$0.00",
      change: "Live Database",
      isUp: true,
      icon: FaChartLine,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Total Orders",
      value: adminOverview ? String(adminOverview.totalOrders) : "0",
      change: adminOverview ? `${adminOverview.pendingOrders} Pending` : "0 Pending",
      isUp: true,
      icon: FaBoxOpen,
      color: "bg-amber-50 text-[#E5A842]",
    },
    {
      title: "Active Products",
      value: adminOverview ? String(adminOverview.totalProducts) : String(products.length),
      change: "In Catalog",
      isUp: true,
      icon: FaShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Registered Users",
      value: adminOverview ? String(adminOverview.totalUsers) : "0",
      change: "Accounts",
      isUp: true,
      icon: FaUsers,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const userStats = [
    {
      title: "My Total Orders",
      value: `${userOrders.length} Orders`,
      change: userOrders.length > 0 ? "Active Account" : "No orders yet",
      isUp: true,
      icon: FaTruck,
      color: "bg-emerald-50 text-[#5FA800]",
    },
    {
      title: "Wishlist Items",
      value: `${wishlistCount} Saved`,
      change: "In Stock",
      isUp: true,
      icon: FaHeart,
      color: "bg-red-50 text-red-500",
    },
    {
      title: "Active Cart",
      value: `${cartCount} Items`,
      change: "Ready to checkout",
      isUp: true,
      icon: FaShoppingBag,
      color: "bg-amber-50 text-[#E5A842]",
    },
    {
      title: "Account Status",
      value: user ? "Verified" : "Guest",
      change: user?.email || "Signed In",
      isUp: true,
      icon: FaCheckCircle,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const recentAdminOrders = adminOverview?.recentOrders || [];

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
            Welcome Back, {user?.displayName || user?.email?.split("@")[0] || (isAdmin ? "Admin" : "Customer")} 👋
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            {isAdmin
              ? "Live overview of platform revenue, active customers, product inventory, and customer fulfillment."
              : "Track your fresh organic grocery orders, manage your wishlist, addresses, and account security."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Link
              href="/dashboard/admin"
              className="flex items-center gap-2 rounded-xl bg-[#E5A842] hover:bg-[#d49633] px-5 py-3 text-xs font-black text-gray-950 transition-colors shadow-md cursor-pointer"
            >
              <FaPlus className="h-3.5 w-3.5" />
              <span>Add Product</span>
            </Link>
          ) : (
            <Link
              href="/shop"
              className="flex items-center gap-2 rounded-xl bg-[#5FA800] hover:bg-[#528f00] px-5 py-3 text-xs font-black text-white transition-colors shadow-md cursor-pointer"
            >
              <FaShoppingBag className="h-3.5 w-3.5" />
              <span>Shop Produce</span>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(isAdmin ? adminStats : userStats).map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  {stat.title}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900">{stat.value}</h3>
                <span className="text-[11px] font-semibold text-gray-500 mt-1 block">
                  {stat.change}
                </span>
              </div>

              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Orders & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Spans 2) - Orders Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {isAdmin ? "Recent Platform Orders" : "My Recent Orders"}
              </h3>
              <p className="text-xs text-gray-400">
                {isAdmin
                  ? "Real-time orders placed across the store"
                  : "Track the status of your recent deliveries"}
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
              recentAdminOrders.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  {loading ? "Loading orders from database..." : "No orders found in database yet."}
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3">Order Number</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                    {recentAdminOrders.map((ord: any) => (
                      <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-gray-900">{ord.orderNumber}</td>
                        <td className="py-3.5 px-3">{ord.user?.displayName || ord.guestName || ord.user?.email || "Guest"}</td>
                        <td className="py-3.5 px-3 font-extrabold text-gray-900">${ord.totalAmount?.toFixed(2)}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              ord.status === "DELIVERED"
                                ? "bg-emerald-50 text-emerald-600"
                                : ord.status === "PENDING"
                                ? "bg-amber-50 text-[#E5A842]"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right text-gray-400">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : userOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">
                {loading ? "Loading your orders..." : "You have not placed any orders yet."}
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.slice(0, 5).map((ord: any) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-900 text-xs">{ord.orderNumber}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {ord.items?.map((i: any) => `${i.product?.name || i.productId} (x${i.quantity})`).join(", ") || `${ord.items?.length || 1} items`}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <span className="font-black text-gray-900 text-sm">${ord.totalAmount?.toFixed(2)}</span>
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

        {/* Right Column - Inventory Status / Store Products */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">
              {isAdmin ? "Catalog Inventory" : "Featured Organic Deals"}
            </h3>
            <span className="text-xs font-bold text-gray-400">
              {products.length} Products
            </span>
          </div>

          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">No products available in catalog.</div>
            ) : (
              products.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gray-200 overflow-hidden relative shrink-0">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <FaShoppingBag className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{p.name}</h4>
                      <span className="text-[11px] text-gray-500">${p.price?.toFixed(2)}</span>
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

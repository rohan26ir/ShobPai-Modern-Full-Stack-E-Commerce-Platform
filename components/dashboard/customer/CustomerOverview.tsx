"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  RotateCw,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Plus,
  Eye,
  Calendar,
} from "lucide-react";
import { useCustomerData, CustomerOrder } from "@/hooks/useCustomerData";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

interface CustomerOverviewProps {
  user: any;
  token?: string | null;
}

export function CustomerOverview({ user, token }: CustomerOverviewProps) {
  const email = user?.email;
  const {
    orders,
    addresses,
    stats,
    loading,
    isRefreshing,
    refreshAll,
  } = useCustomerData(email, token);

  const { addToCart } = useCart();
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<CustomerOrder | null>(null);

  // Default address
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  // Latest active order for live tracking preview
  const activeOrder = orders.find((o) =>
    ["PENDING", "PROCESSING", "SHIPPED"].includes((o.status || "").toUpperCase())
  ) || orders[0];

  const handleQuickReorder = (item: any) => {
    addToCart(
      {
        id: item.id || `prod_${Date.now()}`,
        name: item.title,
        price: item.price,
        images: [item.image],
        category: "grocery",
        categoryName: "Grocery",
        stock: 50,
        unit: "1 unit",
      } as any,
      1
    );
    toast.success(`Added "${item.title}" to cart!`, { icon: "🛒" });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/50";
      case "PROCESSING":
        return "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/50";
      case "SHIPPED":
        return "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/50";
      case "CANCELLED":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/50";
      default:
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/50";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-emerald-500";
      case "PROCESSING":
        return "bg-blue-500";
      case "SHIPPED":
        return "bg-purple-500";
      case "CANCELLED":
        return "bg-rose-500";
      default:
        return "bg-amber-500";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Personalized Welcome Banner */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-gradient-to-br from-orange-400/10 to-transparent pointer-events-none blur-2xl" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/50 border-2 border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl sm:text-2xl font-black text-[#ff6c2f]">
                  {(user?.displayName?.[0] || email?.[0] || "U").toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome back, {user?.displayName || email?.split("@")[0] || "Customer"}!
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] border border-orange-200/60 dark:border-orange-800/50">
                  <Sparkles className="w-3 h-3" />
                  <span>Gold Member</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{email}</span>
                </span>
                <span>•</span>
                <span>Member since {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Cluster */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={refreshAll}
              disabled={isRefreshing}
              title="Synchronize user data"
              className="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#ff6c2f]" : ""}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>

            <Link
              href="/dashboard/user/orders"
              className="h-9 px-4 rounded-xl bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Track Orders</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Summary Metric Cards Grid (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Orders */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Active Deliveries
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {loading ? (
                <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
              ) : (
                stats.activeOrders
              )}
            </div>
            <span className="text-[11px] text-orange-500 font-medium mt-1 block">
              In transit / Processing
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] border border-orange-100 dark:border-orange-800/40 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders Placed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Total Orders Placed
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {loading ? (
                <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
              ) : (
                stats.totalOrders
              )}
            </div>
            <span className="text-[11px] text-emerald-500 font-medium mt-1 block">
              {stats.deliveredOrders} delivered
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Total Spent
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {loading ? (
                <div className="h-8 w-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
              ) : (
                `$${stats.totalSpent.toFixed(2)}`
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">
              Lifetime purchases
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Saved Addresses
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {loading ? (
                <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
              ) : (
                stats.savedAddressesCount
              )}
            </div>
            <Link
              href="/dashboard/user/addresses"
              className="text-[11px] text-[#ff6c2f] hover:underline font-semibold mt-1 block"
            >
              Manage address book →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/40 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Main Body Grid (8 Cols Left for Orders & Quick Reorder, 4 Cols Right for Live Tracker & Address) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 of 12 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Orders List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  My Recent Orders
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Filtered exclusively for your account ({email})
                </p>
              </div>

              <Link
                href="/dashboard/user/orders"
                className="text-xs font-bold text-[#ff6c2f] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                  No orders placed yet
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Browse our organic grocery catalog and find farm-fresh products at great prices.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6c2f] text-white text-xs font-bold hover:bg-[#e0561b] transition-colors shadow-xs"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 4).map((order) => {
                  const upperStatus = (order.status || "PENDING").toUpperCase();
                  const firstItem = order.items?.[0];
                  const title =
                    firstItem?.product?.name ||
                    firstItem?.productName ||
                    firstItem?.name ||
                    "Organic Grocery Item";
                  const image =
                    firstItem?.product?.images?.[0] ||
                    firstItem?.productImage ||
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80";

                  return (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-orange-200 dark:hover:border-orange-900/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shrink-0">
                          <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-blue-600 dark:text-blue-400">
                              #{order.orderNumber || order.id.slice(0, 8)}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(
                                upperStatus
                              )}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${getStatusDot(
                                  upperStatus
                                )}`}
                              />
                              <span>{upperStatus}</span>
                            </span>
                          </div>

                          <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-100 mt-0.5 truncate max-w-[240px]">
                            {title}
                          </h4>

                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            • {order.items?.length || 1} item(s)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block font-normal">
                            Total
                          </span>
                          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                            ${(order.totalAmount || 0).toFixed(2)}
                          </span>
                        </div>

                        <Link
                          href="/dashboard/user/orders"
                          className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Re-Order Carousel / Grid */}
          {stats.quickReorderItems.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#ff6c2f]" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Quick Re-Order
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  From your delivered orders
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {stats.quickReorderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 hover:border-orange-200 dark:hover:border-orange-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-700">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {item.title}
                        </h4>
                        <span className="text-xs font-extrabold text-[#ff6c2f] mt-0.5 block">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickReorder(item)}
                      className="h-8 px-3 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/40 text-[#ff6c2f] text-xs font-bold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 of 12 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Order Milestones Timeline Tracker */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#ff6c2f]" />
                Live Order Tracking
              </span>
              {activeOrder && (
                <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                  #{activeOrder.orderNumber || activeOrder.id?.slice(0, 6)}
                </span>
              )}
            </div>

            {activeOrder ? (
              <div className="space-y-4">
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Status:{" "}
                  <strong className="text-slate-900 dark:text-white capitalize">
                    {activeOrder.status?.toLowerCase() || "processing"}
                  </strong>
                  {activeOrder.estimatedDeliveryDate && (
                    <span className="block mt-0.5 text-[#ff6c2f] font-semibold">
                      Estimated Arrival:{" "}
                      {new Date(activeOrder.estimatedDeliveryDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>

                {/* Progress Steps */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {/* Step 1: Placed */}
                  <div className="relative">
                    <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white">
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Order Confirmed
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Payment received and verified
                    </p>
                  </div>

                  {/* Step 2: Processing */}
                  <div className="relative">
                    <span
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                        ["PROCESSING", "SHIPPED", "DELIVERED"].includes(
                          (activeOrder.status || "").toUpperCase()
                        )
                          ? "bg-emerald-500"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Harvesting & Packaging
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Prepared in warehouse
                    </p>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="relative">
                    <span
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                        ["SHIPPED", "DELIVERED"].includes(
                          (activeOrder.status || "").toUpperCase()
                        )
                          ? "bg-emerald-500"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Out for Delivery
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      With our regional rider
                    </p>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="relative">
                    <span
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                        (activeOrder.status || "").toUpperCase() === "DELIVERED"
                          ? "bg-emerald-500"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Delivered
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Package handed over safely
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard/user/orders"
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Complete Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No orders currently in transit.
              </div>
            )}
          </div>

          {/* Default Delivery Address Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#ff6c2f]" />
                Primary Shipping Address
              </span>
              <Link
                href="/dashboard/user/addresses"
                className="text-[11px] font-bold text-[#ff6c2f] hover:underline"
              >
                Change
              </Link>
            </div>

            {defaultAddress ? (
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {defaultAddress.fullName}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f]">
                    {defaultAddress.title || "Home"}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {defaultAddress.addressLine}, {defaultAddress.city},{" "}
                  {defaultAddress.district}
                </p>
                <p className="text-slate-400 text-[11px] pt-1">
                  Contact: {defaultAddress.phone}
                </p>
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                No default address set.{" "}
                <Link
                  href="/dashboard/user/addresses"
                  className="text-[#ff6c2f] font-semibold underline"
                >
                  Add one now
                </Link>
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white block mb-2">
              Account Hub Shortcuts
            </span>
            <Link
              href="/dashboard/user/settings"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <span>Profile & Password Security</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              href="/dashboard/wishlist"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <span>Saved Items & Wishlist</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              href="/shop"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-semibold text-[#ff6c2f] transition-colors"
            >
              <span>Explore Farm-Fresh Shop</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#ff6c2f]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CustomerOverview;


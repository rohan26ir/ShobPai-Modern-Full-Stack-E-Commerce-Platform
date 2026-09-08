"use client";

import Link from "next/link";
import { useEffect, useMemo, useCallback } from "react";
import {
  FaShoppingBag,
  FaPlus,
  FaSyncAlt,
  FaShieldAlt,
  FaStore,
  FaBox,
  FaHeart,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useShopData } from "@/context/ShopDataContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminOverview,
  fetchDashboardOrders,
} from "@/store/slices/dashboardSlice";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentOrdersWidget } from "@/components/dashboard/RecentOrdersWidget";
import { InventoryAlertWidget } from "@/components/dashboard/InventoryAlertWidget";
import { StatsCardsSkeleton } from "@/components/dashboard/DashboardSkeletons";

export default function DashboardOverviewPage() {
  const dispatch = useAppDispatch();
  const { user, isAdmin, token } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const { products } = useShopData();

  // Redux Dashboard State with selective subscriptions
  const overview = useAppSelector((state) => state.dashboard.overview.data);
  const overviewLoading = useAppSelector((state) => state.dashboard.overview.loading);
  const orders = useAppSelector((state) => state.dashboard.orders.items);
  const ordersLoading = useAppSelector((state) => state.dashboard.orders.loading);

  // Fetch cached data (skips network request if loaded within 2 min cache TTL)
  useEffect(() => {
    if (!token) return;

    if (isAdmin) {
      dispatch(fetchAdminOverview({ token }));
      dispatch(fetchDashboardOrders({ token, isAdmin: true }));
    } else {
      dispatch(fetchDashboardOrders({ token, isAdmin: false }));
    }
  }, [isAdmin, token, dispatch]);

  // Manual force refresh handler
  const handleForceRefresh = useCallback(() => {
    if (!token) return;
    if (isAdmin) {
      dispatch(fetchAdminOverview({ token, force: true }));
      dispatch(fetchDashboardOrders({ token, isAdmin: true, force: true }));
    } else {
      dispatch(fetchDashboardOrders({ token, isAdmin: false, force: true }));
    }
  }, [isAdmin, token, dispatch]);

  const recentOrders = useMemo(() => {
    if (isAdmin && overview?.recentOrders && overview.recentOrders.length > 0) {
      return overview.recentOrders;
    }
    return orders;
  }, [isAdmin, overview?.recentOrders, orders]);

  const isInitialLoading = (overviewLoading && !overview) || (ordersLoading && orders.length === 0);

  return (
    <div className="space-y-8">
      {/* Dynamic Welcome Banner */}
      <div
        className={`text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
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
              ? "Live overview of store revenue, customer fulfillment, and catalog inventory powered by Neon PostgreSQL."
              : "Track your fresh organic grocery orders, manage your saved items, and explore farm-fresh harvests."}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleForceRefresh}
            disabled={overviewLoading || ordersLoading}
            title="Refresh cache from live database"
            className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-3 text-xs font-bold text-white transition-all backdrop-blur-xs disabled:opacity-50 cursor-pointer"
          >
            <FaSyncAlt className={`h-3 w-3 ${overviewLoading || ordersLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

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

      {/* KPI Metric Cards with Skeleton Fallback */}
      {isInitialLoading ? (
        <StatsCardsSkeleton />
      ) : (
        <StatsGrid
          isAdmin={isAdmin}
          overview={overview}
          totalProducts={products.length}
          userOrdersCount={orders.length}
          wishlistCount={wishlistCount}
          cartCount={cartCount}
        />
      )}

      {/* Main Content Grid: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentOrdersWidget orders={recentOrders} isAdmin={isAdmin} />
        <InventoryAlertWidget products={products} isAdmin={isAdmin} />
      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin ? (
          <>
            <Link
              href="/dashboard/admin"
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-[#E5A842] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaStore className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-gray-900">Manage Catalog</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Edit prices, stocks, and items</p>
            </Link>

            <Link
              href="/dashboard/orders"
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaBox className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-gray-900">Orders Manager</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Update fulfillment statuses</p>
            </Link>

            <Link
              href="/dashboard/customers"
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaShieldAlt className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-gray-900">User Access</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Promote admins and review accounts</p>
            </Link>

            <Link
              href="/dashboard/analytics"
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaShoppingBag className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-gray-900">Store Analytics</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Revenue breakdown & trends</p>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/dashboard/orders"
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-[#5FA800] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaBox className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-gray-900">Order History</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Track and download invoices</p>
            </Link>

            <Link
              href="/dashboard/wishlist"
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaHeart className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-gray-900">My Wishlist</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{wishlistCount} saved favorites</p>
            </Link>

            <Link
              href="/cart"
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-[#E5A842] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaShoppingBag className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-gray-900">Shopping Cart</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{cartCount} items ready to order</p>
            </Link>

            <Link
              href="/shop"
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaStore className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-gray-900">Shop Organics</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Explore 100% organic harvest</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { IconType } from "react-icons";
import {
  FaChartLine,
  FaBoxOpen,
  FaShoppingBag,
  FaUsers,
  FaTruck,
  FaHeart,
  FaCheckCircle,
} from "react-icons/fa";
import { AdminOverviewData } from "@/store/slices/dashboardSlice";

interface StatItem {
  title: string;
  value: string;
  change: string;
  isUp: boolean;
  icon: IconType;
  color: string;
}

interface StatsGridProps {
  isAdmin: boolean;
  overview: AdminOverviewData | null;
  totalProducts: number;
  userOrdersCount: number;
  wishlistCount: number;
  cartCount: number;
}

export const StatsGrid = React.memo(function StatsGrid({
  isAdmin,
  overview,
  totalProducts,
  userOrdersCount,
  wishlistCount,
  cartCount,
}: StatsGridProps) {
  const adminStats: StatItem[] = [
    {
      title: "Total Revenue",
      value: overview ? `$${overview.totalRevenue.toFixed(2)}` : "$0.00",
      change: "Live Database",
      isUp: true,
      icon: FaChartLine,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Total Orders",
      value: overview ? String(overview.totalOrders) : "0",
      change: overview ? `${overview.pendingOrders} Pending` : "0 Pending",
      isUp: true,
      icon: FaBoxOpen,
      color: "bg-amber-50 text-[#E5A842]",
    },
    {
      title: "Active Products",
      value: overview ? String(overview.totalProducts) : String(totalProducts),
      change: "In Catalog",
      isUp: true,
      icon: FaShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Registered Users",
      value: overview ? String(overview.totalUsers) : "0",
      change: "Active Accounts",
      isUp: true,
      icon: FaUsers,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const userStats: StatItem[] = [
    {
      title: "My Total Orders",
      value: `${userOrdersCount} Orders`,
      change: userOrdersCount > 0 ? "Account Active" : "No orders yet",
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
      title: "Active Cart Items",
      value: `${cartCount} Items`,
      change: "Ready to Checkout",
      isUp: true,
      icon: FaShoppingBag,
      color: "bg-amber-50 text-[#E5A842]",
    },
    {
      title: "Member Status",
      value: "Verified",
      change: "Active Buyer",
      isUp: true,
      icon: FaCheckCircle,
      color: "bg-blue-50 text-blue-600",
    },
  ];

  const stats = isAdmin ? adminStats : userStats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {stat.title}
              </p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">
                {stat.value}
              </h3>
              <p className="text-xs font-medium text-gray-500 mt-1 flex items-center gap-1">
                <span className="text-[#5FA800] font-bold">●</span>
                {stat.change}
              </p>
            </div>
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
});

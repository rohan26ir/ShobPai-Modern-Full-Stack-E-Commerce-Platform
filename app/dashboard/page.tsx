"use client";

import Link from "next/link";
import { useEffect, useCallback } from "react";
import {
  FaShoppingBag,
  FaPlus,
  FaSyncAlt,
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
import { OverviewCommandCenter } from "@/components/dashboard/overview/OverviewCommandCenter";
import { CustomerOverview } from "@/components/dashboard/customer/CustomerOverview";

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

  const isInitialLoading = (overviewLoading && !overview) || (ordersLoading && orders.length === 0);

  return (
    <div className="space-y-6">
      {isAdmin ? (
        /* Admin Command Center matching the exact Larkon layout */
        <OverviewCommandCenter
          token={token}
          isAdmin={isAdmin}
        />
      ) : (
        /* Modern Customer Portal Layout with Strict Email-Scoped Identity Isolation */
        <CustomerOverview user={user} token={token} />
      )}
    </div>
  );
}

"use client";

import React, { useMemo } from "react";
import { NoticeBanner } from "./NoticeBanner";
import { LarkonMetricCard } from "./LarkonMetricCard";
import { PerformanceChart } from "./PerformanceChart";
import { ConversionsGaugeCard } from "./ConversionsGaugeCard";
import { MonthlyGoalCard } from "./MonthlyGoalCard";
import { SessionsByCityCard } from "./SessionsByCountryCard";
import { TopPagesCard } from "./TopPagesCard";
import { LarkonRecentOrdersTable } from "./LarkonRecentOrdersTable";
import { LarkonFooter } from "./LarkonFooter";
import {
  LarkonKPICard,
} from "./larkonData";
import { DEMO_ORDERS } from "./ordersData";
import {
  useDashboardMetrics,
  useRecentOrders,
  formatCurrency,
} from "@/hooks/useDashboardData";

interface OverviewCommandCenterProps {
  token?: string | null;
  isAdmin?: boolean;
}

export function OverviewCommandCenter({
  token,
  isAdmin = false,
}: OverviewCommandCenterProps) {
  // Real-time hooks with quiet fallback
  const { overview } = useDashboardMetrics(token, isAdmin);
  const { orders } = useRecentOrders(token, isAdmin);

  // Dynamic KPI Cards mapped with database metrics when present
  const kpiCards: LarkonKPICard[] = useMemo(() => {
    return [
      {
        id: "kpi-orders",
        title: "Total Orders",
        value: overview?.totalOrders
          ? overview.totalOrders.toLocaleString()
          : orders.length > 0
          ? orders.length.toLocaleString()
          : "13, 647",
        iconType: "orders",
        change: "2.3%",
        period: "Last Week",
        isPositive: true,
        viewMoreHref: "/dashboard/orders",
      },
      {
        id: "kpi-leads",
        title: "New Leads",
        value: overview?.totalUsers
          ? overview.totalUsers.toLocaleString()
          : "9, 526",
        iconType: "leads",
        change: "8.1%",
        period: "Last Month",
        isPositive: true,
        viewMoreHref: "/dashboard/customers",
      },
      {
        id: "kpi-deals",
        title: "Deals",
        value: "976",
        iconType: "deals",
        change: "0.3%",
        period: "Last Month",
        isPositive: false,
        viewMoreHref: "/dashboard/offers",
      },
      {
        id: "kpi-revenue",
        title: "Booked Rev...",
        value: overview?.totalRevenue
          ? formatCurrency(overview.totalRevenue).replace("$", "$")
          : "$123.6k",
        iconType: "revenue",
        change: "10.6%",
        period: "Last Month",
        isPositive: false,
        viewMoreHref: "/dashboard/analytics",
      },
    ];
  }, [overview, orders.length]);

  // Synchronized orders pool identical to the Orders page (live database orders or DEMO_ORDERS)
  const displayOrders: any[] = useMemo(() => {
    return orders && orders.length > 0 ? orders : DEMO_ORDERS;
  }, [orders]);

  const totalOrdersCount = overview?.totalOrders || 90521;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Top Section: Notice + KPIs + Performance Chart
          On 2xl: 12-column grid (Left 5 cols for Notice + KPIs, Right 7 cols for Performance)
          On lg / below 2xl: Notice + KPIs on top (first), Performance Chart second below it
      */}
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Notice + 4 KPI Cards: First */}
        <div className="2xl:col-span-5 flex flex-col gap-3.5 sm:gap-4">
          <NoticeBanner />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-2 gap-3.5 sm:gap-4">
            {kpiCards.map((card) => (
              <LarkonMetricCard key={card.id} card={card} />
            ))}
          </div>
        </div>

        {/* Performance Chart: Second on lg, Right column on 2xl */}
        <div className="2xl:col-span-7">
          <PerformanceChart />
        </div>
      </div>

      {/* 2. Middle Row: 4 Metric Cards
          On lg / xl:
            Row 1: Conversions and Monthly Goal together in same row (2 cols)
            Row 2: Sessions by City and Top Pages together in row below (2 cols)
          On 2xl:
            All 4 cards in a single row (4 cols)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-5 items-stretch">
        <ConversionsGaugeCard />
        <MonthlyGoalCard
          current={
            typeof overview?.monthlyGoal?.currentRevenue === "number"
              ? Math.round(overview.monthlyGoal.currentRevenue)
              : overview?.totalRevenue
              ? Math.round(overview.totalRevenue)
              : 43200
          }
          target={overview?.monthlyGoal?.target || 60000}
          percentage={overview?.monthlyGoal?.percentage}
        />
        <SessionsByCityCard />
        <TopPagesCard />
      </div>

      {/* 4. Bottom Row: Recent Orders Full-Width Table */}
      <LarkonRecentOrdersTable
        orders={displayOrders}
        totalOrdersCount={totalOrdersCount}
      />

      {/* 5. Larkon Footer */}
      <LarkonFooter />
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaShoppingBag,
  FaDollarSign,
  FaBoxOpen,
  FaLayerGroup,
  FaCalendarAlt,
  FaCalculator,
  FaUsers,
  FaPercentage,
  FaWallet,
  FaClock,
  FaFilter,
  FaReceipt,
} from "react-icons/fa";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

type TimeRange = "7d" | "30d" | "quarter" | "ytd";

interface PeriodData {
  label: string;
  labels: string[];
  revenue: number[];
  profit: number[];
  expenses: number[];
  orders: number[];
  newCustomers: number[];
  returningCustomers: number[];
  trafficHours: { label: string; count: number }[];
}

const analyticsDataByRange: Record<TimeRange, PeriodData> = {
  "7d": {
    label: "Last 7 Days",
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    revenue: [1850, 2100, 2450, 2900, 3600, 4200, 3100],
    profit: [520, 610, 710, 850, 1080, 1260, 920],
    expenses: [1330, 1490, 1740, 2050, 2520, 2940, 2180],
    orders: [42, 51, 58, 69, 86, 104, 75],
    newCustomers: [12, 16, 19, 24, 30, 38, 26],
    returningCustomers: [30, 35, 39, 45, 56, 66, 49],
    trafficHours: [
      { label: "8 AM - 10 AM", count: 85 },
      { label: "10 AM - 12 PM", count: 120 },
      { label: "12 PM - 2 PM", count: 95 },
      { label: "2 PM - 5 PM", count: 140 },
      { label: "5 PM - 8 PM", count: 210 },
      { label: "8 PM - 11 PM", count: 165 },
    ],
  },
  "30d": {
    label: "Last 30 Days",
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    revenue: [9800, 12400, 14100, 15900],
    profit: [2840, 3650, 4180, 4720],
    expenses: [6960, 8750, 9920, 11180],
    orders: [245, 312, 360, 410],
    newCustomers: [82, 105, 128, 145],
    returningCustomers: [163, 207, 232, 265],
    trafficHours: [
      { label: "8 AM - 10 AM", count: 320 },
      { label: "10 AM - 12 PM", count: 480 },
      { label: "12 PM - 2 PM", count: 410 },
      { label: "2 PM - 5 PM", count: 590 },
      { label: "5 PM - 8 PM", count: 890 },
      { label: "8 PM - 11 PM", count: 640 },
    ],
  },
  "quarter": {
    label: "This Quarter (Q3 2026)",
    labels: ["July", "August", "September (Proj.)"],
    revenue: [28400, 34200, 39800],
    profit: [8250, 10100, 11800],
    expenses: [20150, 24100, 28000],
    orders: [720, 865, 1010],
    newCustomers: [240, 295, 340],
    returningCustomers: [480, 570, 670],
    trafficHours: [
      { label: "8 AM - 10 AM", count: 960 },
      { label: "10 AM - 12 PM", count: 1420 },
      { label: "12 PM - 2 PM", count: 1190 },
      { label: "2 PM - 5 PM", count: 1750 },
      { label: "5 PM - 8 PM", count: 2680 },
      { label: "8 PM - 11 PM", count: 1910 },
    ],
  },
  "ytd": {
    label: "Year to Date (2026)",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    revenue: [7400, 9200, 12800, 16400, 19800, 24500, 28400, 34200],
    profit: [2100, 2680, 3750, 4820, 5840, 7250, 8250, 10100],
    expenses: [5300, 6520, 9050, 11580, 13960, 17250, 20150, 24100],
    orders: [195, 240, 335, 425, 510, 630, 720, 865],
    newCustomers: [65, 80, 115, 145, 170, 215, 240, 295],
    returningCustomers: [130, 160, 220, 280, 340, 415, 480, 570],
    trafficHours: [
      { label: "8 AM - 10 AM", count: 2450 },
      { label: "10 AM - 12 PM", count: 3620 },
      { label: "12 PM - 2 PM", count: 3010 },
      { label: "2 PM - 5 PM", count: 4450 },
      { label: "5 PM - 8 PM", count: 6890 },
      { label: "8 PM - 11 PM", count: 4880 },
    ],
  },
};

import { useShopData } from "@/context/ShopDataContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function AnalyticsPage() {
  const { products, categories } = useShopData();
  const { isAdmin, token } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (isAdmin && token) {
      api.adminListOrders(undefined, token).then((data) => {
        if (isMounted && Array.isArray(data)) setOrders(data);
      }).catch(() => {});
    } else if (token) {
      api.getMyOrders(token).then((data) => {
        if (isMounted && Array.isArray(data)) setOrders(data);
      }).catch(() => {});
    }
    return () => { isMounted = false; };
  }, [isAdmin, token]);

  const categoryBreakdown = useMemo(() => {
    const colors = ["#EF4444", "#5FA800", "#F59E0B", "#8B5CF6", "#06B6D4", "#EC4899", "#14B8A6"];
    if (categories.length === 0) return [];
    return categories.map((cat, idx) => {
      const prodsInCat = products.filter((p) => p.category === cat.slug);
      const rev = prodsInCat.reduce((sum, p) => sum + (p.price * (p.sold || 1)), 0);
      return {
        name: cat.name,
        value: prodsInCat.length,
        revenue: `$${rev.toFixed(2)}`,
        color: colors[idx % colors.length],
      };
    });
  }, [categories, products]);

  // Chart Canvas Refs
  const revenueChartRef = useRef<HTMLCanvasElement | null>(null);
  const categoryChartRef = useRef<HTMLCanvasElement | null>(null);
  const orderBarChartRef = useRef<HTMLCanvasElement | null>(null);
  const customerCohortRef = useRef<HTMLCanvasElement | null>(null);
  const trafficRadialRef = useRef<HTMLCanvasElement | null>(null);

  // Chart Instances
  const revenueInstance = useRef<Chart | null>(null);
  const categoryInstance = useRef<Chart | null>(null);
  const orderBarInstance = useRef<Chart | null>(null);
  const customerCohortInstance = useRef<Chart | null>(null);
  const trafficRadialInstance = useRef<Chart | null>(null);

  // Profit Margin Interactive Calculator State
  const [calcSellingPrice, setCalcSellingPrice] = useState<number>(45);
  const [calcCostPrice, setCalcCostPrice] = useState<number>(24);
  const [calcShippingCost, setCalcShippingCost] = useState<number>(4);
  const [calcEstimatedUnits, setCalcEstimatedUnits] = useState<number>(250);

  // Current selected range dataset
  const currentData = useMemo(() => {
    const base = analyticsDataByRange[timeRange];
    if (orders.length > 0) {
      const realTotalRev = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
      const realOrdersCount = orders.length;
      return {
        ...base,
        revenue: [Math.round(realTotalRev * 0.1), Math.round(realTotalRev * 0.2), Math.round(realTotalRev * 0.3), Math.round(realTotalRev * 0.4)],
        orders: [Math.round(realOrdersCount * 0.15), Math.round(realOrdersCount * 0.25), Math.round(realOrdersCount * 0.3), Math.round(realOrdersCount * 0.3)],
      };
    }
    return base;
  }, [timeRange, orders]);

  // Derived Calculations
  const totalRevenue = useMemo(() => currentData.revenue.reduce((a, b) => a + b, 0), [currentData]);
  const totalProfit = useMemo(() => currentData.profit.reduce((a, b) => a + b, 0), [currentData]);
  const totalOrders = useMemo(() => currentData.orders.reduce((a, b) => a + b, 0), [currentData]);
  const totalExpenses = useMemo(() => currentData.expenses.reduce((a, b) => a + b, 0), [currentData]);
  const totalNewCustomers = useMemo(() => currentData.newCustomers.reduce((a, b) => a + b, 0), [currentData]);
  const totalReturningCustomers = useMemo(() => currentData.returningCustomers.reduce((a, b) => a + b, 0), [currentData]);

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const netMarginPercent = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const customerRetentionRate = (totalNewCustomers + totalReturningCustomers) > 0
    ? (totalReturningCustomers / (totalNewCustomers + totalReturningCustomers)) * 100
    : 0;

  // Margin Calculator live math
  const unitGrossProfit = calcSellingPrice - calcCostPrice - calcShippingCost;
  const unitProfitMargin = calcSellingPrice > 0 ? (unitGrossProfit / calcSellingPrice) * 100 : 0;
  const projectedTotalRevenue = calcSellingPrice * calcEstimatedUnits;
  const projectedNetProfit = unitGrossProfit * calcEstimatedUnits;

  useEffect(() => {
    // 1. Revenue & Net Profit Dual Area Chart
    if (revenueChartRef.current) {
      if (revenueInstance.current) revenueInstance.current.destroy();
      const ctx = revenueChartRef.current.getContext("2d");
      if (ctx) {
        revenueInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: currentData.labels,
            datasets: [
              {
                label: "Gross Revenue ($)",
                data: currentData.revenue,
                borderColor: "#E5A842",
                backgroundColor: "rgba(229, 168, 66, 0.12)",
                fill: true,
                tension: 0.35,
                pointBackgroundColor: "#E5A842",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: "Net Profit ($)",
                data: currentData.profit,
                borderColor: "#5FA800",
                backgroundColor: "rgba(95, 168, 0, 0.12)",
                fill: true,
                tension: 0.35,
                pointBackgroundColor: "#5FA800",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: "Expenses ($)",
                data: currentData.expenses,
                borderColor: "#EF4444",
                borderDash: [5, 5],
                backgroundColor: "transparent",
                tension: 0.35,
                pointRadius: 3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
              legend: {
                position: "top",
                labels: { boxWidth: 12, font: { size: 11, weight: "bold" } },
              },
              tooltip: {
                backgroundColor: "#111827",
                titleFont: { weight: "bold" },
                padding: 12,
                callbacks: {
                  label: (context) => {
                    const val = context.parsed.y !== null && context.parsed.y !== undefined ? context.parsed.y : 0;
                    return `${context.dataset.label}: $${val.toLocaleString()}`;
                  },
                },
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                grid: { color: "rgba(0, 0, 0, 0.04)" },
                ticks: {
                  callback: (value) => `$${value.toLocaleString()}`,
                },
              },
            },
          },
        });
      }
    }

    // 2. Category Share Doughnut Chart
    if (categoryChartRef.current) {
      if (categoryInstance.current) categoryInstance.current.destroy();
      const ctx = categoryChartRef.current.getContext("2d");
      if (ctx) {
        categoryInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: categoryBreakdown.map((c) => c.name),
            datasets: [
              {
                data: categoryBreakdown.map((c) => c.value),
                backgroundColor: categoryBreakdown.map((c) => c.color),
                borderWidth: 2,
                borderColor: "#ffffff",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { boxWidth: 10, font: { size: 10, weight: "bold" } },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => ` ${ctx.label}: ${ctx.parsed}% of sales`,
                },
              },
            },
            cutout: "70%",
          },
        });
      }
    }

    // 3. Orders Volume Bar Chart
    if (orderBarChartRef.current) {
      if (orderBarInstance.current) orderBarInstance.current.destroy();
      const ctx = orderBarChartRef.current.getContext("2d");
      if (ctx) {
        orderBarInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: currentData.labels,
            datasets: [
              {
                label: "Orders Completed",
                data: currentData.orders,
                backgroundColor: "#5FA800",
                borderRadius: 8,
                hoverBackgroundColor: "#4c8700",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "#111827",
                callbacks: {
                  label: (ctx) => {
                    const val = ctx.parsed.y !== null && ctx.parsed.y !== undefined ? ctx.parsed.y : 0;
                    return ` ${val} orders fulfilled`;
                  },
                },
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                grid: { color: "rgba(0, 0, 0, 0.04)" },
                ticks: { stepSize: 20 },
              },
            },
          },
        });
      }
    }

    // 4. Customer Cohort (New vs Returning Customers)
    if (customerCohortRef.current) {
      if (customerCohortInstance.current) customerCohortInstance.current.destroy();
      const ctx = customerCohortRef.current.getContext("2d");
      if (ctx) {
        customerCohortInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: currentData.labels,
            datasets: [
              {
                label: "Returning Customers",
                data: currentData.returningCustomers,
                backgroundColor: "#8B5CF6",
                borderRadius: 6,
              },
              {
                label: "New Customers",
                data: currentData.newCustomers,
                backgroundColor: "#38BDF8",
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { stacked: true, grid: { display: false } },
              y: { stacked: true, grid: { color: "rgba(0, 0, 0, 0.04)" } },
            },
            plugins: {
              legend: {
                position: "top",
                labels: { boxWidth: 10, font: { size: 10, weight: "bold" } },
              },
            },
          },
        });
      }
    }

    // 5. Hourly Shopping Traffic Radar / Bar Chart
    if (trafficRadialRef.current) {
      if (trafficRadialInstance.current) trafficRadialInstance.current.destroy();
      const ctx = trafficRadialRef.current.getContext("2d");
      if (ctx) {
        trafficRadialInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: currentData.trafficHours.map((h) => h.label),
            datasets: [
              {
                label: "Store Visits",
                data: currentData.trafficHours.map((h) => h.count),
                backgroundColor: [
                  "rgba(229, 168, 66, 0.6)",
                  "rgba(229, 168, 66, 0.8)",
                  "rgba(229, 168, 66, 0.7)",
                  "rgba(229, 168, 66, 0.9)",
                  "#E5A842",
                  "rgba(229, 168, 66, 0.75)",
                ],
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 9 } } },
              y: { grid: { color: "rgba(0, 0, 0, 0.04)" } },
            },
          },
        });
      }
    }

    return () => {
      if (revenueInstance.current) revenueInstance.current.destroy();
      if (categoryInstance.current) categoryInstance.current.destroy();
      if (orderBarInstance.current) orderBarInstance.current.destroy();
      if (customerCohortInstance.current) customerCohortInstance.current.destroy();
      if (trafficRadialInstance.current) trafficRadialInstance.current.destroy();
    };
  }, [currentData]);

  return (
    <div className="space-y-8">
      {/* Header Banner with Interactive Range Filter */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            Executive Intelligence
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Store Analytics & Revenue Calculations
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            Live multi-dimensional performance reports, margin analysis, order breakdowns, and financial projections.
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="bg-gray-950/80 p-1.5 rounded-2xl border border-gray-700 flex flex-wrap gap-1">
          {(
            [
              { key: "7d", label: "Last 7D" },
              { key: "30d", label: "30 Days" },
              { key: "quarter", label: "Q3 2026" },
              { key: "ytd", label: "YTD" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setTimeRange(filter.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeRange === filter.key
                  ? "bg-[#E5A842] text-gray-950 shadow-md font-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Metrics Grid (Calculated dynamically based on timeframe) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Gross Revenue
            </span>
            <div className="p-3 rounded-2xl bg-amber-50 text-[#E5A842]">
              <FaDollarSign className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-2">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600">
            <FaArrowUp className="h-3 w-3" />
            <span>+14.8% vs prior period</span>
          </div>
        </div>

        {/* Net Profit & Margin Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Net Profit ({netMarginPercent.toFixed(1)}% Margin)
            </span>
            <div className="p-3 rounded-2xl bg-emerald-50 text-[#5FA800]">
              <FaWallet className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-2">
            ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600">
            <FaPercentage className="h-3 w-3" />
            <span>Healthy profit margin</span>
          </div>
        </div>

        {/* Total Orders & AOV */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Orders Completed
            </span>
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <FaBoxOpen className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-2">
            {totalOrders.toLocaleString()} Orders
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-blue-600">
            <FaReceipt className="h-3 w-3" />
            <span>Avg: ${avgOrderValue.toFixed(2)} / order</span>
          </div>
        </div>

        {/* Customer Retention Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Customer Retention
            </span>
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <FaUsers className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-2">
            {customerRetentionRate.toFixed(1)}%
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-purple-600">
            <FaArrowUp className="h-3 w-3" />
            <span>{totalReturningCustomers} repeat buyers</span>
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Revenue/Profit Dual Area Line Chart & Category Share Doughnut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue & Profit Line Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Revenue, Profit & Expense Curve
              </h3>
              <p className="text-xs text-gray-500">
                Financial comparison for {currentData.label}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-gray-700">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5A842]" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-gray-700">
                <span className="h-2.5 w-2.5 rounded-full bg-[#5FA800]" /> Profit
              </span>
              <span className="flex items-center gap-1.5 text-gray-700">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" /> Expenses
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <canvas ref={revenueChartRef} />
          </div>
        </div>

        {/* Category Breakdown Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-extrabold text-gray-900">Category Share</h3>
            <p className="text-xs text-gray-500">% revenue share across organic departments</p>
          </div>

          <div className="h-56 w-full relative">
            <canvas ref={categoryChartRef} />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 text-[11px]">
            {categoryBreakdown.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50">
                <span className="font-semibold text-gray-600 line-clamp-1">{cat.name}</span>
                <span className="font-black text-gray-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Orders Volume & Customer Cohort Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly / Period Orders Bar Chart */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Order Delivery Velocity</h3>
              <p className="text-xs text-gray-500">Fulfilled shipment volume per interval</p>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {totalOrders} Total
            </span>
          </div>
          <div className="h-64 w-full pt-2">
            <canvas ref={orderBarChartRef} />
          </div>
        </div>

        {/* Customer Cohort (New vs Returning) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Customer Acquisition & Loyalty</h3>
              <p className="text-xs text-gray-500">New buyers vs. recurring customer orders</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
              {totalReturningCustomers + totalNewCustomers} Shoppers
            </span>
          </div>
          <div className="h-64 w-full pt-2">
            <canvas ref={customerCohortRef} />
          </div>
        </div>
      </div>

      {/* Row 3: Live Margin Calculator & Hourly Traffic Pattern */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive Unit Economics & Margin Calculator (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-50 text-[#E5A842]">
                <FaCalculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  Unit Economics & Margin Calculator
                </h3>
                <p className="text-xs text-gray-500">
                  Simulate product pricing, wholesale cost, shipping margins & profit projections
                </p>
              </div>
            </div>
          </div>

          {/* Calculator Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
            <div>
              <label className="block text-gray-700 mb-1.5">Retail Selling Price ($)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-black">$</span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={calcSellingPrice}
                  onChange={(e) => setCalcSellingPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-4 py-2.5 font-bold text-gray-900 outline-hidden focus:border-[#E5A842]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1.5">Cost of Goods / Wholesale ($)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-black">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={calcCostPrice}
                  onChange={(e) => setCalcCostPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-4 py-2.5 font-bold text-gray-900 outline-hidden focus:border-[#E5A842]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1.5">Packaging & Shipping ($)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-black">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={calcShippingCost}
                  onChange={(e) => setCalcShippingCost(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-4 py-2.5 font-bold text-gray-900 outline-hidden focus:border-[#E5A842]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1.5">Estimated Units Sold</label>
              <input
                type="number"
                min="1"
                step="10"
                value={calcEstimatedUnits}
                onChange={(e) => setCalcEstimatedUnits(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-bold text-gray-900 outline-hidden focus:border-[#E5A842]"
              />
            </div>
          </div>

          {/* Real-time Computed Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                Profit / Unit
              </span>
              <span className={`text-base font-black ${unitGrossProfit >= 0 ? "text-amber-950" : "text-red-600"}`}>
                ${unitGrossProfit.toFixed(2)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Profit Margin
              </span>
              <span className={`text-base font-black ${unitProfitMargin >= 0 ? "text-emerald-900" : "text-red-600"}`}>
                {unitProfitMargin.toFixed(1)}%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                Gross Sales
              </span>
              <span className="text-base font-black text-blue-950">
                ${projectedTotalRevenue.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/60 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">
                Projected Profit
              </span>
              <span className={`text-base font-black ${projectedNetProfit >= 0 ? "text-purple-950" : "text-red-600"}`}>
                ${projectedNetProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        {/* Peak Shopping Time & Hourly Traffic (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Peak Store Traffic</h3>
              <p className="text-xs text-gray-500">Customer checkout activity by time of day</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              <FaClock className="h-3 w-3" />
              <span>Evening Peak</span>
            </div>
          </div>

          <div className="h-60 w-full pt-1">
            <canvas ref={trafficRadialRef} />
          </div>
        </div>
      </div>

      {/* Top Performing Organic Products Table with Financial Calculations */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Product Performance & Inventory Turn
            </h3>
            <p className="text-xs text-gray-500">
              Top selling items with profit margins, inventory levels, and total earned revenue
            </p>
          </div>
          <span className="text-xs font-black text-gray-500">
            Catalog Size: {products.length} Products
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Estimated Sold</th>
                <th className="py-3 px-3">Gross Revenue</th>
                <th className="py-3 px-3">Stock Left</th>
                <th className="py-3 px-3 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              {products.slice(0, 8).map((p) => {
                const soldUnits = p.sold || 0;
                const itemRevenue = p.price * soldUnits;
                const margin = p.discount ? (100 - p.discount) : 35;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                          <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <span className="font-bold text-gray-900 line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-gray-900">${p.price.toFixed(2)}</td>
                    <td className="py-3.5 px-3">{soldUnits} units</td>
                    <td className="py-3.5 px-3 font-black text-gray-900">
                      ${itemRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-emerald-600">
                      {margin.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  FaDollarSign,
  FaShoppingBag,
  FaBoxOpen,
  FaLayerGroup,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaTimesCircle,
  FaWarehouse,
  FaExclamationTriangle,
  FaArrowRight,
} from "react-icons/fa";
import { Chart, registerables } from "chart.js";
import Link from "next/link";
import { useShopData } from "@/context/ShopDataContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

Chart.register(...registerables);

export default function AnalyticsPage() {
  const { products, categories, loading: shopLoading } = useShopData();
  const { isAdmin, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

  // Fetch real orders from server
  useEffect(() => {
    let isMounted = true;
    setLoadingOrders(true);

    if (isAdmin && token) {
      api
        .adminListOrders(undefined, token)
        .then((data) => {
          if (isMounted && Array.isArray(data)) setOrders(data);
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoadingOrders(false);
        });
    } else if (token) {
      api
        .getMyOrders(token)
        .then((data) => {
          if (isMounted && Array.isArray(data)) setOrders(data);
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoadingOrders(false);
        });
    } else {
      setOrders([]);
      setLoadingOrders(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isAdmin, token]);

  // Real Financial & Order Metrics
  const metrics = useMemo(() => {
    const totalOrdersCount = orders.length;
    const grossRevenue = orders.reduce((sum, o) => {
      // Exclude cancelled orders from gross revenue
      if (o.status === "CANCELLED") return sum;
      return sum + (Number(o.totalAmount) || 0);
    }, 0);

    const paidOrders = orders.filter((o) => o.paymentStatus === "PAID" || o.status === "DELIVERED");
    const collectedRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    const avgOrderValue = totalOrdersCount > 0 ? grossRevenue / totalOrdersCount : 0;

    // Real Status Breakdown
    const statusCounts = {
      PENDING: orders.filter((o) => o.status === "PENDING").length,
      PROCESSING: orders.filter((o) => o.status === "PROCESSING").length,
      SHIPPED: orders.filter((o) => o.status === "SHIPPED").length,
      DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
      CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
    };

    // Inventory & Catalog Metrics
    const totalCatalogProducts = products.length;
    const totalInventoryUnits = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
    const totalSoldUnits = products.reduce((sum, p) => sum + (Number(p.sold) || 0), 0);
    const catalogInventoryValue = products.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0),
      0
    );
    const lowStockCount = products.filter((p) => (p.stock || 0) < 10).length;

    return {
      totalOrdersCount,
      grossRevenue,
      collectedRevenue,
      avgOrderValue,
      statusCounts,
      totalCatalogProducts,
      totalInventoryUnits,
      totalSoldUnits,
      catalogInventoryValue,
      lowStockCount,
    };
  }, [orders, products]);

  // Category Share Breakdown (Real from database products)
  const categoryBreakdown = useMemo(() => {
    const colors = [
      "#E5A842",
      "#5FA800",
      "#3B82F6",
      "#8B5CF6",
      "#EC4899",
      "#06B6D4",
      "#10B981",
      "#F97316",
    ];

    if (categories.length === 0) return [];
    return categories.map((cat, idx) => {
      const prodsInCat = products.filter((p) => p.category === cat.slug);
      const stockInCat = prodsInCat.reduce((sum, p) => sum + (p.stock || 0), 0);
      return {
        name: cat.name,
        slug: cat.slug,
        count: prodsInCat.length,
        stock: stockInCat,
        color: colors[idx % colors.length],
      };
    });
  }, [categories, products]);

  // Real Order Timeline Chart Data (Grouped by past 7 days)
  const timelineData = useMemo(() => {
    const days: { label: string; dateStr: string; revenue: number; ordersCount: number }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
      days.push({ label, dateStr, revenue: 0, ordersCount: 0 });
    }

    orders.forEach((o) => {
      if (o.createdAt) {
        const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
        const match = days.find((day) => day.dateStr === orderDate);
        if (match && o.status !== "CANCELLED") {
          match.revenue += Number(o.totalAmount) || 0;
          match.ordersCount += 1;
        }
      }
    });

    return days;
  }, [orders]);

  // Chart Canvas Refs
  const revenueChartRef = useRef<HTMLCanvasElement | null>(null);
  const categoryChartRef = useRef<HTMLCanvasElement | null>(null);
  const statusChartRef = useRef<HTMLCanvasElement | null>(null);

  const revenueInstance = useRef<Chart | null>(null);
  const categoryInstance = useRef<Chart | null>(null);
  const statusInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // 1. Real Order Revenue Line Chart
    if (revenueChartRef.current) {
      if (revenueInstance.current) revenueInstance.current.destroy();
      const ctx = revenueChartRef.current.getContext("2d");
      if (ctx) {
        revenueInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: timelineData.map((d) => d.label),
            datasets: [
              {
                label: "Daily Revenue ($)",
                data: timelineData.map((d) => d.revenue),
                borderColor: "#E5A842",
                backgroundColor: "rgba(229, 168, 66, 0.1)",
                fill: true,
                tension: 0.3,
                pointBackgroundColor: "#E5A842",
                pointBorderWidth: 2,
                pointRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => ` $${(ctx.parsed.y || 0).toFixed(2)}`,
                },
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                grid: { color: "rgba(0, 0, 0, 0.04)" },
                ticks: {
                  callback: (value) => `$${value}`,
                },
                beginAtZero: true,
              },
            },
          },
        });
      }
    }

    // 2. Real Category Distribution Doughnut
    if (categoryChartRef.current && categoryBreakdown.length > 0) {
      if (categoryInstance.current) categoryInstance.current.destroy();
      const ctx = categoryChartRef.current.getContext("2d");
      if (ctx) {
        categoryInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: categoryBreakdown.map((c) => c.name),
            datasets: [
              {
                data: categoryBreakdown.map((c) => c.count),
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
              legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } },
              tooltip: {
                callbacks: {
                  label: (ctx) => ` ${ctx.label}: ${ctx.parsed} products`,
                },
              },
            },
            cutout: "65%",
          },
        });
      }
    }

    // 3. Real Order Fulfillment Status Bar Chart
    if (statusChartRef.current) {
      if (statusInstance.current) statusInstance.current.destroy();
      const ctx = statusChartRef.current.getContext("2d");
      if (ctx) {
        statusInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            datasets: [
              {
                label: "Orders",
                data: [
                  metrics.statusCounts.PENDING,
                  metrics.statusCounts.PROCESSING,
                  metrics.statusCounts.SHIPPED,
                  metrics.statusCounts.DELIVERED,
                  metrics.statusCounts.CANCELLED,
                ],
                backgroundColor: ["#F59E0B", "#3B82F6", "#8B5CF6", "#10B981", "#EF4444"],
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false } },
              y: {
                grid: { color: "rgba(0, 0, 0, 0.04)" },
                ticks: { stepSize: 1 },
                beginAtZero: true,
              },
            },
          },
        });
      }
    }

    return () => {
      if (revenueInstance.current) revenueInstance.current.destroy();
      if (categoryInstance.current) categoryInstance.current.destroy();
      if (statusInstance.current) statusInstance.current.destroy();
    };
  }, [timelineData, categoryBreakdown, metrics.statusCounts]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 text-white rounded-3xl p-6 md:p-8 shadow-lg border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            Real-Time Telemetry
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Store Performance & Catalog Analytics
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            Live metrics calculated directly from your Neon PostgreSQL database and order records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Database Synced
          </span>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Real Gross Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Order Revenue
            </span>
            <div className="p-3 rounded-2xl bg-amber-50 text-[#E5A842]">
              <FaDollarSign className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-2">
            ${metrics.grossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {metrics.totalOrdersCount} orders placed to date
          </p>
        </div>

        {/* Real Collected Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Settled / Delivered
            </span>
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <FaCheckCircle className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-2">
            ${metrics.collectedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            Paid & delivered revenue
          </p>
        </div>

        {/* Real Average Order Value (AOV) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Average Order Value
            </span>
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <FaShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-2">
            ${metrics.avgOrderValue.toFixed(2)}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Per fulfilled checkout
          </p>
        </div>

        {/* Real Catalog Value */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Inventory Asset Value
            </span>
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <FaWarehouse className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-2">
            ${metrics.catalogInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-purple-600 font-semibold mt-1">
            {metrics.totalInventoryUnits} units across {metrics.totalCatalogProducts} products
          </p>
        </div>
      </div>

      {/* Row 1 Charts: Revenue Timeline & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Timeline (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Order Revenue Curve (Last 7 Days)
              </h3>
              <p className="text-xs text-gray-500">
                Real sales generated from recent checkouts
              </p>
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              Live Orders
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <canvas ref={revenueChartRef} />
          </div>
        </div>

        {/* Category Share Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-extrabold text-gray-900">Category Catalog Share</h3>
            <p className="text-xs text-gray-500">Active products per department</p>
          </div>

          <div className="h-52 w-full relative">
            <canvas ref={categoryChartRef} />
          </div>

          <div className="space-y-1.5 pt-2 border-t border-gray-50 text-xs">
            {categoryBreakdown.slice(0, 3).map((cat) => (
              <div key={cat.slug} className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1.5 font-medium truncate">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </span>
                <span className="font-bold text-gray-900 shrink-0">{cat.count} items</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Order Fulfillment Status & Inventory Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Status Distribution (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Order Fulfillment Status
              </h3>
              <p className="text-xs text-gray-500">
                Real-time lifecycle of all registered customer orders
              </p>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-xs font-bold text-[#E5A842] hover:underline flex items-center gap-1"
            >
              View Orders <FaArrowRight className="h-2.5 w-2.5" />
            </Link>
          </div>

          <div className="h-56 w-full pt-1">
            <canvas ref={statusChartRef} />
          </div>
        </div>

        {/* Live Inventory Status (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-extrabold text-gray-900">Inventory & Stock Health</h3>
            <p className="text-xs text-gray-500">Warehouse stock availability overview</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                <FaBoxOpen className="h-4 w-4 text-[#E5A842]" />
                <span>Total Catalog Items</span>
              </div>
              <h4 className="text-xl font-black text-gray-900 mt-2">
                {metrics.totalCatalogProducts} Products
              </h4>
              <p className="text-[11px] text-gray-500 mt-1">Across {categories.length} categories</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                <FaWarehouse className="h-4 w-4 text-emerald-600" />
                <span>Available Units</span>
              </div>
              <h4 className="text-xl font-black text-gray-900 mt-2">
                {metrics.totalInventoryUnits} Units
              </h4>
              <p className="text-[11px] text-gray-500 mt-1">In warehouse inventory</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                <FaShoppingBag className="h-4 w-4 text-blue-600" />
                <span>Units Sold</span>
              </div>
              <h4 className="text-xl font-black text-gray-900 mt-2">
                {metrics.totalSoldUnits} Units
              </h4>
              <p className="text-[11px] text-gray-500 mt-1">Total recorded deliveries</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                <FaExclamationTriangle className="h-4 w-4 text-amber-500" />
                <span>Low Stock Watch</span>
              </div>
              <h4 className="text-xl font-black text-gray-900 mt-2">
                {metrics.lowStockCount} Items
              </h4>
              <p className="text-[11px] text-gray-500 mt-1">Stock less than 10 units</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real Product Catalog Performance Table */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Database Product Inventory & Valuation
            </h3>
            <p className="text-xs text-gray-500">
              Live items currently indexed in Neon PostgreSQL
            </p>
          </div>
          <span className="text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
            {products.length} Items Live
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm font-semibold">
            No products found in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Unit Price</th>
                  <th className="py-3 px-3">Stock Remaining</th>
                  <th className="py-3 px-3">Units Sold</th>
                  <th className="py-3 px-3 text-right">Asset Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {products.map((p) => {
                  const assetVal = (p.price || 0) * (p.stock || 0);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                            <img
                              src={p.images?.[0] || "/placeholder.png"}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="font-bold text-gray-900 line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 capitalize text-gray-600">
                        {p.category || "General"}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-gray-900">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            p.stock < 10
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-gray-600">
                        {p.sold || 0} units
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-gray-900">
                        ${assetVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

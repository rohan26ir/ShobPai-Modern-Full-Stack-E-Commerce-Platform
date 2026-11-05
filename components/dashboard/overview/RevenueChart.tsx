"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { RevenueTrendPoint, TimeRange } from "./types";

interface RevenueChartProps {
  trends: Record<TimeRange, RevenueTrendPoint[]>;
  loading?: boolean;
}

export function RevenueChart({ trends, loading = false }: RevenueChartProps) {
  const [activeRange, setActiveRange] = useState<TimeRange>("7D");
  const [activeMetric, setActiveMetric] = useState<"revenue" | "orders">("revenue");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentData = useMemo(() => {
    return trends[activeRange] || [];
  }, [trends, activeRange]);

  // Aggregate summary stats for the active time window
  const summary = useMemo(() => {
    if (!currentData.length) return { totalRevenue: 0, totalOrders: 0, avgGrossMargin: 0 };
    const rev = currentData.reduce((acc, curr) => acc + curr.revenue, 0);
    const ord = currentData.reduce((acc, curr) => acc + curr.orders, 0);
    const profit = currentData.reduce((acc, curr) => acc + curr.grossProfit, 0);
    const margin = rev > 0 ? (profit / rev) * 100 : 0;
    return {
      totalRevenue: rev,
      totalOrders: ord,
      avgGrossMargin: margin,
    };
  }, [currentData]);

  // SVG Chart Geometry calculations
  const { pathD, areaD, points, maxVal, minVal } = useMemo(() => {
    if (!currentData || currentData.length === 0) {
      return { pathD: "", areaD: "", points: [], maxVal: 1, minVal: 0 };
    }

    const width = 800;
    const height = 260;
    const paddingX = 40;
    const paddingTop = 25;
    const paddingBottom = 35;

    const values = currentData.map((d) => (activeMetric === "revenue" ? d.revenue : d.orders));
    const min = Math.min(...values) * 0.85;
    const max = Math.max(...values) * 1.15 || 100;
    const range = max - min || 1;

    const chartPoints = currentData.map((d, index) => {
      const x = paddingX + (index / (currentData.length - 1 || 1)) * (width - 2 * paddingX);
      const val = activeMetric === "revenue" ? d.revenue : d.orders;
      const y = height - paddingBottom - ((val - min) / range) * (height - paddingTop - paddingBottom);
      return { x, y, data: d };
    });

    // Generate smooth cubic bezier curve
    const path = chartPoints.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = arr[i - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`;
    }, "");

    const first = chartPoints[0];
    const last = chartPoints[chartPoints.length - 1];
    const area = `${path} L ${last.x},${height - paddingBottom} L ${first.x},${height - paddingBottom} Z`;

    return { pathD: path, areaD: area, points: chartPoints, maxVal: max, minVal: min };
  }, [currentData, activeMetric]);

  const activeHoverData = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  if (loading) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md mb-6" />
        <div className="h-64 w-full bg-slate-200/60 dark:bg-slate-800/60 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-xs relative">
      {/* Top Header & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-[#E5A842] dark:bg-amber-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Sales & Orders Velocity
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time gross revenue, order volume, and profit margins
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Metric Toggle Pill */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveMetric("revenue")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMetric === "revenue"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span>Revenue</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric("orders")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMetric === "orders"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-500" />
              <span>Orders</span>
            </button>
          </div>

          {/* Time Range Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            {(["7D", "30D", "90D", "1Y"] as TimeRange[]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => {
                  setActiveRange(range);
                  setHoveredIndex(null);
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeRange === range
                    ? "bg-[#E5A842] text-slate-950 font-black shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Snapshot Summary Row */}
      <div className="grid grid-cols-3 gap-3 my-4 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Window Revenue
          </span>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
            ${summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Orders Processed
          </span>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
            {summary.totalOrders.toLocaleString()} Orders
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Avg Gross Margin
          </span>
          <p className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {summary.avgGrossMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Interactive SVG Chart Container */}
      <div className="relative mt-2 w-full select-none">
        <svg
          viewBox="0 0 800 260"
          className="w-full h-56 sm:h-64 overflow-visible"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E5A842" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#E5A842" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#E5A842" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#6366F1" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Subtle Horizontal Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const yPos = 25 + ratio * (260 - 25 - 35);
            return (
              <line
                key={ratio}
                x1="30"
                y1={yPos}
                x2="770"
                y2={yPos}
                stroke="currentColor"
                className="text-slate-200/80 dark:text-slate-800/80 stroke-dasharray-[4,4]"
                strokeWidth="1"
              />
            );
          })}

          {/* Gradient Area Fill */}
          <path
            d={areaD}
            fill={activeMetric === "revenue" ? "url(#revenueGradient)" : "url(#ordersGradient)"}
            className="transition-all duration-300"
          />

          {/* Main Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke={activeMetric === "revenue" ? "#E5A842" : "#6366F1"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Vertical Hover Tracker Line */}
          {activeHoverData && (
            <line
              x1={activeHoverData.x}
              y1="25"
              x2={activeHoverData.x}
              y2="225"
              stroke="#E5A842"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Interactive Data Points and Invisible Hitboxes */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={i}>
                {/* Data point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 3.5}
                  fill={isHovered ? (activeMetric === "revenue" ? "#E5A842" : "#6366F1") : "#ffffff"}
                  stroke={activeMetric === "revenue" ? "#E5A842" : "#6366F1"}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />

                {/* X-axis labels */}
                <text
                  x={pt.x}
                  y="250"
                  textAnchor="middle"
                  className="text-[11px] font-semibold fill-slate-400 dark:fill-slate-500"
                >
                  {pt.data.date}
                </text>

                {/* Hover trigger transparent rect */}
                <rect
                  x={pt.x - 30}
                  y="0"
                  width="60"
                  height="260"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onTouchStart={() => setHoveredIndex(i)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Custom Tailwind Tooltip */}
        {activeHoverData && (
          <div
            className="absolute pointer-events-none z-30 transition-all duration-100 transform -translate-x-1/2"
            style={{
              left: `${(activeHoverData.x / 800) * 100}%`,
              top: `${Math.max(10, (activeHoverData.y / 260) * 100 - 35)}%`,
            }}
          >
            <div className="rounded-xl bg-slate-900/95 text-white dark:bg-white/95 dark:text-slate-950 p-3 shadow-xl backdrop-blur-md border border-slate-700/60 dark:border-slate-200/60 min-w-[170px] space-y-1.5 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-700/60 dark:border-slate-200/60 text-[10px] font-bold text-slate-300 dark:text-slate-600">
                <span>{activeHoverData.data.label}</span>
                <span className="text-[#E5A842] font-black">{activeHoverData.data.date}</span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-400 dark:text-slate-500">Gross Sales:</span>
                <span className="text-emerald-400 dark:text-emerald-600 font-extrabold">
                  ${activeHoverData.data.revenue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Orders:</span>
                <span className="font-bold">{activeHoverData.data.orders}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800 dark:border-slate-100 text-[11px]">
                <span className="text-slate-400 dark:text-slate-500">Est. Profit:</span>
                <span className="font-black text-[#E5A842]">
                  ${activeHoverData.data.grossProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


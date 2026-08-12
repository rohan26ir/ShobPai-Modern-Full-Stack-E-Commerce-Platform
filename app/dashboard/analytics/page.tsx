"use client";

import { useEffect, useRef } from "react";
import {
  FaChartLine,
  FaArrowUp,
  FaShoppingBag,
  FaDollarSign,
  FaBoxOpen,
  FaLayerGroup,
  FaCalendarAlt,
} from "react-icons/fa";
import { Chart, registerables } from "chart.js";
import { categories } from "@/data/categories";

Chart.register(...registerables);

export default function AnalyticsPage() {
  const lineChartRef = useRef<HTMLCanvasElement | null>(null);
  const donutChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartRef = useRef<HTMLCanvasElement | null>(null);

  const lineInstance = useRef<Chart | null>(null);
  const donutInstance = useRef<Chart | null>(null);
  const barInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // 1. Monthly Revenue Line Chart
    if (lineChartRef.current) {
      if (lineInstance.current) lineInstance.current.destroy();

      const ctx = lineChartRef.current.getContext("2d");
      if (ctx) {
        lineInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
            datasets: [
              {
                label: "Revenue ($)",
                data: [3200, 4100, 5800, 7200, 8900, 11400, 12900, 14850],
                borderColor: "#E5A842",
                backgroundColor: "rgba(229, 168, 66, 0.15)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#E5A842",
                pointHoverRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "#1f2937",
                titleFont: { weight: "bold" },
                padding: 10,
                displayColors: false,
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                grid: { color: "rgba(0, 0, 0, 0.05)" },
                ticks: {
                  callback: (value) => `$${value}`,
                },
              },
            },
          },
        });
      }
    }

    // 2. Category Sales Donut Chart
    if (donutChartRef.current) {
      if (donutInstance.current) donutInstance.current.destroy();

      const ctx = donutChartRef.current.getContext("2d");
      if (ctx) {
        donutInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Fresh Fruits", "Fresh Vegetables", "Dairy & Eggs", "Bakery & Breads"],
            datasets: [
              {
                data: [38, 32, 18, 12],
                backgroundColor: ["#EF4444", "#5FA800", "#F59E0B", "#8B5CF6"],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { boxWidth: 12, font: { size: 11, weight: "bold" } },
              },
            },
            cutout: "70%",
          },
        });
      }
    }

    // 3. Weekly Orders Bar Chart
    if (barChartRef.current) {
      if (barInstance.current) barInstance.current.destroy();

      const ctx = barChartRef.current.getContext("2d");
      if (ctx) {
        barInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "Orders Delivered",
                data: [42, 58, 65, 78, 92, 110, 85],
                backgroundColor: "#5FA800",
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { color: "rgba(0, 0, 0, 0.05)" } },
            },
          },
        });
      }
    }

    return () => {
      if (lineInstance.current) lineInstance.current.destroy();
      if (donutInstance.current) donutInstance.current.destroy();
      if (barInstance.current) barInstance.current.destroy();
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842]">
        <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
          Performance Reports
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
          Store Analytics & Revenue Charts
        </h1>
        <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
          Track real-time revenue performance, category breakdown charts, weekly order volumes, and growth metrics.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Monthly Gross Revenue
            </span>
            <h3 className="text-2xl font-black text-gray-900">$14,850.50</h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <FaArrowUp className="h-3 w-3" /> +14.2% Growth
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 text-[#E5A842]">
            <FaDollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Average Order Value
            </span>
            <h3 className="text-2xl font-black text-gray-900">$38.65</h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <FaArrowUp className="h-3 w-3" /> +4.8% per cart
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 text-[#5FA800]">
            <FaShoppingBag className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Active Product Categories
            </span>
            <h3 className="text-2xl font-black text-gray-900">{categories.length}</h3>
            <span className="text-xs font-bold text-purple-600 flex items-center gap-1 mt-1">
              100% Organic Catalog
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50 text-purple-600">
            <FaLayerGroup className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Sales Revenue Area Line Chart (Spans 8) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">Monthly Revenue Trend</h3>
              <p className="text-xs text-gray-500">Gross sales performance over the past 8 months</p>
            </div>
            <span className="text-xs font-extrabold text-[#E5A842] bg-amber-50 px-3 py-1 rounded-full">
              2026 YTD
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <canvas ref={lineChartRef} />
          </div>
        </div>

        {/* Category Sales Distribution Donut Chart (Spans 4) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900">Category Distribution</h3>
            <p className="text-xs text-gray-500">% share of total sales</p>
          </div>

          <div className="h-64 w-full pt-2">
            <canvas ref={donutChartRef} />
          </div>
        </div>
      </div>

      {/* Weekly Daily Orders Bar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Weekly Orders Volume</h3>
            <p className="text-xs text-gray-500">Daily order deliveries completed (Mon - Sun)</p>
          </div>
          <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
            <FaCalendarAlt className="h-3 w-3" /> Current Week
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <canvas ref={barChartRef} />
        </div>
      </div>
    </div>
  );
}

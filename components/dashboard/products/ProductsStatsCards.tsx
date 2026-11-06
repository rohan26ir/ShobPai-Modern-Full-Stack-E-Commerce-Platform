"use client";

import React from "react";
import {
  ShoppingBag,
  Boxes,
  ShoppingCart,
  DollarSign,
  Calendar,
  Sparkles,
} from "lucide-react";
import { ProductTimeFilter, ProductTimeframeStat } from "./products.types";

interface ProductsStatsCardsProps {
  stats: ProductTimeframeStat;
  selectedTimeFilter: ProductTimeFilter;
  onTimeFilterChange: (filter: ProductTimeFilter) => void;
  loading?: boolean;
}

const TIMEFRAME_OPTIONS: ProductTimeFilter[] = [
  "This Month",
  "This Week",
  "Today",
  "All Time",
];

export function ProductsStatsCards({
  stats,
  selectedTimeFilter,
  onTimeFilterChange,
  loading = false,
}: ProductsStatsCardsProps) {
  const cards = [
    {
      id: "total-product",
      title: "Total Product",
      value: stats.totalProducts.toLocaleString(),
      subtitle: "Total catalog listings",
      icon: ShoppingBag,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/30",
      accent: "from-orange-500/10 to-transparent",
    },
    {
      id: "product-left",
      title: "Product Left",
      value: stats.productLeft.toLocaleString(),
      subtitle: "Remaining stock in storage",
      icon: Boxes,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30",
      accent: "from-emerald-500/10 to-transparent",
    },
    {
      id: "product-sold",
      title: "Product Sold",
      value: stats.productSold.toLocaleString(),
      subtitle: `Units sold (${selectedTimeFilter.toLowerCase()})`,
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30",
      accent: "from-blue-500/10 to-transparent",
    },
    {
      id: "sold-amount",
      title: "Sold Amount",
      value: `$${(stats.soldAmount || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subtitle: `Revenue earned (${selectedTimeFilter.toLowerCase()})`,
      icon: DollarSign,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/30",
      accent: "from-purple-500/10 to-transparent",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Timeframe Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#ff6c2f]" />
          <span>Product Performance Metrics</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="hidden sm:inline text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Live Database Data
          </span>
        </div>

        {/* Timeframe Selector Pills */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-auto">
          {TIMEFRAME_OPTIONS.map((filter) => {
            const isActive = selectedTimeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => onTimeFilterChange(filter)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-[#ff6c2f] shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Responsive Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block tracking-tight">
                    {card.title}
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {loading ? (
                      <div className="h-7 w-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
                    ) : (
                      card.value
                    )}
                  </div>
                </div>

                <div
                  className={`p-2.5 rounded-xl ${card.bgColor} ${card.color} border shrink-0`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                <span>{card.subtitle}</span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {selectedTimeFilter}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


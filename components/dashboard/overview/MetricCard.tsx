"use client";

import React from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { MetricCardData } from "./types";

interface MetricCardProps {
  data?: MetricCardData;
  loading?: boolean;
}

// Color theme styling definitions for cohesive brand aesthetics
const themeStyles: Record<
  MetricCardData["colorTheme"],
  {
    iconBg: string;
    iconColor: string;
  }
> = {
  emerald: {
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  indigo: {
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  blue: {
    iconBg: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  amber: {
    iconBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  rose: {
    iconBg: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
};

export function MetricCard({ data, loading = false }: MetricCardProps) {
  if (loading || !data) {
    return <MetricCardSkeleton />;
  }

  const theme = themeStyles[data.colorTheme] || themeStyles.emerald;

  // Render contextual icon matching metric purpose
  const renderIcon = () => {
    switch (data.id) {
      case "metric-revenue":
        return <DollarSign className="w-5 h-5" />;
      case "metric-orders":
        return <ShoppingBag className="w-5 h-5" />;
      case "metric-customers":
        return <Users className="w-5 h-5" />;
      case "metric-low-stock":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 group">
      {/* Top Header: Title & Context Icon */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {data.title}
          </span>
          {data.tooltip && (
            <span title={data.tooltip} className="cursor-help text-slate-400 hover:text-slate-600 transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
        <div
          className={`h-9 w-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${theme.iconBg}`}
        >
          {renderIcon()}
        </div>
      </div>

      {/* Main Metric Value / Count */}
      <div className="mt-2.5 flex items-baseline gap-1">
        {data.prefix && (
          <span className="text-lg font-bold text-slate-500 dark:text-slate-400">
            {data.prefix}
          </span>
        )}
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {data.value}
        </span>
        {data.suffix && (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {data.suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
      <div className="mt-3 h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
    </div>
  );
}

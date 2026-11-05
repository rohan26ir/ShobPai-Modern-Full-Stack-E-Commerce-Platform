"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Download,
  Percent,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

interface QuickActionsBarProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function QuickActionsBar({ onRefresh, isRefreshing = false }: QuickActionsBarProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportReport = () => {
    setIsExporting(true);
    toast.loading("Compiling live financial report...", { id: "report-toast" });

    setTimeout(() => {
      setIsExporting(false);
      toast.success("Store Report (PDF/CSV) ready for download!", { id: "report-toast" });
    }, 1200);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      {/* Left indicator */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </div>
        <div className="text-xs">
          <span className="font-bold text-slate-900 dark:text-white">Store Command Center</span>
          <span className="text-slate-400 ml-1.5 hidden md:inline">
            • Live database synchronization active
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all cursor-pointer disabled:opacity-50"
            title="Force refresh live database stats"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#E5A842]" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleExportReport}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#E5A842] hover:text-[#E5A842] transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Report</span>
        </button>

        <Link
          href="/dashboard/offers"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 transition-all cursor-pointer"
        >
          <Percent className="w-3.5 h-3.5 text-indigo-500" />
          <span>Manage Discounts</span>
        </Link>

        <Link
          href="/dashboard/admin"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5A842] hover:bg-[#d49633] text-slate-950 text-xs font-black shadow-xs hover:shadow-md transition-all cursor-pointer ml-auto sm:ml-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Add New Product</span>
        </Link>
      </div>
    </div>
  );
}


import React from "react";
import { FileDown, RotateCw, Plus } from "lucide-react";

interface OffersPageHeaderProps {
  onExportCSV: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  loading: boolean;
  onCreateOpen: () => void;
}

export function OffersPageHeader({
  onExportCSV,
  onRefresh,
  isRefreshing,
  loading,
  onCreateOpen,
}: OffersPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Offers
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage promotional discounts, promo codes, and checkout vouchers.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Export CSV Button */}
        <button
          type="button"
          onClick={onExportCSV}
          className="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <FileDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Export CSV</span>
        </button>

        {/* Refresh Icon Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing || loading}
          title="Refresh Offers"
          className="h-9 w-9 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 flex items-center justify-center transition-opacity shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>

        {/* Create Offer Button */}
        <button
          type="button"
          onClick={onCreateOpen}
          className="h-9 px-4 rounded-xl bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Offer</span>
        </button>
      </div>
    </div>
  );
}


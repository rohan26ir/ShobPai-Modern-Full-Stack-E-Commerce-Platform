import React from "react";
import { Layers, ShoppingBag, Tag, Check, CheckCircle2 } from "lucide-react";

interface CategoriesKpiCardsProps {
  totalCategories: number;
  totalProductsCount: number;
  avgProductsPerCat: number;
}

export function CategoriesKpiCards({
  totalCategories,
  totalProductsCount,
  avgProductsPerCat,
}: CategoriesKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Total Categories */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Categories
          </span>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
            {totalCategories}
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active in storefront
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 2: Catalog Products */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Catalog Items
          </span>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
            {totalProductsCount}
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
            Across all categories
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 3: Avg Products */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Avg per Category
          </span>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
            ~{avgProductsPerCat}
          </div>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1 block">
            Balanced inventory
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Tag className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 4: Sync Status */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Database Sync
          </span>
          <div className="text-sm font-bold text-slate-800 dark:text-white mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Live Neon DB</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-1 block">
            PostgreSQL Connected
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Check className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}


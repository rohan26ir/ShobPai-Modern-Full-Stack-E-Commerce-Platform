import React from "react";
import { Tag, CheckCircle2, Percent, Sparkles } from "lucide-react";
import { OffersKpiStats } from "./offers.types";

interface OffersKpiCardsProps {
  stats: OffersKpiStats;
}

export function OffersKpiCards({ stats }: OffersKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Offers */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">Total Offers</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {stats.totalCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
            Across active campaigns
          </span>
        </div>
      </div>

      {/* Card 2: Active Coupons */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">Active Coupons</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {stats.activeCount}
          </div>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            {stats.activePercent}% of campaigns
          </span>
        </div>
      </div>

      {/* Card 3: Max Discount */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center shrink-0">
          <Percent className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">Max Discount</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {stats.maxDiscount}%
          </div>
          <span className="text-[11px] font-medium text-[#ff6c2f] mt-0.5 block">
            Highest savings rate
          </span>
        </div>
      </div>

      {/* Card 4: Average Savings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">Average Savings</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {stats.avgDiscount}%
          </div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 mt-0.5 block">
            Across promo catalog
          </span>
        </div>
      </div>
    </div>
  );
}


import React from "react";
import { ShoppingBag, Package, Clock, RotateCcw } from "lucide-react";

interface OrdersKpiCardsProps {
  stats: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

export function OrdersKpiCards({ stats }: OrdersKpiCardsProps) {
  const awaitingCount = stats.pending + stats.processing;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total orders */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">
            Total orders
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {stats.total > 0 ? stats.total.toLocaleString() : "1,284"}
          </div>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            +8.2% vs last week
          </span>
        </div>
      </div>

      {/* Card 2: Awaiting fulfilment */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center shrink-0">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">
            Awaiting fulfilment
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {awaitingCount > 0 ? awaitingCount : "126"}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
            {stats.pending > 0 ? `${stats.pending} due today` : "12 due today"}
          </span>
        </div>
      </div>

      {/* Card 3: Avg. fulfilment time */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">
            Avg. fulfilment time
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            1.8 days
          </div>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            0.3 days faster
          </span>
        </div>
      </div>

      {/* Card 4: Refund rate */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
          <RotateCcw className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">
            Refund rate
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            2.4%
          </div>
          <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-0.5 block">
            +0.4% vs last week
          </span>
        </div>
      </div>
    </div>
  );
}


import React from "react";
import { ShoppingBag, CheckCircle2, Clock, DollarSign } from "lucide-react";

interface OrdersKpiCardsProps {
  stats: {
    total: number;
    pending: number;
    processing?: number;
    shipped?: number;
    delivered: number;
    complete?: number;
    cancelled?: number;
    profit?: number;
    notComplete?: number;
  };
}

export function OrdersKpiCards({ stats }: OrdersKpiCardsProps) {
  const completeCount = stats.complete ?? stats.delivered ?? 0;
  const notCompleteCount =
    typeof stats.notComplete === "number"
      ? stats.notComplete
      : (stats.pending || 0) + (stats.processing || 0) + (stats.shipped || 0);
  const deliveryPct = stats.total > 0 ? Math.round((completeCount / stats.total) * 100) : 0;
  const profitAmount = typeof stats.profit === "number" ? stats.profit : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total orders (Kept) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">
            Total orders
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {stats.total.toLocaleString()}
          </div>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            +8.2% vs last week
          </span>
        </div>
      </div>

      {/* Card 2: Complete order (Added) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">
            Complete order
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {completeCount.toLocaleString()}
          </div>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            {deliveryPct}% delivery rate
          </span>
        </div>
      </div>

      {/* Card 3: Incomplete order */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">
            Incomplete order
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {notCompleteCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5 block font-medium">
            {notCompleteCount > 0 ? `${notCompleteCount} active in progress` : "All orders completed"}
          </span>
        </div>
      </div>

      {/* Card 4: Profit (Added) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">
            Profit
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            ${profitAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400 mt-0.5 block">
            Gross profit earned
          </span>
        </div>
      </div>
    </div>
  );
}
export default OrdersKpiCards;

"use client";

import React from "react";
import { AlertCircle, RotateCcw, Tag, ShieldAlert } from "lucide-react";
import { ReturnReasonTag } from "./types";

interface ReturnRateBreakdownProps {
  data: {
    totalReturns: number;
    returnRatePercentage: number;
    reasons: ReturnReasonTag[];
  };
}

export function ReturnRateBreakdown({ data }: ReturnRateBreakdownProps) {
  const getCategoryBadge = (category: ReturnReasonTag["category"]) => {
    switch (category) {
      case "logistics":
        return "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40";
      case "customer":
        return "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40";
      case "product":
        return "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40";
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                <RotateCcw className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Returns & Cancellations Root Cause
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tagged drivers of product returns and failed deliveries
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">Return Rate</span>
            <p className="text-lg font-black text-rose-600 dark:text-rose-400">
              {data.returnRatePercentage}%
            </p>
          </div>
        </div>

        {/* Reasons Breakdown List */}
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/60">
          {data.reasons.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-3 group">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {item.reason}
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadge(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Revenue impact: ${item.impactRevenue.toLocaleString()}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  {item.count} cases
                </span>
                <span className="block text-[11px] font-semibold text-slate-400">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


"use client";

import React from "react";
import { Users, UserPlus, Repeat, HeartHandshake } from "lucide-react";
import { RetentionCohort } from "./types";

interface CustomerRetentionWidgetProps {
  cohorts: RetentionCohort[];
}

export function CustomerRetentionWidget({ cohorts }: CustomerRetentionWidgetProps) {
  const newCohort = cohorts.find((c) => c.type === "new") || cohorts[0];
  const returningCohort = cohorts.find((c) => c.type === "returning") || cohorts[1];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <HeartHandshake className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Customer Retention Ratio
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              New vs. returning buyer revenue contribution
            </p>
          </div>
        </div>

        {/* Stacked Comparative Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              New ({newCohort.percentage}%)
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5" />
              Returning ({returningCohort.percentage}%)
            </span>
          </div>

          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5">
            <div
              className="h-full bg-indigo-500 rounded-l-full transition-all duration-500"
              style={{ width: `${newCohort.percentage}%` }}
              title={`New Customers: ${newCohort.percentage}%`}
            />
            <div
              className="h-full bg-emerald-500 rounded-r-full transition-all duration-500"
              style={{ width: `${returningCohort.percentage}%` }}
              title={`Returning Customers: ${returningCohort.percentage}%`}
            />
          </div>
        </div>

        {/* Cohort Detail Cards */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {/* New Buyer Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              First-Time Buyers
            </span>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {newCohort.count.toLocaleString()}
            </p>
            <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 space-y-0.5">
              <p>Revenue: <strong className="text-slate-800 dark:text-slate-200">${newCohort.revenue.toLocaleString()}</strong></p>
              <p>AOV: <strong className="text-slate-800 dark:text-slate-200">${newCohort.avgOrderValue.toFixed(2)}</strong></p>
            </div>
          </div>

          {/* Returning Buyer Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Loyal / Repeat Buyers
            </span>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {returningCohort.count.toLocaleString()}
            </p>
            <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 space-y-0.5">
              <p>Revenue: <strong className="text-emerald-600 dark:text-emerald-400">${returningCohort.revenue.toLocaleString()}</strong></p>
              <p>AOV: <strong className="text-emerald-600 dark:text-emerald-400">${returningCohort.avgOrderValue.toFixed(2)}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


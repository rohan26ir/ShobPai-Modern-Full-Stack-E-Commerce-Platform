"use client";

import React from "react";
import { MapPin, TrendingUp, Minus, ArrowUpRight } from "lucide-react";
import { RegionalMetric } from "./types";

interface RegionalSalesChartProps {
  regions: RegionalMetric[];
}

export function RegionalSalesChart({ regions }: RegionalSalesChartProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <MapPin className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Regional Order Volume
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Top geographic hubs and fulfillment destinations
            </p>
          </div>
        </div>

        {/* Horizontal Bars */}
        <div className="mt-5 space-y-4">
          {regions.map((reg) => (
            <div key={reg.id} className="space-y-1.5 group">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {reg.district}
                  </span>
                  {reg.trend === "up" && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                      <ArrowUpRight className="w-2.5 h-2.5" />
                      Growth
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {reg.orders.toLocaleString()} orders
                  </span>
                  <span className="font-black text-slate-900 dark:text-white min-w-[65px] text-right">
                    ${reg.revenue.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-[#E5A842] transition-all duration-500 group-hover:opacity-90"
                  style={{ width: `${reg.percentageOfTotal}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


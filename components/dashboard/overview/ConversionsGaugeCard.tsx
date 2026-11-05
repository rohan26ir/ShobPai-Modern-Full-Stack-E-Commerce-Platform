"use client";

import React, { useMemo } from "react";
import Link from "next/link";

interface ConversionsGaugeCardProps {
  percentage?: number;
  thisWeek?: string;
  lastWeek?: string;
}

export function ConversionsGaugeCard({
  percentage = 65.2,
  thisWeek = "23.5k",
  lastWeek = "41.05k",
}: ConversionsGaugeCardProps) {
  // Generate radial dash segments (40 ticks around 260 degrees arc)
  const totalTicks = 42;
  const startAngle = 140; // in degrees (starts bottom-left)
  const endAngle = 400; // in degrees (ends bottom-right, 260 degree sweep)
  const sweepAngle = endAngle - startAngle;

  const activeTicksCount = Math.round((percentage / 100) * totalTicks);

  const ticks = useMemo(() => {
    const list = [];
    const cx = 110;
    const cy = 110;
    const rInner = 68;
    const rOuter = 88;

    for (let i = 0; i < totalTicks; i++) {
      const angleDeg = startAngle + (i / (totalTicks - 1)) * sweepAngle;
      const angleRad = (angleDeg * Math.PI) / 180;

      const x1 = cx + rInner * Math.cos(angleRad);
      const y1 = cy + rInner * Math.sin(angleRad);
      const x2 = cx + rOuter * Math.cos(angleRad);
      const y2 = cy + rOuter * Math.sin(angleRad);

      const isActive = i < activeTicksCount;

      list.push({
        id: i,
        x1,
        y1,
        x2,
        y2,
        isActive,
      });
    }
    return list;
  }, [totalTicks, startAngle, sweepAngle, activeTicksCount]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between h-full min-h-[490px] sm:min-h-[520px]">
      {/* Title */}
      <h2 className="text-sm font-bold text-slate-800 dark:text-white">
        Conversions
      </h2>

      {/* Radial Segmented Gauge Visual */}
      <div className="relative flex items-center justify-center my-auto py-4">
        <svg
          viewBox="0 0 220 200"
          className="w-52 sm:w-56 h-48 sm:h-52 overflow-visible select-none"
        >
          {ticks.map((t) => (
            <line
              key={t.id}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.isActive ? "#ff6c2f" : "#e2e8f0"}
              strokeWidth={3}
              strokeLinecap="round"
              className={t.isActive ? "transition-colors duration-200" : "dark:stroke-slate-800"}
            />
          ))}
        </svg>

        {/* Center Text inside the gauge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {percentage}%
          </span>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
            Returning Customer
          </span>
        </div>
      </div>

      {/* Comparison Metrics */}
      <div className="grid grid-cols-2 gap-3 py-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <div>
          <p className="text-[11px] text-slate-400 font-medium">This Week</p>
          <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mt-0.5">
            {thisWeek}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Last Week</p>
          <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mt-0.5">
            {lastWeek}
          </p>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="mt-3">
        <Link
          href="/dashboard/analytics"
          className="block w-full text-center py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}


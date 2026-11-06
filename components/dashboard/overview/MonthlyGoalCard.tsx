"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Sliders } from "lucide-react";

interface MonthlyGoalCardProps {
  target?: number;
  current?: number;
  percentage?: number;
}

export function MonthlyGoalCard({
  target = 60000,
  current = 43200,
  percentage,
}: MonthlyGoalCardProps) {
  // Compute percentage if not explicitly provided
  const pct = useMemo(() => {
    if (typeof percentage === "number") return Math.round(percentage);
    if (!target || target <= 0) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  }, [percentage, current, target]);

  // Donut geometry calculations
  // Radius r = 62, viewBox = 0 0 180 180, center = (90, 90)
  const radius = 62;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius; // ~389.56
  const strokeDashoffset = circumference * (1 - pct / 100);

  // Status message logic
  const isOnTrack = pct >= 60;
  const isGoalReached = pct >= 100;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between h-full min-h-[490px] sm:min-h-[520px]">
      {/* 1. Header: Title (Left) & Target amount (Right) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">
            Monthly Goal
          </h2>
          <Link
            href="/dashboard/setup"
            className="p-1 rounded-md text-slate-400 hover:text-[#ff6c2f] hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Setup Monthly Goal"
          >
            <Sliders className="w-3.5 h-3.5" />
          </Link>
        </div>
        <span className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-normal">
          ${target.toLocaleString()} target
        </span>
      </div>

      {/* 2. Donut Progress Ring with Center Percentage */}
      <div className="relative flex items-center justify-center my-auto py-4">
        <svg
          viewBox="0 0 180 180"
          className="w-52 h-52 sm:w-60 sm:h-60 overflow-visible select-none drop-shadow-2xs"
        >
          {/* Background track circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
            fill="none"
            className="dark:stroke-slate-800/90"
          />

          {/* Filled progress circle arc */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#4F46E5"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
            fill="none"
            transform="rotate(-90 90 90)"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center labels */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {pct}%
          </span>
          <span className="text-xs font-normal text-slate-400 dark:text-slate-500 mt-0.5">
            reached
          </span>
        </div>
      </div>

      {/* 3. Bottom Progress Insight matching screenshot */}
      <div className="pt-2 text-center text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800/40">
        ${current.toLocaleString()} of ${target.toLocaleString()} —{" "}
        {isGoalReached ? (
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            goal achieved!
          </span>
        ) : isOnTrack ? (
          <>
            <span className="text-teal-600 dark:text-teal-400 font-bold">
              on track
            </span>{" "}
            to hit this month&apos;s goal.
          </>
        ) : (
          <>
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              needs boost
            </span>{" "}
            to reach this month&apos;s goal.
          </>
        )}
      </div>
    </div>
  );
}

export default MonthlyGoalCard;


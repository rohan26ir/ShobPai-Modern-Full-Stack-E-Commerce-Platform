"use client";

import React, { useMemo, useState, useEffect } from "react";
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
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Animate percentage count-up & tick fill on mount or when percentage changes
  useEffect(() => {
    setIsMounted(true);
    let startTime: number | null = null;
    const duration = 1200; // 1.2s smooth ease-out animation
    const startVal = 0;
    const targetVal = percentage;

    let animFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (targetVal - startVal) * easeOut;

      setDisplayPercentage(current);

      if (progress < 1) {
        animFrameId = requestAnimationFrame(step);
      } else {
        setDisplayPercentage(targetVal);
      }
    };

    animFrameId = requestAnimationFrame(step);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [percentage]);

  // Generate radial dash segments (42 ticks around 260 degrees arc)
  const totalTicks = 42;
  const startAngle = 140; // in degrees (starts bottom-left)
  const endAngle = 400; // in degrees (ends bottom-right, 260 degree sweep)
  const sweepAngle = endAngle - startAngle;

  const currentPercent = isMounted ? displayPercentage : percentage;
  const activeTicksCount = Math.round((currentPercent / 100) * totalTicks);

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
      const isLeading = isActive && i === activeTicksCount - 1;

      list.push({
        id: i,
        x1,
        y1,
        x2,
        y2,
        isActive,
        isLeading,
      });
    }
    return list;
  }, [totalTicks, startAngle, sweepAngle, activeTicksCount]);

  const leadingTick = useMemo(() => {
    if (activeTicksCount <= 0) return null;
    return ticks[activeTicksCount - 1] || null;
  }, [ticks, activeTicksCount]);

  // Format percentage number: keep decimal if original has decimals
  const formattedPercentage = useMemo(() => {
    if (!isMounted) return `${percentage}%`;
    const hasDecimal = percentage % 1 !== 0;
    return hasDecimal
      ? `${displayPercentage.toFixed(1)}%`
      : `${Math.round(displayPercentage)}%`;
  }, [displayPercentage, percentage, isMounted]);

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full min-h-[490px] sm:min-h-[520px]">
      {/* Title */}
      <h2 className="text-sm font-bold text-slate-800 dark:text-white">
        Conversions
      </h2>

      {/* Radial Segmented Gauge Visual with Animated Sweep & Indicator */}
      <div className="relative flex items-center justify-center my-auto py-4">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute w-28 h-28 rounded-full bg-orange-500/5 dark:bg-orange-500/10 blur-xl pointer-events-none transition-all duration-500 group-hover:bg-orange-500/15" />

        <svg
          viewBox="0 0 220 200"
          className="w-52 sm:w-56 h-48 sm:h-52 overflow-visible select-none transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        >
          <defs>
            <filter id="gauge-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="tip-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {ticks.map((t) => (
            <line
              key={t.id}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.isActive ? "#ff6c2f" : "#e2e8f0"}
              strokeWidth={t.isLeading ? 3.5 : 3}
              strokeLinecap="round"
              filter={t.isLeading ? "url(#tip-glow)" : undefined}
              className={
                t.isActive
                  ? "transition-all duration-300 stroke-[#ff6c2f] hover:stroke-orange-400"
                  : "transition-all duration-300 dark:stroke-slate-800"
              }
            />
          ))}

          {/* Animated Pulsing Bead on Leading Tip */}
          {leadingTick && (
            <circle
              cx={leadingTick.x2}
              cy={leadingTick.y2}
              r={3}
              fill="#ff6c2f"
              filter="url(#tip-glow)"
              className="transition-all duration-300"
            >
              <animate
                attributeName="r"
                values="2.8;4.2;2.8"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.75;1;0.75"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          )}
        </svg>

        {/* Center Text inside the gauge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2 transition-transform duration-300 group-hover:scale-105">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight tabular-nums">
            {formattedPercentage}
          </span>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
            Returning Customer
          </span>
        </div>
      </div>

      {/* Comparison Metrics */}
      <div className="grid grid-cols-2 gap-3 py-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <div className="transition-transform duration-200 hover:scale-105">
          <p className="text-[11px] text-slate-400 font-medium">This Week</p>
          <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mt-0.5">
            {thisWeek}
          </p>
        </div>
        <div className="transition-transform duration-200 hover:scale-105">
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
          className="block w-full text-center py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all duration-200 active:scale-[0.99]"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ConversionsGaugeCard;

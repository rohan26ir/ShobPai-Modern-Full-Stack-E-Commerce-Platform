"use client";

import React, { useState, useMemo } from "react";
import { PerformancePoint } from "./larkonData";
import { performance12MonthsData, performance30DaysData } from "./performanceData";

type TimeRangeFilter = "ALL" | "1M" | "6M" | "1Y";

interface PerformanceChartProps {
  data?: PerformancePoint[];
  dailyData?: PerformancePoint[];
}

export function PerformanceChart({
  data = performance12MonthsData,
  dailyData = performance30DaysData,
}: PerformanceChartProps) {
  const [activeFilter, setActiveFilter] = useState<TimeRangeFilter>("ALL");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const isDaily = activeFilter === "1M";

  const filteredData = useMemo(() => {
    if (activeFilter === "1M") return dailyData;
    if (activeFilter === "6M") return data.slice(-6);
    return data;
  }, [data, dailyData, activeFilter]);

  const svgW = 620;
  const svgH = 220;
  const padL = 32;
  const padR = 16;
  const padT = 16;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - 28;
  const maxY = 80;
  const yTicks = [80, 70, 60, 50, 40, 30, 20, 10, 0];

  const points = useMemo(() => {
    const count = filteredData.length;
    const slotW = chartW / count;
    const barW = isDaily ? Math.max(6, Math.min(10, slotW * 0.55)) : Math.min(14, slotW * 0.45);

    return filteredData.map((d, i) => {
      const centerX = padL + i * slotW + slotW / 2;
      const barH = (d.pageViews / maxY) * chartH;
      const barY = padT + (chartH - barH);
      const lineY = padT + chartH - (d.clicks / maxY) * chartH;
      return { ...d, centerX, barX: centerX - barW / 2, barY, barWidth: barW, barHeight: barH, lineX: centerX, lineY };
    });
  }, [filteredData, chartW, chartH, padL, padT, maxY, isDaily]);

  const linePath = useMemo(() => {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].lineX} ${points[0].lineY}`;

    let path = `M ${points[0].lineX} ${points[0].lineY}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
      const cp1x = p1.lineX + (p2.lineX - p0.lineX) / 6;
      const cp1y = p1.lineY + (p2.lineY - p0.lineY) / 6;
      const cp2x = p2.lineX - (p3.lineX - p1.lineX) / 6;
      const cp2y = p2.lineY - (p3.lineY - p1.lineY) / 6;
      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.lineX.toFixed(1)} ${p2.lineY.toFixed(1)}`;
    }
    return path;
  }, [points]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">Performance</h2>
          {isDaily && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-orange-50 text-[#ff6c2f] dark:bg-orange-950/40">
              Daily View (30 Days)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
          {(["ALL", "1M", "6M", "1Y"] as TimeRangeFilter[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                activeFilter === tab
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-48 sm:h-56 select-none">
          {yTicks.map((tick) => {
            const y = padT + chartH - (tick / maxY) * chartH;
            return (
              <g key={tick}>
                <text x={padL - 8} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-sans">{tick}</text>
                <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800/80" strokeDasharray="2 2" />
              </g>
            );
          })}

          {points.map((pt, idx) => {
            const showLabel = !isDaily || idx % 2 === 0 || idx === points.length - 1;
            return (
              <g key={pt.month} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)} className="cursor-pointer">
                <rect x={pt.centerX - pt.barWidth * 1.5} y={padT} width={pt.barWidth * 3} height={chartH} fill="transparent" />
                <rect x={pt.barX} y={pt.barY} width={pt.barWidth} height={pt.barHeight} rx={2.5} className="transition-all duration-150" fill={hoveredIdx === idx ? "#ea580c" : "#ff6c2f"} />
                {showLabel && (
                  <text
                    x={pt.centerX}
                    y={svgH - 8}
                    textAnchor="middle"
                    className={`text-[9px] font-medium transition-colors ${
                      hoveredIdx === idx ? "fill-orange-600 font-bold" : "fill-slate-400 dark:fill-slate-500"
                    }`}
                  >
                    {pt.month}
                  </text>
                )}
              </g>
            );
          })}

          <path d={linePath} fill="none" stroke="#10b981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {points.map((pt, idx) => (
            <circle
              key={`dot-${pt.month}`}
              cx={pt.lineX}
              cy={pt.lineY}
              r={hoveredIdx === idx ? 4.5 : isDaily ? 2 : 2.5}
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth={1.5}
            />
          ))}
        </svg>

        {hoveredIdx !== null && points[hoveredIdx] && (
          <div
            className="absolute z-20 pointer-events-none -translate-x-1/2 bg-slate-900/90 text-white rounded-lg px-2.5 py-1.5 text-[11px] shadow-lg backdrop-blur-xs flex flex-col gap-0.5 border border-slate-700"
            style={{
              left: `${(points[hoveredIdx].centerX / svgW) * 100}%`,
              top: `${Math.max(10, (points[hoveredIdx].barY / svgH) * 100 - 25)}%`,
            }}
          >
            <span className="font-bold text-orange-400">
              {isDaily ? `Day ${points[hoveredIdx].month} (Dec)` : points[hoveredIdx].month}
            </span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff6c2f]" />
              <span>Page Views: {points[hoveredIdx].pageViews}k</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
              <span>Clicks: {points[hoveredIdx].clicks}k</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
        <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-[#ff6c2f]" />
          <span>Page Views</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-[#10b981]" />
          <span>Clicks</span>
        </div>
      </div>
    </div>
  );
}

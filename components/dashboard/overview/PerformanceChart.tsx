"use client";

import React, { useState, useMemo } from "react";
import { performance12Months, PerformancePoint } from "./larkonData";

type TimeRangeFilter = "ALL" | "1M" | "6M" | "1Y";

interface PerformanceChartProps {
  data?: PerformancePoint[];
}

export function PerformanceChart({ data = performance12Months }: PerformanceChartProps) {
  const [activeFilter, setActiveFilter] = useState<TimeRangeFilter>("ALL");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    switch (activeFilter) {
      case "1M":
        return data.slice(-1);
      case "6M":
        return data.slice(-6);
      case "1Y":
      case "ALL":
      default:
        return data;
    }
  }, [data, activeFilter]);

  // Chart Geometry
  const svgWidth = 620;
  const svgHeight = 220;
  const paddingLeft = 32;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 28;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxY = 80;
  const yTicks = [80, 70, 60, 50, 40, 30, 20, 10, 0];

  // Compute bar and line coordinates
  const points = useMemo(() => {
    const count = filteredData.length;
    const slotWidth = chartWidth / count;
    const barWidth = Math.min(14, slotWidth * 0.45);

    return filteredData.map((d, i) => {
      const centerX = paddingLeft + i * slotWidth + slotWidth / 2;
      const barHeight = (d.pageViews / maxY) * chartHeight;
      const barY = paddingTop + (chartHeight - barHeight);

      const lineY = paddingTop + chartHeight - (d.clicks / maxY) * chartHeight;

      return {
        ...d,
        centerX,
        barX: centerX - barWidth / 2,
        barY,
        barWidth,
        barHeight,
        lineX: centerX,
        lineY,
      };
    });
  }, [filteredData, chartWidth, chartHeight, paddingLeft, paddingTop, maxY]);

  // Generate smooth line curve (Catmull-Rom or cubic bezier)
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
      {/* Header: Title (Left) & Time Tabs (Right) */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white">
          Performance
        </h2>

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

      {/* Main SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-48 sm:h-56 select-none"
        >
          {/* Grid lines and Y axis numbers */}
          {yTicks.map((tick) => {
            const y = paddingTop + chartHeight - (tick / maxY) * chartHeight;
            return (
              <g key={tick}>
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400 dark:fill-slate-500 font-sans"
                >
                  {tick}
                </text>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800/80"
                  strokeDasharray="2 2"
                />
              </g>
            );
          })}

          {/* Vertical Bars: Page Views */}
          {points.map((pt, idx) => (
            <g
              key={pt.month}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              {/* Invisible wide hover target */}
              <rect
                x={pt.centerX - pt.barWidth * 1.5}
                y={paddingTop}
                width={pt.barWidth * 3}
                height={chartHeight}
                fill="transparent"
              />
              {/* Actual colored bar */}
              <rect
                x={pt.barX}
                y={pt.barY}
                width={pt.barWidth}
                height={pt.barHeight}
                rx={3}
                className="transition-all duration-150"
                fill={hoveredIdx === idx ? "#ea580c" : "#ff6c2f"}
              />
              {/* X Axis Month Label */}
              <text
                x={pt.centerX}
                y={svgHeight - 8}
                textAnchor="middle"
                className={`text-[10px] font-medium transition-colors ${
                  hoveredIdx === idx
                    ? "fill-orange-600 font-bold"
                    : "fill-slate-400 dark:fill-slate-500"
                }`}
              >
                {pt.month}
              </text>
            </g>
          ))}

          {/* Smooth Green Line: Clicks */}
          <path
            d={linePath}
            fill="none"
            stroke="#10b981"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots on line */}
          {points.map((pt, idx) => (
            <circle
              key={`dot-${pt.month}`}
              cx={pt.lineX}
              cy={pt.lineY}
              r={hoveredIdx === idx ? 4 : 2.5}
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth={1.5}
              className="transition-all"
            />
          ))}
        </svg>

        {/* Hover Tooltip Popup */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div
            className="absolute z-20 pointer-events-none -translate-x-1/2 bg-slate-900/90 text-white rounded-lg px-2.5 py-1.5 text-[11px] shadow-lg backdrop-blur-xs flex flex-col gap-0.5 border border-slate-700"
            style={{
              left: `${(points[hoveredIdx].centerX / svgWidth) * 100}%`,
              top: `${Math.max(10, (points[hoveredIdx].barY / svgHeight) * 100 - 25)}%`,
            }}
          >
            <span className="font-bold text-orange-400">{points[hoveredIdx].month}</span>
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

      {/* Legend at bottom */}
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


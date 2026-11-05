"use client";

import React, { useState, useMemo, useRef } from "react";
import { bdDistricts, DistrictInfo } from "./bdDistrictsData";

export type { DistrictInfo };

interface BdMapProps {
  onHoverDistrict?: (district: DistrictInfo | null) => void;
  onSelectDistrict?: (district: DistrictInfo) => void;
  selectedDistrict?: string | null;
  className?: string;
  customData?: Record<string, Partial<DistrictInfo>>;
  showTooltip?: boolean;
}

export function BdMap({
  onHoverDistrict,
  onSelectDistrict,
  selectedDistrict,
  className = "",
  customData,
  showTooltip = true,
}: BdMapProps) {
  const [hovered, setHovered] = useState<DistrictInfo | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Merge default metrics with custom user data if provided
  const districts = useMemo(() => {
    if (!customData) return bdDistricts;
    return bdDistricts.map((d) => {
      const overrides = customData[d.name];
      if (!overrides) return d;
      return {
        ...d,
        ...overrides,
      };
    });
  }, [customData]);

  const handleMouseEnter = (d: DistrictInfo, e: React.MouseEvent) => {
    setHovered(d);
    onHoverDistrict?.(d);
    updateMouse(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updateMouse(e);
  };

  const updateMouse = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHovered(null);
    onHoverDistrict?.(null);
  };

  const getDistrictFill = (d: DistrictInfo) => {
    const isHovered = hovered?.name === d.name;
    const isSelected = selectedDistrict === d.name;

    if (isHovered || isSelected) {
      return "#ff6c2f"; // Vibrant coral on hover/select
    }

    // Heat gradient based on sessions volume
    if (d.sessions > 5000) return "#fb923c"; // High (Dhaka)
    if (d.sessions > 2000) return "#fdba74"; // Medium-High (Chittagong, Sylhet)
    if (d.sessions > 1000) return "#fed7aa"; // Medium
    return "#e2e8f0"; // Subtle base (dark mode overrides with CSS)
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden ${className}`}
    >
      <svg
        viewBox="-40 -20 1620 2260"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full max-h-full max-w-full drop-shadow-2xs select-none overflow-hidden"
      >
        <g transform="translate(10, 0)">
          {districts.map((d) => {
            const isHovered = hovered?.name === d.name;
            const isSelected = selectedDistrict === d.name;

            return (
              <path
                key={d.name}
                d={d.d}
                fill={getDistrictFill(d)}
                stroke={isHovered || isSelected ? "#ea580c" : "#ffffff"}
                strokeWidth={isHovered || isSelected ? 3.5 : 1.2}
                strokeLinejoin="round"
                strokeLinecap="round"
                className={`transition-all duration-150 cursor-pointer ${
                  isHovered ? "brightness-105" : ""
                } ${
                  d.sessions <= 1000 ? "dark:fill-slate-800 dark:stroke-slate-900" : ""
                }`}
                onMouseEnter={(e) => handleMouseEnter(d, e)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onSelectDistrict?.(d)}
              />
            );
          })}
        </g>
      </svg>

      {/* Dynamic Floating Tooltip */}
      {showTooltip && hovered && (
        <div
          className={`absolute z-30 pointer-events-none -translate-x-1/2 ${
            mousePos.y < 75 ? "" : "-translate-y-full"
          } bg-slate-900/95 dark:bg-slate-900/95 text-white rounded-xl px-3 py-2 text-xs shadow-xl backdrop-blur-md border border-slate-700/80 min-w-[145px] animate-in fade-in duration-100`}
          style={{
            left: `${Math.min(Math.max(mousePos.x, 75), (containerRef.current?.clientWidth || 260) - 75)}px`,
            top: mousePos.y < 75 ? `${mousePos.y + 15}px` : `${mousePos.y - 8}px`,
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1 mb-1">
            <span className="font-bold text-orange-400 text-xs truncate">
              {hovered.name}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {hovered.division}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>Sessions:</span>
            <span className="font-bold text-white">
              {hovered.sessions.toLocaleString()} ({hovered.percentage}%)
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300 mt-0.5">
            <span>Orders:</span>
            <span className="font-bold text-emerald-400">
              {hovered.orders} orders
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default BdMap;

"use client";

import React, { useState } from "react";
import { BdMap, DistrictInfo } from "@/components/customCom/BdMap";
import { MapPin } from "lucide-react";

interface SessionsByCityCardProps {
  thisWeek?: string;
  lastWeek?: string;
}

export function SessionsByCityCard({
  thisWeek = "23.5k",
  lastWeek = "41.05k",
}: SessionsByCityCardProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictInfo | null>(null);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between h-full min-h-[490px] sm:min-h-[520px]">
      {/* Header: Title & Fixed-Height Hover Status Indicator */}
      <div className="flex items-center justify-between gap-2 h-7 mb-1 shrink-0">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white">
          Sessions by City
        </h2>

        <div className="h-6 flex items-center justify-end">
          {hoveredDistrict ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] border border-orange-200/60 dark:border-orange-800/50 text-[11px] font-bold">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{hoveredDistrict.name}</span>
            </div>
          ) : (
            <span className="text-[10px] font-medium text-slate-400">
              Hover city/district
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Bangladesh Map Component (Stable fixed-height bounds to completely prevent any shake or reflow) */}
      <div className="relative w-full h-[280px] sm:h-[300px] my-auto flex items-center justify-center overflow-hidden shrink-0">
        <BdMap
          onHoverDistrict={setHoveredDistrict}
          showTooltip={false}
          className="h-full w-full max-h-full"
        />
      </div>

      {/* Dynamic Comparison Bar: Fixed height to eliminate layout shifting */}
      <div className="relative z-10 bg-white dark:bg-slate-900 grid grid-cols-2 gap-3 pt-3 pb-1 mt-auto border-t border-slate-100 dark:border-slate-800/80 text-center min-h-[58px] shrink-0">
        {hoveredDistrict ? (
          <>
            <div>
              <p className="text-[11px] text-[#ff6c2f] font-semibold truncate">
                {hoveredDistrict.name} Sessions
              </p>
              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mt-0.5 leading-tight">
                {hoveredDistrict.sessions.toLocaleString()}{" "}
                <span className="text-xs text-slate-400 font-normal">
                  ({hoveredDistrict.percentage}%)
                </span>
              </p>
            </div>
            <div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                Orders Volume
              </p>
              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mt-0.5 leading-tight">
                {hoveredDistrict.orders} orders
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-[11px] text-slate-400 font-medium truncate">This Week</p>
              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mt-0.5 leading-tight">
                {thisWeek}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium truncate">Last Week</p>
              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mt-0.5 leading-tight">
                {lastWeek}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Alias for backwards compatibility
export const SessionsByCountryCard = SessionsByCityCard;
export default SessionsByCityCard;

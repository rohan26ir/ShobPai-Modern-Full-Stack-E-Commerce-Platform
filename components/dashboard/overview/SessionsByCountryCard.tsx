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
      {/* Header: Title & Dynamic Hover Status */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white">
          Sessions by City
        </h2>

        {hoveredDistrict ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] border border-orange-200/60 dark:border-orange-800/50 text-[11px] font-bold animate-in fade-in">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{hoveredDistrict.name}</span>
          </div>
        ) : (
          <span className="text-[10px] font-medium text-slate-400">
            Hover city/district
          </span>
        )}
      </div>

      {/* Dynamic Bangladesh Map Component (Sized cleanly within bounds without overflowing or cutting bottom) */}
      <div className="relative w-full flex-1 min-h-[260px] sm:min-h-[300px] max-h-[340px] my-2 flex items-center justify-center overflow-hidden">
        <BdMap
          onHoverDistrict={setHoveredDistrict}
          showTooltip={true}
          className="h-full w-full max-h-full"
        />
      </div>

      {/* Dynamic Comparison Bar: Updates based on hovered district */}
      <div className="relative z-10 bg-white dark:bg-slate-900 grid grid-cols-2 gap-3 pt-3 pb-1 mt-auto border-t border-slate-100 dark:border-slate-800/80 text-center transition-all">
        {hoveredDistrict ? (
          <>
            <div>
              <p className="text-[11px] text-[#ff6c2f] font-semibold">
                {hoveredDistrict.name} Sessions
              </p>
              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mt-0.5">
                {hoveredDistrict.sessions.toLocaleString()}{" "}
                <span className="text-xs text-slate-400 font-normal">
                  ({hoveredDistrict.percentage}%)
                </span>
              </p>
            </div>
            <div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Orders Volume
              </p>
              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mt-0.5">
                {hoveredDistrict.orders} orders
              </p>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

// Alias for backwards compatibility
export const SessionsByCountryCard = SessionsByCityCard;
export default SessionsByCityCard;

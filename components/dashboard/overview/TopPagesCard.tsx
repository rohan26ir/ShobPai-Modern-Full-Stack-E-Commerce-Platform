"use client";

import React from "react";
import Link from "next/link";
import { topPagesList, TopPageItem } from "./larkonData";

interface TopPagesCardProps {
  pages?: TopPageItem[];
}

export function TopPagesCard({ pages = topPagesList }: TopPagesCardProps) {
  const getBadgeStyle = (color: TopPageItem["rateColor"]) => {
    switch (color) {
      case "green":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50";
      case "red":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50";
      case "yellow":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between h-full min-h-[490px] sm:min-h-[520px]">
      {/* Header: Title (Left) & View All Button (Right) */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white">
          Top Pages
        </h2>

        <Link
          href="/dashboard/analytics"
          className="text-xs font-semibold text-[#ff6c2f] bg-[#fff1eb] hover:bg-[#ffe2d6] dark:bg-orange-950/40 dark:hover:bg-orange-900/50 px-2.5 py-1 rounded-md transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Pages Table */}
      <div className="overflow-x-auto w-full my-auto">
        <table className="w-full text-left text-[11px] sm:text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium">
              <th className="py-2.5 pr-2 font-medium">Page Path</th>
              <th className="py-2.5 px-2 text-right font-medium">Page Views</th>
              <th className="py-2.5 pl-2 text-right font-medium">Exit Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
            {pages.slice(0, 8).map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-2.5 sm:py-3 pr-2 font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                  <Link
                    href={item.path}
                    className="hover:text-[#ff6c2f] dark:hover:text-orange-400 hover:underline transition-colors"
                  >
                    {item.path}
                  </Link>
                </td>
                <td className="py-1.5 px-2 text-right font-medium text-slate-700 dark:text-slate-200">
                  {item.views.toLocaleString()}
                </td>
                <td className="py-1.5 pl-2 text-right">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${getBadgeStyle(
                      item.rateColor
                    )}`}
                  >
                    {item.exitRate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


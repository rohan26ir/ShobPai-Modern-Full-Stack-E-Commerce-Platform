"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Award,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { LarkonKPICard } from "./larkonData";

interface LarkonMetricCardProps {
  card: LarkonKPICard;
}

export function LarkonMetricCard({ card }: LarkonMetricCardProps) {
  const renderIcon = () => {
    switch (card.iconType) {
      case "orders":
        return <ShoppingBag className="w-5 h-5" />;
      case "leads":
        return <Award className="w-5 h-5" />;
      case "deals":
        return <Briefcase className="w-5 h-5" />;
      case "revenue":
        return <DollarSign className="w-5 h-5" />;
      default:
        return <ShoppingBag className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
      {/* Top: Icon (Left) & Title/Count (Right) */}
      <div className="flex items-center justify-between gap-3">
        <div className="h-11 w-11 rounded-xl bg-[#fff1eb] dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center shrink-0">
          {renderIcon()}
        </div>

        <div className="text-right">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {card.title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mt-0.5 tracking-tight">
            {card.value}
          </p>
        </div>
      </div>

      {/* Bottom: Change indicator (Left) & View More (Right) */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
        <div
          className={`flex items-center gap-1 font-semibold ${
            card.isPositive ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {card.isPositive ? (
            <span className="text-[10px]">▲</span>
          ) : (
            <span className="text-[10px]">▼</span>
          )}
          <span>{card.change}</span>
          <span className="text-slate-400 font-normal ml-0.5">{card.period}</span>
        </div>

        <Link
          href={card.viewMoreHref || "#"}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium transition-colors"
        >
          View More
        </Link>
      </div>
    </div>
  );
}

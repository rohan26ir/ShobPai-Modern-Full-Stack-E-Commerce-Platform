"use client";

import React, { useState, useMemo } from "react";
import { CreditCard, Wallet, Banknote, ShieldCheck } from "lucide-react";
import { PaymentMethodShare } from "./types";

interface PaymentDistributionChartProps {
  distribution: PaymentMethodShare[];
}

export function PaymentDistributionChart({ distribution }: PaymentDistributionChartProps) {
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  const totalAmount = useMemo(() => {
    return distribution.reduce((acc, curr) => acc + curr.amount, 0);
  }, [distribution]);

  // SVG Donut slices calculation using stroke-dasharray & stroke-dashoffset
  const slices = useMemo(() => {
    const radius = 64;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    return distribution.map((item) => {
      const sliceStrokeLength = (item.percentage / 100) * circumference;
      const strokeDasharray = `${sliceStrokeLength} ${circumference - sliceStrokeLength}`;
      const strokeDashoffset = -accumulatedOffset;
      accumulatedOffset += sliceStrokeLength;

      return {
        ...item,
        radius,
        circumference,
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [distribution]);

  const activeItem = hoveredCode
    ? distribution.find((d) => d.code === hoveredCode) || distribution[0]
    : null;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400">
                <Wallet className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Payment Channel Split
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Transaction volumes by payment gateway & MFS channels
            </p>
          </div>
        </div>

        {/* Visual Donut Chart + Center Info */}
        <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-8">
          <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90 overflow-visible"
              viewBox="0 0 160 160"
            >
              {slices.map((slice) => {
                const isHovered = hoveredCode === slice.code;
                return (
                  <circle
                    key={slice.code}
                    cx="80"
                    cy="80"
                    r={slice.radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={isHovered ? "20" : "15"}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredCode(slice.code)}
                    onMouseLeave={() => setHoveredCode(null)}
                  />
                );
              })}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              {activeItem ? (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {activeItem.name.split(" ")[0]}
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {activeItem.percentage}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    ${activeItem.amount.toLocaleString()}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total
                  </span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    ${totalAmount.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-500">
                    100% Settled
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Interactive Legend List */}
          <div className="w-full sm:w-auto flex-1 space-y-2.5">
            {distribution.map((item) => {
              const isHovered = hoveredCode === item.code;
              return (
                <div
                  key={item.code}
                  onMouseEnter={() => setHoveredCode(item.code)}
                  onMouseLeave={() => setHoveredCode(null)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isHovered
                      ? "bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 scale-[1.02]"
                      : "border-slate-100 dark:border-slate-800 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {item.ordersCount.toLocaleString()} orders
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {item.percentage}%
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import React from "react";
import {
  TrendingUp,
  ArrowDown,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Users,
  Target,
} from "lucide-react";
import { ConversionStep, MetricComparison } from "./types";

interface ConversionFunnelProps {
  funnel: ConversionStep[];
  comparisons: {
    aov: MetricComparison;
    clv: MetricComparison;
    cac?: MetricComparison;
  };
}

export function ConversionFunnel({ funnel, comparisons }: ConversionFunnelProps) {
  const overallConversionRate = funnel.length > 0
    ? ((funnel[funnel.length - 1].count / funnel[0].count) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-6">
      {/* 1. Main Conversion Funnel Breakdown */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                <Target className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Customer Conversion Funnel
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              End-to-end shopping progression and drop-off analysis
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Net Conversion: {overallConversionRate}%</span>
          </div>
        </div>

        {/* Funnel Steps Horizontal or Stepped Visuals */}
        <div className="mt-6 space-y-4">
          {funnel.map((step, idx) => {
            const isLast = idx === funnel.length - 1;
            return (
              <div key={step.id} className="group">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black flex items-center justify-center text-slate-600 dark:text-slate-300">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {step.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {step.count.toLocaleString()}
                    </span>
                    <span className="text-slate-400 font-semibold min-w-[45px] text-right">
                      {step.percentageOfTotal}%
                    </span>
                  </div>
                </div>

                {/* Relative Width Progress Bar */}
                <div className="h-5 w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-hidden p-0.5 relative">
                  <div
                    className="h-full rounded-lg transition-all duration-500 relative flex items-center justify-end pr-2"
                    style={{
                      width: `${step.percentageOfTotal}%`,
                      backgroundColor: step.color,
                    }}
                  >
                    <span className="text-[10px] font-black text-white drop-shadow-xs">
                      {step.percentageOfTotal}%
                    </span>
                  </div>
                </div>

                {/* Drop-off Callout connecting to next step */}
                {!isLast && (
                  <div className="flex items-center gap-2 py-1.5 pl-6 text-[11px] text-rose-500 font-semibold">
                    <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                    <span>-{step.dropoffPercentage}% drop-off</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Comparative AOV & CLV Metric Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AOV Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {comparisons.aov.title}
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {comparisons.aov.value}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {comparisons.aov.description}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Industry Benchmark:</span>
            <span className="font-bold text-[#E5A842]">{comparisons.aov.benchmark}</span>
          </div>
        </div>

        {/* CLV Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {comparisons.clv.title}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {comparisons.clv.value}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {comparisons.clv.description}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">LTV/CAC Efficiency:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {comparisons.clv.benchmark}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


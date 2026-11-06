"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Target,
  DollarSign,
  Package,
  Calendar,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function SetupPage() {
  const { token, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [targetAmount, setTargetAmount] = useState<number>(60000);
  const [targetOrders, setTargetOrders] = useState<number>(500);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // Live Metrics State from Backend
  const [currentRevenue, setCurrentRevenue] = useState<number>(0);
  const [currentOrders, setCurrentOrders] = useState<number>(0);

  // Load existing goal from backend
  useEffect(() => {
    let isMounted = true;
    async function loadGoal() {
      try {
        setLoading(true);
        const data = await api.getAdminMonthlyGoal(token);
        if (isMounted && data) {
          if (data.target) setTargetAmount(data.target);
          if (data.targetOrders) setTargetOrders(data.targetOrders);
          if (data.month) setSelectedMonth(data.month);
          if (typeof data.currentRevenue === "number") setCurrentRevenue(data.currentRevenue);
          if (typeof data.currentOrders === "number") setCurrentOrders(data.currentOrders);
        }
      } catch (err: any) {
        console.error("Failed to load monthly goal setup:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (token && isAdmin) {
      loadGoal();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token, isAdmin]);

  // Derived progress computations
  const revenuePct = useMemo(() => {
    if (!targetAmount || targetAmount <= 0) return 0;
    return Math.min(100, Math.round((currentRevenue / targetAmount) * 100));
  }, [currentRevenue, targetAmount]);

  const ordersPct = useMemo(() => {
    if (!targetOrders || targetOrders <= 0) return 0;
    return Math.min(100, Math.round((currentOrders / targetOrders) * 100));
  }, [currentOrders, targetOrders]);

  // Donut geometry calculations (matching MonthlyGoalCard)
  const radius = 62;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~389.56
  const strokeDashoffset = circumference * (1 - revenuePct / 100);

  const isAchieved = revenuePct >= 100;
  const isOnTrack = revenuePct >= 60;

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAmount || targetAmount <= 0) {
      toast.error("Please enter a valid target revenue greater than 0");
      return;
    }

    const toastId = toast.loading("Saving Monthly Goal settings...");
    setSaving(true);
    try {
      const updated = await api.updateAdminMonthlyGoal(
        {
          target: targetAmount,
          targetOrders: targetOrders,
          month: selectedMonth,
        },
        token
      );
      if (updated) {
        if (typeof updated.currentRevenue === "number") setCurrentRevenue(updated.currentRevenue);
        if (typeof updated.currentOrders === "number") setCurrentOrders(updated.currentOrders);
      }
      toast.success("Monthly Goal updated successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || "Failed to save monthly goal", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setTargetAmount(60000);
    setTargetOrders(500);
    toast.success("Defaults restored (Click Save to apply)");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ff6c2f] uppercase tracking-wider mb-1">
            <Target className="w-4 h-4" />
            <span>Store Configuration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Setup &amp; Monthly Goal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure your monthly store targets, sales thresholds, and real-time performance milestones.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors self-start sm:self-center"
        >
          <span>View Overview</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Grid: Form Setup (Left) & Real-time Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Setup */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-[#ff6c2f]" />
                Monthly Target Settings
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Adjust revenue expectations and order targets for your storefront.
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] border border-orange-200 dark:border-orange-900/40">
              Admin Exclusive
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Target Revenue */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  Monthly Target Revenue ($ USD / ৳ BDT)
                </span>
                <span className="text-[11px] font-normal text-slate-400">
                  Target: ${targetAmount.toLocaleString()}
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                  $
                </div>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value) || 0)}
                  placeholder="e.g. 60000"
                  className="w-full h-10 pl-8 pr-3 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6c2f]/40 transition-all"
                  required
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[11px] text-slate-400">Presets:</span>
                {[30000, 50000, 60000, 75000, 100000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTargetAmount(preset)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                      targetAmount === preset
                        ? "bg-[#ff6c2f] text-white border-[#ff6c2f]"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                    }`}
                  >
                    ${preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Orders Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-blue-500" />
                  Target Orders Volume
                </span>
                <span className="text-[11px] font-normal text-slate-400">
                  Target: {targetOrders.toLocaleString()} orders
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                  #
                </div>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={targetOrders}
                  onChange={(e) => setTargetOrders(Number(e.target.value) || 0)}
                  placeholder="e.g. 500"
                  className="w-full h-10 pl-8 pr-3 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6c2f]/40 transition-all"
                />
              </div>

              {/* Quick Presets for orders */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[11px] text-slate-400">Presets:</span>
                {[150, 300, 500, 800, 1200].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTargetOrders(preset)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                      targetOrders === preset
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {preset} orders
                  </button>
                ))}
              </div>
            </div>

            {/* Target Month Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                Active Target Month
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full h-10 px-3 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6c2f]/40 transition-all"
              />
              <p className="text-[11px] text-slate-400">
                Revenue and orders from this month are aggregated automatically against this target.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="submit"
                disabled={saving || loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6c2f] hover:bg-[#ea580c] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Goal Settings"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Donut Gauge Preview Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs flex flex-col justify-between min-h-[460px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ff6c2f]">
                  Live Overview
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Monthly Goal Card Preview
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                ${targetAmount.toLocaleString()} target
              </span>
            </div>

            {/* Donut Progress Ring */}
            <div className="relative flex items-center justify-center my-6">
              <svg viewBox="0 0 180 180" className="w-48 h-48 sm:w-56 sm:h-56 select-none">
                {/* Background track circle */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="#F1F5F9"
                  strokeWidth={strokeWidth}
                  fill="none"
                  className="dark:stroke-slate-800/90"
                />
                {/* Filled progress circle arc */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="#4F46E5"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  transform="rotate(-90 90 90)"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Center labels */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {revenuePct}%
                </span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                  reached
                </span>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Current Revenue</span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  ${currentRevenue.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  of ${targetAmount.toLocaleString()} target
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <Package className="w-3.5 h-3.5 text-blue-500" />
                  <span>Current Orders</span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  {currentOrders.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  of {targetOrders.toLocaleString()} target ({ordersPct}%)
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-5 pt-3 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            {isAchieved ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Goal achieved for this month!
              </span>
            ) : isOnTrack ? (
              <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold">
                <Sparkles className="w-4 h-4" /> On track to hit this month&apos;s goal.
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4" /> Needs boost to reach this month&apos;s goal.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


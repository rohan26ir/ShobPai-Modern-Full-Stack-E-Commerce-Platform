"use client";

import React, { useState } from "react";
import {
  Calendar,
  Filter,
  Download,
  ChevronDown,
  Layers,
  FileSpreadsheet,
  FileText,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { DateRangePreset, SalesChannel } from "./types";

interface AnalyticsFilterBarProps {
  dateRange: DateRangePreset;
  onDateRangeChange: (preset: DateRangePreset) => void;
  channel: SalesChannel;
  onChannelChange: (channel: SalesChannel) => void;
}

export function AnalyticsFilterBar({
  dateRange,
  onDateRangeChange,
  channel,
  onChannelChange,
}: AnalyticsFilterBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const datePresets: { id: DateRangePreset; label: string }[] = [
    { id: "today", label: "Today (Live)" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "quarter", label: "This Quarter (90D)" },
    { id: "custom", label: "Custom Range..." },
  ];

  const channels: { id: SalesChannel; label: string }[] = [
    { id: "all", label: "All Channels" },
    { id: "web", label: "Web Storefront" },
    { id: "mobile-app", label: "Mobile App" },
    { id: "social", label: "Social Commerce" },
  ];

  const handleExport = (format: "CSV" | "PDF") => {
    setExportOpen(false);
    toast.loading(`Preparing ${format} analytics export...`, { id: "analytics-export" });
    setTimeout(() => {
      toast.success(`${format} export generated successfully!`, { id: "analytics-export" });
    }, 1000);
  };

  const currentPresetLabel = datePresets.find((p) => p.id === dateRange)?.label || "This Month";

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs relative">
      {/* Left: Date Range Dropdown & Calendar Indicator */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setExportOpen(false);
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#E5A842] transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#E5A842]" />
            <span>{currentPresetLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute left-0 top-full mt-1.5 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-40 space-y-0.5 text-xs animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setDropdownOpen(false)}
            >
              {datePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onDateRangeChange(preset.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                    dateRange === preset.id
                      ? "bg-[#E5A842] text-slate-950 font-black"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{preset.label}</span>
                  {dateRange === preset.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Channel Filter Pills */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold overflow-x-auto max-w-full">
          {channels.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onChannelChange(c.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                channel === c.id
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Export Menu Mockup */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => {
            setExportOpen(!exportOpen);
            setDropdownOpen(false);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </button>

        {exportOpen && (
          <div
            className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-40 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-100"
            onClick={() => setExportOpen(false)}
          >
            <button
              type="button"
              onClick={() => handleExport("CSV")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Export as CSV</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport("PDF")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
            >
              <FileText className="w-4 h-4 text-rose-500" />
              <span>Export Executive PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


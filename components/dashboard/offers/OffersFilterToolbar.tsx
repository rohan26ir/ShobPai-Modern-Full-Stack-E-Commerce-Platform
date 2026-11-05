import React from "react";
import { Search, X, Table as TableIcon, LayoutGrid } from "lucide-react";
import { OffersTab, OffersSortOrder, OffersViewMode, OffersKpiStats } from "./offers.types";

interface OffersFilterToolbarProps {
  activeTab: OffersTab;
  setActiveTab: (tab: OffersTab) => void;
  stats: OffersKpiStats;
  viewMode: OffersViewMode;
  setViewMode: (mode: OffersViewMode) => void;
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  sortOrder: OffersSortOrder;
  setSortOrder: (order: OffersSortOrder) => void;
  onResetPage: () => void;
}

export function OffersFilterToolbar({
  activeTab,
  setActiveTab,
  stats,
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
  onResetPage,
}: OffersFilterToolbarProps) {
  const tabs: Array<{ id: OffersTab; label: string; count: number }> = [
    { id: "all", label: "All", count: stats.totalCount },
    { id: "active", label: "Active", count: stats.activeCount },
    { id: "paused", label: "Paused", count: stats.pausedCount },
    { id: "expiring", label: "Expiring Soon", count: stats.expiringSoonCount },
  ];

  return (
    <>
      {/* Status Filter Tab Pills & View Mode Switcher */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                onResetPage();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                  activeTab === tab.id
                    ? "bg-white/20 dark:bg-slate-900/10"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table / Grid view switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            title="Table View"
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            title="Grid Cards View"
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Search Box */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onResetPage();
            }}
            placeholder="Search by coupon code or description..."
            className="w-full h-9 pl-9 pr-8 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Sort Order Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as OffersSortOrder)}
            className="h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="highest">Highest discount (%)</option>
            <option value="lowest">Lowest discount (%)</option>
            <option value="minSpend">Minimum spend</option>
          </select>
        </div>
      </div>
    </>
  );
}


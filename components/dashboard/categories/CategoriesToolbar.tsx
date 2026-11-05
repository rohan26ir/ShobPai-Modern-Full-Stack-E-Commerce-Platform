import React from "react";
import { Search, Plus, List, LayoutGrid } from "lucide-react";
import { CategoryTimeFilter, CategoryViewMode } from "./categories.types";

interface CategoriesToolbarProps {
  totalCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddOpen: () => void;
  selectedTimeFilter: CategoryTimeFilter;
  onTimeFilterChange: (value: CategoryTimeFilter) => void;
  viewMode: CategoryViewMode;
  onViewModeChange: (mode: CategoryViewMode) => void;
}

export function CategoriesToolbar({
  totalCount,
  searchTerm,
  onSearchChange,
  onAddOpen,
  selectedTimeFilter,
  onTimeFilterChange,
  viewMode,
  onViewModeChange,
}: CategoriesToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-bold text-slate-800 dark:text-white">
          All Category List
        </h2>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f]">
          {totalCount}
        </span>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Search filter input */}
        <div className="relative w-full sm:w-52">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search category..."
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] transition-all"
          />
        </div>

        {/* Add New Category Button */}
        <button
          type="button"
          onClick={onAddOpen}
          title="Add New Category"
          className="h-8 px-3 rounded-lg bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Category</span>
        </button>

        {/* Time / Status dropdown */}
        <select
          value={selectedTimeFilter}
          onChange={(e) => onTimeFilterChange(e.target.value as CategoryTimeFilter)}
          className="h-8 px-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
        >
          <option value="This Month">This Month</option>
          <option value="This Week">This Week</option>
          <option value="Today">Today</option>
          <option value="All Time">All Time</option>
        </select>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            title="Table View"
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-white dark:bg-slate-700 text-[#ff6c2f] shadow-xs"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            title="Grid View"
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-white dark:bg-slate-700 text-[#ff6c2f] shadow-xs"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}


import React from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { ProductTimeFilter } from "./products.types";

interface ProductsToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTimeFilter: ProductTimeFilter;
  onTimeFilterChange: (value: ProductTimeFilter) => void;
}

export function ProductsToolbar({
  searchTerm,
  onSearchChange,
  selectedTimeFilter,
  onTimeFilterChange,
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
      <div>
        <h2 className="text-base font-bold text-slate-800 dark:text-white">
          All Product List
        </h2>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Search filter */}
        <div className="relative w-full sm:w-48">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search product..."
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-400 transition-all"
          />
        </div>

        {/* Time / Status dropdown */}
        <select
          value={selectedTimeFilter}
          onChange={(e) => onTimeFilterChange(e.target.value as ProductTimeFilter)}
          className="h-8 px-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer"
        >
          <option value="This Month">This Month</option>
          <option value="This Week">This Week</option>
          <option value="Today">Today</option>
          <option value="All Time">All Time</option>
        </select>

        {/* + Add Product Button */}
        <Link
          href="/dashboard/products/create"
          className="flex items-center gap-1.5 px-3.5 py-1.5 h-8 rounded-lg bg-[#ff6c2f] hover:bg-[#ea580c] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs shadow-orange-500/20 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </Link>
      </div>
    </div>
  );
}


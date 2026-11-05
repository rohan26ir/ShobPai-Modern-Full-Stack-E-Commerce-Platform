import React from "react";
import { RotateCw } from "lucide-react";

interface CategoriesHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function CategoriesHeader({ loading, onRefresh }: CategoriesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-sm sm:text-base font-extrabold tracking-wider text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2">
        <span>CATEGORY LIST</span>
      </h1>
      <button
        onClick={onRefresh}
        disabled={loading}
        title="Refresh categories"
        className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#ff6c2f]" : ""}`} />
        <span className="hidden sm:inline">Refresh</span>
      </button>
    </div>
  );
}


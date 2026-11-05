import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, RotateCw, Sparkles } from "lucide-react";
import { PRESET_TEMPLATES } from "./productAdd.constants";
import { PresetProductTemplate } from "./productAdd.types";

interface ProductAddHeaderProps {
  isSubmitting: boolean;
  onSubmit: () => void;
  onApplyTemplate: (tpl: PresetProductTemplate) => void;
}

export function ProductAddHeader({
  isSubmitting,
  onSubmit,
  onApplyTemplate,
}: ProductAddHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <Link
            href="/dashboard/products"
            className="hover:text-[#ff6c2f] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Products</span>
          </Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300 font-medium">Add Product</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create New Product
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configured to display all details matching the public product showcase.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Load Fuji Apples Template Button */}
        <button
          type="button"
          onClick={() => onApplyTemplate(PRESET_TEMPLATES[0])}
          className="h-9 px-3.5 rounded-xl border border-orange-200 dark:border-orange-800/60 bg-orange-50/70 dark:bg-orange-950/30 text-[#ff6c2f] hover:bg-orange-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fuji Apples Template</span>
        </button>

        <Link
          href="/dashboard/products"
          className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          Cancel
        </Link>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="h-9 px-5 rounded-xl bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <RotateCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          <span>Publish Product</span>
        </button>
      </div>
    </div>
  );
}


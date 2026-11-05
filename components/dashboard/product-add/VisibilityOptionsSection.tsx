import React from "react";
import Link from "next/link";
import { Check, RotateCw, Eye } from "lucide-react";

interface VisibilityOptionsSectionProps {
  isFeatured: boolean;
  isTrending: boolean;
  isDealOfDay: boolean;
  isSubmitting: boolean;
  slug: string;
  onUpdate: (key: any, value: any) => void;
  onSubmit: () => void;
}

export function VisibilityOptionsSection({
  isFeatured,
  isTrending,
  isDealOfDay,
  isSubmitting,
  slug,
  onUpdate,
  onSubmit,
}: VisibilityOptionsSectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-2xs space-y-4">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
        Storefront Placement & Promotion
      </h2>

      <div className="space-y-3 text-xs">
        <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">Featured Product</span>
            <span className="text-[11px] text-slate-400">Highlight in homepage featured collections</span>
          </div>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => onUpdate("isFeatured", e.target.checked)}
            className="rounded border-slate-300 text-[#ff6c2f] focus:ring-[#ff6c2f] cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">Trending Item</span>
            <span className="text-[11px] text-slate-400">Display in top trending products grid</span>
          </div>
          <input
            type="checkbox"
            checked={isTrending}
            onChange={(e) => onUpdate("isTrending", e.target.checked)}
            className="rounded border-slate-300 text-[#ff6c2f] focus:ring-[#ff6c2f] cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">Deal of the Day</span>
            <span className="text-[11px] text-slate-400">Attach to flash deals countdown timer</span>
          </div>
          <input
            type="checkbox"
            checked={isDealOfDay}
            onChange={(e) => onUpdate("isDealOfDay", e.target.checked)}
            className="rounded border-slate-300 text-[#ff6c2f] focus:ring-[#ff6c2f] cursor-pointer"
          />
        </label>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full h-11 rounded-xl bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          <span>Publish Product & View Live Page</span>
        </button>

        {slug && (
          <Link
            href={`/product/${slug}`}
            target="_blank"
            className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview URL Target: /product/{slug}</span>
          </Link>
        )}
      </div>
    </div>
  );
}


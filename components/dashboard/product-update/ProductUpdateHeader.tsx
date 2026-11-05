import React from "react";
import Link from "next/link";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";

interface ProductUpdateHeaderProps {
  productTitle: string;
  slug?: string;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function ProductUpdateHeader({
  productTitle,
  slug,
  isSubmitting,
  onSubmit,
}: ProductUpdateHeaderProps) {
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
          <span className="text-slate-700 dark:text-slate-300 font-medium">Edit Product</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Edit Product: <span className="text-[#ff6c2f]">{productTitle || "Loading..."}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Update specifications, pricing, discount, and storefront placement.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {slug && (
          <Link
            href={`/product/${slug}`}
            target="_blank"
            className="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>View Live Page</span>
          </Link>
        )}

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
          className="h-9 px-5 rounded-xl bg-[#ff6c2f] hover:bg-[#ea580c] text-white text-xs font-bold flex items-center gap-2 shadow-xs shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Saving Changes..." : "Update Product"}</span>
        </button>
      </div>
    </div>
  );
}


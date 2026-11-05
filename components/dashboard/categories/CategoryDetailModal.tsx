import React from "react";
import Image from "next/image";
import { Layers, X, Pencil } from "lucide-react";
import { Category } from "@/data/categories";
import { IMAGE_PRESETS } from "./categories.constants";

interface CategoryDetailModalProps {
  category: Category | null;
  onClose: () => void;
  onEdit: (cat: Category) => void;
}

export function CategoryDetailModal({
  category: viewingCategory,
  onClose,
  onEdit,
}: CategoryDetailModalProps) {
  if (!viewingCategory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#ff6c2f]" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Category Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 dark:text-slate-300">
          {/* Banner Preview */}
          <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Image
              src={viewingCategory.image || IMAGE_PRESETS[0].url}
              alt={viewingCategory.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <h2 className="text-lg font-bold">{viewingCategory.name}</h2>
              <span className="text-[11px] font-mono text-slate-200">
                /{viewingCategory.slug}
              </span>
            </div>
          </div>

          {/* Badges Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Products Linked
              </span>
              <p className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
                {viewingCategory.itemCount || 0}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Status
              </span>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Active</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Theme Color
              </span>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    viewingCategory.bgColor || "bg-orange-50 text-orange-800 border-orange-100"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6c2f]" />
                  <span>Theme Pill</span>
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Description
            </label>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {viewingCategory.description || "No description provided for this category."}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit(viewingCategory)}
            className="h-8 px-4 rounded-lg bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit Category</span>
          </button>
        </div>
      </div>
    </div>
  );
}


import React from "react";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Category } from "@/data/categories";
import { COLOR_PRESETS, IMAGE_PRESETS } from "./categories.constants";

interface CategoryGridCardProps {
  category: Category;
  onView: (cat: Category) => void;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

export function CategoryGridCard({
  category: cat,
  onView,
  onEdit,
  onDelete,
}: CategoryGridCardProps) {
  const itemCount = cat.itemCount || 0;
  const matchingColor = COLOR_PRESETS.find((c) => c.value === cat.bgColor);

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900/40 transition-all overflow-hidden flex flex-col justify-between">
      {/* Top Thumbnail Image */}
      <div className="relative h-32 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <Image
          src={cat.image || IMAGE_PRESETS[0].url}
          alt={cat.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Action buttons overlay */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-1 rounded-lg shadow-xs">
          <button
            type="button"
            onClick={() => onView(cat)}
            className="p-1 text-slate-600 hover:text-[#ff6c2f] transition-colors cursor-pointer"
            title="View"
          >
            <Eye className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(cat)}
            className="p-1 text-slate-600 hover:text-[#ff6c2f] transition-colors cursor-pointer"
            title="Edit"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(cat)}
            className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        {/* Bottom overlay: Item count badge */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white backdrop-blur-xs">
            {itemCount} Products
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3
            onClick={() => onView(cat)}
            className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-[#ff6c2f] transition-colors cursor-pointer truncate"
          >
            {cat.name}
          </h3>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">/{cat.slug}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {cat.description || "Farm fresh organic selection."}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
              cat.bgColor || "bg-orange-50 text-orange-800 border-orange-100"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                matchingColor?.dot || "bg-orange-500"
              }`}
            />
            <span>{matchingColor?.label || "Theme"}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>
      </div>
    </div>
  );
}


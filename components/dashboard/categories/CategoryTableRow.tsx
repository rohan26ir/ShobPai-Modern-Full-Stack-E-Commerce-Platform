import React from "react";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Category } from "@/data/categories";
import { COLOR_PRESETS, IMAGE_PRESETS } from "./categories.constants";

interface CategoryTableRowProps {
  category: Category;
  isChecked: boolean;
  onToggleSelect: (id: string) => void;
  onView: (cat: Category) => void;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

export function CategoryTableRow({
  category: cat,
  isChecked,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
}: CategoryTableRowProps) {
  const itemCount = cat.itemCount || 0;
  const matchingColor = COLOR_PRESETS.find((c) => c.value === cat.bgColor);

  return (
    <tr
      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
        isChecked ? "bg-orange-50/20 dark:bg-orange-950/20" : ""
      }`}
    >
      {/* Checkbox */}
      <td className="py-3 px-3">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggleSelect(cat.id)}
          className="rounded border-slate-300 dark:border-slate-700 text-[#ff6c2f] focus:ring-[#ff6c2f] cursor-pointer"
        />
      </td>

      {/* Category Name & Slug */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700">
            <Image
              src={cat.image || IMAGE_PRESETS[0].url}
              alt={cat.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p
              onClick={() => onView(cat)}
              className="font-medium text-slate-800 dark:text-slate-100 text-xs sm:text-sm hover:text-[#ff6c2f] transition-colors cursor-pointer"
            >
              {cat.name}
            </p>
            <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
              /{cat.slug}
            </span>
          </div>
        </div>
      </td>

      {/* Description */}
      <td className="py-3 px-3 max-w-[220px]">
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {cat.description || "Farm fresh organic selection."}
        </p>
      </td>

      {/* Items Count */}
      <td className="py-3 px-3">
        <span className="font-semibold text-slate-700 dark:text-slate-200 block">
          {itemCount} Items
        </span>
        <span className="text-[10px] text-slate-400">Linked Products</span>
      </td>

      {/* Badge Theme */}
      <td className="py-3 px-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
            cat.bgColor || "bg-orange-50 text-orange-800 border-orange-100"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              matchingColor?.dot || "bg-orange-500"
            }`}
          />
          <span>{matchingColor?.label || "Default Theme"}</span>
        </span>
      </td>

      {/* Status */}
      <td className="py-3 px-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      </td>

      {/* Actions */}
      <td className="py-3 px-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => onView(cat)}
            title="View Category Details"
            className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(cat)}
            title="Edit Category"
            className="h-8 w-8 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/40 text-[#ff6c2f] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(cat)}
            title="Delete Category"
            className="h-8 w-8 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}


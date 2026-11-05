import React from "react";
import { Trash2 } from "lucide-react";
import { Category } from "@/data/categories";

interface DeleteCategoryDialogProps {
  category: Category | null;
  onClose: () => void;
  onConfirm: (cat: Category) => void;
}

export function DeleteCategoryDialog({
  category: deletingCategory,
  onClose,
  onConfirm,
}: DeleteCategoryDialogProps) {
  if (!deletingCategory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center">
          <Trash2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Delete Category?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              "{deletingCategory.name}"
            </span>
            ?
            {(deletingCategory.itemCount || 0) > 0 && (
              <span className="block text-rose-500 font-bold mt-1">
                Warning: {deletingCategory.itemCount} linked products are currently in this category.
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(deletingCategory)}
            className="flex-1 h-9 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}


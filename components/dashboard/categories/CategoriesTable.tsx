import React from "react";
import { Category } from "@/data/categories";
import { CategoryTableRow } from "./CategoryTableRow";

interface CategoriesTableProps {
  categories: Category[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onToggleSelect: (id: string) => void;
  onView: (cat: Category) => void;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

export function CategoriesTable({
  categories,
  selectedIds,
  onSelectAll,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  const isAllSelected =
    categories.length > 0 && categories.every((c) => selectedIds.includes(c.id));

  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <th className="py-3 px-3 w-8">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-[#ff6c2f] focus:ring-[#ff6c2f] cursor-pointer"
              />
            </th>
            <th className="py-3 px-3">Category Name & Slug</th>
            <th className="py-3 px-3">Description</th>
            <th className="py-3 px-3">Catalog Items</th>
            <th className="py-3 px-3">Badge Theme</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
          {categories.map((cat) => (
            <CategoryTableRow
              key={cat.id}
              category={cat}
              isChecked={selectedIds.includes(cat.id)}
              onToggleSelect={onToggleSelect}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}


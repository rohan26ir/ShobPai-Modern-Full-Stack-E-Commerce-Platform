import React from "react";
import { Category } from "@/data/categories";
import { CategoryGridCard } from "./CategoryGridCard";

interface CategoriesGridProps {
  categories: Category[];
  onView: (cat: Category) => void;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

export function CategoriesGrid({
  categories,
  onView,
  onEdit,
  onDelete,
}: CategoriesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {categories.map((cat) => (
        <CategoryGridCard
          key={cat.id}
          category={cat}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}


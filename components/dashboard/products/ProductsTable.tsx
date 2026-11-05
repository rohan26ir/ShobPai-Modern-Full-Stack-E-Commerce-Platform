import React from "react";
import { TableProduct } from "./products.types";
import { ProductTableRow } from "./ProductTableRow";

interface ProductsTableProps {
  products: TableProduct[];
  selectedIds: string[];
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleSelect: (id: string) => void;
  onView: (product: TableProduct) => void;
  onEdit: (product: TableProduct) => void;
  onDelete: (product: TableProduct) => void;
}

export function ProductsTable({
  products,
  selectedIds,
  onSelectAll,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const isAllSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p.id));

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium whitespace-nowrap">
            <th className="py-3 px-2 w-8 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onSelectAll}
                className="rounded border-slate-300 text-[#ff6c2f] focus:ring-orange-400 cursor-pointer"
              />
            </th>
            <th className="py-3 px-3 font-medium">Product Name & Size</th>
            <th className="py-3 px-3 font-medium">Price & Profit</th>
            <th className="py-3 px-3 font-medium">Stock</th>
            <th className="py-3 px-3 font-medium">Category</th>
            <th className="py-3 px-3 font-medium">Rating</th>
            <th className="py-3 px-3 font-medium text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
          {products.map((p) => (
            <ProductTableRow
              key={p.id}
              product={p}
              isSelected={selectedIds.includes(p.id)}
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


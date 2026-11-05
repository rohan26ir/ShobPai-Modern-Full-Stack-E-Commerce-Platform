import React from "react";
import { Eye, Pencil, Trash2, Star } from "lucide-react";
import { TableProduct } from "./products.types";

interface ProductTableRowProps {
  product: TableProduct;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onView: (product: TableProduct) => void;
  onEdit: (product: TableProduct) => void;
  onDelete: (product: TableProduct) => void;
}

export function ProductTableRow({
  product: p,
  isSelected,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
}: ProductTableRowProps) {
  const thumb =
    p.images?.[0] ||
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80";

  return (
    <tr
      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors whitespace-nowrap ${
        isSelected ? "bg-orange-50/40 dark:bg-orange-950/20" : ""
      }`}
    >
      {/* Checkbox */}
      <td className="py-3 px-2 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(p.id)}
          className="rounded border-slate-300 text-[#ff6c2f] focus:ring-orange-400 cursor-pointer"
        />
      </td>

      {/* Product Name & Size */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={thumb}
              alt={p.name}
              className="h-full w-full object-cover rounded-lg"
              loading="lazy"
            />
          </div>
          <div>
            <p
              onClick={() => onView(p)}
              className="font-bold text-slate-800 dark:text-slate-100 text-xs hover:text-[#ff6c2f] transition-colors cursor-pointer truncate max-w-[200px]"
            >
              {p.name}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
              {p.sizesDisplay || (p.unit ? `Size : ${p.unit}` : "Size : S , M , L")}
            </p>
          </div>
        </div>
      </td>

      {/* Price & Profit */}
      <td className="py-3 px-3">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 dark:text-slate-100">
            ${Number(p.price || 0).toFixed(2)}
          </span>
          {p.buyingPrice ? (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] text-slate-400">
                Cost: ${Number(p.buyingPrice).toFixed(2)}
              </span>
              <span
                className={`text-[10px] font-bold ${
                  p.price >= p.buyingPrice
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                ({p.price >= p.buyingPrice ? "+" : ""}${(p.price - p.buyingPrice).toFixed(2)})
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 mt-0.5">Cost: —</span>
          )}
        </div>
      </td>

      {/* Stock & Sold */}
      <td className="py-3 px-3">
        <p className="font-medium text-slate-700 dark:text-slate-300">
          {p.stock > 0 ? `${p.stock} Item Left` : "Out of Stock"}
        </p>
        <p className="text-[11px] text-slate-400 font-normal">
          {p.sold || Math.round(p.stock * 0.4)} Sold
        </p>
      </td>

      {/* Category */}
      <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-300">
        {p.categoryName || p.category}
      </td>

      {/* Rating */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold text-slate-700 dark:text-slate-200">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{(p.rating || 4.5).toFixed(1)}</span>
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            {p.reviewsCount || 45} Review
          </span>
        </div>
      </td>

      {/* Actions: View (Eye) | Edit | Delete */}
      <td className="py-3 px-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => onView(p)}
            title="View Product Details"
            className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(p)}
            title="Edit Product"
            className="h-8 w-8 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/40 text-[#ff6c2f] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(p)}
            title="Delete Product"
            className="h-8 w-8 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}


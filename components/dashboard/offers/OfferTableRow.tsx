import React from "react";
import { Check, Copy, Calendar, ToggleLeft, ToggleRight, Pencil, Trash2 } from "lucide-react";
import { CouponData } from "./offers.types";

interface OfferTableRowProps {
  coupon: CouponData;
  isSelected: boolean;
  isCopied: boolean;
  onToggleSelect: (id: string) => void;
  onCopyCode: (code: string) => void;
  onToggleActive: (coupon: CouponData) => void;
  onEdit: (coupon: CouponData) => void;
  onDelete: (coupon: CouponData) => void;
}

export function OfferTableRow({
  coupon,
  isSelected,
  isCopied,
  onToggleSelect,
  onCopyCode,
  onToggleActive,
  onEdit,
  onDelete,
}: OfferTableRowProps) {
  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now();

  return (
    <tr
      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors ${
        isSelected ? "bg-orange-50/30 dark:bg-orange-950/10" : ""
      }`}
    >
      {/* Checkbox */}
      <td className="py-3.5 px-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(coupon.id)}
          className="rounded border-slate-300 dark:border-slate-600 text-[#ff6c2f] focus:ring-[#ff6c2f] cursor-pointer"
        />
      </td>

      {/* Code & Copy Button */}
      <td className="py-3.5 px-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80 text-xs">
            {coupon.code}
          </span>
          <button
            type="button"
            onClick={() => onCopyCode(coupon.code)}
            title={isCopied ? "Copied!" : "Copy code"}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </td>

      {/* Discount Badge */}
      <td className="py-3.5 px-3">
        <span className="inline-flex items-center gap-1 font-bold text-xs text-[#ff6c2f] bg-orange-50 dark:bg-orange-950/30 px-2.5 py-1 rounded-lg border border-orange-100 dark:border-orange-900/30">
          <span>{coupon.discountPercentage}% OFF</span>
        </span>
      </td>

      {/* Min Spend */}
      <td className="py-3.5 px-3">
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {coupon.minSpend > 0 ? `$${coupon.minSpend.toFixed(2)}` : "No min"}
        </span>
      </td>

      {/* Description */}
      <td className="py-3.5 px-3 max-w-xs">
        <span className="text-slate-600 dark:text-slate-400 block truncate" title={coupon.description}>
          {coupon.description || "Storewide discount voucher"}
        </span>
      </td>

      {/* Expiration */}
      <td className="py-3.5 px-3">
        {coupon.expiresAt ? (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            <span
              className={`text-[11px] font-medium ${
                isExpired ? "text-rose-500 line-through" : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {new Date(coupon.expiresAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">Never expires</span>
        )}
      </td>

      {/* Status Badge + Toggle Switch */}
      <td className="py-3.5 px-3">
        <div className="flex items-center gap-2">
          {coupon.isActive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Active</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200/80 dark:border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>Paused</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => onToggleActive(coupon)}
            title={coupon.isActive ? "Click to pause" : "Click to activate"}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            {coupon.isActive ? (
              <ToggleRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </td>

      {/* Action Buttons */}
      <td className="py-3.5 px-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(coupon)}
            title="Edit Offer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#ff6c2f] hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(coupon)}
            title="Delete Offer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}


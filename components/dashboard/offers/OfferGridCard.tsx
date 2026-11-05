import React from "react";
import { Check, Copy, Clock, ToggleRight, ToggleLeft, Pencil, Trash2 } from "lucide-react";
import { CouponData } from "./offers.types";

interface OfferGridCardProps {
  coupon: CouponData;
  isCopied: boolean;
  onCopyCode: (code: string) => void;
  onToggleActive: (coupon: CouponData) => void;
  onOpenEdit: (coupon: CouponData) => void;
  onDelete: (coupon: CouponData) => void;
}

export function OfferGridCard({
  coupon,
  isCopied,
  onCopyCode,
  onToggleActive,
  onOpenEdit,
  onDelete,
}: OfferGridCardProps) {
  const isExpired =
    coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now();

  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between ${
        coupon.isActive
          ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-[#ff6c2f]/40"
          : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/50 opacity-80"
      }`}
    >
      <div>
        {/* Top Row: Code & Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-xs tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700">
              {coupon.code}
            </span>
            <button
              type="button"
              onClick={() => onCopyCode(coupon.code)}
              title={isCopied ? "Copied!" : "Copy Code"}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              coupon.isActive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/70"
                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {coupon.isActive ? "Active" : "Paused"}
          </span>
        </div>

        {/* Discount & Min Spend */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {coupon.discountPercentage}%
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6c2f]">
              OFF
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              Min Spend:{" "}
              <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                {coupon.minSpend > 0 ? `$${coupon.minSpend.toFixed(2)}` : "None"}
              </strong>
            </span>
            {coupon.expiresAt && (
              <>
                <span>•</span>
                <span
                  className={`flex items-center gap-1 ${
                    isExpired ? "text-rose-500 line-through" : ""
                  }`}
                >
                  <Clock className="w-3 h-3 text-slate-400" />
                  Exp: {new Date(coupon.expiresAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {coupon.description || "Storewide promotional coupon code."}
        </p>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onToggleActive(coupon)}
          className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-2 rounded-lg transition-colors cursor-pointer ${
            coupon.isActive
              ? "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800"
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          {coupon.isActive ? (
            <>
              <ToggleRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Active</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-4 h-4 text-slate-400" />
              <span>Paused</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onOpenEdit(coupon)}
            title="Edit Offer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#ff6c2f] hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(coupon)}
            title="Delete Offer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}


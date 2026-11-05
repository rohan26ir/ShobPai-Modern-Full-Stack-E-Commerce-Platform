import React from "react";
import { AlertTriangle } from "lucide-react";
import { CouponData } from "./offers.types";

interface DeleteOfferDialogProps {
  deletingCoupon: CouponData | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteOfferDialog({
  deletingCoupon,
  onClose,
  onConfirm,
}: DeleteOfferDialogProps) {
  if (!deletingCoupon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            Delete Offer?
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Are you sure you want to delete promo code{" "}
            <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
              {deletingCoupon.code}
            </span>
            ? Customers will no longer be able to use it during checkout.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}


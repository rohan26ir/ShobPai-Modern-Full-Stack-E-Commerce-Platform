import React from "react";
import { X, Sparkles, RotateCw, Check, ToggleLeft, ToggleRight } from "lucide-react";
import { CouponData } from "./offers.types";
import { useCreateEditOfferModal } from "./useCreateEditOfferModal";

interface CreateEditOfferModalProps {
  isOpen: boolean;
  editingCoupon: CouponData | null;
  onClose: () => void;
  token: string | null;
  onSuccess: (coupon: CouponData, isEdit: boolean) => void;
}

export function CreateEditOfferModal({
  isOpen,
  editingCoupon,
  onClose,
  token,
  onSuccess,
}: CreateEditOfferModalProps) {
  const {
    formCode,
    setFormCode,
    formDiscount,
    setFormDiscount,
    formMinSpend,
    setFormMinSpend,
    formDesc,
    setFormDesc,
    formIsActive,
    setFormIsActive,
    formExpiresAt,
    setFormExpiresAt,
    isSubmitting,
    handleGenerateCode,
    handleSubmit,
  } = useCreateEditOfferModal({ isOpen, editingCoupon, token, onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6c2f] block">Promotions</span>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
              {editingCoupon ? `Edit Offer #${editingCoupon.code}` : "Create New Offer"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Coupon Code *</label>
              <button
                type="button"
                onClick={handleGenerateCode}
                className="text-[11px] text-[#ff6c2f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto Generate</span>
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. FLASH25, MEGA10"
              value={formCode}
              onChange={(e) => setFormCode(e.target.value.toUpperCase())}
              className="w-full h-10 px-3 text-xs font-mono font-bold tracking-wider rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Discount Percentage (%) *</label>
              <div className="flex items-center gap-1">
                {[10, 15, 20, 25, 50].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setFormDiscount(preset)}
                    className={`px-1.5 py-0.5 text-[10px] rounded-md border cursor-pointer ${
                      formDiscount === preset
                        ? "bg-[#ff6c2f] text-white border-[#ff6c2f]"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              required
              min={1}
              max={100}
              placeholder="e.g. 20"
              value={formDiscount}
              onChange={(e) => setFormDiscount(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full h-10 px-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Minimum Spend ($)</label>
            <input
              type="number"
              min={0}
              placeholder="0 for No Minimum"
              value={formMinSpend}
              onChange={(e) => setFormMinSpend(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Description</label>
            <input
              type="text"
              placeholder="e.g. 20% off on all organic fresh vegetables"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Expiration Date (Optional)</label>
            <input
              type="date"
              value={formExpiresAt}
              onChange={(e) => setFormExpiresAt(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Initial Status</span>
            <button
              type="button"
              onClick={() => setFormIsActive(!formIsActive)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                formIsActive
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {formIsActive ? <ToggleRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
              <span>{formIsActive ? "Active" : "Paused"}</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>{editingCoupon ? "Save Changes" : "Create Offer"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

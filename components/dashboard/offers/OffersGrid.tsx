import React from "react";
import { Tag } from "lucide-react";
import { CouponData } from "./offers.types";
import { OfferGridCard } from "./OfferGridCard";

interface OffersGridProps {
  paginatedCoupons: CouponData[];
  copiedCode: string | null;
  onCopyCode: (code: string) => void;
  onToggleActive: (coupon: CouponData) => void;
  onOpenEdit: (coupon: CouponData) => void;
  onDelete: (coupon: CouponData) => void;
  onOpenCreate: () => void;
}

export function OffersGrid({
  paginatedCoupons,
  copiedCode,
  onCopyCode,
  onToggleActive,
  onOpenEdit,
  onDelete,
  onOpenCreate,
}: OffersGridProps) {
  if (paginatedCoupons.length === 0) {
    return (
      <div className="py-14 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center mx-auto">
          <Tag className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          No promotional offers found
        </p>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Try clearing search filters or create a brand new coupon voucher.
        </p>
        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ff6c2f] text-white text-xs font-semibold hover:bg-[#e0561b] transition-colors cursor-pointer"
        >
          Create New Offer
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
      {paginatedCoupons.map((coupon) => (
        <OfferGridCard
          key={coupon.id}
          coupon={coupon}
          isCopied={copiedCode === coupon.code}
          onCopyCode={onCopyCode}
          onToggleActive={onToggleActive}
          onOpenEdit={onOpenEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}


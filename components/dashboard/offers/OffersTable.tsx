import React from "react";
import { CouponData } from "./offers.types";
import { OfferTableRow } from "./OfferTableRow";

interface OffersTableProps {
  coupons: CouponData[];
  selectedIds: string[];
  copiedCode: string | null;
  onSelectAll: (checked: boolean) => void;
  onToggleSelect: (id: string) => void;
  onCopyCode: (code: string) => void;
  onToggleActive: (coupon: CouponData) => void;
  onEdit: (coupon: CouponData) => void;
  onDelete: (coupon: CouponData) => void;
}

export function OffersTable({
  coupons,
  selectedIds,
  copiedCode,
  onSelectAll,
  onToggleSelect,
  onCopyCode,
  onToggleActive,
  onEdit,
  onDelete,
}: OffersTableProps) {
  const isAllSelected = coupons.length > 0 && selectedIds.length === coupons.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400">
            <th className="py-3 px-3 w-10">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-600 text-[#ff6c2f] focus:ring-[#ff6c2f] cursor-pointer"
              />
            </th>
            <th className="py-3 px-3">Coupon Code</th>
            <th className="py-3 px-3">Discount</th>
            <th className="py-3 px-3">Min Spend</th>
            <th className="py-3 px-3">Description</th>
            <th className="py-3 px-3">Expires At</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {coupons.map((coupon) => (
            <OfferTableRow
              key={coupon.id}
              coupon={coupon}
              isSelected={selectedIds.includes(coupon.id)}
              isCopied={copiedCode === coupon.code}
              onToggleSelect={onToggleSelect}
              onCopyCode={onCopyCode}
              onToggleActive={onToggleActive}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}


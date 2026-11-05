import React from "react";

interface InvoicePrintTableProps {
  items: any[];
}

export function InvoicePrintTable({ items }: InvoicePrintTableProps) {
  return (
    <div className="pt-2">
      <div className="w-full rounded-xs overflow-hidden">
        <div className="bg-[#FFE01B] text-slate-900 font-bold text-xs py-2.5 px-4 flex items-center justify-between">
          <span className="w-1/2 text-left">Product Description</span>
          <span className="w-16 text-center">Quantity</span>
          <span className="w-24 text-right">Unit Price</span>
          <span className="w-20 text-center">Discount</span>
          <span className="w-24 text-right">Total</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {items.map((item: any, idx: number) => {
            const title = item.product?.name || item.name || "Product Item";
            const modelStr = item.model || `Model: ${item.id?.slice(0, 6).toUpperCase() || "BHT432"}`;
            const qty = item.quantity || 1;
            const price = item.price || item.unitPrice || 50;
            const disc = item.discount ? `${item.discount}%` : "0%";
            const rowTotal = item.total || price * qty * (1 - (item.discount || 0) / 100);

            return (
              <div
                key={idx}
                className="py-3 px-4 flex items-center justify-between border-b border-slate-100"
              >
                <div className="w-1/2 text-left">
                  <span className="font-medium text-slate-800 block truncate">{title}</span>
                  <span className="text-[11px] text-slate-400 block">({modelStr})</span>
                </div>
                <span className="w-16 text-center text-slate-700">{qty}</span>
                <span className="w-24 text-right text-slate-700">${price.toFixed(2)}</span>
                <span className="w-20 text-center text-slate-700">{disc}</span>
                <span className="w-24 text-right font-medium text-slate-900">${rowTotal.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


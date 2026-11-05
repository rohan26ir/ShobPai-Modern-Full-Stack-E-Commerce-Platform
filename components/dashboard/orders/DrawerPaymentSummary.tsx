import React from "react";
import { Order } from "./orders.types";

interface DrawerPaymentSummaryProps {
  order: Order;
}

export function DrawerPaymentSummary({ order }: DrawerPaymentSummaryProps) {
  const subtotal = order.subtotal || order.totalAmount || 0;
  const total = order.totalAmount || 0;
  const paymentMethod = order.paymentMethod || "Visa •• 4242";

  return (
    <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
        PAYMENT SUMMARY
      </span>
      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
        <span>Subtotal</span>
        <span className="font-medium text-slate-800 dark:text-slate-200">
          ${subtotal.toFixed(2)}
        </span>
      </div>
      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
        <span>Shipping</span>
        <span className="font-medium text-slate-800 dark:text-slate-200">Free</span>
      </div>
      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
        <span>Paid with</span>
        <span className="font-medium text-slate-800 dark:text-slate-200">{paymentMethod}</span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}


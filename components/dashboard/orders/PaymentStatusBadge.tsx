import React from "react";

interface PaymentStatusBadgeProps {
  status?: string;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const pStatus = (status || "PAID").toUpperCase();

  if (pStatus === "PAID") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>Paid</span>
      </span>
    );
  }

  if (pStatus === "REFUNDED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        <span>Refunded</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      <span>Unpaid</span>
    </span>
  );
}


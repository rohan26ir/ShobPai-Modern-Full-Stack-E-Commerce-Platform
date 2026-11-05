import React from "react";

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const upper = (status || "PENDING").toUpperCase();

  switch (upper) {
    case "DELIVERED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Delivered</span>
        </span>
      );
    case "PROCESSING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Processing</span>
        </span>
      );
    case "SHIPPED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span>Shipped</span>
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>Cancelled</span>
        </span>
      );
    case "PENDING":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Pending</span>
        </span>
      );
  }
}


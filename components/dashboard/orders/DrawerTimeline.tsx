import React from "react";
import { Order, CustomDeliveryOverride } from "./orders.types";

interface DrawerTimelineProps {
  order: Order;
  customDeliveryOverride?: CustomDeliveryOverride;
}

export function DrawerTimeline({ order, customDeliveryOverride }: DrawerTimelineProps) {
  const isDelivered = order.status === "DELIVERED";
  const isShipped = order.status === "SHIPPED" || isDelivered;
  const isProcessing = order.status !== "PENDING" || isShipped;

  const estDate = customDeliveryOverride?.deliveryDate || order.estimatedDeliveryDate;
  const expectedDateFormatted = estDate
    ? new Date(estDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : new Date(new Date(order.createdAt).getTime() + 1000 * 60 * 60 * 48).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      );

  return (
    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
        TIMELINE
      </span>

      <div className="relative pl-5 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-100 dark:before:bg-slate-800">
        {/* Step 1: Order placed */}
        <div className="relative">
          <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
          <span className="font-semibold text-slate-800 dark:text-white block">
            Order placed
          </span>
          <span className="text-[11px] text-slate-400 block">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Step 2: Payment confirmed */}
        <div className="relative">
          <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
          <span className="font-semibold text-slate-800 dark:text-white block">
            Payment confirmed
          </span>
          <span className="text-[11px] text-slate-400 block">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Step 3: Processing */}
        <div className="relative">
          <span
            className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
              isProcessing ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          />
          <span className="font-semibold text-slate-800 dark:text-white block">
            Processing
          </span>
          <span className="text-[11px] text-slate-400 block">
            {new Date(new Date(order.createdAt).getTime() + 1000 * 60 * 60 * 12).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            )}
          </span>
        </div>

        {/* Step 4: Shipped */}
        <div className="relative">
          <span
            className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
              isShipped ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          />
          <span className="font-semibold text-slate-800 dark:text-white block">Shipped</span>
          <span className="text-[11px] text-slate-400 block">
            {new Date(new Date(order.createdAt).getTime() + 1000 * 60 * 60 * 24).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            )}
          </span>
        </div>

        {/* Step 5: Delivered */}
        <div className="relative">
          <span
            className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
              isDelivered ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          />
          <span className="font-semibold text-slate-800 dark:text-white block">
            {isDelivered ? "Delivered" : "Expected Delivery"}
          </span>
          <span className="text-[11px] text-slate-400 block">{expectedDateFormatted}</span>
        </div>
      </div>
    </div>
  );
}


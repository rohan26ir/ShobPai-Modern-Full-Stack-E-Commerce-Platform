"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Package,
  CreditCard,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import { RecentOrder, OrderStatus } from "./types";

interface RecentOrdersTableProps {
  orders: RecentOrder[];
  loading?: boolean;
}

// Accessible, vibrant status badge mappings
const statusConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  PAID: {
    label: "Paid",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200/80 dark:border-emerald-800/50",
    icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />,
  },
  DELIVERED: {
    label: "Delivered",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200/80 dark:border-emerald-800/50",
    icon: <Package className="w-3 h-3 text-emerald-500" />,
  },
  DISPATCHED: {
    label: "Dispatched",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200/80 dark:border-blue-800/50",
    icon: <Truck className="w-3 h-3 text-blue-500" />,
  },
  PROCESSING: {
    label: "Processing",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200/80 dark:border-indigo-800/50",
    icon: <Clock className="w-3 h-3 text-indigo-500" />,
  },
  PENDING: {
    label: "Pending",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200/80 dark:border-amber-800/50",
    icon: <Clock className="w-3 h-3 text-amber-500" />,
  },
  FAILED: {
    label: "Failed",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200/80 dark:border-rose-800/50",
    icon: <XCircle className="w-3 h-3 text-rose-500" />,
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
    icon: <XCircle className="w-3 h-3 text-slate-400" />,
  },
};

export function RecentOrdersTable({ orders, loading = false }: RecentOrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs animate-pulse">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-md mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <ShoppingBag className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Orders
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Latest customer transactions requiring fulfillment
              </p>
            </div>
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#E5A842] hover:text-[#d49633] transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto mt-3 -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300 min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const status = statusConfig[order.status] || statusConfig.PENDING;
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Order ID & Time */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 dark:text-white group-hover:text-[#E5A842] transition-colors">
                            {order.orderNumber}
                          </span>
                          <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                            {order.date}
                          </span>
                        </td>

                        {/* Customer Avatar + Name */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700">
                              {order.customer.initials}
                            </div>
                            <div className="truncate max-w-[130px]">
                              <p className="font-semibold text-slate-900 dark:text-white truncate">
                                {order.customer.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {order.customer.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Status Pill */}
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${status.bg} ${status.text} ${status.border}`}
                          >
                            {status.icon}
                            <span>{status.label}</span>
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-3 px-3 text-right">
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            ${order.amount.toFixed(2)}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-medium">
                            {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"} • {order.paymentMethod}
                          </span>
                        </td>

                        {/* Action Quick View Button */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#E5A842] hover:text-slate-950 transition-all cursor-pointer"
                            title={`Inspect ${order.orderNumber}`}
                            aria-label={`View order ${order.orderNumber}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick View Modal Dialog */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedOrder(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Inspect
                </span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedOrder.orderNumber}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Customer:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedOrder.customer.name}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Email:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {selectedOrder.customer.email}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Payment Method:</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#E5A842]" />
                  {selectedOrder.paymentMethod}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Order Total:</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  ${selectedOrder.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer text-center"
              >
                Dismiss
              </button>
              <Link
                href="/dashboard/orders"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#E5A842] text-slate-950 font-black text-xs hover:bg-[#d49633] transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <span>Full Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


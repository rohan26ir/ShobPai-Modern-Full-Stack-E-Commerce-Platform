import React from "react";
import { X, Package, Calendar, Printer, RotateCw } from "lucide-react";
import { Order, CustomDeliveryOverride } from "./orders.types";
import { getCustomerAvatar } from "@/components/dashboard/overview/ordersData";
import { DrawerTimeline } from "./DrawerTimeline";
import { DrawerPaymentSummary } from "./DrawerPaymentSummary";

interface OrderDetailDrawerProps {
  order: Order | null;
  onClose: () => void;
  onDownloadPdf: (order: Order) => void;
  isGeneratingPdf: boolean;
  customDeliveryOverride?: CustomDeliveryOverride;
}

export function OrderDetailDrawer({
  order,
  onClose,
  onDownloadPdf,
  isGeneratingPdf,
  customDeliveryOverride,
}: OrderDetailDrawerProps) {
  if (!order) return null;

  const isGuest = !order.userId && !order.user;
  const customerName = order.user?.displayName || order.guestName || "Customer";
  const customerEmail = order.user?.email || order.guestEmail || "customer@example.com";
  const avatarUrl = getCustomerAvatar(order);
  const estDate = customDeliveryOverride?.deliveryDate || order.estimatedDeliveryDate;
  const estNote = customDeliveryOverride?.deliveryNote || order.deliveryNote;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] md:w-[450px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Order #{order.orderNumber || order.id.slice(0, 8)}
            </h2>
            <span className="text-xs text-slate-400 mt-1 block">
              {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}{" "}
              at {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Product Items List */}
          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item: any, idx: number) => {
                const price = item.price || item.unitPrice || order.totalAmount / (order.items?.length || 1);
                const qty = item.quantity || 1;
                return (
                  <div key={idx} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700 overflow-hidden">
                        {item.product?.images?.[0] ? (
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900 dark:text-white block truncate text-xs">
                          {item.product?.name || item.name || "Product Item"}
                        </span>
                        <span className="text-[11px] text-slate-400 block">{qty} × ${price.toFixed(2)}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white shrink-0 text-xs">${(price * qty).toFixed(2)}</span>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700">
                    <Package className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white block truncate text-xs">Organic Package Item</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white shrink-0 text-xs">${(order.totalAmount || 0).toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* PAYMENT SUMMARY */}
          <DrawerPaymentSummary order={order} />

          {/* CUSTOMER */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">CUSTOMER</span>
              {isGuest && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50">
                  Guest User
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-100 dark:ring-slate-800 bg-slate-100 dark:bg-slate-800">
                <img src={avatarUrl} alt={customerName} className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 dark:text-white block truncate">{customerName}</span>
                <span className="text-slate-400 block truncate">{customerEmail}</span>
                {order.guestPhone && (
                  <span className="text-[11px] text-slate-500 block truncate">{order.guestPhone}</span>
                )}
              </div>
            </div>
            <div className="pt-1.5">
              <span className="text-[11px] text-slate-400 block">Shipping address</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium block mt-0.5">
                {order.shippingAddress?.addressLine || (typeof order.shippingAddress === "string" ? order.shippingAddress : (order.shippingAddress as any)?.address ? `${(order.shippingAddress as any).address}, ${(order.shippingAddress as any).city}` : "12 Maple Avenue, New York, US")}
              </span>
            </div>
          </div>

          {/* ESTIMATED / EXTENDED DELIVERY CARD */}
          <div className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-800/40 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#ff6c2f] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                Estimated Delivery
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {estDate
                  ? new Date(estDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
                  : new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            {estNote ? (
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                <span className="font-medium text-slate-700 dark:text-slate-200">Note:</span> {estNote}
              </p>
            ) : (
              <p className="text-[10px] text-slate-400">Standard courier fulfillment window</p>
            )}
          </div>

          {/* TIMELINE */}
          <DrawerTimeline order={order} customDeliveryOverride={customDeliveryOverride} />
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => onDownloadPdf(order)}
            disabled={isGeneratingPdf}
            className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <RotateCw className="w-4 h-4 animate-spin text-[#ff6c2f]" />
            ) : (
              <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            )}
            <span>{isGeneratingPdf ? "Downloading PDF..." : "Download Invoice PDF"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

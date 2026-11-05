import React from "react";
import { Calendar, Printer, Pencil, Eye, RotateCw } from "lucide-react";
import { Order, CustomDeliveryOverride } from "./orders.types";
import { getCustomerAvatar } from "@/components/dashboard/overview/ordersData";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface OrderTableRowProps {
  order: Order;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDownloadPdf: (order: Order) => void;
  isGeneratingPdf: boolean;
  customDeliveryOverride?: CustomDeliveryOverride;
}

export function OrderTableRow({
  order,
  isSelected,
  onToggleSelect,
  onView,
  onEdit,
  onDownloadPdf,
  isGeneratingPdf,
  customDeliveryOverride,
}: OrderTableRowProps) {
  const customerName = order.user?.displayName || order.guestName || "Guest Customer";
  const customerEmail = order.user?.email || order.guestEmail || "No email";
  const avatarUrl =
    order.user?.photoURL ||
    getCustomerAvatar(order);
  const itemsCount =
    order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) ||
    order.items?.length ||
    1;
  const firstItemTitle =
    order.items?.[0]?.product?.name || order.items?.[0]?.name || "Organic Product";

  return (
    <tr
      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
        isSelected ? "bg-orange-50/30 dark:bg-orange-950/10" : ""
      }`}
    >
      {/* Checkbox */}
      <td className="py-3.5 px-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(order.id)}
          className="rounded border-slate-300 dark:border-slate-600 text-[#ff6c2f] focus:ring-[#ff6c2f] cursor-pointer"
        />
      </td>

      {/* Order Number & Timestamp */}
      <td className="py-3.5 px-3">
        <div>
          <span
            className="font-bold text-blue-600 dark:text-blue-400 block hover:underline cursor-pointer"
            onClick={() => onView(order)}
          >
            #{order.orderNumber || order.id.slice(0, 8)}
          </span>
          <span className="text-[11px] text-slate-400 block">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
          {customDeliveryOverride?.deliveryDate && (
            <span className="inline-flex items-center gap-1 text-[10px] text-[#ff6c2f] font-medium mt-0.5 bg-orange-50 dark:bg-orange-950/40 px-1.5 py-0.2 rounded-md">
              <Calendar className="w-2.5 h-2.5 shrink-0" />
              <span>
                Est:{" "}
                {new Date(customDeliveryOverride.deliveryDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </span>
          )}
        </div>
      </td>

      {/* Customer Info with Full Rounded Avatar */}
      <td className="py-3.5 px-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-100 dark:ring-slate-800 bg-slate-100 dark:bg-slate-800">
            <img
              src={avatarUrl}
              alt={customerName}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                const target = e.currentTarget;
                const fallback = `https://api.dicebear.com/7.x/avataaars/svg?seed=user`;
                if (target.src !== fallback) target.src = fallback;
              }}
            />
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-slate-900 dark:text-white block truncate max-w-[160px]">
              {customerName}
            </span>
            <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
              {customerEmail}
            </span>
          </div>
        </div>
      </td>

      {/* Items */}
      <td className="py-3.5 px-3">
        <div>
          <span className="font-medium text-slate-800 dark:text-slate-200 block">
            {itemsCount} {itemsCount === 1 ? "item" : "items"}
          </span>
          <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
            {firstItemTitle}
          </span>
        </div>
      </td>

      {/* Total Amount */}
      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white text-sm">
        ${(order.totalAmount || 0).toFixed(2)}
      </td>

      {/* Payment Status */}
      <td className="py-3.5 px-3">
        <PaymentStatusBadge status={order.paymentStatus} />
      </td>

      {/* Order Status Badge */}
      <td className="py-3.5 px-3">
        <OrderStatusBadge status={order.status} />
      </td>

      {/* Action Buttons */}
      <td className="py-3.5 px-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onDownloadPdf(order)}
            disabled={isGeneratingPdf}
            title="Direct Download Invoice PDF"
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <RotateCw className="w-4 h-4 animate-spin text-[#ff6c2f]" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onEdit(order)}
            title="Edit Order Status & Details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#ff6c2f] hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onView(order)}
            title="View Order Slide-Over"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#ff6c2f] hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

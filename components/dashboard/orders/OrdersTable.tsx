import React from "react";
import { Package } from "lucide-react";
import { TableSkeleton } from "@/components/dashboard/DashboardSkeletons";
import { Order, CustomDeliveryOverride } from "./orders.types";
import { OrderTableRow } from "./OrderTableRow";

interface OrdersTableProps {
  orders: Order[];
  isInitialLoading: boolean;
  search: string;
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onToggleSelect: (id: string) => void;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDownloadPdf: (order: Order) => void;
  generatingPdfId: string | null;
  customDeliveryOverrides: Record<string, CustomDeliveryOverride>;
}

export function OrdersTable({
  orders,
  isInitialLoading,
  search,
  selectedIds,
  onSelectAll,
  onToggleSelect,
  onView,
  onEdit,
  onDownloadPdf,
  generatingPdfId,
  customDeliveryOverrides,
}: OrdersTableProps) {
  if (isInitialLoading) {
    return (
      <div className="py-4">
        <TableSkeleton rows={6} cols={7} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8 my-2">
        <Package className="w-10 h-10 mb-2 text-slate-300 dark:text-slate-700" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
          No orders found
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          {search
            ? `No orders matched "${search}".`
            : "No customer orders currently match this status filter."}
        </p>
      </div>
    );
  }

  const isAllSelected = orders.length > 0 && selectedIds.length === orders.length;

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
            <th className="py-3 px-3">Order</th>
            <th className="py-3 px-3">Customer</th>
            <th className="py-3 px-3">Items</th>
            <th className="py-3 px-3">Total</th>
            <th className="py-3 px-3">Payment</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {orders.map((order) => (
            <OrderTableRow
              key={order.id}
              order={order}
              isSelected={selectedIds.includes(order.id)}
              onToggleSelect={onToggleSelect}
              onView={onView}
              onEdit={onEdit}
              onDownloadPdf={onDownloadPdf}
              isGeneratingPdf={generatingPdfId === order.id}
              customDeliveryOverride={customDeliveryOverrides[order.id]}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}


"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { DEMO_ORDERS, getCustomerAvatar } from "./ordersData";

interface LarkonRecentOrdersTableProps {
  orders?: any[];
  totalOrdersCount?: number;
}

export function LarkonRecentOrdersTable({
  orders = DEMO_ORDERS,
  totalOrdersCount = 90521,
}: LarkonRecentOrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const pageSize = 5;

  // Active orders pool: ensure we always have data matching OrdersPage
  const activeOrders = useMemo(() => {
    return orders && orders.length > 0 ? orders : DEMO_ORDERS;
  }, [orders]);

  const totalPages = Math.max(1, Math.ceil(activeOrders.length / pageSize));

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return activeOrders.slice(start, start + pageSize);
  }, [activeOrders, currentPage, pageSize]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedOrders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs">
      {/* Header: Title (Left) & Actions (Right) */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
            Recent Orders
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Real-time synchronization with Orders management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/orders"
            className="text-xs font-semibold text-[#ff6c2f] hover:underline px-2.5 py-1.5 hidden sm:inline-block"
          >
            View All Orders →
          </Link>

          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fff1eb] dark:bg-orange-950/40 border border-[#ffdacb] dark:border-orange-800/40 text-[#ff6c2f] hover:bg-[#ffe3d6] dark:hover:bg-orange-900/40 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Order</span>
          </Link>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 whitespace-nowrap">
              <th className="py-3 px-3 w-10">
                <input
                  type="checkbox"
                  checked={
                    paginatedOrders.length > 0 &&
                    selectedIds.length === paginatedOrders.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-[#ff6c2f] focus:ring-[#ff6c2f] cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 font-medium">Order</th>
              <th className="py-3 px-3 font-medium">Customer</th>
              <th className="py-3 px-3 font-medium">Items</th>
              <th className="py-3 px-3 font-medium">Total</th>
              <th className="py-3 px-3 font-medium">Payment</th>
              <th className="py-3 px-3 font-medium">Status</th>
              <th className="py-3 px-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {paginatedOrders.map((order) => {
              const isSelected = selectedIds.includes(order.id);
              const customerName =
                order.user?.displayName || order.guestName || "Customer";
              const customerEmail =
                order.user?.email || order.guestEmail || "No email";
              const avatarUrl = getCustomerAvatar(order);

              // Items info
              const itemsCount = order.items?.length || 1;
              const firstItemTitle =
                order.items?.[0]?.product?.name ||
                order.items?.[0]?.name ||
                order.items?.[0]?.productId ||
                "Product Item";

              // Status badges
              const upperStatus = (order.status || "PENDING").toUpperCase();
              const pStatus = (order.paymentStatus || "").toUpperCase();

              // Date formatting
              const dateStr = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })
                : "Just now";

              return (
                <tr
                  key={order.id}
                  className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors whitespace-nowrap ${
                    isSelected ? "bg-orange-50/30 dark:bg-orange-950/10" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(order.id)}
                      className="rounded border-slate-300 dark:border-slate-600 text-[#ff6c2f] focus:ring-[#ff6c2f] cursor-pointer"
                    />
                  </td>

                  {/* Order Number & Timestamp */}
                  <td className="py-3.5 px-3">
                    <div>
                      <Link
                        href="/dashboard/orders"
                        className="font-bold text-blue-600 dark:text-blue-400 block hover:underline cursor-pointer"
                      >
                        #{order.orderNumber || order.id?.slice(0, 8) || "10482"}
                      </Link>
                      <span className="text-[11px] text-slate-400 block">
                        {dateStr}
                      </span>
                    </div>
                  </td>

                  {/* Customer Info with Avatar */}
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
                      <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                        {firstItemTitle}
                      </span>
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white text-sm">
                    ${(order.totalAmount || 0).toFixed(2)}
                  </td>

                  {/* Payment Status Badge */}
                  <td className="py-3.5 px-3">
                    {pStatus === "PAID" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Paid</span>
                      </span>
                    ) : pStatus === "REFUNDED" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        <span>Refunded</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Unpaid</span>
                      </span>
                    )}
                  </td>

                  {/* Order Status Badge */}
                  <td className="py-3.5 px-3">
                    {upperStatus === "DELIVERED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Delivered</span>
                      </span>
                    )}
                    {upperStatus === "PROCESSING" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Processing</span>
                      </span>
                    )}
                    {upperStatus === "SHIPPED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span>Shipped</span>
                      </span>
                    )}
                    {upperStatus === "PENDING" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Pending</span>
                      </span>
                    )}
                    {upperStatus === "CANCELLED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>Cancelled</span>
                      </span>
                    )}
                  </td>

                  {/* Action Link to Orders Page */}
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href="/dashboard/orders"
                      title="View Order Details"
                      className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-[#ff6c2f] hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer: Showing Count (Left) & Pagination (Right) */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 font-medium">
          Showing {paginatedOrders.length} of {activeOrders.length} orders
        </span>

        {/* Pagination buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-[#ff6c2f] text-white shadow-xs"
                  : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

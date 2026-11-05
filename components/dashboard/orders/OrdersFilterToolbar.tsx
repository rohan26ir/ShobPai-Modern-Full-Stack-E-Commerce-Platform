import React from "react";
import { Search, X, RotateCw } from "lucide-react";
import {
  PaymentFilterType,
  SortOrderType,
  StatusFilterType,
  TabCounts,
} from "./orders.types";

interface OrdersFilterToolbarProps {
  statusFilter: StatusFilterType;
  setStatusFilter: (status: StatusFilterType) => void;
  tabCounts: TabCounts;
  search: string;
  setSearch: (text: string) => void;
  paymentFilter: PaymentFilterType;
  setPaymentFilter: (filter: PaymentFilterType) => void;
  sortOrder: SortOrderType;
  setSortOrder: (order: SortOrderType) => void;
  loading: boolean;
  handleRefresh: () => void;
}

export function OrdersFilterToolbar({
  statusFilter,
  setStatusFilter,
  tabCounts,
  search,
  setSearch,
  paymentFilter,
  setPaymentFilter,
  sortOrder,
  setSortOrder,
  loading,
  handleRefresh,
}: OrdersFilterToolbarProps) {
  const tabs: Array<{ id: StatusFilterType; label: string; count: number }> = [
    { id: "ALL", label: "All", count: tabCounts.all },
    { id: "PENDING", label: "Pending", count: tabCounts.pending },
    { id: "PROCESSING", label: "Processing", count: tabCounts.processing },
    { id: "SHIPPED", label: "Shipped", count: tabCounts.shipped },
    { id: "DELIVERED", label: "Delivered", count: tabCounts.delivered },
    { id: "CANCELLED", label: "Cancelled", count: tabCounts.cancelled },
  ];

  return (
    <>
      {/* Status Filter Tab Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              statusFilter === tab.id
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                statusFilter === tab.id
                  ? "bg-white/20 dark:bg-slate-900/10"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer..."
            className="w-full h-9 pl-9 pr-8 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Payment Status Dropdown */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as PaymentFilterType)}
          className="h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
        >
          <option value="all">All payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="refunded">Refunded</option>
        </select>

        {/* Sort Order Dropdown */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrderType)}
          className="h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest total</option>
          <option value="lowest">Lowest total</option>
        </select>

        {/* Refresh Button on right */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          title="Refresh Orders"
          className="sm:ml-auto h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#ff6c2f]" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </>
  );
}


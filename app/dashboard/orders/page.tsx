"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FaBox,
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaSyncAlt,
  FaSearch,
  FaSpinner,
  FaTruck,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchDashboardOrders,
  updateOrderStatusThunk,
  setOrdersPage,
  setOrdersPageSize,
  setOrdersStatusFilter,
  setOrdersSearch,
  selectPaginatedOrders,
  selectOrdersStats,
} from "@/store/slices/dashboardSlice";
import { PaginationControls } from "@/components/dashboard/PaginationControls";
import { TableSkeleton } from "@/components/dashboard/DashboardSkeletons";
import toast from "react-hot-toast";

const STATUSES = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusBadgeStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-800 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-800 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-800 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-800 border-red-200",
};

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { user, isAdmin, token } = useAuth();

  // Redux memoized selectors & state
  const { items: paginatedOrders, totalCount, totalPages, currentPage, pageSize } =
    useAppSelector(selectPaginatedOrders);
  const stats = useAppSelector(selectOrdersStats);
  const loading = useAppSelector((state) => state.dashboard.orders.loading);
  const updatingId = useAppSelector((state) => state.dashboard.orders.updatingId);
  const statusFilter = useAppSelector((state) => state.dashboard.orders.statusFilter);
  const search = useAppSelector((state) => state.dashboard.orders.search);

  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);

  // Fetch orders with cache TTL check (instant load if within 2 minutes)
  useEffect(() => {
    if (!token) return;
    dispatch(fetchDashboardOrders({ token, isAdmin }));
  }, [isAdmin, token, dispatch]);

  const handleRefresh = useCallback(() => {
    if (!token) return;
    dispatch(fetchDashboardOrders({ token, isAdmin, force: true }));
  }, [isAdmin, token, dispatch]);

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    if (!token || !isAdmin) return;
    try {
      await dispatch(updateOrderStatusThunk({ orderId, status: nextStatus, token })).unwrap();
      toast.success(`Order status updated to ${nextStatus}!`, {
        icon: <FaTruck className="text-[#E5A842] text-lg shrink-0" />,
      });
    } catch {
      toast.error("Failed to update order status");
    }
  };

  // Performance Optimization: Dynamic Lazy Load jsPDF on demand only
  const generatePDF = async (order: any) => {
    setGeneratingPdfId(order.id);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // Store Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(34, 34, 34);
      doc.text("ShobPai Fresh Organics", 20, 25);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Official Invoice & Purchase Receipt", 20, 31);
      doc.text("Support Email: support@shobpai.com | www.shobpai.com", 20, 36);

      // Accent Line
      doc.setDrawColor(229, 168, 66);
      doc.setLineWidth(1.5);
      doc.line(20, 42, 190, 42);

      // Order Meta Info Box
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(34, 34, 34);
      doc.text(`INVOICE NUMBER: ${order.orderNumber || order.id}`, 20, 52);
      doc.text(`DATE: ${new Date(order.createdAt).toLocaleDateString()}`, 130, 52);

      doc.setFont("helvetica", "normal");
      const customerName =
        order.user?.displayName || order.guestName || user?.displayName || "Customer";
      const customerEmail =
        order.user?.email || order.guestEmail || user?.email || "customer@example.com";
      doc.text(`Customer: ${customerName}`, 20, 60);
      doc.text(`Email: ${customerEmail}`, 20, 66);
      doc.text(`Payment: ${order.paymentMethod || "Cash on Delivery"}`, 130, 60);
      doc.text(`Status: ${order.status}`, 130, 66);

      // Items Table Header
      doc.setFillColor(248, 248, 248);
      doc.rect(20, 76, 170, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text("ORDERED ITEMS", 25, 81.5);
      doc.text("QTY", 130, 81.5);
      doc.text("SUBTOTAL", 160, 81.5);

      // Items List
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);

      let startY = 92;
      if (order.items && order.items.length > 0) {
        order.items.forEach((item: any) => {
          const title = item.product?.name || item.productId || "Organic Item";
          doc.text(title.slice(0, 45), 25, startY);
          doc.text(String(item.quantity || 1), 132, startY);
          doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 160, startY);
          startY += 8;
        });
      } else {
        doc.text("Farm Fresh Organics Package", 25, startY);
        doc.text("1", 132, startY);
        doc.text(`$${order.totalAmount?.toFixed(2)}`, 160, startY);
        startY += 8;
      }

      // Divider Line
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(20, startY + 2, 190, startY + 2);

      // Pricing Breakdown
      const finalY = startY + 12;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Order Subtotal:", 125, finalY);
      doc.text(`$${(order.subtotal || order.totalAmount).toFixed(2)}`, 165, finalY);

      doc.text("Shipping & Handling:", 125, finalY + 6);
      doc.text(`$${(order.shippingFee || 0).toFixed(2)}`, 165, finalY + 6);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(229, 168, 66);
      doc.text("Grand Total:", 125, finalY + 15);
      doc.text(`$${order.totalAmount?.toFixed(2)}`, 165, finalY + 15);

      // Footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(
        "Thank you for shopping organic with ShobPai! Hand-picked farm fresh quality guaranteed.",
        20,
        270
      );

      doc.save(`ShobPai-Invoice-${order.orderNumber || order.id}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setGeneratingPdfId(null);
    }
  };

  const isInitialLoading = loading && paginatedOrders.length === 0 && !search;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            {isAdmin ? "Admin Order Fulfillment" : "Purchase History"}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            {isAdmin ? "All Platform Orders" : "My Orders"}
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            {isAdmin
              ? "Manage customer shipments, update fulfillment stages, and export official billing receipts."
              : "Review your completed organic produce orders, check tracking statuses, and download invoices."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-3 text-xs font-bold text-white transition-all backdrop-blur-xs disabled:opacity-50 cursor-pointer self-start md:self-auto"
        >
          <FaSyncAlt className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {STATUSES.map((st) => {
            const isActive = statusFilter === st;
            let count = stats.total;
            if (st === "PENDING") count = stats.pending;
            if (st === "PROCESSING") count = stats.processing;
            if (st === "SHIPPED") count = stats.shipped;
            if (st === "DELIVERED") count = stats.delivered;
            if (st === "CANCELLED") count = stats.cancelled;

            return (
              <button
                key={st}
                type="button"
                onClick={() => dispatch(setOrdersStatusFilter(st))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#E5A842] text-gray-950 shadow-xs"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{st}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-black/20 text-gray-950" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-3 w-3" />
          <input
            type="text"
            placeholder="Search order # or customer..."
            value={search}
            onChange={(e) => dispatch(setOrdersSearch(e.target.value))}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-[#E5A842] focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Orders Table or Skeletons */}
      {isInitialLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : paginatedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
          <FaBox className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-gray-800">No Orders Found</h3>
          <p className="text-xs text-gray-400 mt-1">
            {search || statusFilter !== "ALL"
              ? "No orders match the current filter or search criteria."
              : "No orders have been placed yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                  <th className="py-3 px-3">Order Number</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedOrders.map((ord: any) => {
                  const badgeClass =
                    statusBadgeStyles[ord.status] || "bg-gray-50 text-gray-600 border-gray-200";
                  const customerName =
                    ord.user?.displayName || ord.guestName || "Customer";
                  const customerEmail =
                    ord.user?.email || ord.guestEmail || "No email";
                  const isUpdating = updatingId === ord.id;
                  const isPdfDownloading = generatingPdfId === ord.id;

                  return (
                    <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        #{ord.orderNumber || ord.id.slice(-6)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-gray-900">{customerName}</div>
                        <div className="text-[11px] text-gray-400">{customerEmail}</div>
                      </td>
                      <td className="py-3 px-3 text-gray-400">
                        {ord.createdAt
                          ? new Date(ord.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-3 px-3">
                        {ord.items?.length || 1} item(s)
                      </td>
                      <td className="py-3 px-3 font-bold text-gray-900">
                        ${Number(ord.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        {isAdmin ? (
                          <div className="flex items-center gap-1.5">
                            <select
                              value={ord.status}
                              disabled={isUpdating}
                              onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                              className={`rounded-lg border px-2 py-1 text-[11px] font-bold outline-none cursor-pointer ${badgeClass}`}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="PROCESSING">PROCESSING</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                            {isUpdating && <FaSpinner className="h-3 w-3 animate-spin text-gray-400" />}
                          </div>
                        ) : (
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeClass}`}
                          >
                            {ord.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => generatePDF(ord)}
                          disabled={isPdfDownloading}
                          title="Generate PDF Receipt"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1 text-[11px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isPdfDownloading ? (
                            <FaSpinner className="h-3 w-3 animate-spin text-[#E5A842]" />
                          ) : (
                            <FaFileInvoiceDollar className="h-3 w-3 text-[#E5A842]" />
                          )}
                          <span>Invoice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Memoized Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={(p) => dispatch(setOrdersPage(p))}
            onPageSizeChange={(s) => dispatch(setOrdersPageSize(s))}
            pageSizeOptions={[10, 25, 50]}
          />
        </div>
      )}
    </div>
  );
}

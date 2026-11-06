"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  Clock,
  Search,
  Eye,
  FileDown,
  Printer,
  ChevronRight,
  ArrowRight,
  Calendar,
  X,
  CheckCircle2,
  Truck,
  RotateCw,
  AlertCircle,
  Star,
} from "lucide-react";
import { useCustomerData, CustomerOrder } from "@/hooks/useCustomerData";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import { ReviewProductModal } from "./ReviewProductModal";
import { api } from "@/lib/api";

interface CustomerOrdersViewProps {
  user: any;
  token?: string | null;
}

export function CustomerOrdersView({ user, token }: CustomerOrdersViewProps) {
  const email = user?.email;
  const { orders, loading, isRefreshing, refreshAll } = useCustomerData(email, token);

  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "DELIVERED" | "CANCELLED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [reviewingItem, setReviewingItem] = useState<{
    productId: string;
    productName: string;
    productImage?: string;
    price?: number;
    orderNumber?: string;
  } | null>(null);
  const [reviewedProductIds, setReviewedProductIds] = useState<Set<string>>(new Set());

  // Pre-load user's submitted reviews so reviewed items display the "Reviewed" badge
  useEffect(() => {
    if (!token) return;
    api.getMyReviews(token)
      .then((res: any) => {
        if (Array.isArray(res)) {
          const ids = new Set<string>();
          for (const r of res) {
            if (r.productId) ids.add(r.productId);
            if (r.product?.id) ids.add(r.product.id);
          }
          setReviewedProductIds(ids);
        }
      })
      .catch(() => {});
  }, [token]);

  // Filtered orders list strictly belonging to this authenticated user
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = (order.status || "PENDING").toUpperCase();

      // Tab filter
      if (activeTab === "ACTIVE" && !["PENDING", "PROCESSING", "SHIPPED"].includes(status)) {
        return false;
      }
      if (activeTab === "DELIVERED" && status !== "DELIVERED") {
        return false;
      }
      if (activeTab === "CANCELLED" && status !== "CANCELLED") {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const orderIdMatch = (order.orderNumber || order.id || "").toLowerCase().includes(query);
        const itemMatch = order.items?.some((it) => {
          const title = it.product?.name || it.productName || it.name || "";
          return title.toLowerCase().includes(query);
        });
        if (!orderIdMatch && !itemMatch) return false;
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: orders.length,
      active: orders.filter((o) =>
        ["PENDING", "PROCESSING", "SHIPPED"].includes((o.status || "").toUpperCase())
      ).length,
      delivered: orders.filter((o) => (o.status || "").toUpperCase() === "DELIVERED").length,
      cancelled: orders.filter((o) => (o.status || "").toUpperCase() === "CANCELLED").length,
    };
  }, [orders]);

  // PDF Invoice Generator
  const generateInvoicePDF = async (order: CustomerOrder) => {
    setGeneratingPdfId(order.id);
    const toastId = toast.loading("Generating your official invoice PDF...");

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Yellow top accent bar
      doc.setFillColor(255, 224, 27);
      doc.rect(170, 0, 40, 10, "F");

      // Brand Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 30, 30);
      doc.text("Invoice", 20, 28);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(70, 70, 70);
      doc.text(`#${order.orderNumber || order.id.slice(0, 8)}`, 20, 36);

      // Company Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(255, 108, 47);
      doc.text("shobPai", 152, 34);

      // Billing & Shipping Addresses
      const custName = order.user?.displayName || user?.displayName || "Valued Customer";
      const custEmail = order.user?.email || email || "customer@example.com";
      const custPhone = order.shippingAddress?.phone || order.user?.phoneNumber || "+880 1700-000000";
      const addressLine = order.shippingAddress?.addressLine || "Home Delivery Address";
      const cityDistrict = `${order.shippingAddress?.city || "Dhaka"}, Bangladesh`;

      // Seller Info
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text("BILLING FROM", 20, 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text("shobPai E-Commerce Ltd.", 20, 68);
      doc.text("House 14, Road 5, Dhanmondi, Dhaka 1205", 20, 73);
      doc.text("support@shobpai.com • +880 1700-000000", 20, 78);

      // Customer Info
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text("SHIPPING TO", 120, 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(custName, 120, 68);
      doc.text(addressLine, 120, 73);
      doc.text(cityDistrict, 120, 78);
      doc.text(`${custEmail} • ${custPhone}`, 120, 83);

      // Table Header Banner
      const tableY = 98;
      doc.setFillColor(255, 224, 27);
      doc.rect(20, tableY, 170, 9, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(20, 20, 20);
      doc.text("Product Description", 23, tableY + 6);
      doc.text("Qty", 100, tableY + 6);
      doc.text("Unit Price", 125, tableY + 6);
      doc.text("Total", 170, tableY + 6);

      // Rows
      let rowY = tableY + 16;
      const items = order.items && order.items.length > 0 ? order.items : [
        {
          productName: "Organic Grocery Basket",
          quantity: 1,
          price: order.totalAmount || 120,
          total: order.totalAmount || 120,
        },
      ];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      items.forEach((it) => {
        const title = it.product?.name || it.productName || it.name || "Grocery Item";
        const qty = it.quantity || 1;
        const price = it.price || it.unitPrice || 50;
        const total = it.total || price * qty;

        doc.setTextColor(30, 30, 30);
        doc.text(title.slice(0, 36), 23, rowY);
        doc.text(String(qty), 103, rowY);
        doc.text(`$${price.toFixed(2)}`, 128, rowY);
        doc.text(`$${total.toFixed(2)}`, 170, rowY);

        doc.setDrawColor(230, 230, 230);
        doc.line(20, rowY + 6, 190, rowY + 6);
        rowY += 12;
      });

      // Summary
      let sumY = Math.max(rowY + 10, 160);
      const subtotal = order.subtotal || order.totalAmount || 100;
      const totalAmount = order.totalAmount || 100;

      const renderRow = (label: string, val: string, bold = false) => {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(9);
        doc.text(label, 125, sumY);
        doc.text(val, 170, sumY);
        doc.setDrawColor(210, 210, 210);
        doc.line(125, sumY + 2.5, 190, sumY + 2.5);
        sumY += 8.5;
      };

      renderRow("Subtotal", `$${subtotal.toFixed(2)}`);
      renderRow("Shipping Fee", "$0.00 (Free)");
      renderRow("Total Paid", `$${totalAmount.toFixed(2)}`, true);

      // Save
      doc.save(`shobPai-Invoice-${order.orderNumber || order.id.slice(0, 6)}.pdf`);
      toast.success("Invoice downloaded successfully!", { id: toastId, icon: "📄" });
    } catch {
      toast.error("Failed to generate PDF invoice", { id: toastId });
    } finally {
      setGeneratingPdfId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/50";
      case "PROCESSING":
        return "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/50";
      case "SHIPPED":
        return "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/50";
      case "CANCELLED":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/50";
      default:
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/50";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-emerald-500";
      case "PROCESSING":
        return "bg-blue-500";
      case "SHIPPED":
        return "bg-purple-500";
      case "CANCELLED":
        return "bg-rose-500";
      default:
        return "bg-amber-500";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Page Header with Title & Sync Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Orders & Tracking
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            View order progress, live tracking milestones, and download invoices
          </p>
        </div>

        <button
          type="button"
          onClick={refreshAll}
          disabled={isRefreshing}
          className="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#ff6c2f]" : ""}`} />
          <span>Sync Orders</span>
        </button>
      </div>

      {/* 2. Filter Tabs & Search Bar Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                activeTab === "ALL"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>All Orders</span>
              <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500">
                {tabCounts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ACTIVE")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                activeTab === "ACTIVE"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>In Transit / Active</span>
              <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-orange-100 dark:bg-orange-950/60 text-[#ff6c2f] font-bold">
                {tabCounts.active}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("DELIVERED")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                activeTab === "DELIVERED"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Delivered</span>
              <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500">
                {tabCounts.delivered}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("CANCELLED")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                activeTab === "CANCELLED"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Cancelled</span>
              <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500">
                {tabCounts.cancelled}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID or product..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
            />
          </div>
        </div>
      </div>

      {/* 3. Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 animate-pulse"
            />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-10 text-center text-slate-400 space-y-3 shadow-xs">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {searchQuery ? "No matching orders found" : "No orders found in this category"}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No orders matching "${searchQuery}". Try searching with another keyword.`
              : "Explore our farm-fresh produce, groceries, and premium goods in the shop."}
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <span>Explore Shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const upperStatus = (order.status || "PENDING").toUpperCase();
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              : "Recently";

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-orange-200 dark:hover:border-orange-900/40 transition-all space-y-4"
              >
                {/* Order Top Bar: ID, Date, Status Pill, Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">
                      #{order.orderNumber || order.id.slice(0, 8)}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusColor(
                        upperStatus
                      )}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(upperStatus)}`} />
                      <span>{upperStatus}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => generateInvoicePDF(order)}
                      disabled={generatingPdfId === order.id}
                      className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      title="Download Invoice PDF"
                    >
                      <FileDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Invoice</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="h-8 px-3.5 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/40 text-[#ff6c2f] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                    </button>
                  </div>
                </div>

                {/* Items Preview List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(order.items || []).map((item, idx) => {
                    const title = item.product?.name || item.productName || item.name || "Item";
                    const img =
                      item.product?.images?.[0] ||
                      item.productImage ||
                      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80";
                    const price = item.price || item.unitPrice || 50;
                    const qty = item.quantity || 1;
                    const prodId = (item as any).productId || item.product?.id || item.id || "";
                    const isReviewed = prodId ? reviewedProductIds.has(prodId) : false;

                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                            <img src={img} alt={title} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                              {title}
                            </h4>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              Qty: {qty} • ${price.toFixed(2)} each
                            </span>
                          </div>
                        </div>

                        {/* Review Product Button (Available after Complete Delivery) */}
                        {upperStatus === "DELIVERED" && prodId && (
                          <div className="shrink-0 pl-1">
                            {isReviewed ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Reviewed</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setReviewingItem({
                                    productId: prodId,
                                    productName: title,
                                    productImage: img,
                                    price: price,
                                    orderNumber: order.orderNumber || order.id.slice(0, 8),
                                  })
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/70 transition-all cursor-pointer shadow-2xs hover:scale-102"
                              >
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span>Review Product</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Order Footer: Total and Delivery Note */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Delivery Address:
                    </span>
                    <span className="truncate max-w-[280px]">
                      {order.shippingAddress?.addressLine || "Home Address"},{" "}
                      {order.shippingAddress?.city || "Dhaka"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span>
                      Payment:{" "}
                      <strong className="text-slate-800 dark:text-slate-200 capitalize">
                        {order.paymentMethod || "Online / COD"}
                      </strong>
                    </span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      ${(order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Tracking Milestones & Order Detail Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#ff6c2f]" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    Order Tracking #{selectedOrder.orderNumber || selectedOrder.id.slice(0, 8)}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Real-time fulfillment milestone timeline
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 [scrollbar-width:thin]">
              {/* Stepper Timeline */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    Order Placed & Confirmed
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    We received your order and payment verification
                  </p>
                </div>

                <div className="relative">
                  <span
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                      ["PROCESSING", "SHIPPED", "DELIVERED"].includes(
                        (selectedOrder.status || "").toUpperCase()
                      )
                        ? "bg-emerald-500"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  />
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    Processing & Packaging
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Fresh produce harvested and packed with insulated packaging
                  </p>
                </div>

                <div className="relative">
                  <span
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                      ["SHIPPED", "DELIVERED"].includes(
                        (selectedOrder.status || "").toUpperCase()
                      )
                        ? "bg-emerald-500"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  />
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    Out for Delivery
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    With our rider assigned to your delivery sector
                  </p>
                </div>

                <div className="relative">
                  <span
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                      (selectedOrder.status || "").toUpperCase() === "DELIVERED"
                        ? "bg-emerald-500"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  />
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    Delivered
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Delivered to your address
                  </p>
                </div>
              </div>

              {/* Items in Order */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block mb-2.5">
                  Ordered Items ({selectedOrder.items?.length || 1})
                </span>
                <div className="space-y-2">
                  {(selectedOrder.items || []).map((it, idx) => {
                    const prodId = (it as any).productId || it.product?.id || it.id || "";
                    const isReviewed = prodId ? reviewedProductIds.has(prodId) : false;
                    const isDelivered = (selectedOrder.status || "").toUpperCase() === "DELIVERED";
                    const title = it.product?.name || it.productName || it.name || "Product Item";
                    const img = it.product?.images?.[0] || it.productImage;
                    const price = it.price || it.unitPrice || 50;

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                            {title}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Qty: {it.quantity || 1} • ${price.toFixed(2)} each
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            ${(price * (it.quantity || 1)).toFixed(2)}
                          </span>

                          {isDelivered && prodId && (
                            <div>
                              {isReviewed ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  <span>Reviewed</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setReviewingItem({
                                      productId: prodId,
                                      productName: title,
                                      productImage: img,
                                      price: price,
                                      orderNumber: selectedOrder.orderNumber || selectedOrder.id.slice(0, 8),
                                    })
                                  }
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-800 transition-all cursor-pointer"
                                >
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>Review</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Address & Pricing summary */}
              <div className="p-3.5 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Shipping Address:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-right">
                    {selectedOrder.shippingAddress?.addressLine || "Home Address"},{" "}
                    {selectedOrder.shippingAddress?.city || "Dhaka"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Recipient Contact:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedOrder.shippingAddress?.phone || selectedOrder.user?.phoneNumber || "On file"}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-orange-200/50 dark:border-orange-900/40 font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Total Order Amount:</span>
                  <span className="text-sm font-extrabold text-[#ff6c2f]">
                    ${(selectedOrder.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <button
                type="button"
                onClick={() => generateInvoicePDF(selectedOrder)}
                className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Download Invoice PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="h-9 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Review Delivered Product Modal */}
      {reviewingItem && (
        <ReviewProductModal
          isOpen={!!reviewingItem}
          onClose={() => setReviewingItem(null)}
          token={token}
          user={user}
          orderNumber={reviewingItem.orderNumber}
          item={reviewingItem}
          onSuccess={(prodId) => {
            setReviewedProductIds((prev) => new Set(prev).add(prodId));
          }}
        />
      )}
    </div>
  );
}
export default CustomerOrdersView;


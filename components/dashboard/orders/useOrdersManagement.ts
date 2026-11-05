import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchDashboardOrders,
  setOrdersPage,
  setOrdersPageSize,
  setOrdersStatusFilter,
  setOrdersSearch,
  selectPaginatedOrders,
  selectOrdersStats,
} from "@/store/slices/dashboardSlice";
import { DEMO_ORDERS } from "@/components/dashboard/overview/ordersData";
import { generateInvoicePdf } from "./generateInvoicePdf";
import { useOrderEditModal } from "./useOrderEditModal";
import {
  Order,
  PaymentFilterType,
  SortOrderType,
  StatusFilterType,
  TabCounts,
} from "./orders.types";

export function useOrdersManagement() {
  const dispatch = useAppDispatch();
  const { user, isAdmin, token } = useAuth();

  const { totalPages, currentPage, pageSize } = useAppSelector(selectPaginatedOrders);
  const rawOrders = useAppSelector((state) => state.dashboard.orders.items);
  const stats = useAppSelector(selectOrdersStats);
  const loading = useAppSelector((state) => state.dashboard.orders.loading);
  const updatingId = useAppSelector((state) => state.dashboard.orders.updatingId);
  const statusFilter = useAppSelector((state) => state.dashboard.orders.statusFilter) as StatusFilterType;
  const search = useAppSelector((state) => state.dashboard.orders.search);

  // Local UI filters & selections
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilterType>("all");
  const [sortOrder, setSortOrder] = useState<SortOrderType>("newest");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);

  // Edit modal helper hook
  const editModal = useOrderEditModal(token, isAdmin, viewingOrder, setViewingOrder);

  // Initial fetch
  useEffect(() => {
    if (!token) return;
    dispatch(fetchDashboardOrders({ token, isAdmin }));
  }, [isAdmin, token, dispatch]);

  const handleRefresh = useCallback(() => {
    if (!token) return;
    dispatch(fetchDashboardOrders({ token, isAdmin, force: true }));
  }, [isAdmin, token, dispatch]);

  // Active dataset
  const ordersPool = rawOrders.length > 0 ? (rawOrders as Order[]) : (DEMO_ORDERS as unknown as Order[]);

  // Filter & sort
  const filteredOrders = useMemo(() => {
    return ordersPool
      .filter((order) => {
        if (statusFilter !== "ALL" && order.status !== statusFilter) return false;

        if (paymentFilter !== "all") {
          const pStatus = (order.paymentStatus || "").toUpperCase();
          if (paymentFilter === "paid" && pStatus !== "PAID") return false;
          if (paymentFilter === "unpaid" && pStatus !== "PENDING" && pStatus !== "UNPAID") return false;
          if (paymentFilter === "refunded" && pStatus !== "REFUNDED") return false;
        }

        if (search.trim()) {
          const query = search.toLowerCase();
          const orderNum = (order.orderNumber || order.id || "").toLowerCase();
          const customer = (order.user?.displayName || order.guestName || order.user?.email || "").toLowerCase();
          if (!orderNum.includes(query) && !customer.includes(query)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortOrder === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortOrder === "highest") return (b.totalAmount || 0) - (a.totalAmount || 0);
        if (sortOrder === "lowest") return (a.totalAmount || 0) - (b.totalAmount || 0);
        return 0;
      });
  }, [ordersPool, statusFilter, paymentFilter, search, sortOrder]);

  // Derived counts for tabs
  const tabCounts: TabCounts = useMemo(() => ({
    all: ordersPool.length,
    pending: ordersPool.filter((o) => o.status === "PENDING").length,
    processing: ordersPool.filter((o) => o.status === "PROCESSING").length,
    shipped: ordersPool.filter((o) => o.status === "SHIPPED").length,
    delivered: ordersPool.filter((o) => o.status === "DELIVERED").length,
    cancelled: ordersPool.filter((o) => o.status === "CANCELLED").length,
  }), [ordersPool]);

  // Bulk selection
  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredOrders.map((o) => o.id) : []);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleGeneratePdf = (order: Order) => {
    generateInvoicePdf(
      order,
      () => setGeneratingPdfId(order.id),
      () => setGeneratingPdfId(null)
    );
  };

  return {
    user,
    isAdmin,
    token,
    loading,
    updatingId,
    stats,
    statusFilter,
    setStatusFilter: (status: StatusFilterType) => dispatch(setOrdersStatusFilter(status)),
    search,
    setSearch: (text: string) => dispatch(setOrdersSearch(text)),
    paymentFilter,
    setPaymentFilter,
    sortOrder,
    setSortOrder,
    selectedIds,
    handleSelectAll,
    handleToggleSelect,
    filteredOrders,
    tabCounts,
    currentPage,
    totalPages,
    pageSize,
    setPage: (p: number) => dispatch(setOrdersPage(p)),
    setPageSize: (s: number) => dispatch(setOrdersPageSize(s)),
    handleRefresh,
    ...editModal,
    viewingOrder,
    setViewingOrder,
    invoiceModalOrder,
    setInvoiceModalOrder,
    generatingPdfId,
    handleGeneratePdf,
    isInitialLoading: loading && rawOrders.length === 0,
  };
}

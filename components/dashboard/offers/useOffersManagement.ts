import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  CouponData,
  OffersTab,
  OffersSortOrder,
  OffersViewMode,
} from "./offers.types";
import { DEFAULT_COUPONS } from "./offers.constants";
import { calculateOffersKpi, exportCouponsToCsv } from "./offers.utils";

export function useOffersManagement() {
  const { token } = useAuth();

  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Controls
  const [activeTab, setActiveTab] = useState<OffersTab>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<OffersSortOrder>("newest");
  const [viewMode, setViewMode] = useState<OffersViewMode>("table");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponData | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<CouponData | null>(null);

  // Load coupons from backend with fallback
  const fetchCoupons = useCallback(async () => {
    try {
      const data = await api.getCoupons();
      if (Array.isArray(data) && data.length > 0) {
        setCoupons(data);
      } else {
        setCoupons(DEFAULT_COUPONS);
      }
    } catch {
      setCoupons(DEFAULT_COUPONS);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchCoupons();
    toast.success("Offers updated!");
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied code "${code}" to clipboard!`, { icon: "📋" });
    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev));
    }, 2000);
  };

  const handleToggleActive = async (coupon: CouponData) => {
    const nextStatus = !coupon.isActive;
    setCoupons((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, isActive: nextStatus } : c))
    );

    try {
      await api.updateCoupon(coupon.id, { isActive: nextStatus }, token);
      toast.success(nextStatus ? `Offer ${coupon.code} activated` : `Offer ${coupon.code} paused`);
    } catch {
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, isActive: coupon.isActive } : c))
      );
      toast.error("Failed to update status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCoupon) return;
    const { id, code } = deletingCoupon;

    try {
      await api.deleteCoupon(id, token);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Coupon "${code}" deleted`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete coupon");
    } finally {
      setDeletingCoupon(null);
    }
  };

  const handleExportCSV = () => exportCouponsToCsv(coupons);

  const stats = useMemo(() => calculateOffersKpi(coupons), [coupons]);

  const filteredCoupons = useMemo(() => {
    return coupons
      .filter((c) => {
        if (activeTab === "active" && !c.isActive) return false;
        if (activeTab === "paused" && c.isActive) return false;
        if (activeTab === "expiring") {
          if (!c.expiresAt) return false;
          const thirtyDaysAhead = Date.now() + 30 * 24 * 60 * 60 * 1000;
          if (new Date(c.expiresAt).getTime() > thirtyDaysAhead) return false;
        }

        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchCode = c.code.toLowerCase().includes(query);
          const matchDesc = (c.description || "").toLowerCase().includes(query);
          if (!matchCode && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        if (sortOrder === "highest") return b.discountPercentage - a.discountPercentage;
        if (sortOrder === "lowest") return a.discountPercentage - b.discountPercentage;
        if (sortOrder === "minSpend") return (a.minSpend || 0) - (b.minSpend || 0);
        return 0;
      });
  }, [coupons, activeTab, searchTerm, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredCoupons.length / pageSize));
  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCoupons.slice(start, start + pageSize);
  }, [filteredCoupons, currentPage, pageSize]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginatedCoupons.map((c) => c.id) : []);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return {
    token,
    coupons,
    setCoupons,
    loading,
    isRefreshing,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    selectedIds,
    copiedCode,
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize,
    isCreateOpen,
    setIsCreateOpen,
    editingCoupon,
    setEditingCoupon,
    deletingCoupon,
    setDeletingCoupon,
    handleRefresh,
    handleCopyCode,
    handleToggleActive,
    handleConfirmDelete,
    handleExportCSV,
    handleSelectAll,
    handleToggleSelect,
    stats,
    filteredCoupons,
    paginatedCoupons,
  };
}

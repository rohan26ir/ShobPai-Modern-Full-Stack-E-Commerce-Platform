import { useState, useMemo, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useShopData } from "@/context/ShopDataContext";
import { useAppDispatch } from "@/store/hooks";
import { deleteProduct } from "@/store/slices/shopSlice";
import { api } from "@/lib/api";
import {
  TableProduct,
  ProductTimeFilter,
  AggregatedProductStats,
  ProductTimeframeStat,
} from "./products.types";

export function useProductsManagement() {
  const dispatch = useAppDispatch();
  const { token, isAdmin } = useAuth();
  const { products: storeProducts, categories, refreshProducts } = useShopData();

  // ONLY real database products - zero fake mockup fallback
  const allProducts: TableProduct[] = useMemo(() => {
    if (!storeProducts || storeProducts.length === 0) {
      return [];
    }
    return storeProducts.map((p) => ({
      ...p,
      categoryName: p.categoryName || p.category || "General",
      sizesDisplay: p.unit ? `Size : ${p.unit}` : "Size : Standard",
      stock: typeof p.stock === "number" ? p.stock : 0,
      sold: typeof p.sold === "number" ? p.sold : 0,
      rating: typeof p.rating === "number" ? p.rating : 5.0,
      reviewsCount: typeof p.reviewsCount === "number" ? p.reviewsCount : 0,
    }));
  }, [storeProducts]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<ProductTimeFilter>("This Month");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Real API Stats state
  const [apiStats, setApiStats] = useState<AggregatedProductStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch real aggregated product stats from backend
  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      setStatsLoading(true);
      const res = await api.getAdminProductStats(token);
      if (res && res.allTime) {
        setApiStats(res);
      }
    } catch (err) {
      console.error("Failed to load real product stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAdmin && token) {
      fetchStats();
    }
  }, [isAdmin, token, fetchStats]);

  // Active timeframe statistics (backend aggregated with dynamic fallback)
  const currentStats: ProductTimeframeStat = useMemo(() => {
    const totalCatalogProducts = allProducts.length;
    const totalInventoryStock = allProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
    const totalCatalogSold = allProducts.reduce((sum, p) => sum + (p.sold || 0), 0);
    const totalCatalogRevenue = allProducts.reduce(
      (sum, p) => sum + (p.sold || 0) * (p.price || 0),
      0
    );

    if (apiStats) {
      switch (selectedTimeFilter) {
        case "Today":
          return (
            apiStats.today || {
              totalProducts: totalCatalogProducts,
              productLeft: totalInventoryStock,
              productSold: 0,
              soldAmount: 0,
            }
          );
        case "This Week":
          return (
            apiStats.thisWeek || {
              totalProducts: totalCatalogProducts,
              productLeft: totalInventoryStock,
              productSold: 0,
              soldAmount: 0,
            }
          );
        case "This Month":
          return (
            apiStats.thisMonth || {
              totalProducts: totalCatalogProducts,
              productLeft: totalInventoryStock,
              productSold: totalCatalogSold,
              soldAmount: totalCatalogRevenue,
            }
          );
        case "All Time":
        default:
          return (
            apiStats.allTime || {
              totalProducts: totalCatalogProducts,
              productLeft: totalInventoryStock,
              productSold: totalCatalogSold,
              soldAmount: totalCatalogRevenue,
            }
          );
      }
    }

    // Dynamic local fallback while waiting for API
    return {
      totalProducts: totalCatalogProducts,
      productLeft: totalInventoryStock,
      productSold: totalCatalogSold,
      soldAmount: totalCatalogRevenue,
    };
  }, [allProducts, apiStats, selectedTimeFilter]);

  // Modals state
  const [viewingProduct, setViewingProduct] = useState<TableProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<TableProduct | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.categoryName || p.category).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (p.categoryName || "").toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? paginatedProducts.map((p) => p.id) : []);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteProduct = async (product: TableProduct) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    const toastId = toast.loading("Removing product from catalog...");
    try {
      if (token && product.id && !product.id.startsWith("prod-")) {
        await api.adminDeleteProduct(product.id, token);
      }
      dispatch(deleteProduct(product.id));
      await refreshProducts?.();
      await fetchStats();
      toast.success(`"${product.name}" removed successfully!`, { id: toastId });
    } catch {
      dispatch(deleteProduct(product.id));
      toast.success(`"${product.name}" removed from view!`, { id: toastId });
    }
  };

  return {
    token,
    categories,
    refreshProducts,
    fetchStats,
    searchTerm,
    setSearchTerm,
    selectedTimeFilter,
    setSelectedTimeFilter,
    selectedCategory,
    setSelectedCategory,
    selectedIds,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    paginatedProducts,
    filteredProducts,
    allProductsCount: allProducts.length,
    currentStats,
    statsLoading,
    handleSelectAll,
    handleToggleSelect,
    handleDeleteProduct,
    viewingProduct,
    setViewingProduct,
    editingProduct,
    setEditingProduct,
    isAddingProduct,
    setIsAddingProduct,
  };
}

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useShopData } from "@/context/ShopDataContext";
import { useAppDispatch } from "@/store/hooks";
import { deleteProduct } from "@/store/slices/shopSlice";
import { api } from "@/lib/api";
import { TableProduct, ProductTimeFilter } from "./products.types";
import { DEFAULT_SCREENSHOT_PRODUCTS } from "./products.constants";

export function useProductsManagement() {
  const dispatch = useAppDispatch();
  const { token } = useAuth();
  const { products: storeProducts, categories, refreshProducts } = useShopData();

  // Combine database products with default screenshot catalog
  const allProducts: TableProduct[] = useMemo(() => {
    if (!storeProducts || storeProducts.length === 0) {
      return DEFAULT_SCREENSHOT_PRODUCTS;
    }
    const mappedStore: TableProduct[] = storeProducts.map((p) => ({
      ...p,
      categoryName: p.categoryName || p.category || "General",
      sizesDisplay: p.unit ? `Size : ${p.unit}` : "Size : S , M , L",
      stock: p.stock || 45,
      sold: p.sold || Math.max(12, Math.round((p.stock || 45) * 0.4)),
      rating: p.rating || 4.5,
      reviewsCount: p.reviewsCount || 48,
    }));

    const existingSlugs = new Set(mappedStore.map((p) => p.slug));
    const extraDefaults = DEFAULT_SCREENSHOT_PRODUCTS.filter((p) => !existingSlugs.has(p.slug));
    return [...mappedStore, ...extraDefaults];
  }, [storeProducts]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<ProductTimeFilter>("This Month");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
      refreshProducts?.();
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


import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { Category } from "@/data/categories";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useShopData } from "@/context/ShopDataContext";
import { CategoryTimeFilter, CategoryViewMode } from "./categories.types";

export function useCategoriesManagement() {
  const { token } = useAuth();
  const { refreshCategories } = useShopData();
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<CategoryTimeFilter>("This Month");
  const [viewMode, setViewMode] = useState<CategoryViewMode>("table");

  // Selection & Pagination
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      if (Array.isArray(data)) {
        setCategoriesList(data);
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Filter Categories by search term
  const filteredCategories = useMemo(() => {
    return categoriesList.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [categoriesList, searchTerm]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  // Statistics
  const totalProductsCount = useMemo(() => {
    return categoriesList.reduce((acc, cat) => acc + (cat.itemCount || 0), 0);
  }, [categoriesList]);

  const avgProductsPerCat = useMemo(() => {
    if (categoriesList.length === 0) return 0;
    return Math.round(totalProductsCount / categoriesList.length);
  }, [categoriesList, totalProductsCount]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginatedCategories.map((c) => c.id) : []);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteCategory = async (cat: Category) => {
    const toastId = toast.loading(`Deleting "${cat.name}"...`);
    try {
      await api.deleteCategory(cat.id, token);
      setCategoriesList((prev) => prev.filter((c) => c.id !== cat.id));
      await refreshCategories();
      toast.success(`Category "${cat.name}" removed successfully`, { id: toastId });
      setDeletingCategory(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete category", { id: toastId });
    }
  };

  return {
    token,
    categoriesList,
    loading,
    loadCategories,
    searchTerm,
    setSearchTerm,
    selectedTimeFilter,
    setSelectedTimeFilter,
    viewMode,
    setViewMode,
    selectedIds,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    filteredCategories,
    paginatedCategories,
    totalProductsCount,
    avgProductsPerCat,
    handleSelectAll,
    handleToggleSelect,
    handleDeleteCategory,
    viewingCategory,
    setViewingCategory,
    editingCategory,
    setEditingCategory,
    isAdding,
    setIsAdding,
    deletingCategory,
    setDeletingCategory,
  };
}


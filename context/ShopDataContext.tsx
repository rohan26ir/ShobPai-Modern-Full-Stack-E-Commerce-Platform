"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { Product } from "@/data/products";
import { Category } from "@/data/categories";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, fetchCategories } from "@/store/slices/shopSlice";

interface ShopDataContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  productsLoading: boolean;
  categoriesLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const ShopDataContext = createContext<ShopDataContextType | undefined>(undefined);

export function ShopDataProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { products, categories, loading, productsLoading, categoriesLoading, error } = useAppSelector(
    (state) => state.shop
  );

  const handleRefreshProducts = useCallback(async () => {
    await dispatch(fetchProducts()).unwrap().catch(() => {});
  }, [dispatch]);

  const handleRefreshCategories = useCallback(async () => {
    await dispatch(fetchCategories()).unwrap().catch(() => {});
  }, [dispatch]);

  const handleRefreshAll = useCallback(async () => {
    await Promise.all([
      dispatch(fetchProducts()).unwrap().catch(() => {}),
      dispatch(fetchCategories()).unwrap().catch(() => {}),
    ]);
  }, [dispatch]);

  const contextValue = useMemo(
    () => ({
      products,
      categories,
      loading,
      productsLoading,
      categoriesLoading,
      error,
      refreshProducts: handleRefreshProducts,
      refreshCategories: handleRefreshCategories,
      refreshAll: handleRefreshAll,
    }),
    [
      products,
      categories,
      loading,
      productsLoading,
      categoriesLoading,
      error,
      handleRefreshProducts,
      handleRefreshCategories,
      handleRefreshAll,
    ]
  );

  return (
    <ShopDataContext.Provider value={contextValue}>
      {children}
    </ShopDataContext.Provider>
  );
}

export function useShopData() {
  const context = useContext(ShopDataContext);
  if (!context) {
    throw new Error("useShopData must be used within a ShopDataProvider");
  }
  return context;
}

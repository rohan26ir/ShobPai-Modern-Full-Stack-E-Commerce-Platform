"use client";

import React, { createContext, useContext } from "react";
import { Product } from "@/data/products";
import { Category } from "@/data/categories";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, fetchCategories } from "@/store/slices/shopSlice";

interface ShopDataContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const ShopDataContext = createContext<ShopDataContextType | undefined>(undefined);

export function ShopDataProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { products, categories, loading, error } = useAppSelector(
    (state) => state.shop
  );

  const handleRefreshProducts = async () => {
    await dispatch(fetchProducts()).unwrap().catch(() => {});
  };

  const handleRefreshCategories = async () => {
    await dispatch(fetchCategories()).unwrap().catch(() => {});
  };

  const handleRefreshAll = async () => {
    await Promise.all([
      dispatch(fetchProducts()).unwrap().catch(() => {}),
      dispatch(fetchCategories()).unwrap().catch(() => {}),
    ]);
  };

  return (
    <ShopDataContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        refreshProducts: handleRefreshProducts,
        refreshCategories: handleRefreshCategories,
        refreshAll: handleRefreshAll,
      }}
    >
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

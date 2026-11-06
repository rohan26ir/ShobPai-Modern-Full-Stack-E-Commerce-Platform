"use client";

import React from "react";
import { useProductsManagement } from "@/components/dashboard/products/useProductsManagement";
import { ProductsHeader } from "@/components/dashboard/products/ProductsHeader";
import { ProductsStatsCards } from "@/components/dashboard/products/ProductsStatsCards";
import { ProductsToolbar } from "@/components/dashboard/products/ProductsToolbar";
import { ProductsTable } from "@/components/dashboard/products/ProductsTable";
import { ProductsPagination } from "@/components/dashboard/products/ProductsPagination";
import { ProductDetailModal } from "@/components/dashboard/products/ProductDetailModal";
import { ProductFormModal } from "@/components/dashboard/products/ProductFormModal";

export default function ProductsPage() {
  const {
    token,
    refreshProducts,
    searchTerm,
    setSearchTerm,
    selectedTimeFilter,
    setSelectedTimeFilter,
    selectedIds,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedProducts,
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
  } = useProductsManagement();

  return (
    <div className="space-y-5">
      <ProductsHeader />

      {/* Real Performance Metrics Cards filtered by Timeframe */}
      <ProductsStatsCards
        stats={currentStats}
        selectedTimeFilter={selectedTimeFilter}
        onTimeFilterChange={setSelectedTimeFilter}
        loading={statsLoading}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xs">
        <ProductsToolbar
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          selectedTimeFilter={selectedTimeFilter}
          onTimeFilterChange={setSelectedTimeFilter}
        />

        <ProductsTable
          products={paginatedProducts}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onToggleSelect={handleToggleSelect}
          onView={setViewingProduct}
          onEdit={setEditingProduct}
          onDelete={handleDeleteProduct}
        />

        <ProductsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <ProductDetailModal
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
        onEdit={(prod) => {
          setViewingProduct(null);
          setEditingProduct(prod);
        }}
      />

      {(isAddingProduct || editingProduct) && (
        <ProductFormModal
          isOpen={isAddingProduct || !!editingProduct}
          initialData={editingProduct || undefined}
          token={token}
          onClose={() => {
            setIsAddingProduct(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            setIsAddingProduct(false);
            setEditingProduct(null);
            refreshProducts?.();
          }}
        />
      )}
    </div>
  );
}

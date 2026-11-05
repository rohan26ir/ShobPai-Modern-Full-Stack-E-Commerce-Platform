"use client";

import React from "react";
import { RotateCw, FolderOpen } from "lucide-react";
import { useCategoriesManagement } from "@/components/dashboard/categories/useCategoriesManagement";
import { CategoriesHeader } from "@/components/dashboard/categories/CategoriesHeader";
import { CategoriesKpiCards } from "@/components/dashboard/categories/CategoriesKpiCards";
import { CategoriesToolbar } from "@/components/dashboard/categories/CategoriesToolbar";
import { CategoriesTable } from "@/components/dashboard/categories/CategoriesTable";
import { CategoriesGrid } from "@/components/dashboard/categories/CategoriesGrid";
import { CategoriesPagination } from "@/components/dashboard/categories/CategoriesPagination";
import { CategoryDetailModal } from "@/components/dashboard/categories/CategoryDetailModal";
import { CategoryFormModal } from "@/components/dashboard/categories/CategoryFormModal";
import { DeleteCategoryDialog } from "@/components/dashboard/categories/DeleteCategoryDialog";

export default function CategoriesPage() {
  const {
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
  } = useCategoriesManagement();

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <CategoriesHeader loading={loading} onRefresh={loadCategories} />

      <CategoriesKpiCards
        totalCategories={categoriesList.length}
        totalProductsCount={totalProductsCount}
        avgProductsPerCat={avgProductsPerCat}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xs">
        <CategoriesToolbar
          totalCount={filteredCategories.length}
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          onAddOpen={() => setIsAdding(true)}
          selectedTimeFilter={selectedTimeFilter}
          onTimeFilterChange={setSelectedTimeFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <RotateCw className="w-6 h-6 animate-spin text-[#ff6c2f]" />
            <span>Loading categories catalog...</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                No categories found
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                {searchTerm
                  ? `No matches for "${searchTerm}". Try a different search query.`
                  : "No categories currently exist. Click 'Add New Category' to create one."}
              </p>
            </div>
          </div>
        ) : viewMode === "table" ? (
          <CategoriesTable
            categories={paginatedCategories}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onToggleSelect={handleToggleSelect}
            onView={setViewingCategory}
            onEdit={setEditingCategory}
            onDelete={setDeletingCategory}
          />
        ) : (
          <CategoriesGrid
            categories={paginatedCategories}
            onView={setViewingCategory}
            onEdit={setEditingCategory}
            onDelete={setDeletingCategory}
          />
        )}

        <CategoriesPagination
          totalItems={filteredCategories.length}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <CategoryDetailModal
        category={viewingCategory}
        onClose={() => setViewingCategory(null)}
        onEdit={(cat) => {
          setViewingCategory(null);
          setEditingCategory(cat);
        }}
      />

      {(isAdding || editingCategory) && (
        <CategoryFormModal
          isOpen={true}
          isEdit={!!editingCategory}
          initialData={editingCategory}
          onClose={() => {
            setIsAdding(false);
            setEditingCategory(null);
          }}
          onSuccess={async () => {
            setIsAdding(false);
            setEditingCategory(null);
            await loadCategories();
          }}
          token={token}
        />
      )}

      <DeleteCategoryDialog
        category={deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
}

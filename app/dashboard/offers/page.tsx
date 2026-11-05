"use client";

import React from "react";
import { useOffersManagement } from "@/components/dashboard/offers/useOffersManagement";
import { OffersPageHeader } from "@/components/dashboard/offers/OffersPageHeader";
import { OffersKpiCards } from "@/components/dashboard/offers/OffersKpiCards";
import { OffersFilterToolbar } from "@/components/dashboard/offers/OffersFilterToolbar";
import { OffersTable } from "@/components/dashboard/offers/OffersTable";
import { OffersGrid } from "@/components/dashboard/offers/OffersGrid";
import { OffersPagination } from "@/components/dashboard/offers/OffersPagination";
import { CreateEditOfferModal } from "@/components/dashboard/offers/CreateEditOfferModal";
import { DeleteOfferDialog } from "@/components/dashboard/offers/DeleteOfferDialog";
import { CouponData } from "@/components/dashboard/offers/offers.types";

export default function OffersPage() {
  const {
    token,
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
  } = useOffersManagement();

  const handleModalSuccess = (savedCoupon: CouponData, isEdit: boolean) => {
    if (isEdit) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === savedCoupon.id ? savedCoupon : c))
      );
    } else {
      setCoupons((prev) => [savedCoupon, ...prev]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <OffersPageHeader
        onExportCSV={handleExportCSV}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        loading={loading}
        onCreateOpen={() => {
          setEditingCoupon(null);
          setIsCreateOpen(true);
        }}
      />

      <OffersKpiCards stats={stats} />

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-2xs p-4 sm:p-5 space-y-4">
        <OffersFilterToolbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stats={stats}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onResetPage={() => setCurrentPage(1)}
        />

        {viewMode === "table" ? (
          <OffersTable
            coupons={paginatedCoupons}
            selectedIds={selectedIds}
            copiedCode={copiedCode}
            onSelectAll={handleSelectAll}
            onToggleSelect={handleToggleSelect}
            onCopyCode={handleCopyCode}
            onToggleActive={handleToggleActive}
            onEdit={(coupon) => setEditingCoupon(coupon)}
            onDelete={(coupon) => setDeletingCoupon(coupon)}
          />
        ) : (
          <OffersGrid
            paginatedCoupons={paginatedCoupons}
            copiedCode={copiedCode}
            onCopyCode={handleCopyCode}
            onToggleActive={handleToggleActive}
            onOpenEdit={(coupon) => setEditingCoupon(coupon)}
            onDelete={(coupon) => setDeletingCoupon(coupon)}
            onOpenCreate={() => {
              setEditingCoupon(null);
              setIsCreateOpen(true);
            }}
          />
        )}

        <OffersPagination
          totalItems={filteredCoupons.length}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <CreateEditOfferModal
        isOpen={isCreateOpen || !!editingCoupon}
        editingCoupon={editingCoupon}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingCoupon(null);
        }}
        token={token}
        onSuccess={handleModalSuccess}
      />

      <DeleteOfferDialog
        deletingCoupon={deletingCoupon}
        onClose={() => setDeletingCoupon(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

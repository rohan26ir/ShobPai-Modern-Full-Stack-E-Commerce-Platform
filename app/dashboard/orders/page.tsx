"use client";

import React from "react";
import { CustomerOrdersView } from "@/components/dashboard/customer/CustomerOrdersView";
import { OrdersKpiCards } from "@/components/dashboard/orders/OrdersKpiCards";
import { OrdersFilterToolbar } from "@/components/dashboard/orders/OrdersFilterToolbar";
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";
import { OrdersPagination } from "@/components/dashboard/orders/OrdersPagination";
import { EditOrderModal } from "@/components/dashboard/orders/EditOrderModal";
import { OrderDetailDrawer } from "@/components/dashboard/orders/OrderDetailDrawer";
import { InvoicePreviewModal } from "@/components/dashboard/orders/InvoicePreviewModal";
import { useOrdersManagement } from "@/components/dashboard/orders/useOrdersManagement";

export default function OrdersPage() {
  const m = useOrdersManagement();

  // If customer role, render dedicated customer order tracking view
  if (!m.isAdmin) {
    return <CustomerOrdersView user={m.user} token={m.token} />;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Top 4 Metric KPI Cards */}
      <OrdersKpiCards stats={m.stats} />

      {/* 2. Main Orders Card Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        {/* Status Filter Tab Pills & Controls Bar */}
        <OrdersFilterToolbar
          statusFilter={m.statusFilter}
          setStatusFilter={m.setStatusFilter}
          tabCounts={m.tabCounts}
          search={m.search}
          setSearch={m.setSearch}
          paymentFilter={m.paymentFilter}
          setPaymentFilter={m.setPaymentFilter}
          sortOrder={m.sortOrder}
          setSortOrder={m.setSortOrder}
          loading={m.loading}
          handleRefresh={m.handleRefresh}
        />

        {/* 3. Orders Table */}
        <OrdersTable
          orders={m.filteredOrders}
          isInitialLoading={m.isInitialLoading}
          search={m.search}
          selectedIds={m.selectedIds}
          onSelectAll={m.handleSelectAll}
          onToggleSelect={m.handleToggleSelect}
          onView={(order) => m.setViewingOrder(order)}
          onEdit={(order) => m.openEditModal(order)}
          onDownloadPdf={(order) => m.handleGeneratePdf(order)}
          generatingPdfId={m.generatingPdfId}
          customDeliveryOverrides={m.customDeliveryOverrides}
        />

        {/* 4. Pagination Footer */}
        <OrdersPagination
          totalItems={m.filteredOrders.length}
          pageSize={m.pageSize}
          currentPage={m.currentPage}
          totalPages={m.totalPages}
          onPageChange={m.setPage}
        />
      </div>

      {/* 5. Modals & Drawers */}
      <EditOrderModal
        order={m.editingOrder}
        onClose={() => m.setEditingOrder(null)}
        editStatus={m.editStatus}
        setEditStatus={m.setEditStatus}
        editPaymentStatus={m.editPaymentStatus}
        setEditPaymentStatus={m.setEditPaymentStatus}
        editDeliveryDate={m.editDeliveryDate}
        setEditDeliveryDate={m.setEditDeliveryDate}
        editDeliveryNote={m.editDeliveryNote}
        setEditDeliveryNote={m.setEditDeliveryNote}
        extendDeliveryDays={m.extendDeliveryDays}
        onSave={m.handleSaveOrderEdit}
        savingEdit={m.savingEdit}
      />

      <OrderDetailDrawer
        order={m.viewingOrder}
        onClose={() => m.setViewingOrder(null)}
        onDownloadPdf={(order) => m.handleGeneratePdf(order)}
        isGeneratingPdf={m.generatingPdfId === m.viewingOrder?.id}
        customDeliveryOverride={m.viewingOrder ? m.customDeliveryOverrides[m.viewingOrder.id] : undefined}
      />

      <InvoicePreviewModal
        order={m.invoiceModalOrder}
        onClose={() => m.setInvoiceModalOrder(null)}
        onDownloadPdf={(order) => m.handleGeneratePdf(order)}
        isGeneratingPdf={m.generatingPdfId === m.invoiceModalOrder?.id}
      />
    </div>
  );
}

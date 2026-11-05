import toast from "react-hot-toast";
import { CouponData, OffersKpiStats } from "./offers.types";

export function calculateOffersKpi(coupons: CouponData[]): OffersKpiStats {
  const totalCount = coupons.length;
  const activeCount = coupons.filter((c) => c.isActive).length;
  const pausedCount = totalCount - activeCount;
  const thirtyDaysAhead = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const expiringSoonCount = coupons.filter(
    (c) => c.expiresAt && new Date(c.expiresAt).getTime() <= thirtyDaysAhead
  ).length;
  const maxDiscount = totalCount > 0 ? Math.max(...coupons.map((c) => c.discountPercentage)) : 0;
  const avgDiscount =
    totalCount > 0
      ? Math.round(coupons.reduce((acc, c) => acc + c.discountPercentage, 0) / totalCount)
      : 0;
  const activePercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

  return {
    totalCount,
    activeCount,
    pausedCount,
    expiringSoonCount,
    maxDiscount,
    avgDiscount,
    activePercent,
  };
}

export function exportCouponsToCsv(coupons: CouponData[]): void {
  if (coupons.length === 0) {
    toast.error("No coupons available to export");
    return;
  }

  const headers = [
    "ID",
    "Coupon Code",
    "Discount (%)",
    "Min Spend ($)",
    "Status",
    "Expires At",
    "Description",
  ];
  const rows = coupons.map((c) => [
    `"${c.id}"`,
    `"${c.code}"`,
    c.discountPercentage,
    c.minSpend || 0,
    c.isActive ? "Active" : "Paused",
    c.expiresAt ? `"${new Date(c.expiresAt).toLocaleDateString()}"` : '"Never"',
    `"${(c.description || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `offers_export_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success("Exported offers CSV successfully!");
}


export interface CouponData {
  id: string;
  code: string;
  discountPercentage: number;
  minSpend: number;
  description: string;
  isActive: boolean;
  expiresAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type OffersTab = "all" | "active" | "paused" | "expiring";
export type OffersSortOrder = "newest" | "highest" | "lowest" | "minSpend";
export type OffersViewMode = "table" | "grid";

export interface OffersKpiStats {
  totalCount: number;
  activeCount: number;
  pausedCount: number;
  expiringSoonCount: number;
  maxDiscount: number;
  avgDiscount: number;
  activePercent: number;
}

export interface CouponFormData {
  code: string;
  discount: string;
  minSpend: string;
  description: string;
  isActive: boolean;
  expiresAt: string;
}


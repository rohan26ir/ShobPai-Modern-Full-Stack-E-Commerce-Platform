export interface Coupon {
  code: string;
  discountPercentage: number;
  minSpend: number;
  description: string;
}

// Coupons are validated dynamically against the Neon PostgreSQL database via api.validateCoupon()
export const availableCoupons: Coupon[] = [];

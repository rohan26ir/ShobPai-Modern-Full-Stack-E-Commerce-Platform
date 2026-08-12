export interface Coupon {
  code: string;
  discountPercentage: number;
  minSpend: number;
  description: string;
}

export const availableCoupons: Coupon[] = [
  {
    code: "FRESH2026",
    discountPercentage: 15,
    minSpend: 20,
    description: "15% OFF on all fresh organic produce orders over $20",
  },
  {
    code: "VEGIST10",
    discountPercentage: 10,
    minSpend: 0,
    description: "10% OFF welcome coupon for new shoppers",
  },
  {
    code: "ORGANIC20",
    discountPercentage: 20,
    minSpend: 50,
    description: "20% OFF mega savings on orders over $50",
  },
];

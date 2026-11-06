import { Product } from "@/data/products";

export interface TableProduct extends Product {
  sizesDisplay?: string;
  itemsLeft?: number;
  itemsSold?: number;
}

export type ProductTimeFilter = "This Month" | "This Week" | "Today" | "All Time";

export interface ProductTimeframeStat {
  totalProducts: number;
  productLeft: number;
  productSold: number;
  soldAmount: number;
}

export interface AggregatedProductStats {
  allTime: ProductTimeframeStat;
  thisMonth: ProductTimeframeStat;
  thisWeek: ProductTimeframeStat;
  today: ProductTimeframeStat;
}

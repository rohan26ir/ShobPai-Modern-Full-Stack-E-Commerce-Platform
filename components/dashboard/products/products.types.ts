import { Product } from "@/data/products";

export interface TableProduct extends Product {
  sizesDisplay?: string;
  itemsLeft?: number;
  itemsSold?: number;
}

export type ProductTimeFilter = "This Month" | "This Week" | "Today" | "All Time";


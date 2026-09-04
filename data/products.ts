export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  categoryName: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  sold?: number;
  unit: string;
  description: string;
  shortDescription: string;
  nutritionalBenefits?: string[];
  storage?: string;
  shelfLife?: string;
  certifications?: string;
  isTrending?: boolean;
  isFeatured?: boolean;
  isDealOfDay?: boolean;
  badge?: string;
  saleEndsIn?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

// Live products are fetched directly from the Neon PostgreSQL database via api.getProducts()
export const products: Product[] = [];

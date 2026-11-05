export interface ProductAddFormData {
  name: string;
  slug: string;
  category: string;
  price: number | "";
  buyingPrice: number | "";
  originalPrice: number | "";
  discount: number | "";
  stock: number | "";
  unit: string;
  sku: string;
  badge: string;
  shortDesc: string;
  description: string;
  storage: string;
  shelfLife: string;
  certifications: string;
  nutritionalBenefits: string[];
  isFeatured: boolean;
  isTrending: boolean;
  isDealOfDay: boolean;
  images: string[];
}

export interface PresetProductTemplate {
  label: string;
  category: string;
  name: string;
  unit: string;
  price: number;
  buyingPrice: number;
  originalPrice: number;
  discount?: number;
  stock: number;
  badge: string;
  storage: string;
  shelfLife: string;
  certifications: string;
  shortDesc: string;
  description: string;
  nutritionalBenefits: string[];
  images: string[];
}


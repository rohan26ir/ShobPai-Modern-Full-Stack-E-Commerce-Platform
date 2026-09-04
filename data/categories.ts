export interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  description?: string;
  image: string;
  bgColor: string;
}

// Live categories are fetched directly from the Neon PostgreSQL database via api.getCategories()
export const categories: Category[] = [];
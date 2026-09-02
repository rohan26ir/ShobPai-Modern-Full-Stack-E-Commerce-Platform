export interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  description?: string;
  image: string;
  bgColor: string;
}

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Fresh Fruits",
    slug: "fresh-fruits",
    itemCount: 48,
    description: "Farm-fresh organic fruits and seasonal picks",
    image: "/category/fresh_fruits.jpg",
    bgColor: "bg-emerald-50 text-emerald-800 border-emerald-100",
  },
  {
    id: "cat-2",
    name: "Fast Food",
    slug: "fast-food",
    itemCount: 35,
    description: "Burgers, pizzas, tacos, and quick bites",
    image: "/category/fast_food.jpg",
    bgColor: "bg-amber-50 text-amber-800 border-amber-100",
  },
  {
    id: "cat-3",
    name: "Gadgets & Tech",
    slug: "gadgets",
    itemCount: 52,
    description: "Smartphones, accessories, and modern electronics",
    image: "/category/gadgets_tech.jpg",
    bgColor: "bg-indigo-50 text-indigo-800 border-indigo-100",
  },
  {
    id: "cat-4",
    name: "Clothing & Apparel",
    slug: "clothing",
    itemCount: 84,
    description: "Men's, women's, and kids' trendy everyday fashion",
    image: "/category/clothing_apparel.jpg",
    bgColor: "bg-violet-50 text-violet-800 border-violet-100",
  },
  {
    id: "cat-5",
    name: "Beauty & Personal Care",
    slug: "beauty-care",
    itemCount: 29,
    description: "Skincare, cosmetics, and self-care essentials",
    image: "/category/beauty_personal_care.jpg",
    bgColor: "bg-rose-50 text-rose-800 border-rose-100",
  },
  {
    id: "cat-6",
    name: "Home & Living",
    slug: "home-living",
    itemCount: 41,
    description: "Home decor, kitchenware, and furniture pieces",
    image: "/category/home-living.avif",
    bgColor: "bg-teal-50 text-teal-800 border-teal-100",
  },
  {
    id: "cat-7",
    name: "Sports & Fitness",
    slug: "sports-fitness",
    itemCount: 23,
    description: "Workout gear, equipment, and sportswear",
    image: "/category/sports_fitness.jpg",
    bgColor: "bg-sky-50 text-sky-800 border-sky-100",
  },
  {
    id: "cat-8",
    name: "Books & Stationery",
    slug: "books-stationery",
    itemCount: 38,
    description: "Best-selling novels, journals, and office supplies",
    image: "/category/books_stationery.jpg",
    bgColor: "bg-amber-100/60 text-amber-900 border-amber-200",
  },
];
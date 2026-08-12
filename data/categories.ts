export interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  image: string;
  bgColor: string;
}

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Fresh Fruits",
    slug: "fresh-fruits",
    itemCount: 48,
    image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&auto=format&fit=crop&q=80",
    bgColor: "bg-amber-50 text-amber-800 border-amber-100",
  },
  {
    id: "cat-2",
    name: "Fresh Vegetables",
    slug: "vegetables",
    itemCount: 64,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80",
    bgColor: "bg-emerald-50 text-emerald-800 border-emerald-100",
  },
  {
    id: "cat-3",
    name: "Dairy & Cheese",
    slug: "dairy",
    itemCount: 32,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80",
    bgColor: "bg-yellow-50 text-yellow-800 border-yellow-100",
  },
  {
    id: "cat-4",
    name: "Bakery & Breads",
    slug: "bakery",
    itemCount: 28,
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&auto=format&fit=crop&q=80",
    bgColor: "bg-orange-50 text-orange-800 border-orange-100",
  },
  {
    id: "cat-5",
    name: "Cold Juices",
    slug: "beverages",
    itemCount: 22,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&auto=format&fit=crop&q=80",
    bgColor: "bg-lime-50 text-lime-800 border-lime-100",
  },
  {
    id: "cat-6",
    name: "Organic Meat",
    slug: "meat",
    itemCount: 19,
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&auto=format&fit=crop&q=80",
    bgColor: "bg-red-50 text-red-800 border-red-100",
  },
  {
    id: "cat-7",
    name: "Honey & Jams",
    slug: "honey",
    itemCount: 15,
    image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=400&auto=format&fit=crop&q=80",
    bgColor: "bg-amber-100/50 text-amber-900 border-amber-200",
  },
  {
    id: "cat-8",
    name: "Fresh Seafood",
    slug: "seafood",
    itemCount: 26,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&auto=format&fit=crop&q=80",
    bgColor: "bg-sky-50 text-sky-800 border-sky-100",
  },
];

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

export const products: Product[] = [
  {
    id: "1",
    name: "Fresh Red Organic Tomatoes",
    slug: "fresh-red-organic-tomatoes",
    price: 3.50,
    originalPrice: 4.80,
    discount: 27,
    images: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?q=80&w=1170&auto=format&fit=crop&q=80"
    ],
    category: "vegetables",
    categoryName: "Fresh Vegetables",
    rating: 4.9,
    reviewsCount: 38,
    stock: 85,
    sold: 142,
    unit: "500g",
    description: "Hand-picked farm fresh organic red tomatoes, rich in lycopene and vitamin C. Grown without synthetic pesticides for authentic natural taste.",
    shortDescription: "Plump, juicy organic tomatoes directly harvested from local farms.",
    isTrending: true,
    isFeatured: true,
    badge: "Bestseller",
    saleEndsIn: { days: 8632, hours: 3, minutes: 4, seconds: 50 },
  },
  {
    id: "2",
    name: "Organic Crisp Fuji Apples",
    slug: "organic-crisp-fuji-apples",
    price: 4.20,
    originalPrice: 5.50,
    discount: 23,
    images: [
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fresh-fruits",
    categoryName: "Fresh Fruits",
    rating: 4.8,
    reviewsCount: 52,
    stock: 64,
    sold: 98,
    unit: "1 kg",
    description: "Sweet and crunchy organic Fuji apples harvested from high-altitude mountain orchards.",
    shortDescription: "Crisp and juicy sweet Fuji apples.",
    isTrending: true,
    isDealOfDay: true,
    badge: "Sale",
    saleEndsIn: { days: 142, hours: 12, minutes: 30, seconds: 15 },
  },
  {
    id: "3",
    name: "Wild Organic Forest Honey",
    slug: "wild-organic-forest-honey",
    price: 12.90,
    originalPrice: 15.00,
    discount: 14,
    images: [
      "https://images.unsplash.com/photo-1603445215995-fb465c635535?q=80&w=1631&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622006979077-afc14f833d4e?q=80&w=880&auto=format&fit=crop&q=80"
    ],
    category: "honey-jams",
    categoryName: "Honey & Jams",
    rating: 5.0,
    reviewsCount: 19,
    stock: 30,
    sold: 45,
    unit: "350g",
    description: "Raw unfiltered organic forest honey collected from wild wildflowers.",
    shortDescription: "Pure raw unpasteurized wild honey.",
    isFeatured: true,
    badge: "Hot",
    saleEndsIn: { days: 450, hours: 8, minutes: 15, seconds: 0 },
  },
  {
    id: "4",
    name: "Fresh Seafoods Mussels & Prawns",
    slug: "fresh-seafoods-mussels-prawns",
    price: 18.00,
    originalPrice: 44.00,
    discount: 59,
    images: [
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&auto=format&fit=crop&q=80"
    ],
    category: "meat-seafood",
    categoryName: "Fresh Seafood",
    rating: 4.7,
    reviewsCount: 24,
    stock: 12,
    sold: 66,
    unit: "1 kg",
    description: "Ocean fresh wild-caught black mussels and king prawns delivered on crushed ice.",
    shortDescription: "Sustainably caught ocean seafood package.",
    isTrending: true,
    isFeatured: true,
    badge: "59% OFF",
    saleEndsIn: { days: 215, hours: 6, minutes: 42, seconds: 18 },
  },
  {
    id: "5",
    name: "Cold Pressed Orange & Carrot Juice",
    slug: "cold-pressed-orange-carrot-juice",
    price: 3.99,
    originalPrice: 4.99,
    discount: 20,
    images: [
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beverages",
    categoryName: "Cold Juices",
    rating: 4.6,
    reviewsCount: 15,
    stock: 40,
    sold: 80,
    unit: "500 ml",
    description: "100% pure raw cold-pressed citrus juice with zero added sugar or preservatives.",
    shortDescription: "Vitamin C packed immune booster juice.",
    isTrending: true,
    saleEndsIn: { days: 88, hours: 18, minutes: 20, seconds: 40 },
  },
  {
    id: "6",
    name: "Artisan Whole Wheat Sourdough Bread",
    slug: "artisan-whole-wheat-sourdough-bread",
    price: 4.80,
    originalPrice: 6.00,
    discount: 20,
    images: [
      "https://images.unsplash.com/photo-1771160962771-00186d83364e?q=80&w=1074&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1785502108690-52e3dc5e918b?q=80&w=880&auto=format&fit=crop&q=80"
    ],
    category: "bakery",
    categoryName: "Bakery & Breads",
    rating: 4.9,
    reviewsCount: 41,
    stock: 25,
    sold: 110,
    unit: "1 loaf",
    description: "Traditional 24-hour slow fermented organic sourdough loaf baked daily in stone hearth ovens.",
    shortDescription: "Crispy crust and soft airy sourdough interior.",
    isFeatured: true,
    badge: "Organic",
    saleEndsIn: { days: 52, hours: 4, minutes: 10, seconds: 5 },
  },
  {
    id: "7",
    name: "Grass-Fed Farm Aged Cheddar Cheese",
    slug: "grass-fed-farm-aged-cheddar-cheese",
    price: 7.50,
    originalPrice: 9.00,
    discount: 16,
    images: [
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&auto=format&fit=crop&q=80"
    ],
    category: "dairy",
    categoryName: "Dairy & Cheese",
    rating: 4.8,
    reviewsCount: 33,
    stock: 35,
    sold: 72,
    unit: "250g",
    description: "Rich and tangy mature cheddar cheese aged for 12 months from grass-fed cows.",
    shortDescription: "Artisanal 12-month aged vintage cheddar cheese.",
    isTrending: true,
    saleEndsIn: { days: 310, hours: 14, minutes: 55, seconds: 33 },
  },
  {
    id: "8",
    name: "Organic Hass Avocado Pack",
    slug: "organic-hass-avocado-pack",
    price: 5.99,
    originalPrice: 7.50,
    discount: 20,
    images: [
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fresh-fruits",
    categoryName: "Fresh Fruits",
    rating: 4.9,
    reviewsCount: 67,
    stock: 50,
    sold: 180,
    unit: "3 pcs",
    description: "Creamy, nutrient-rich organic Hass avocados perfect for guacamole, salads, and toasts.",
    shortDescription: "Creamy perfectly ripe organic Hass avocados.",
    isTrending: true,
    isFeatured: true,
    badge: "Popular",
    saleEndsIn: { days: 999, hours: 9, minutes: 9, seconds: 9 },
  }
];

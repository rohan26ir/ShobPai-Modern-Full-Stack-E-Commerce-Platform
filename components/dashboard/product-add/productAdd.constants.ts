import { PresetProductTemplate, ProductAddFormData } from "./productAdd.types";

export const DEFAULT_PRODUCT_ADD_FORM: ProductAddFormData = {
  name: "",
  slug: "",
  category: "fresh-fruits",
  price: 4.2,
  buyingPrice: 2.6,
  originalPrice: 5.5,
  discount: 24,
  stock: 60,
  unit: "1 kg",
  sku: "",
  badge: "Trending",
  shortDesc: "",
  description: "",
  storage: "Refrigerate at 4°C - 8°C",
  shelfLife: "5 - 7 Days",
  certifications: "100% USDA Organic",
  nutritionalBenefits: [
    "Rich In Dietary Fibre – Supports healthy digestion and bowel regularity.",
    "High in Natural Energy – Natural glucose and fructose for an instant revitalizing boost.",
    "Packed with Essential Minerals – Potassium, calcium, and magnesium for vitality.",
    "Loaded with Antioxidants – Protects cells from oxidative stress and supports heart health.",
  ],
  isFeatured: true,
  isTrending: true,
  isDealOfDay: false,
  images: [
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80",
  ],
};

export const SAMPLE_PRESET_IMAGES = [
  {
    category: "Fresh Fruits",
    name: "Organic Fuji Apples",
    url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80",
  },
  {
    category: "Fresh Fruits",
    name: "Apples Orchard Basket",
    url: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&auto=format&fit=crop&q=80",
  },
  {
    category: "Fresh Produce",
    name: "Red Tomatoes",
    url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
  },
  {
    category: "Fresh Produce",
    name: "Green Broccoli",
    url: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80",
  },
  {
    category: "Groceries",
    name: "Fresh Fruits Basket",
    url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80",
  },
  {
    category: "Beverages",
    name: "Fresh Orange Juice",
    url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80",
  },
];

export const PRESET_TEMPLATES: PresetProductTemplate[] = [
  {
    label: "Organic Crisp Fuji Apples (Like Detail Page)",
    category: "fresh-fruits",
    name: "Organic Crisp Fuji Apples",
    unit: "1 kg",
    price: 4.2,
    buyingPrice: 2.6,
    originalPrice: 5.5,
    stock: 60,
    badge: "Trending",
    storage: "Refrigerate at 4°C - 8°C",
    shelfLife: "5 - 7 Days",
    certifications: "100% USDA Organic",
    shortDesc: "Sweet, crisp and pesticide-free fresh orchard apples with golden blush.",
    description:
      "Organic Crisp Fuji Apples are carefully sourced from certified organic farms, celebrated for cultivating the finest produce. Each item is meticulously hand-picked at the perfect stage of ripeness to ensure superior quality, uniform size, and a naturally deep, authentic hue. 100% natural and free from artificial colors, flavors, or preservatives, retaining their authentic taste and rich nutritional goodness.",
    nutritionalBenefits: [
      "Rich In Dietary Fibre – Supports healthy digestion and helps maintain bowel regularity.",
      "High in Natural Energy – Contains natural sugars like glucose, fructose, and sucrose that provide an instant energy boost.",
      "Packed with Essential Minerals – A good source of potassium, magnesium, calcium, and iron for vitality.",
      "Loaded with Antioxidants – Helps protect cells from oxidative stress and supports heart health.",
      "Promotes Bone Strength – Presence of minerals contributes to strong and healthy bones.",
      "Supports Heart Health – Low in fat and cholesterol-free, aids in maintaining healthy cholesterol levels.",
      "Boosts Immunity – Natural nutrients, vitamins, and antioxidants enhance the body's immune defense system.",
      "Improves Brain Function – Rich in natural compounds that may help enhance memory and cognitive performance.",
    ],
    images: [
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    label: "Fresh Farm Organic Tomatoes",
    category: "vegetables",
    name: "Fresh Red Organic Tomatoes",
    unit: "500g",
    price: 3.5,
    buyingPrice: 2.1,
    originalPrice: 4.8,
    stock: 85,
    badge: "Bestseller",
    storage: "Cool dry place (12°C - 15°C)",
    shelfLife: "4 - 6 Days",
    certifications: "Non-GMO & Organic Certified",
    shortDesc: "Plump, juicy vine-ripened organic red tomatoes harvested at dawn.",
    description:
      "Hand-picked farm fresh organic red tomatoes, rich in lycopene and vitamin C. Ideal for fresh salads, slow-simmered artisanal sauces, and wholesome daily home cooking.",
    nutritionalBenefits: [
      "High in Lycopene – Powerful natural antioxidant that protects against cardiovascular diseases.",
      "Rich in Vitamin C & K – Promotes collagen production, tissue repair, and immune wellness.",
      "Natural Hydration – 95% water content supports optimal daily cellular hydration.",
    ],
    images: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
    ],
  },
];

export const NUTRITION_SUGGESTIONS = [
  "Rich In Dietary Fibre – Supports healthy digestion and helps maintain bowel regularity.",
  "High in Natural Energy – Provides an instant natural revitalizing energy boost.",
  "Packed with Essential Minerals – A rich source of potassium, magnesium, and iron.",
  "Loaded with Antioxidants – Helps protect cells from oxidative stress and supports cellular health.",
  "100% Pesticide-Free – Cultivated following strict organic regenerative agriculture standards.",
  "Low Calorie & Heart Healthy – Zero trans fats and naturally low in sodium.",
];

import { CategoryColorPreset, CategoryImagePreset } from "./categories.types";

export const COLOR_PRESETS: CategoryColorPreset[] = [
  { label: "Emerald Green", value: "bg-emerald-50 text-emerald-800 border-emerald-100", dot: "bg-emerald-500" },
  { label: "Warm Amber", value: "bg-amber-50 text-amber-800 border-amber-100", dot: "bg-amber-500" },
  { label: "Citrus Orange", value: "bg-orange-50 text-orange-800 border-orange-100", dot: "bg-orange-500" },
  { label: "Berry Purple", value: "bg-purple-50 text-purple-800 border-purple-100", dot: "bg-purple-500" },
  { label: "Sky Blue", value: "bg-blue-50 text-blue-800 border-blue-100", dot: "bg-blue-500" },
  { label: "Rose Pink", value: "bg-rose-50 text-rose-800 border-rose-100", dot: "bg-rose-500" },
];

export const IMAGE_PRESETS: CategoryImagePreset[] = [
  { label: "Vegetables", url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80" },
  { label: "Fruits", url: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80" },
  { label: "Dairy & Eggs", url: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=600&auto=format&fit=crop&q=80" },
  { label: "Grains & Nuts", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
  { label: "Oils & Honey", url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80" },
  { label: "Beverages", url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80" },
];

export const SUPPORTED_IMAGE_TYPES = [
  "image/webp",
  "image/avif",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
  "image/gif",
];


import { ProductAddFormData } from "./productAdd.types";
import { PRESET_TEMPLATES } from "./productAdd.constants";
import { Category } from "@/data/categories";

export function calculateProfitMargins(
  price: number | "",
  buyingPrice: number | "",
  stock: number | ""
) {
  const numericPrice = typeof price === "number" ? price : parseFloat(String(price)) || 0;
  const numericBuying =
    typeof buyingPrice === "number" ? buyingPrice : parseFloat(String(buyingPrice)) || 0;
  const numericStock = typeof stock === "number" ? stock : parseInt(String(stock)) || 0;
  const unitProfit = numericPrice > 0 && numericBuying > 0 ? numericPrice - numericBuying : 0;
  const marginPct =
    numericPrice > 0 && numericBuying > 0
      ? ((unitProfit / numericPrice) * 100).toFixed(1)
      : "0.0";
  const projectedTotalProfit = unitProfit * numericStock;

  return {
    numericPrice,
    numericBuying,
    numericStock,
    unitProfit,
    marginPct,
    projectedTotalProfit,
  };
}

export function buildProductCreatePayload(
  form: ProductAddFormData,
  categories?: Category[]
) {
  const { numericPrice, numericBuying, numericStock } = calculateProfitMargins(
    form.price,
    form.buyingPrice,
    form.stock
  );

  const slug =
    form.slug.trim() ||
    form.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");

  const categoryRecord = categories?.find(
    (c) => c.slug === form.category || c.id === form.category
  );
  const categoryName =
    categoryRecord?.name ||
    form.category.charAt(0).toUpperCase() + form.category.slice(1);

  return {
    name: form.name.trim(),
    slug,
    category: form.category,
    categoryName,
    price: numericPrice,
    buyingPrice: numericBuying > 0 ? numericBuying : undefined,
    originalPrice: Number(form.originalPrice) || numericPrice,
    stock: numericStock,
    unit: form.unit.trim() || "1 kg",
    images: form.images.length > 0 ? form.images : [PRESET_TEMPLATES[0].images[0]],
    badge: form.badge.trim() || undefined,
    shortDescription: form.shortDesc.trim() || form.description.slice(0, 120),
    description:
      form.description.trim() ||
      `${form.name} sourced from certified organic local farms.`,
    storage: form.storage.trim() || undefined,
    shelfLife: form.shelfLife.trim() || undefined,
    certifications: form.certifications.trim() || undefined,
    nutritionalBenefits: form.nutritionalBenefits,
    isFeatured: form.isFeatured,
    isTrending: form.isTrending,
    isDealOfDay: form.isDealOfDay,
  };
}


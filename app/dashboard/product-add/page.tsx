"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Check,
  Sparkles,
  ShoppingBag,
  DollarSign,
  Package,
  Layers,
  Tag,
  Eye,
  RotateCw,
  Image as ImageIcon,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useShopData } from "@/context/ShopDataContext";
import { useAppDispatch } from "@/store/hooks";
import { addProduct } from "@/store/slices/shopSlice";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

// Sample high-res preset images for quick selection
const SAMPLE_PRESET_IMAGES = [
  {
    category: "Fashion",
    url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    name: "Black T-Shirt",
  },
  {
    category: "Accessories",
    url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    name: "Leather Bag",
  },
  {
    category: "Electronics",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    name: "Headphones",
  },
  {
    category: "Footwear",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    name: "Red Sneakers",
  },
  {
    category: "Watches",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    name: "Smart Watch",
  },
  {
    category: "Groceries",
    url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80",
    name: "Fresh Fruits Basket",
  },
];

export default function ProductAddPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, isAdmin } = useAuth();
  const { categories, refreshProducts } = useShopData();

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("fashion");
  const [price, setPrice] = useState<number | "">(80);
  const [buyingPrice, setBuyingPrice] = useState<number | "">(45);
  const [originalPrice, setOriginalPrice] = useState<number | "">(100);
  const [stock, setStock] = useState<number | "">(50);
  const [unit, setUnit] = useState("Size : S , M , L , XL");
  const [sku, setSku] = useState("");
  const [badge, setBadge] = useState("New");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");

  // Profit & Margin Calculations
  const numericPrice = typeof price === "number" ? price : parseFloat(String(price)) || 0;
  const numericBuyingPrice = typeof buyingPrice === "number" ? buyingPrice : parseFloat(String(buyingPrice)) || 0;
  const numericStock = typeof stock === "number" ? stock : parseInt(String(stock)) || 0;

  const unitProfit = numericPrice > 0 && numericBuyingPrice > 0 ? numericPrice - numericBuyingPrice : 0;
  const marginPct =
    numericPrice > 0 && numericBuyingPrice > 0
      ? ((unitProfit / numericPrice) * 100).toFixed(1)
      : "0.0";
  const projectedTotalProfit = unitProfit * numericStock;

  // Media
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate SKU
  const handleGenerateSku = () => {
    const catCode = category.slice(0, 3).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    setSku(`SKU-${catCode}-${rand}`);
    toast.success("Generated product SKU!", { icon: "🏷️" });
  };

  // Add Image URL
  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      toast.error("Image already added to gallery");
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setImageUrlInput("");
  };

  // Remove Image
  const handleRemoveImage = (indexToRemove: number) => {
    if (images.length <= 1) {
      toast.error("Product must have at least one image");
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a product title");
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const numericStock = Number(stock) || 0;
    const numericOriginalPrice = Number(originalPrice) || numericPrice;
    const numericBuyingPriceVal = Number(buyingPrice) || 0;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newProductPayload = {
      name: name.trim(),
      slug: slug || `prod-${Date.now()}`,
      category: category.toLowerCase(),
      categoryName:
        category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
      price: numericPrice,
      buyingPrice: numericBuyingPriceVal > 0 ? numericBuyingPriceVal : undefined,
      originalPrice: numericOriginalPrice,
      stock: numericStock,
      unit: unit.trim() || "Size : S , M , L",
      images: images.length > 0 ? images : [SAMPLE_PRESET_IMAGES[0].url],
      badge: badge.trim() || undefined,
      shortDescription:
        shortDesc.trim() || "High quality product crafted with superior materials.",
      description:
        description.trim() ||
        "Designed for long-lasting comfort, modern aesthetic, and premium daily utility.",
    };

    setIsSubmitting(true);
    const toastId = toast.loading("Publishing product to catalog...");

    try {
      if (token && isAdmin) {
        const created = await api.adminCreateProduct(newProductPayload, token);
        dispatch(
          addProduct(created || ({ ...newProductPayload, id: `prod-${Date.now()}` } as any))
        );
      } else {
        dispatch(
          addProduct({ ...newProductPayload, id: `prod-${Date.now()}` } as any)
        );
      }

      await refreshProducts?.();
      toast.success(`Product "${name}" published successfully!`, { id: toastId });
      router.push("/dashboard/products");
    } catch (err: any) {
      // Optimistic fallback
      dispatch(
        addProduct({ ...newProductPayload, id: `prod-${Date.now()}` } as any)
      );
      toast.success(`Product "${name}" saved to catalog!`, { id: toastId });
      router.push("/dashboard/products");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header with Breadcrumbs & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link
              href="/dashboard/products"
              className="hover:text-[#ff6c2f] transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Products</span>
            </Link>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Add Product
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create New Product
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/products"
            className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-9 px-5 rounded-xl bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Publish Product</span>
          </button>
        </div>
      </div>

      {/* 2. Form Grid (8 Cols Left for Product Details, 4 Cols Right for Media & Status) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 of 12 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. General Information Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <ShoppingBag className="w-4 h-4 text-[#ff6c2f]" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                General Information
              </h2>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Classic Combed Cotton T-Shirt"
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
                >
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="electronics">Electronics & Gadgets</option>
                  <option value="footwear">Shoes & Footwear</option>
                  <option value="accessories">Bags & Accessories</option>
                  <option value="groceries">Fresh Produce & Groceries</option>
                  <option value="home">Home & Living</option>
                  {categories?.map((c) => (
                    <option key={c.id || c.slug} value={c.slug || c.name.toLowerCase()}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Promotional Tag / Badge
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
                >
                  <option value="">No Badge</option>
                  <option value="New">New Arrival</option>
                  <option value="Trending">Trending</option>
                  <option value="Hot">Hot Seller</option>
                  <option value="Sale">Special Sale</option>
                  <option value="Organic">100% Organic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Short Summary
              </label>
              <input
                type="text"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Brief one-line highlight (e.g. Classic breathable cotton crewneck)"
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Full Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed specifications, features, materials, and care instructions..."
                className="w-full p-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
              />
            </div>
          </div>

          {/* B. Pricing & Stock Inventory Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <DollarSign className="w-4 h-4 text-[#ff6c2f]" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Pricing & Stock Inventory
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Selling Price ($) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value === "" ? "" : parseFloat(e.target.value))
                    }
                    className="w-full h-10 pl-8 pr-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Buying Price ($) *
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Cost
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={buyingPrice}
                    onChange={(e) =>
                      setBuyingPrice(
                        e.target.value === "" ? "" : parseFloat(e.target.value)
                      )
                    }
                    className="w-full h-10 pl-8 pr-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Original Price ($) (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={originalPrice}
                    onChange={(e) =>
                      setOriginalPrice(
                        e.target.value === "" ? "" : parseFloat(e.target.value)
                      )
                    }
                    className="w-full h-10 pl-8 pr-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                  />
                </div>
              </div>
            </div>

            {/* Profit & Margin Measurement Box */}
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                unitProfit > 0
                  ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/60"
                  : unitProfit < 0
                  ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/80 dark:border-rose-800/60"
                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                    Estimated Profit Per Unit:
                  </span>
                  <span
                    className={`font-extrabold text-sm ${
                      unitProfit > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : unitProfit < 0
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {unitProfit >= 0
                      ? `+$${unitProfit.toFixed(2)}`
                      : `-$${Math.abs(unitProfit).toFixed(2)}`}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      unitProfit > 0
                        ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                        : unitProfit < 0
                        ? "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {marginPct}% margin
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Projected Batch Profit:{" "}
                  <strong className="text-slate-800 dark:text-slate-200 font-bold">
                    $
                    {projectedTotalProfit.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>{" "}
                  ({numericStock} in stock)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Initial Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value === "" ? "" : parseInt(e.target.value))
                  }
                  className="w-full h-10 px-3.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Product SKU Code
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSku}
                    className="text-[11px] text-[#ff6c2f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. SKU-FAS-4821"
                  className="w-full h-10 px-3.5 text-xs font-mono font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                />
              </div>
            </div>

            {/* Units / Sizes */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Units & Sizes (e.g. Size : S , M , L , XL or 1 kg / 500g)
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Size : S , M , L , XL"
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
              />
            </div>
          </div>
        </div>

        {/* Right Column (4 of 12 cols): Images & Live Card Preview */}
        <div className="lg:col-span-4 space-y-6">
          {/* C. Product Media / Gallery Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <ImageIcon className="w-4 h-4 text-[#ff6c2f]" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Product Image & Gallery
              </h2>
            </div>

            {/* Main Image Live Preview */}
            <div className="relative aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center p-3 overflow-hidden shadow-2xs">
              {images[0] ? (
                <img
                  src={images[0]}
                  alt="Product preview"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    // fallback to placeholder on broken URL
                    (e.target as any).src =
                      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";
                  }}
                />
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span className="text-xs">No image uploaded</span>
                </div>
              )}
              {badge && (
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#ff6c2f] text-white text-[10px] font-bold shadow-xs">
                  {badge}
                </span>
              )}
            </div>

            {/* Image URL Input & Add Button */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Add Image URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Quick Sample Presets */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Or pick a preset sample photo:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_PRESET_IMAGES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImages([sample.url])}
                    className="aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-[#ff6c2f] transition-all cursor-pointer relative group"
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] py-0.5 text-center truncate">
                      {sample.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery thumbnails */}
            {images.length > 1 && (
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Gallery Thumbnails ({images.length})
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-14 h-14 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 group"
                    >
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* D. Profit Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                Profit Analysis
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  unitProfit > 0
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {marginPct}% margin
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Selling Price:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  ${numericPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Buying Cost:</span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {numericBuyingPrice > 0 ? `$${numericBuyingPrice.toFixed(2)}` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 font-bold">
                <span className="text-slate-700 dark:text-slate-300">Unit Profit:</span>
                <span
                  className={
                    unitProfit >= 0
                      ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                      : "text-rose-600 dark:text-rose-400 font-extrabold"
                  }
                >
                  {unitProfit >= 0
                    ? `+$${unitProfit.toFixed(2)}`
                    : `-$${Math.abs(unitProfit).toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>

          {/* E. Action Button Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-2xs space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <RotateCw className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Publish Product Now</span>
            </button>

            <Link
              href="/dashboard/products"
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
            >
              Back to Product List
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}


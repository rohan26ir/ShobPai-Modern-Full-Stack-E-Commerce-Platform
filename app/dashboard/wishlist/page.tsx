"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  HeartOff,
  ShoppingCart,
  Trash2,
  Eye,
  Star,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductQuickViewModal from "@/components/usable/ProductQuickViewModal";
import { Product } from "@/data/products";
import toast from "react-hot-toast";

export default function DashboardWishlistPage() {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [stockFilter, setStockFilter] = useState<"ALL" | "IN_STOCK" | "OUT_OF_STOCK">("ALL");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    wishlistItems.forEach((p) => {
      if (p.categoryName) set.add(p.categoryName);
      else if (p.category) set.add(p.category);
    });
    return ["ALL", ...Array.from(set)];
  }, [wishlistItems]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return wishlistItems.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === "ALL" ||
        p.categoryName === selectedCategory ||
        p.category === selectedCategory;

      const isInStock = (p.stock ?? 0) > 0;
      const matchesStock =
        stockFilter === "ALL" ||
        (stockFilter === "IN_STOCK" && isInStock) ||
        (stockFilter === "OUT_OF_STOCK" && !isInStock);

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [wishlistItems, searchQuery, selectedCategory, stockFilter]);

  // Aggregate stats
  const inStockCount = useMemo(() => {
    return wishlistItems.filter((p) => (p.stock ?? 0) > 0).length;
  }, [wishlistItems]);

  const totalValue = useMemo(() => {
    return wishlistItems.reduce((acc, p) => acc + (p.price || 0), 0);
  }, [wishlistItems]);

  // Action: Move all in-stock items to cart
  const handleMoveAllToCart = () => {
    const inStockItems = wishlistItems.filter((p) => (p.stock ?? 0) > 0);
    if (inStockItems.length === 0) {
      toast.error("No in-stock items found in your wishlist.");
      return;
    }

    inStockItems.forEach((item) => {
      addToCart(item, 1);
    });
    toast.success(`Moved ${inStockItems.length} items directly to your shopping cart!`);
  };

  // Action: Clear entire wishlist
  const handleClearWishlist = () => {
    if (wishlistItems.length === 0) return;
    wishlistItems.forEach((item) => removeFromWishlist(item.id));
    toast.success("Wishlist has been cleared.");
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
            <Link href="/dashboard" className="hover:text-[#ff6c2f] transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300">My Wishlist</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Saved Wishlist
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] border border-orange-200/60 dark:border-orange-800/40">
              {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Items bookmarked for future purchases. Add them to your active cart anytime.
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleMoveAllToCart}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff6c2f] hover:bg-[#e05b24] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Move All In-Stock to Cart</span>
            </button>
            <button
              onClick={handleClearWishlist}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Clear entire wishlist"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Saved Products
            </span>
            <span className="text-xl font-black text-slate-800 dark:text-white mt-0.5 block">
              {wishlistItems.length}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              In Stock & Ready
            </span>
            <span className="text-xl font-black text-slate-800 dark:text-white mt-0.5 block">
              {inStockCount}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Estimated Total Value
            </span>
            <span className="text-xl font-black text-slate-800 dark:text-white mt-0.5 block">
              ${totalValue.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      {wishlistItems.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search saved products by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {categories.length > 2 && (
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="dark:bg-slate-900">
                      {cat === "ALL" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setStockFilter("ALL")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  stockFilter === "ALL"
                    ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStockFilter("IN_STOCK")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  stockFilter === "IN_STOCK"
                    ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                In Stock
              </button>
              <button
                onClick={() => setStockFilter("OUT_OF_STOCK")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  stockFilter === "OUT_OF_STOCK"
                    ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                Out of Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Wishlist Grid or Empty State */}
      {wishlistItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-10 sm:p-14 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto">
          <div className="h-16 w-16 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center mb-4">
            <HeartOff className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1.5 mb-6 max-w-sm">
            Save your favorite organic groceries, trending products, or daily essentials to easily track and purchase them later!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff6c2f] hover:bg-[#e05b24] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <span>Explore Shop Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-10 text-center shadow-xs">
          <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            No Matching Products Found
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Try adjusting your search keywords or resetting category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
              setStockFilter("ALL");
            }}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((product) => {
            const isInStock = (product.stock ?? 0) > 0;
            const discountPct =
              product.originalPrice && product.originalPrice > product.price
                ? Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  )
                : product.discount || null;

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-3.5 shadow-xs hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800/50 mb-3 border border-slate-100 dark:border-slate-800/60">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        No image
                      </div>
                    )}

                    {/* Discount Badge */}
                    {discountPct && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold shadow-xs">
                        -{discountPct}%
                      </span>
                    )}

                    {/* Stock Status Badge */}
                    <span
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md shadow-xs ${
                        isInStock
                          ? "bg-emerald-500/90 text-white"
                          : "bg-rose-500/90 text-white"
                      }`}
                    >
                      {isInStock ? "In Stock" : "Out of Stock"}
                    </span>

                    {/* Quick View Floating Button */}
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="absolute bottom-2 right-2 h-8 w-8 rounded-lg bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 hover:text-[#ff6c2f] dark:hover:text-[#ff6c2f] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                      title="Quick Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Category & Rating */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mb-1">
                    <span className="uppercase font-semibold tracking-wider truncate max-w-[120px]">
                      {product.categoryName || product.category || "Organic"}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                        {product.rating || "4.8"}
                      </span>
                    </div>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white line-clamp-2 hover:text-[#ff6c2f] transition-colors mb-1">
                    <Link href={`/product/${product.slug || product.id}`}>
                      {product.name}
                    </Link>
                  </h3>

                  {/* Unit description */}
                  {product.unit && (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block mb-2">
                      Unit: {product.unit}
                    </span>
                  )}
                </div>

                {/* Price & Actions Row */}
                <div className="pt-2 border-t border-slate-50 dark:border-slate-800/40 mt-2">
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-slate-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        toast.success(`${product.name} added to cart!`);
                      }}
                      disabled={!isInStock}
                      className={`col-span-4 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        isInStock
                          ? "bg-[#ff6c2f] hover:bg-[#e05b24] text-white shadow-xs cursor-pointer"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{isInStock ? "Add to Cart" : "Sold Out"}</span>
                    </button>

                    <button
                      onClick={() => {
                        removeFromWishlist(product.id);
                        toast.success(`${product.name} removed from wishlist`);
                      }}
                      className="col-span-1 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}

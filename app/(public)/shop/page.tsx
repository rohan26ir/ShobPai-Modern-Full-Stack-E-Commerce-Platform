"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FaFilter,
  FaRedo,
  FaSlidersH,
  FaThLarge,
  FaList,
  FaChevronLeft,
  FaChevronRight,
  FaAppleAlt,
  FaCarrot,
  FaFish,
  FaDrumstickBite,
  FaBreadSlice,
  FaSeedling,
  FaThList,
} from "react-icons/fa";
import {
  GiCrab,
  GiPeanut,
  GiGrapes,
  GiOrangeSlice,
  GiWatermelon,
  GiCheeseWedge,
  GiHoneyJar,
} from "react-icons/gi";

import { Product } from "@/data/products";
import { Category } from "@/data/categories";
import { useShopData } from "@/context/ShopDataContext";
import ProductCard from "@/components/usable/ProductCard";
import ProductCardList from "@/components/usable/ProductCardList";
import ProductQuickViewModal from "@/components/usable/ProductQuickViewModal";
import Image from "next/image";

import bannerBg from '@/public/sections/product-collection-banner.webp';

const ITEMS_PER_PAGE = 6;

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products: productList, categories: categoryList } = useShopData();

  // Read URL query params on mount
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "featured";
  const initialMinPrice = Number(searchParams.get("min")) || 0;
  const initialMaxPrice = Number(searchParams.get("max")) || 50;
  const initialPage = Number(searchParams.get("page")) || 1;

  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [activeThumb, setActiveThumb] = useState<"min" | "max">("min");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync states to URL query params
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (searchTerm.trim()) params.set("search", searchTerm);
    if (sortBy !== "featured") params.set("sort", sortBy);
    if (minPrice > 0) params.set("min", String(minPrice));
    if (maxPrice < 50) params.set("max", String(maxPrice));
    if (currentPage > 1) params.set("page", String(currentPage));

    const queryString = params.toString();
    router.push(queryString ? `/shop?${queryString}` : "/shop", { scroll: false });
  }, [category, searchTerm, sortBy, minPrice, maxPrice, currentPage, router]);

  // Helper to render Category Icons in #5FA800 color
  const renderCategoryIcon = (slug: string) => {
    const iconClass = "text-[#5FA800] h-4 w-4 shrink-0";
    switch (slug) {
      case "fresh-fruits":
        return <FaAppleAlt className={iconClass} />;
      case "seafood":
        return <GiCrab className={iconClass} />;
      case "meat":
        return <FaDrumstickBite className={iconClass} />;
      case "vegetables":
        return <FaCarrot className={iconClass} />;
      case "dryfruits":
        return <GiPeanut className={iconClass} />;
      case "blackberry":
        return <GiGrapes className={iconClass} />;
      case "beverages":
        return <GiOrangeSlice className={iconClass} />;
      case "sea-fish":
        return <FaFish className={iconClass} />;
      case "summer-fruit":
        return <GiWatermelon className={iconClass} />;
      case "dairy":
        return <GiCheeseWedge className={iconClass} />;
      case "bakery":
        return <FaBreadSlice className={iconClass} />;
      case "honey":
        return <GiHoneyJar className={iconClass} />;
      default:
        return <FaSeedling className={iconClass} />;
    }
  };

  // Reset page to 1 whenever filters change
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  // Reset all filters
  const handleReset = () => {
    setCategory("all");
    setSearchTerm("");
    setSortBy("featured");
    setMinPrice(0);
    setMaxPrice(50);
    setCurrentPage(1);
    setInStockOnly(false);
    setOnSaleOnly(false);
    router.push("/shop", { scroll: false });
  };

  // Filter & sort logic
  const filteredProducts = productList.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (
      searchTerm.trim() &&
      !p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !p.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    if (p.price < minPrice || p.price > maxPrice) return false;
    if (inStockOnly && p.stock <= 0) return false;
    if (onSaleOnly && !p.discount) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "newest") return b.id.localeCompare(a.id);
    return 0; // featured default
  });

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="py-8 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Page Header */}
        <div className="relative mb-8  text-white p-8 ">
          
          {/* bg image */}
          <div className="absolute inset-0 overflow-hidden ">
            <Image 
            src={bannerBg}
            alt="bg product banner"
            fill
            className="object-cover  "
            />
          </div>
          
          <div className="relative -z-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            Organic Grocery Store
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
            Shop Fresh Produce & Groceries
          </h1>
          <p className="text-sm text-gray-300 mt-2 max-w-xl">
            Browse our complete selection of farm-fresh fruits, organic vegetables, dairy, bakery, and healthy beverages.
          </p>
          </div>


        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filter Panel */}
          <aside className="lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs h-fit">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <FaFilter className="text-[#E5A842] h-4 w-4" />
                <span>Filters</span>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs font-bold text-[#E5A842] hover:text-[#d49633] transition-colors cursor-pointer"
                title="Reset Filters"
              >
                <FaRedo className="h-3 w-3" />
                <span>Reset All</span>
              </button>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Search Products
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Type keyword..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-800 outline-hidden focus:border-[#E5A842] focus:ring-2 focus:ring-[#E5A842]/30"
              />
            </div>

            {/* Categories Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Categories
              </label>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors font-semibold cursor-pointer ${
                    category === "all"
                      ? "bg-[#E5A842] text-gray-950 font-black shadow-2xs"
                      : "text-gray-700 hover:bg-amber-50/70 hover:text-[#E5A842]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FaThList className={category === "all" ? "text-gray-950 h-3.5 w-3.5" : "text-[#5FA800] h-3.5 w-3.5"} />
                    <span>All Categories</span>
                  </div>
                  <span className="text-[11px] font-bold opacity-80">({productList.length})</span>
                </button>
                {categoryList.map((c) => {
                  const count = productList.filter((p) => p.category === c.slug).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleCategoryChange(c.slug)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors font-semibold cursor-pointer ${
                        category === c.slug
                          ? "bg-[#E5A842] text-gray-950 font-black shadow-2xs"
                          : "text-gray-700 hover:bg-amber-50/70 hover:text-[#E5A842]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {renderCategoryIcon(c.slug)}
                        <span>{c.name}</span>
                      </div>
                      <span className="text-[11px] font-bold opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Single Dual-Handle Price Range Filter (Matching Reference Screenshot 1-to-1) */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                Price
              </label>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">
                  The highest price is $50.00
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice(0);
                    setMaxPrice(50);
                    setCurrentPage(1);
                  }}
                  className="font-bold text-gray-800 hover:text-[#5FA800] underline transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Dual Handle Range Track */}
              <div
                className="relative h-6 flex items-center select-none py-2 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
                  const clickedValue = Math.round(clickRatio * 50);

                  const distToMin = Math.abs(clickedValue - minPrice);
                  const distToMax = Math.abs(clickedValue - maxPrice);

                  if (distToMin < distToMax) {
                    setMinPrice(Math.min(clickedValue, maxPrice - 1));
                    setActiveThumb("min");
                  } else {
                    setMaxPrice(Math.max(clickedValue, minPrice + 1));
                    setActiveThumb("max");
                  }
                  setCurrentPage(1);
                }}
              >
                {/* Base Track */}
                <div className="absolute left-0 right-0 h-1.5 bg-gray-200 rounded-full"></div>

                {/* Highlighted Range Track */}
                <div
                  className="absolute h-1.5 bg-gray-900 rounded-full"
                  style={{
                    left: `${(minPrice / 50) * 100}%`,
                    right: `${100 - (maxPrice / 50) * 100}%`,
                  }}
                ></div>

                {/* Min Input Slider */}
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={minPrice}
                  onMouseDown={() => setActiveThumb("min")}
                  onTouchStart={() => setActiveThumb("min")}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), maxPrice - 1);
                    setMinPrice(val);
                    setCurrentPage(1);
                  }}
                  className={`absolute w-full h-1 opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 ${
                    activeThumb === "min" ? "z-40" : "z-20"
                  }`}
                />

                {/* Max Input Slider */}
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={maxPrice}
                  onMouseDown={() => setActiveThumb("max")}
                  onTouchStart={() => setActiveThumb("max")}
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value), minPrice + 1);
                    setMaxPrice(val);
                    setCurrentPage(1);
                  }}
                  className={`absolute w-full h-1 opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 ${
                    activeThumb === "max" ? "z-40" : "z-30"
                  }`}
                />

                {/* Custom Circular White Thumbs with Dark Borders */}
                <div
                  className="absolute h-5 w-5 bg-white border-2 border-gray-900 rounded-full shadow-md z-10 pointer-events-none -ml-2.5"
                  style={{ left: `${(minPrice / 50) * 100}%` }}
                ></div>
                <div
                  className="absolute h-5 w-5 bg-white border-2 border-gray-900 rounded-full shadow-md z-10 pointer-events-none -ml-2.5"
                  style={{ left: `${(maxPrice / 50) * 100}%` }}
                ></div>
              </div>

              {/* From & To Input Boxes */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1">
                  <label className="text-[11px] text-gray-500 font-medium block mb-1">From</label>
                  <div className="relative flex items-center border border-gray-300 rounded-sm bg-white px-2.5 py-1.5 focus-within:border-gray-900">
                    <span className="text-xs font-semibold text-gray-600 mr-2">$</span>
                    <input
                      type="number"
                      min="0"
                      max={maxPrice}
                      value={minPrice}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(Number(e.target.value), maxPrice - 1));
                        setMinPrice(val);
                        setCurrentPage(1);
                      }}
                      className="w-full text-xs font-semibold text-gray-900 outline-hidden bg-transparent text-right"
                    />
                  </div>
                </div>

                <span className="text-gray-400 font-bold mt-5">-</span>

                <div className="flex-1">
                  <label className="text-[11px] text-gray-500 font-medium block mb-1">To</label>
                  <div className="relative flex items-center border border-gray-300 rounded-sm bg-white px-2.5 py-1.5 focus-within:border-gray-900">
                    <span className="text-xs font-semibold text-gray-600 mr-2">$</span>
                    <input
                      type="number"
                      min={minPrice}
                      max="50"
                      value={maxPrice}
                      onChange={(e) => {
                        const val = Math.min(50, Math.max(Number(e.target.value), minPrice + 1));
                        setMaxPrice(val);
                        setCurrentPage(1);
                      }}
                      className="w-full text-xs font-semibold text-gray-900 outline-hidden bg-transparent text-right"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded-md border-gray-300 text-[#5FA800] focus:ring-[#5FA800] h-4 w-4"
                />
                <span>In Stock Only</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => {
                    setOnSaleOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded-md border-gray-300 text-[#5FA800] focus:ring-[#5FA800] h-4 w-4"
                />
                <span>On Sale Only</span>
              </label>
            </div>
          </aside>

          {/* Main Products Grid & Toolbar */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <p className="text-xs font-bold text-gray-600">
                Showing <span className="text-[#5FA800] font-black">{paginatedProducts.length > 0 ? `${startIndex + 1}–${Math.min(startIndex + ITEMS_PER_PAGE, sortedProducts.length)}` : 0}</span> of{" "}
                <span className="text-gray-900 font-bold">{sortedProducts.length}</span> organic products
              </p>

              <div className="flex items-center gap-4">
                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 outline-hidden focus:border-[#5FA800]"
                  >
                    <option value="featured">Featured Picks</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>

                {/* Grid / List toggle */}
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      viewMode === "grid" ? "bg-white text-[#5FA800] shadow-xs" : "text-gray-400"
                    }`}
                    title="Grid View"
                  >
                    <FaThLarge className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      viewMode === "list" ? "bg-white text-[#5FA800] shadow-xs" : "text-gray-400"
                    }`}
                    title="List View"
                  >
                    <FaList className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Listing */}
            {sortedProducts.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
                <FaSlidersH className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="text-base font-bold text-gray-800">No products match your criteria</h3>
                <p className="text-xs text-gray-400 mt-1 mb-6">
                  Try adjusting your search keywords, category, or price filters.
                </p>
                <button
                  onClick={handleReset}
                  className="rounded-xl bg-[#E5A842] px-6 py-2.5 text-xs font-bold text-gray-950 hover:bg-[#d49633] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {paginatedProducts.map((product) => (
                  <ProductCardList
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls Component */}
            {totalPages > 1 && (
              <div className="mt-12 pt-8 border-t border-gray-200/60 flex flex-col items-center gap-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  {/* Previous Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 transition-all hover:border-[#E5A842] hover:bg-[#E5A842] hover:text-gray-950 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                    title="Previous Page"
                  >
                    <FaChevronLeft className="h-3 w-3" />
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`flex h-10 w-10 items-center justify-center rounded-md text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                          currentPage === pageNum
                            ? "bg-[#E5A842] border border-[#E5A842] text-gray-950 shadow-sm"
                            : "border border-gray-200 bg-white text-gray-700 hover:border-[#E5A842] hover:bg-[#E5A842] hover:text-gray-950"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 transition-all hover:border-[#E5A842] hover:bg-[#E5A842] hover:text-gray-950 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                    title="Next Page"
                  >
                    <FaChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-gray-500">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}

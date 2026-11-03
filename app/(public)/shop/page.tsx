"use client";

import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FaFilter,
  FaRedo,
  FaSlidersH,
  FaThLarge,
  FaList,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaAppleAlt,
  FaCarrot,
  FaFish,
  FaDrumstickBite,
  FaBreadSlice,
  FaSeedling,
  FaThList,
  FaTimes,
  FaSpa,
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
// Performance Optimization: Dynamic import for QuickView modal to defer bundle load until user clicks
const ProductQuickViewModal = dynamic(
  () => import("@/components/usable/ProductQuickViewModal"),
  { ssr: false }
);
import Image from "next/image";

import bannerBg from '@/public/sections/product-collection-banner.webp';

const ITEMS_PER_PAGE = 6;

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products: productList, categories: categoryList } = useShopData();

  // Performance Optimization: Dynamic calculation of catalog maximum price memoized
  const catalogMaxPrice = useMemo(() => {
    if (!productList.length) return 1000;
    return Math.max(
      100,
      ...productList.map((p) => Math.ceil(p.price || 0))
    );
  }, [productList]);

  // Performance Optimization: Pre-compute category item counts accurately
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of categoryList) {
      counts[c.slug] = 0;
    }
    const normalize = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const p of productList) {
      const pCat = normalize(p.category);
      const pCatName = normalize(p.categoryName);
      for (const c of categoryList) {
        const cSlug = normalize(c.slug);
        const cName = normalize(c.name);
        if (pCat === cSlug || pCatName === cSlug || pCat === cName || pCatName === cName) {
          counts[c.slug] = (counts[c.slug] || 0) + 1;
        }
      }
    }
    return counts;
  }, [categoryList, productList]);

  // Read URL query params on mount
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "featured";
  const initialMinPrice = Number(searchParams.get("min")) || 0;
  const initialMaxPrice = searchParams.has("max")
    ? Number(searchParams.get("max")) || catalogMaxPrice
    : catalogMaxPrice;
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialLimit = Number(searchParams.get("limit")) || ITEMS_PER_PAGE;

  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [activeThumb, setActiveThumb] = useState<"min" | "max">("min");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync incoming URL query params changes (e.g. from navbar clicks or back/forward) into internal states
  const urlCategory = searchParams.get("category") || "all";
  const urlSearch = searchParams.get("search") || "";
  const urlSort = searchParams.get("sort") || "featured";
  const urlMin = Number(searchParams.get("min")) || 0;
  const urlMax = searchParams.has("max") ? Number(searchParams.get("max")) : null;
  const urlPage = Number(searchParams.get("page")) || 1;
  const urlLimit = Number(searchParams.get("limit")) || ITEMS_PER_PAGE;

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    setSearchTerm(urlSearch);
    setDebouncedSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setSortBy(urlSort);
  }, [urlSort]);

  useEffect(() => {
    setMinPrice(urlMin);
  }, [urlMin]);

  useEffect(() => {
    if (urlMax !== null) {
      setMaxPrice(urlMax);
    } else {
      setMaxPrice(catalogMaxPrice);
    }
  }, [urlMax, catalogMaxPrice]);

  useEffect(() => {
    setCurrentPage(urlPage);
  }, [urlPage]);

  useEffect(() => {
    setItemsPerPage(urlLimit);
  }, [urlLimit]);

  // Lock body scroll on mobile/tablet when mobile filter drawer is open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  // Performance Optimization: Debounce search input by 300ms to eliminate keystroke thrashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Performance Optimization: Sync URL query params only on debounced search, avoiding push-state thrashing
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (sortBy !== "featured") params.set("sort", sortBy);
    if (minPrice > 0) params.set("min", String(minPrice));
    if (maxPrice < catalogMaxPrice) params.set("max", String(maxPrice));
    if (currentPage > 1) params.set("page", String(currentPage));
    if (itemsPerPage !== ITEMS_PER_PAGE) params.set("limit", String(itemsPerPage));

    const queryString = params.toString();
    router.push(queryString ? `/shop?${queryString}` : "/shop", { scroll: false });
  }, [category, debouncedSearch, sortBy, minPrice, maxPrice, currentPage, itemsPerPage, router, catalogMaxPrice]);

  // Helper to normalize strings for robust URL slug & category matching (e.g. "beauty-care" matches "Beauty & Care")
  const normalizeSlug = (str: string) =>
    (str || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");

  // Find active category object from categoryList for accurate display names & matching
  const activeCategoryObj = useMemo(() => {
    if (category === "all") return null;
    const target = normalizeSlug(category);
    return (
      categoryList.find(
        (c) => normalizeSlug(c.slug) === target || normalizeSlug(c.name) === target
      ) || null
    );
  }, [category, categoryList]);

  // Human-friendly display title for the current active category
  const activeCategoryDisplayName = useMemo(() => {
    if (activeCategoryObj) return activeCategoryObj.name;
    if (category === "all") return "All Categories";
    return category
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }, [activeCategoryObj, category]);

  // Robust category matcher for products
  const isProductInCategory = useCallback(
    (p: Product, selectedCategory: string) => {
      if (selectedCategory === "all") return true;
      const target = normalizeSlug(selectedCategory);
      const pCat = normalizeSlug(p.category || "");
      const pCatName = normalizeSlug(p.categoryName || "");

      if (pCat === target || pCatName === target) return true;
      if (pCat && target && (pCat.includes(target) || target.includes(pCat))) return true;
      if (pCatName && target && (pCatName.includes(target) || target.includes(pCatName))) return true;

      if (activeCategoryObj) {
        const objSlug = normalizeSlug(activeCategoryObj.slug);
        const objName = normalizeSlug(activeCategoryObj.name);
        if (pCat === objSlug || pCatName === objName || pCat === objName || pCatName === objSlug) {
          return true;
        }
      }
      return false;
    },
    [activeCategoryObj]
  );

  // Check if a category is active for pills and sidebar highlighting
  const isCategoryActive = useCallback(
    (catSlug: string, catName?: string) => {
      if (category === "all") return catSlug === "all";
      const target = normalizeSlug(category);
      if (normalizeSlug(catSlug) === target) return true;
      if (catName && normalizeSlug(catName) === target) return true;
      if (activeCategoryObj) {
        if (normalizeSlug(activeCategoryObj.slug) === normalizeSlug(catSlug)) return true;
      }
      return false;
    },
    [category, activeCategoryObj]
  );

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
      case "beauty":
      case "beauty-care":
      case "personal-care":
        return <FaSpa className={iconClass} />;
      default:
        return <FaSeedling className={iconClass} />;
    }
  };

  // Performance Optimization: Stable callbacks to avoid re-renders of filter inputs and buttons
  const handleCategoryChange = useCallback((newCat: string) => {
    setCategory(newCat);
    setCurrentPage(1);
    setMobileFiltersOpen(false); // Seamlessly dismiss mobile filter drawer upon selection
  }, []);

  const handleSearchChange = useCallback((val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((val: string) => {
    setSortBy(val);
    setCurrentPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setCategory("all");
    setSearchTerm("");
    setDebouncedSearch("");
    setSortBy("featured");
    setMinPrice(0);
    setMaxPrice(catalogMaxPrice);
    setCurrentPage(1);
    setItemsPerPage(ITEMS_PER_PAGE);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setMobileFiltersOpen(false);
    router.push("/shop", { scroll: false });
  }, [catalogMaxPrice, router]);

  const handleOpenQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  // Performance Optimization: Memoized filtering logic on debounced search term
  const filteredProducts = useMemo(() => {
    const trimmed = debouncedSearch.toLowerCase().trim();

    return productList.filter((p) => {
      if (!isProductInCategory(p, category)) {
        return false;
      }
      if (trimmed) {
        const nameMatches = p.name?.toLowerCase().includes(trimmed);
        const catMatches = p.categoryName?.toLowerCase().includes(trimmed);
        const descMatches = p.shortDescription?.toLowerCase().includes(trimmed);
        if (!nameMatches && !catMatches && !descMatches) return false;
      }
      if (minPrice > 0 && p.price < minPrice) return false;
      if (maxPrice < catalogMaxPrice && p.price > maxPrice) return false;
      if (inStockOnly && p.stock <= 0) return false;
      if (onSaleOnly && !p.discount) return false;
      return true;
    });
  }, [productList, category, isProductInCategory, debouncedSearch, minPrice, maxPrice, inStockOnly, onSaleOnly, catalogMaxPrice]);

  // Performance Optimization: Memoized sorting logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-low") return list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") return list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") return list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "newest") {
      return list.sort((a, b) => String(b.createdAt || b.id).localeCompare(String(a.createdAt || a.id)));
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Active filter count for mobile badge & chips
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (category !== "all") count++;
    if (debouncedSearch.trim()) count++;
    if (sortBy !== "featured") count++;
    if (minPrice > 0 || maxPrice < catalogMaxPrice) count++;
    if (inStockOnly) count++;
    if (onSaleOnly) count++;
    return count;
  }, [category, debouncedSearch, sortBy, minPrice, maxPrice, catalogMaxPrice, inStockOnly, onSaleOnly]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Performance Optimization: Memoized pagination slice
  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, startIndex, itemsPerPage]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  }, [totalPages]);

  return (
    <div className="py-6 sm:py-8 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4">

        {/* Page Header Banner */}
        <div className="relative mb-6 sm:mb-8 text-white p-5 sm:p-8 rounded-2xl overflow-hidden">
          {/* bg image */}
          <div className="absolute inset-0 overflow-hidden ">
            <Image
              src={bannerBg}
              alt="bg product banner"
              fill
              className="left-0 object-left-top md:object-center object-cover  md:object-cover "
              priority
            />
            {/* <div className="absolute inset-0 bg-black/50" /> */}
          </div>

          <div className="h-26 md:h-40">

          </div>
        </div>

        {/* Mobile & Tablet Slide-over Drawer Backdrop */}
        {mobileFiltersOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* Sidebar Filter Panel (Desktop Sticky Sidebar + Mobile/Tablet Slide-over Drawer) */}
          <aside
            className={`
              bg-white
              /* Mobile & Tablet Slide-over Drawer */
              fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm h-full flex flex-col justify-between overflow-hidden shadow-2xl transition-transform duration-300 ease-in-out
              ${mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"}
              /* Desktop Static Sticky Sidebar */
              lg:static lg:z-auto lg:w-auto lg:max-w-none lg:h-fit lg:translate-x-0 lg:rounded-3xl lg:border lg:border-gray-100 lg:shadow-xs lg:col-span-1 lg:flex-none lg:block
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-5 lg:p-6 lg:pb-4">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <FaFilter className="text-[#E5A842] h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E5A842] text-gray-950 font-black text-[10px]">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs font-bold text-[#E5A842] hover:text-[#d49633] transition-colors cursor-pointer py-1"
                  title="Reset Filters"
                >
                  <FaRedo className="h-3 w-3" />
                  <span>Reset All</span>
                </button>
                {/* Mobile Drawer Close Button */}
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="lg:hidden flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors ml-1 cursor-pointer"
                  aria-label="Close filters"
                >
                  <FaTimes className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Filters Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 lg:p-6 lg:pt-2 lg:overflow-visible">
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
                    type="button"
                    onClick={() => handleCategoryChange("all")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors font-semibold cursor-pointer ${category === "all"
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
                    const count = categoryCounts[c.slug] || 0;
                    const isSelected = isCategoryActive(c.slug, c.name);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleCategoryChange(c.slug)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors font-semibold cursor-pointer ${isSelected
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

              {/* Single Dual-Handle Price Range Filter */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                  Price
                </label>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">
                    The highest price is ${catalogMaxPrice}.00
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(catalogMaxPrice);
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
                    const clickedValue = Math.round(clickRatio * catalogMaxPrice);

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
                      left: `${(minPrice / catalogMaxPrice) * 100}%`,
                      right: `${100 - (maxPrice / catalogMaxPrice) * 100}%`,
                    }}
                  ></div>

                  {/* Min Input Slider */}
                  <input
                    type="range"
                    min="0"
                    max={catalogMaxPrice}
                    step="1"
                    value={minPrice}
                    onMouseDown={() => setActiveThumb("min")}
                    onTouchStart={() => setActiveThumb("min")}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), maxPrice - 1);
                      setMinPrice(val);
                      setCurrentPage(1);
                    }}
                    className={`absolute w-full h-1 opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 ${activeThumb === "min" ? "z-40" : "z-20"
                      }`}
                  />

                  {/* Max Input Slider */}
                  <input
                    type="range"
                    min="0"
                    max={catalogMaxPrice}
                    step="1"
                    value={maxPrice}
                    onMouseDown={() => setActiveThumb("max")}
                    onTouchStart={() => setActiveThumb("max")}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), minPrice + 1);
                      setMaxPrice(val);
                      setCurrentPage(1);
                    }}
                    className={`absolute w-full h-1 opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 ${activeThumb === "max" ? "z-40" : "z-30"
                      }`}
                  />

                  {/* Custom Circular White Thumbs with Dark Borders */}
                  <div
                    className="absolute h-5 w-5 bg-white border-2 border-gray-900 rounded-full shadow-md z-10 pointer-events-none -ml-2.5"
                    style={{ left: `${(minPrice / catalogMaxPrice) * 100}%` }}
                  ></div>
                  <div
                    className="absolute h-5 w-5 bg-white border-2 border-gray-900 rounded-full shadow-md z-10 pointer-events-none -ml-2.5"
                    style={{ left: `${(maxPrice / catalogMaxPrice) * 100}%` }}
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
                        max={catalogMaxPrice}
                        value={maxPrice}
                        onChange={(e) => {
                          const val = Math.min(catalogMaxPrice, Math.max(Number(e.target.value), minPrice + 1));
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
            </div>

            {/* Sticky Mobile Drawer Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 transition-colors cursor-pointer text-center"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 px-3 rounded-xl bg-[#E5A842] text-gray-950 text-xs font-black hover:bg-[#d49633] transition-colors cursor-pointer shadow-xs text-center"
              >
                Show ({sortedProducts.length}) Results
              </button>
            </div>
          </aside>

          {/* Main Products Grid & Toolbar */}
          <main className="lg:col-span-3 flex flex-col justify-between">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between gap-2.5 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-xs">
              {/* Left Side: Filter Button for Sidebar (Small & Medium devices) */}
              <div className="lg:hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs sm:text-sm font-bold text-gray-800 hover:border-[#E5A842] hover:bg-amber-50/50 transition-colors cursor-pointer min-h-[42px]"
                  aria-label="Open Filters"
                >
                  <FaFilter className="text-[#E5A842] h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E5A842] text-gray-950 font-black text-[10px]">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Center: Searchbar for Small & Medium devices */}
              <div className="lg:hidden flex-1 max-w-md mx-auto relative">
                <div className="relative flex items-center w-full">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <FaSearch className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search organic products..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/80 pl-9 pr-8 py-2 text-xs sm:text-sm text-gray-800 outline-hidden focus:border-[#E5A842] focus:bg-white focus:ring-2 focus:ring-[#E5A842]/20 min-h-[42px] transition-all"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                      title="Clear search"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Side Group: Items Per Page Dropdown + Grid/List View Toggle */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
                {/* Items Per Page Dropdown (On the left side of List & Grid view) */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                  <span className="hidden sm:inline whitespace-nowrap">Show:</span>
                  <div className="relative">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="appearance-none rounded-xl border border-gray-200 bg-gray-50/80 px-2.5 sm:px-3 py-2 pr-7 text-xs font-bold text-gray-800 outline-hidden focus:border-[#E5A842] focus:bg-white focus:ring-2 focus:ring-[#E5A842]/20 min-h-[38px] sm:min-h-[42px] cursor-pointer transition-all"
                      title="Items per page"
                      aria-label="Items per page"
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={18}>18</option>
                      <option value={24}>24</option>
                      <option value={36}>36</option>
                      <option value={48}>48</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <FaChevronDown className="h-2.5 w-2.5" />
                    </div>
                  </div>
                </div>

                {/* Grid / List view toggle */}
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 sm:p-2.5 rounded-lg text-xs transition-colors cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-[38px] sm:min-w-[38px] flex items-center justify-center ${viewMode === "grid" ? "bg-white text-[#5FA800] shadow-xs font-bold" : "text-gray-400 hover:text-gray-700"
                      }`}
                    title="Grid View"
                    aria-label="Grid View"
                  >
                    <FaThLarge className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-2 sm:p-2.5 rounded-lg text-xs transition-colors cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-[38px] sm:min-w-[38px] flex items-center justify-center ${viewMode === "list" ? "bg-white text-[#5FA800] shadow-xs font-bold" : "text-gray-400 hover:text-gray-700"
                      }`}
                    title="List View"
                    aria-label="List View"
                  >
                    <FaList className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Listing Container with 6 items minimum height reserved */}
            <div className="flex-1 my-6 min-h-[650px] sm:min-h-[800px] lg:min-h-[920px]">
              {sortedProducts.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-8 sm:p-12 text-center text-gray-500">
                  <FaSlidersH className="h-10 w-10 text-gray-300 mb-3" />
                  <h3 className="text-base font-bold text-gray-800">No products match your criteria</h3>
                  <p className="text-xs text-gray-400 mt-1 mb-6">
                    Try adjusting your search keywords, category, or price filters.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-xl bg-[#E5A842] px-6 py-3 text-xs font-bold text-gray-950 hover:bg-[#d49633] transition-colors cursor-pointer min-h-[44px]"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={handleOpenQuickView}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {paginatedProducts.map((product) => (
                    <ProductCardList
                      key={product.id}
                      product={product}
                      onQuickView={handleOpenQuickView}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls Component - Always positioned at bottom */}
            {sortedProducts.length > 0 && (
              <div className="mt-auto pt-8 flex flex-col items-center gap-4 text-center">
                {totalPages > 1 ? (
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-full">
                    {/* Previous Page Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 transition-all hover:border-[#E5A842] hover:bg-[#E5A842] hover:text-gray-950 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 cursor-pointer disabled:cursor-not-allowed shadow-2xs min-h-[44px] min-w-[44px]"
                      title="Previous Page"
                      aria-label="Previous Page"
                    >
                      <FaChevronLeft className="h-3 w-3" />
                    </button>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`flex h-11 w-11 items-center justify-center rounded-md text-xs font-bold transition-all cursor-pointer shadow-2xs min-h-[44px] min-w-[44px] ${currentPage === pageNum
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
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 transition-all hover:border-[#E5A842] hover:bg-[#E5A842] hover:text-gray-950 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 cursor-pointer disabled:cursor-not-allowed shadow-2xs min-h-[44px] min-w-[44px]"
                      title="Next Page"
                      aria-label="Next Page"
                    >
                      <FaChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-full">
                    <button
                      type="button"
                      disabled
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 opacity-40 cursor-not-allowed shadow-2xs min-h-[44px] min-w-[44px]"
                      title="Previous Page"
                      aria-label="Previous Page"
                    >
                      <FaChevronLeft className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled
                      className="flex h-11 w-11 items-center justify-center rounded-md bg-[#E5A842] border border-[#E5A842] text-gray-950 text-xs font-bold shadow-sm min-h-[44px] min-w-[44px]"
                    >
                      1
                    </button>
                    <button
                      type="button"
                      disabled
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 opacity-40 cursor-not-allowed shadow-2xs min-h-[44px] min-w-[44px]"
                      title="Next Page"
                      aria-label="Next Page"
                    >
                      <FaChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                )}

              </div>
            )}
          </main>

        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={handleCloseQuickView}
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

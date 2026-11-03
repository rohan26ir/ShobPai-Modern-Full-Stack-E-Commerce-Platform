"use client";

import { useState, useMemo, memo } from "react";
import { Product } from "@/data/products";
import { useShopData } from "@/context/ShopDataContext";
import ProductGrid from "@/components/usable/ProductGrid";

interface TrendingSectionProps {
  onQuickView: (product: Product) => void;
}

const filterTabs = [
  { id: "all", label: "All Items" },
  { id: "fresh-fruits", label: "Fresh Fruits" },
  { id: "vegetables", label: "Vegetables" },
  { id: "dairy", label: "Dairy & Cheese" },
  { id: "bakery", label: "Bakery & Breads" },
];

function TrendingSection({ onQuickView }: TrendingSectionProps) {
  const { products, loading, productsLoading } = useShopData();
  const isLoading = productsLoading || (loading && products.length === 0);
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeTab === "all") return p.isTrending || true;
      return p.category === activeTab;
    });
  }, [products, activeTab]);

  return (
    <section className="py-12 bg-gray-50/50 border-y border-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Header with Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <span className="text-xs font-black tracking-widest uppercase text-[#F0A843]">
              Popular Picks
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
              Trending Organic Products
            </h2>
          </div>

          {/* Filter / Sort Tabs (Hidden on small and medium devices < lg, visible on desktop lg:) */}
          <div className="hidden lg:flex flex-wrap items-center gap-1.5 sm:gap-2 bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-xs max-w-full overflow-x-auto no-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 sm:px-4 py-2 min-h-[44px] flex items-center justify-center text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? "bg-black text-white shadow-xs"
                    : "text-gray-600 hover:text-[#F0A843] hover:bg-amber-50/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts.slice(0, 8)}
          onQuickView={onQuickView}
          loading={isLoading}
          skeletonCount={8}
        />
      </div>
    </section>
  );
}

export default memo(TrendingSection);

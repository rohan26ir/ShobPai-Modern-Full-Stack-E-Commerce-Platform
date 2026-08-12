"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { Product, products } from "@/data/products";
import ProductGrid from "@/components/usable/ProductGrid";

interface FeaturedProductsSectionProps {
  onQuickView: (product: Product) => void;
}

export default function FeaturedProductsSection({ onQuickView }: FeaturedProductsSectionProps) {
  const featuredProducts = products.filter((p) => p.isFeatured || p.rating >= 4.7);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-600">
              Handpicked Quality
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
              Our Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>Explore All Products</span>
            <FaArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={featuredProducts}
          onQuickView={onQuickView}
        />
      </div>
    </section>
  );
}

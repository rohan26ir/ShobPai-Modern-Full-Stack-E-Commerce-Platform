"use client";

import { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "@/components/skeletons/HomeSkeletons";

interface ProductGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
  emptyMessage?: string;
  loading?: boolean;
  skeletonCount?: number;
}

export default function ProductGrid({
  products,
  onQuickView,
  emptyMessage = "No products found.",
  loading = false,
  skeletonCount = 8,
}: ProductGridProps) {
  if (loading) {
    return <ProductGridSkeleton count={skeletonCount} />;
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center text-gray-500">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}

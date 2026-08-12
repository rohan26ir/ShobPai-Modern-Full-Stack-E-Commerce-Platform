"use client";

import Link from "next/link";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/usable/ProductCard";
import ProductQuickViewModal from "@/components/usable/ProductQuickViewModal";
import { Product } from "@/data/products";

export default function DashboardWishlistPage() {
  const { wishlistItems } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            Saved Products
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            My Wishlist & Favorites
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            Save your favorite organic produce items for later or quickly move them into your shopping cart.
          </p>
        </div>

        <span className="text-xs font-black bg-[#E5A842] text-gray-950 px-4 py-2 rounded-xl shadow-md self-start md:self-auto">
          {wishlistItems.length} Saved Items
        </span>
      </div>

      {/* Wishlist Grid using ProductCard */}
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
          <FaHeart className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-gray-800">Your wishlist is currently empty</h3>
          <p className="text-xs text-gray-400 mt-1 mb-6">
            Browse our organic shop catalog and tap the heart icon on any product!
          </p>
          <Link
            href="/shop"
            className="rounded-xl bg-[#E5A842] px-6 py-3 text-xs font-black text-gray-950 hover:bg-[#d49633] transition-colors"
          >
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaHeart, FaShoppingBag, FaStar } from "react-icons/fa";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardListProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCardList({ product, onQuickView }: ProductCardListProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div className="group relative flex flex-col sm:flex-row items-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5 sm:p-4 transition-all duration-300 hover:border-[#F0A843]/50 hover:shadow-md hover:shadow-[#F0A843]/10 gap-4 md:gap-6">
      
      {/* Left Compact Thumbnail Image Column */}
      <div
        className="relative h-32 w-32 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-gray-50 cursor-pointer"
        onClick={handleQuickViewClick}
        onMouseEnter={() => {
          if (product.images.length > 1) setCurrentImageIndex(1);
        }}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <Image
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="144px"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.discount && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              -{product.discount}%
            </span>
          )}
          {product.badge && (
            <span className="rounded-full bg-[#F0A843] px-2 py-0.5 text-[10px] font-black text-gray-950 shadow-xs">
              {product.badge}
            </span>
          )}
        </div>
      </div>

      {/* Middle Content Column */}
      <div className="flex flex-1 flex-col justify-between space-y-1.5 w-full">
        <div>
          {/* Category, Unit & Real Review Star */}
          <div className="flex items-center gap-2 text-[11px] font-bold">
            <span className="text-[#F0A843]">{product.categoryName}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">{product.unit}</span>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1 text-[#F0A843]">
              <FaStar className="h-3 w-3 fill-current" />
              <span className="font-bold text-gray-900 text-[11px]">
                {(product.rating ? Number(product.rating) : 5.0).toFixed(1)}
              </span>
              <span className="font-normal text-gray-400 text-[10px]">
                ({product.reviewsCount || 1})
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-[#F0A843] line-clamp-1">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-xs text-gray-500 leading-relaxed line-clamp-2">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Stock status */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 pt-0.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>In Stock ({product.stock} left)</span>
        </div>
      </div>

      {/* Right Price & Actions Column */}
      <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto sm:border-l sm:border-gray-100 sm:pl-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">
        {/* Pricing */}
        <div className="text-left sm:text-right">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-gray-950">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:mt-3">
          <button
            onClick={handleAddToCart}
            className={`flex h-9 items-center justify-center gap-1.5 rounded-xl px-3.5 text-xs font-bold transition-all cursor-pointer ${
              isAdded
                ? "bg-gray-900 text-white"
                : "bg-[#F0A843] hover:bg-[#e09732] text-gray-950 shadow-xs"
            }`}
          >
            <FaShoppingBag className="h-3 w-3" />
            <span>{isAdded ? "Added!" : "Add"}</span>
          </button>

          {onQuickView && (
            <button
              onClick={handleQuickViewClick}
              title="Quick View"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-[#F0A843] transition-colors cursor-pointer"
            >
              <FaEye className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            onClick={handleToggleWishlist}
            title="Wishlist"
            className={`flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 transition-colors cursor-pointer ${
              isWishlisted ? "bg-red-50 text-red-500 border-red-200" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FaHeart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

    </div>
  );
}

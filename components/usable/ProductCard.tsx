"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaHeart, FaShoppingBag, FaShoppingCart, FaStar } from "react-icons/fa";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
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
    <div 
      className="group relative flex flex-col justify-between overflow-hidden border-0 border-black bg-white transition-all duration-300  "
    >
      {/* Top Discount / Status Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.discount && (
          <span className=" bg-red-500 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white shadow-xs">
            -{product.discount}%
          </span>
        )}
        {/* {product.badge && (
          <span className="rounded-full bg-[#F0A843] px-2.5 py-1 text-[11px] font-black tracking-wider text-gray-950 shadow-xs">
            {product.badge}
          </span>
        )} */}
      </div>

      {/* Quick Action Overlay Buttons (Wishlist [hidden on small device], Quick View, Cart [kept]) */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-90 md:opacity-0 transition-all duration-300 md:group-hover:opacity-100">
        {/* Wishlist Button: hidden on small device, kept on desktop (md+) */}
        <button
          onClick={handleToggleWishlist}
          title="Add to Wishlist"
          aria-label="Add to Wishlist"
          className={`hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer min-h-[36px] min-w-[36px] ${
            isWishlisted ? "text-red-500" : "text-gray-600 hover:text-red-500"
          }`}
        >
          <FaHeart className={`h-4 w-4 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
        </button>

        {onQuickView && (
          <button
            onClick={handleQuickViewClick}
            title="Quick View"
            aria-label="Quick View"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-md backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 hover:text-[#F0A843] cursor-pointer min-h-[36px] min-w-[36px]"
          >
            <FaEye className="h-4 w-4" />
          </button>
        )}
        
        {/* Add to Cart Button (Kept on small device and desktop) */}
        <button
          onClick={handleAddToCart}
          title="Add to Cart"
          aria-label="Add to Cart"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-md backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 hover:text-[#F0A843] cursor-pointer min-h-[36px] min-w-[36px]"
        >
          <FaShoppingCart className="h-4 w-4" />
        </button>
      </div>

      {/* Product Image */}
      <div 
        className="relative mb-3 aspect-square w-full overflow-hidden  bg-gray-50 cursor-pointer"
        onClick={handleQuickViewClick}
        onMouseEnter={() => {
          if (product.images.length > 1) setCurrentImageIndex(1);
        }}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <Image
          src={
            product.images && product.images.length > 0 && product.images[currentImageIndex]
              ? product.images[currentImageIndex]
              : product.images && product.images.length > 0 && product.images[0]
              ? product.images[0]
              : "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"
          }
          alt={product.name || "Product"}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col">
        {/* Product Title */}
        <h3 className="line-clamp-2 mb-1.5 text-sm font-semibold text-gray-800 transition-colors group-hover:text-[#F0A843]">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Real Review Star with Point */}
        <div className="mb-2 flex items-center gap-1.5 text-xs">
          <div className="flex items-center gap-1 text-[#F0A843]">
            <FaStar className="h-3 w-3 fill-current" />
            <span className="font-bold text-gray-900 text-xs">
              {(product.rating ? Number(product.rating) : 5.0).toFixed(1)}
            </span>
          </div>
          <span className="text-gray-400 text-[11px]">
            ({product.reviewsCount || 1})
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex h-10 min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-3 sm:px-3.5 text-xs font-bold transition-all cursor-pointer ${
              isAdded
                ? "bg-gray-900 text-white"
                : "bg-[#F0A843] text-gray-950 hover:bg-[#e09732] shadow-xs"
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            <FaShoppingBag className="h-3.5 w-3.5" />
            <span>{isAdded ? "Added!" : "Add"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

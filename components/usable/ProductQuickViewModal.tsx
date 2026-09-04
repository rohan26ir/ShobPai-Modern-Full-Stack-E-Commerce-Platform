"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaHeart, FaMinus, FaPlus, FaRegHeart, FaRegStar, FaStar, FaTimes } from "react-icons/fa";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductQuickViewModal({
  product,
  onClose,
}: ProductQuickViewModalProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  // Variant selections matching Vegist Shopify quickview
  const [selectedSize, setSelectedSize] = useState("1KG");
  const [selectedMaterial, setSelectedMaterial] = useState("CANADA");

  // Ticking countdown timer for sale banner initialized per product
  const [timeLeft, setTimeLeft] = useState({
    days: 8632,
    hours: 3,
    minutes: 4,
    seconds: 50,
  });

  useEffect(() => {
    if (product?.saleEndsIn) {
      setTimeLeft(product.saleEndsIn);
    } else {
      setTimeLeft({ days: 8632, hours: 3, minutes: 4, seconds: 50 });
    }
  }, [product]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!product) return null;

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity((prev) => Math.min(product.stock, prev + 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const sizes = ["1KG", "2KG", "5KG"];
  const materials = ["CANADA", "INDIA", "GERMANY"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl bg-white p-6 md:p-8 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
          title="Close Modal"
        >
          <FaTimes className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Gallery (Spans 5) */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            {/* Main Preview Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-50 border border-gray-100">
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>

            {/* Thumbnails Row */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-square w-full overflow-hidden rounded-sm border transition-all cursor-pointer bg-gray-50 p-1 ${activeImageIndex === idx
                    ? "border-[#F0A843] border-2 shadow-xs"
                    : "border-gray-200 hover:border-gray-400"
                    }`}
                >
                  <Image src={img} alt="" fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details & Purchase Form (Spans 7) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4 text-gray-800">
            <div>
              {/* Product Name */}
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-500">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) =>
                    i < Math.floor(product.rating) ? (
                      <FaStar key={i} className="h-3.5 w-3.5 fill-[#F0A843]" />
                    ) : (
                      <FaRegStar key={i} className="h-3.5 w-3.5 text-gray-300" />
                    )
                  )}
                </div>
                <span className="text-gray-400 text-xs ml-1">
                  {product.reviewsCount > 0 ? `${product.reviewsCount} review` : "No reviews"}
                </span>
              </div>

              {/* Availability */}
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-gray-700">
                <span>Availability:</span>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{product.stock} in stock</span>
                </div>
              </div>

              {/* Price & Discount Pill */}
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xl md:text-2xl font-bold text-gray-950">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discount && (
                  <span className="rounded-sm bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white uppercase">
                    {product.discount}%
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-3 text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-3">
                {product.shortDescription || product.description || "Fresh and sustainably sourced organic produce delivered straight from certified farms to your table."}
              </p>
            </div>

            {/* Sale Countdown Banner Box */}
            <div className="rounded-md bg-red-50/70 border border-red-100 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-red-600">Hurry up! Sale ends in:</span>
              <span className="font-bold text-red-600 font-mono tracking-wider">
                {String(timeLeft.days).padStart(4, "0")} : {String(timeLeft.hours).padStart(2, "0")} : {String(timeLeft.minutes).padStart(2, "0")} : {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>

            {/* Size Selector */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-gray-800">
                Size: <span className="font-semibold text-gray-600">{selectedSize.toLowerCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-sm border transition-all cursor-pointer ${selectedSize === s
                      ? "border-[#F0A843] bg-amber-50/40 text-gray-950 border-2"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Material / Origin Selector */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-gray-800">
                Material: <span className="font-semibold text-gray-600">{selectedMaterial}</span>
              </div>
              <div className="flex items-center gap-2">
                {materials.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMaterial(m)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-sm border transition-all cursor-pointer ${selectedMaterial === m
                      ? "border-[#F0A843] bg-amber-50/40 text-gray-950 border-2"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 text-xs font-bold text-gray-800">
              <span>Quantity:</span>
              <div className="flex items-center rounded-sm border border-gray-200 bg-gray-50">
                <button
                  onClick={handleDecrease}
                  className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer"
                >
                  <FaMinus className="h-2.5 w-2.5" />
                </button>
                <span className="w-9 text-center text-xs font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer"
                >
                  <FaPlus className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy It Now */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-sm bg-[#F0A843] hover:bg-[#e09732] text-gray-950 font-bold text-xs transition-colors shadow-xs cursor-pointer text-center"
                >
                  {isAdded ? "Added to cart!" : "Add to cart"}
                </button>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="py-3 px-4 rounded-sm bg-gray-900 hover:bg-black text-white !text-white font-bold text-xs transition-colors shadow-xs text-center block"
                >
                  <span className="text-white !text-white font-bold">Buy it now</span>
                </Link>
              </div>

              {/* Wishlist Link */}
              <button
                onClick={handleToggleWishlist}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#F0A843] transition-colors cursor-pointer"
              >
                {isWishlisted ? (
                  <FaHeart className="h-3.5 w-3.5 text-red-500 fill-current" />
                ) : (
                  <FaRegHeart className="h-3.5 w-3.5 text-gray-500" />
                )}
                <span>Wishlist</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

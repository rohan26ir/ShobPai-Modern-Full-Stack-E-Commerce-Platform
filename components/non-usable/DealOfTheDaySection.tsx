"use client";

import Image from "next/image";
import { useState } from "react";
import { FaFire, FaShoppingBag, FaStar } from "react-icons/fa";
import { Product, products } from "@/data/products";
import CountdownTimer from "@/components/usable/CountdownTimer";

interface DealOfTheDaySectionProps {
  onQuickView: (product: Product) => void;
}

export default function DealOfTheDaySection({ onQuickView }: DealOfTheDaySectionProps) {
  const dealProduct = products.find((p) => p.isDealOfDay) || products[0];
  const [isAdded, setIsAdded] = useState(false);

  const soldCount = dealProduct.sold || 45;
  const totalStock = dealProduct.stock + soldCount;
  const percentageSold = Math.round((soldCount / totalStock) * 100);

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <section className="py-12 bg-gray-950 text-white relative overflow-hidden">
      {/* Background glowing blur elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F0A843]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F0A843]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title & Timer Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0A843]/20 text-[#F0A843] border border-[#F0A843]/30">
              <FaFire className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F0A843]">
                Limited Time Flash Offer
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Deal of the Day
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-300 hidden lg:inline">
              Hurry up! Offer ends in:
            </span>
            <CountdownTimer />
          </div>
        </div>

        {/* Featured Deal Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gray-900/60 rounded-3xl p-6 md:p-8 border border-gray-800 backdrop-blur-md">
          {/* Deal Product Image */}
          <div className="lg:col-span-5 relative aspect-square w-full overflow-hidden rounded-2xl bg-white/5 border border-gray-800">
            <Image
              src={dealProduct.images[0]}
              alt={dealProduct.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {dealProduct.discount && (
              <span className="absolute top-4 left-4 rounded-full bg-red-500 px-3.5 py-1.5 text-xs font-black text-white shadow-lg">
                SAVE {dealProduct.discount}%
              </span>
            )}
          </div>

          {/* Deal Details */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-xs font-black uppercase tracking-widest text-[#F0A843] mb-1">
              {dealProduct.categoryName} • {dealProduct.unit}
            </span>
            <h3 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
              {dealProduct.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm text-[#F0A843] mb-4">
              <div className="flex items-center">
                <FaStar className="h-4 w-4 fill-current" />
                <span className="ml-1 font-bold text-white">{dealProduct.rating}</span>
              </div>
              <span className="text-gray-400">({dealProduct.reviewsCount} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl md:text-4xl font-extrabold text-white">
                ${dealProduct.price.toFixed(2)}
              </span>
              {dealProduct.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  ${dealProduct.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-300 mb-6 leading-relaxed line-clamp-2">
              {dealProduct.description}
            </p>

            {/* Stock Progress Bar */}
            <div className="mb-6 bg-gray-950 p-4 rounded-2xl border border-gray-800">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-gray-300">Already Sold: <strong className="text-[#F0A843]">{soldCount} items</strong></span>
                <span className="text-gray-300">Available: <strong className="text-white">{dealProduct.stock} items</strong></span>
              </div>
              <div className="h-3 w-full bg-gray-900 rounded-full overflow-hidden p-0.5 border border-gray-800">
                <div
                  className="h-full bg-[#F0A843] rounded-full transition-all duration-1000"
                  style={{ width: `${percentageSold}%` }}
                />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-black text-gray-950 transition-all shadow-lg ${
                  isAdded
                    ? "bg-gray-700 text-white"
                    : "bg-[#F0A843] hover:bg-[#e09732] shadow-[#F0A843]/20 cursor-pointer"
                }`}
              >
                <FaShoppingBag className="h-4 w-4" />
                <span>{isAdded ? "Added to Cart!" : "Claim Deal Now"}</span>
              </button>

              <button
                onClick={() => onQuickView(dealProduct)}
                className="py-4 px-6 rounded-2xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs transition-colors cursor-pointer"
              >
                Quick View
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

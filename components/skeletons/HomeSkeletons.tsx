"use client";

import React from "react";

export function CategoryCardSkeleton() {
  return (
    <div className="flex items-center gap-3 md:gap-4 p-2 md:p-4 bg-white animate-pulse">
      {/* Circle Image Avatar */}
      <div className="relative h-20 w-20 md:h-40 md:w-40 shrink-0 rounded-full bg-gray-200" />

      {/* Category Info */}
      <div className="space-y-2 min-w-0">
        <div className="h-4 w-20 md:w-28 bg-gray-200 rounded" />
        <div className="h-3 w-12 md:w-16 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export function CategorySliderSkeleton() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 py-2">
      {/* Display 3 on mobile/tablet and 4 on desktop to match Swiper breakpoints */}
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={`items-center gap-3 md:gap-4 p-2 md:p-4 bg-white animate-pulse ${
            index === 3 ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-36 md:w-36 rounded-full bg-gray-200 shrink-0" />
          <div className="space-y-2 min-w-0">
            <div className="h-3.5 md:h-4 w-16 md:w-24 bg-gray-200 rounded" />
            <div className="h-2.5 md:h-3 w-10 md:w-14 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col justify-between overflow-hidden bg-white p-2 animate-pulse">
      {/* Product Image Box */}
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-gray-200" />

      {/* Product Info */}
      <div className="flex flex-1 flex-col space-y-2.5">
        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-4 w-3/5 bg-gray-100 rounded" />
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-3.5 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-8 bg-gray-100 rounded" />
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="h-5 w-16 bg-gray-200 rounded" />
          <div className="h-9 w-20 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

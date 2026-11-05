import React, { useState } from "react";
import { TableProduct } from "../products.types";

interface ProductModalGalleryProps {
  product: TableProduct;
  activeDiscount: number;
}

export function ProductModalGallery({
  product,
  activeDiscount,
}: ProductModalGalleryProps) {
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80"];

  const [activeIdx, setActiveIdx] = useState(0);
  const currentImage = images[activeIdx] || images[0];

  return (
    <div className="space-y-3">
      {/* Primary Display */}
      <div className="relative aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800 overflow-hidden border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center p-3 shadow-2xs">
        <img
          src={currentImage}
          alt={product.name}
          className="max-h-full max-w-full object-contain rounded-xl transition-all duration-300"
        />

        {/* Discount Badge */}
        {activeDiscount > 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-500 text-white text-[11px] font-extrabold shadow-sm">
            -{activeDiscount}% OFF
          </span>
        )}

        {/* Custom Status Badge */}
        {product.badge && (
          <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#ff6c2f] text-white text-[10px] font-bold shadow-xs">
            {product.badge}
          </span>
        )}
      </div>

      {/* Thumbnails Carousel */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                activeIdx === idx
                  ? "border-[#ff6c2f] ring-2 ring-[#ff6c2f]/20 scale-102"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


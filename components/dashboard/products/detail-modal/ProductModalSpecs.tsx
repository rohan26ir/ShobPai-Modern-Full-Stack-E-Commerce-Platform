import React from "react";
import { Star, ShieldCheck, Clock, Thermometer, Box, TrendingUp, Sparkles } from "lucide-react";
import { TableProduct } from "../products.types";

interface ProductModalSpecsProps {
  product: TableProduct;
  sellingPrice: number;
  buyingPrice: number | null;
  unitProfit: number | null;
  marginPercent: number;
}

export function ProductModalSpecs({
  product,
  sellingPrice,
  buyingPrice,
  unitProfit,
  marginPercent,
}: ProductModalSpecsProps) {
  return (
    <div className="flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] text-xs font-semibold">
            {product.categoryName || product.category}
          </span>
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 text-[10px] font-bold">
              Featured
            </span>
          )}
          {product.isTrending && (
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 text-[10px] font-bold">
              Trending
            </span>
          )}
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1.5 leading-snug">
          {product.name}
        </h2>

        {/* Rating & Sold count */}
        <div className="flex items-center gap-2 mt-2 text-xs">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {(typeof product.rating === "number" ? product.rating : 5.0).toFixed(1)}
            </span>
          </div>
          <span className="text-slate-400">
            • {typeof product.reviewsCount === "number" ? product.reviewsCount : 0} reviews
          </span>
          <span className="text-slate-400">•</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {typeof product.sold === "number" ? product.sold : 0} Sold
          </span>
        </div>

        {/* Pricing & Profit Box */}
        <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ${sellingPrice.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Cost (Buying Price)</span>
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                {buyingPrice !== null ? `$${buyingPrice.toFixed(2)}` : "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Unit Profit Margin</span>
              {unitProfit !== null ? (
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                    {unitProfit >= 0 ? `+$${unitProfit.toFixed(2)}` : `-$${Math.abs(unitProfit).toFixed(2)}`}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-500">
                    ({marginPercent}% margin)
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 text-xs">—</span>
              )}
            </div>
          </div>
        </div>

        {/* 4-Card Specifications Grid */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-slate-400 mb-0.5 text-[10px] font-bold uppercase">
              <Box className="w-3 h-3 text-[#ff6c2f]" />
              <span>Unit & Packaging</span>
            </div>
            <p className="font-bold text-slate-800 dark:text-slate-200">{product.unit || "1 kg"}</p>
          </div>

          <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-slate-400 mb-0.5 text-[10px] font-bold uppercase">
              <Thermometer className="w-3 h-3 text-cyan-500" />
              <span>Storage</span>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {product.storage || "Standard"}
            </p>
          </div>

          <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-slate-400 mb-0.5 text-[10px] font-bold uppercase">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>Shelf Life</span>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {product.shelfLife || "Standard"}
            </p>
          </div>

          <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-slate-400 mb-0.5 text-[10px] font-bold uppercase">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Certifications</span>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {product.certifications || "Standard"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


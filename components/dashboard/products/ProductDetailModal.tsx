import React from "react";
import { Package, X, Star } from "lucide-react";
import { TableProduct } from "./products.types";

interface ProductDetailModalProps {
  product: TableProduct | null;
  onClose: () => void;
  onEdit: (product: TableProduct) => void;
}

export function ProductDetailModal({
  product: viewingProduct,
  onClose,
  onEdit,
}: ProductDetailModalProps) {
  if (!viewingProduct) return null;

  const sellingPrice = Number(viewingProduct.price || 0);
  const buyingPrice = viewingProduct.buyingPrice ? Number(viewingProduct.buyingPrice) : null;
  const unitProfit = buyingPrice !== null ? sellingPrice - buyingPrice : null;
  const marginPercent =
    unitProfit !== null && sellingPrice > 0
      ? Math.round((unitProfit / sellingPrice) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#ff6c2f]" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Product Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 [scrollbar-width:thin]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="relative aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-700/60 flex items-center justify-center p-4">
              <img
                src={viewingProduct.images?.[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"}
                alt={viewingProduct.name}
                className="max-h-full max-w-full object-contain rounded-xl"
              />
              {viewingProduct.badge && (
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#ff6c2f] text-white text-[10px] font-bold">
                  {viewingProduct.badge}
                </span>
              )}
            </div>

            {/* Details Column */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] text-xs font-semibold">
                  {viewingProduct.categoryName || viewingProduct.category}
                </span>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                  {viewingProduct.name}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {(viewingProduct.rating || 4.5).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    • {viewingProduct.reviewsCount || 45} customer reviews
                  </span>
                </div>

                {/* Price & Profit Card */}
                <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        ${sellingPrice.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1.5 font-medium">Selling Price</span>
                    </div>
                    {viewingProduct.originalPrice && viewingProduct.originalPrice > viewingProduct.price && (
                      <span className="text-xs text-slate-400 line-through">
                        ${viewingProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Buying Price (Cost)</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                        {buyingPrice !== null ? `$${buyingPrice.toFixed(2)}` : "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Profit Per Unit</span>
                      {unitProfit !== null ? (
                        <div className="flex items-baseline gap-1">
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                            +{unitProfit >= 0 ? `$${unitProfit.toFixed(2)}` : `-$${Math.abs(unitProfit).toFixed(2)}`}
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

                {/* Stock Pill */}
                <div className="mt-3 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${viewingProduct.stock > 0 ? "bg-emerald-500" : "bg-rose-500"}`} />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {viewingProduct.stock > 0 ? `${viewingProduct.stock} Units Left in Stock` : "Out of Stock"}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({viewingProduct.sold || Math.round(viewingProduct.stock * 0.4)} units sold)
                  </span>
                </div>

                {/* Sizes */}
                <div className="mt-4">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Available Sizes / Options:
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["S", "M", "L", "XL"].map((sz) => (
                      <span
                        key={sz}
                        className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Product Overview
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {viewingProduct.description || viewingProduct.shortDescription}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit(viewingProduct)}
            className="px-4 py-2 rounded-lg bg-[#ff6c2f] hover:bg-[#ea580c] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
}


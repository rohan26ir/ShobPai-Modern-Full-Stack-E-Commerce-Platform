import React from "react";
import Link from "next/link";
import { Package, X, Pencil, ExternalLink, CheckCircle2 } from "lucide-react";
import { TableProduct } from "./products.types";
import { ProductModalGallery } from "./detail-modal/ProductModalGallery";
import { ProductModalSpecs } from "./detail-modal/ProductModalSpecs";

interface ProductDetailModalProps {
  product: TableProduct | null;
  onClose: () => void;
  onEdit: (product: TableProduct) => void;
}

export function ProductDetailModal({
  product: viewingProduct,
  onClose,
}: ProductDetailModalProps) {
  if (!viewingProduct) return null;

  const sellingPrice = Number(viewingProduct.price || 0);
  const origPrice = Number(viewingProduct.originalPrice) || sellingPrice;
  const buyingPrice = viewingProduct.buyingPrice ? Number(viewingProduct.buyingPrice) : null;
  const unitProfit = buyingPrice !== null ? sellingPrice - buyingPrice : null;
  const marginPercent =
    unitProfit !== null && sellingPrice > 0
      ? Math.round((unitProfit / sellingPrice) * 100)
      : 0;

  const activeDiscount =
    typeof viewingProduct.discount === "number" && viewingProduct.discount > 0
      ? viewingProduct.discount
      : origPrice > sellingPrice && origPrice > 0
      ? Math.round(((origPrice - sellingPrice) / origPrice) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#ff6c2f]" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Product Overview
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {viewingProduct.slug && (
              <Link
                href={`/product/${viewingProduct.slug}`}
                target="_blank"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="View on public storefront"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Storefront</span>
              </Link>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 [scrollbar-width:thin]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Gallery Column (5 cols) */}
            <div className="md:col-span-5">
              <ProductModalGallery product={viewingProduct} activeDiscount={activeDiscount} />
            </div>

            {/* Specifications Column (7 cols) */}
            <div className="md:col-span-7">
              <ProductModalSpecs
                product={viewingProduct}
                sellingPrice={sellingPrice}
                buyingPrice={buyingPrice}
                unitProfit={unitProfit}
                marginPercent={marginPercent}
              />
            </div>
          </div>

          {/* Description & Overview */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Description & Highlights
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {viewingProduct.description || viewingProduct.shortDescription || "No detailed description provided."}
            </p>
          </div>

          {/* Nutritional Benefits (Matching Fuji Apples detail page) */}
          {Array.isArray(viewingProduct.nutritionalBenefits) && viewingProduct.nutritionalBenefits.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Nutritional Benefits
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {viewingProduct.nutritionalBenefits.map((benefit, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <span className="text-[11px] text-slate-400 font-mono">
            ID: {viewingProduct.id}
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
            <Link
              href={`/dashboard/product/update?id=${viewingProduct.id}`}
              className="px-4 py-2 rounded-xl bg-[#ff6c2f] hover:bg-[#ea580c] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shadow-orange-500/20"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Product</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

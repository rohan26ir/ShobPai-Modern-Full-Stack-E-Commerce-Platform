import React, { useState } from "react";
import { Star, Truck, CheckCircle2, Shield, RotateCcw, Eye } from "lucide-react";
import { ProductAddFormData } from "./productAdd.types";

interface ProductDetailPreviewCardProps {
  form: ProductAddFormData;
  numericPrice: number;
}

export function ProductDetailPreviewCard({
  form,
  numericPrice,
}: ProductDetailPreviewCardProps) {
  const [activeTab, setActiveTab] = useState<"desc" | "specs">("desc");
  const origPrice = Number(form.originalPrice) || numericPrice;
  const discountPct =
    typeof form.discount === "number" && form.discount > 0
      ? form.discount
      : origPrice > numericPrice && origPrice > 0
      ? Math.round(((origPrice - numericPrice) / origPrice) * 100)
      : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#ff6c2f]" />
          Live /product/[slug] Preview
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-400">
          Matches Fuji Apples Page
        </span>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3 text-xs">
        {/* Breadcrumb Preview */}
        <p className="text-[10px] text-slate-400 font-medium truncate">
          Home / Shop / <span className="text-[#ff6c2f]">{form.category}</span> /{" "}
          <span className="text-slate-700 dark:text-slate-300 font-bold">{form.name || "Product Name"}</span>
        </p>

        {/* Gallery & Header snippet */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5 relative aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            {form.images[0] && (
              <img src={form.images[0]} alt="preview" className="w-full h-full object-cover" />
            )}
            {discountPct > 0 && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-bold">
                -{discountPct}% OFF
              </span>
            )}
          </div>

          <div className="sm:col-span-7 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-[#ff6c2f] block tracking-wider">
              {form.category} • Unit: {form.unit || "1 kg"}
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
              {form.name || "Organic Crisp Fuji Apples"}
            </h3>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
              <span className="text-[10px] text-slate-400 font-normal ml-1">
                5.0 (52 Reviews) • 110 Sold
              </span>
            </div>

            {/* Price Preview */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-lg font-black text-slate-900 dark:text-white">
                ${numericPrice.toFixed(2)}
              </span>
              {origPrice > numericPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${origPrice.toFixed(2)}
                </span>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold">
                In Stock ({form.stock || 0})
              </span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#ff6c2f] shrink-0" />
            <span>Free Express Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>100% Farm Fresh</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#ff6c2f] shrink-0" />
            <span>Satisfaction Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-[#ff6c2f] shrink-0" />
            <span>7 Days Fresh Return</span>
          </div>
        </div>

        {/* Tab switch preview */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="flex gap-4 border-b border-slate-200/60 dark:border-slate-700/60 pb-1 font-bold text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab("desc")}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === "desc"
                  ? "text-[#ff6c2f] border-b-2 border-[#ff6c2f]"
                  : "text-slate-400"
              }`}
            >
              Full Description & Benefits
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === "specs"
                  ? "text-[#ff6c2f] border-b-2 border-[#ff6c2f]"
                  : "text-slate-400"
              }`}
            >
              Nutrition & Origin
            </button>
          </div>

          {activeTab === "desc" ? (
            <div className="pt-2 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
              <p className="line-clamp-2">
                {form.description || "Detailed farm-fresh organic description..."}
              </p>
              {form.nutritionalBenefits.length > 0 && (
                <ul className="list-disc pl-4 space-y-1 text-[10px] text-slate-700 dark:text-slate-300">
                  {form.nutritionalBenefits.slice(0, 3).map((b, idx) => (
                    <li key={idx} className="line-clamp-1">
                      {b}
                    </li>
                  ))}
                  {form.nutritionalBenefits.length > 3 && (
                    <span className="text-[10px] text-[#ff6c2f] font-semibold block">
                      +{form.nutritionalBenefits.length - 3} more benefits listed
                    </span>
                  )}
                </ul>
              )}
            </div>
          ) : (
            <div className="pt-2 grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-400 block font-medium">Storage:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {form.storage || "Refrigerate at 4°C - 8°C"}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-400 block font-medium">Shelf Life:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {form.shelfLife || "5 - 7 Days"}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 col-span-2">
                <span className="text-slate-400 block font-medium">Certifications:</span>
                <span className="font-bold text-[#ff6c2f] truncate block">
                  {form.certifications || "100% USDA Organic"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


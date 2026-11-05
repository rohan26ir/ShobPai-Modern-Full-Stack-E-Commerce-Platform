import React from "react";
import { DollarSign, TrendingUp, Sparkles, Percent } from "lucide-react";

interface PricingStockSectionProps {
  price: number | "";
  buyingPrice: number | "";
  originalPrice: number | "";
  discount: number | "";
  stock: number | "";
  sku: string;
  unitProfit: number;
  marginPct: string;
  projectedTotalProfit: number;
  onUpdate: (key: any, value: any) => void;
  onGenerateSku: () => void;
}

export function PricingStockSection({
  price,
  buyingPrice,
  originalPrice,
  discount,
  stock,
  sku,
  unitProfit,
  marginPct,
  projectedTotalProfit,
  onUpdate,
  onGenerateSku,
}: PricingStockSectionProps) {
  const numericPrice = Number(price) || 0;
  const numericOriginal = Number(originalPrice) || 0;
  const activeDiscount =
    typeof discount === "number" && discount > 0
      ? discount
      : numericOriginal > numericPrice && numericOriginal > 0
      ? Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100)
      : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#ff6c2f]" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Pricing, Discount & Inventory
          </h2>
        </div>
        {activeDiscount > 0 && (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            {activeDiscount}% Discount Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Selling Price ($) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={price}
              onChange={(e) => onUpdate("price", e.target.value === "" ? "" : parseFloat(e.target.value))}
              className="w-full h-10 pl-7 pr-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Original Price ($)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={originalPrice}
              onChange={(e) => onUpdate("originalPrice", e.target.value === "" ? "" : parseFloat(e.target.value))}
              className="w-full h-10 pl-7 pr-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Discount (%)
            </label>
            <span className="text-[10px] text-rose-500 font-bold">% OFF</span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              <Percent className="w-3 h-3" />
            </span>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 24"
              value={discount}
              onChange={(e) => onUpdate("discount", e.target.value === "" ? "" : parseFloat(e.target.value))}
              className="w-full h-10 pl-7 pr-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-400"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Buying Price ($)
            </label>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Cost</span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={buyingPrice}
              onChange={(e) => onUpdate("buyingPrice", e.target.value === "" ? "" : parseFloat(e.target.value))}
              className="w-full h-10 pl-7 pr-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Profit Measurement Box */}
      <div
        className={`p-3.5 rounded-xl border transition-all ${
          unitProfit > 0
            ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/60"
            : unitProfit < 0
            ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/80 dark:border-rose-800/60"
            : "bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
              Estimated Profit Per Unit:
            </span>
            <span
              className={`font-extrabold text-sm ${
                unitProfit > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : unitProfit < 0
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {unitProfit >= 0 ? `+$${unitProfit.toFixed(2)}` : `-$${Math.abs(unitProfit).toFixed(2)}`}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                unitProfit > 0
                  ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              {marginPct}% margin
            </span>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Projected Batch Profit:{" "}
            <strong className="text-slate-800 dark:text-slate-200 font-bold">
              ${projectedTotalProfit.toFixed(2)}
            </strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Initial Stock Quantity *
          </label>
          <input
            type="number"
            min="0"
            required
            value={stock}
            onChange={(e) => onUpdate("stock", e.target.value === "" ? "" : parseInt(e.target.value))}
            className="w-full h-10 px-3.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Product SKU Code
            </label>
            <button
              type="button"
              onClick={onGenerateSku}
              className="text-[11px] text-[#ff6c2f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Auto Generate</span>
            </button>
          </div>
          <input
            type="text"
            value={sku}
            onChange={(e) => onUpdate("sku", e.target.value)}
            placeholder="e.g. SKU-FRU-8421"
            className="w-full h-10 px-3.5 text-xs font-mono font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
          />
        </div>
      </div>
    </div>
  );
}

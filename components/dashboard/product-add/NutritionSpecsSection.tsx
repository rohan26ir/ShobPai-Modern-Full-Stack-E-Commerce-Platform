import React from "react";
import { Sparkles, Plus, Trash2, ShieldCheck } from "lucide-react";
import { NUTRITION_SUGGESTIONS } from "./productAdd.constants";

interface NutritionSpecsSectionProps {
  storage: string;
  shelfLife: string;
  certifications: string;
  nutritionalBenefits: string[];
  newBenefitInput: string;
  onSetNewBenefitInput: (val: string) => void;
  onAddBenefit: (text?: string) => void;
  onRemoveBenefit: (idx: number) => void;
  onUpdate: (key: any, value: any) => void;
}

export function NutritionSpecsSection({
  storage,
  shelfLife,
  certifications,
  nutritionalBenefits,
  newBenefitInput,
  onSetNewBenefitInput,
  onAddBenefit,
  onRemoveBenefit,
  onUpdate,
}: NutritionSpecsSectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <ShieldCheck className="w-4 h-4 text-[#ff6c2f]" />
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Nutrition, Origin & Specifications
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Rendered inside the "Nutrition & Origin" and "Full Description" tabs on the product page.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Storage Temperature / Place
          </label>
          <input
            type="text"
            value={storage}
            onChange={(e) => onUpdate("storage", e.target.value)}
            placeholder="e.g. Refrigerate at 4°C - 8°C"
            className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Shelf Life
          </label>
          <input
            type="text"
            value={shelfLife}
            onChange={(e) => onUpdate("shelfLife", e.target.value)}
            placeholder="e.g. 5 - 7 Days"
            className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Certifications
          </label>
          <input
            type="text"
            value={certifications}
            onChange={(e) => onUpdate("certifications", e.target.value)}
            placeholder="e.g. 100% USDA Organic"
            className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
          />
        </div>
      </div>

      {/* Nutritional Benefits Builder */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
          Nutritional Benefits List (Bullet Points with Title & Description)
        </label>

        {/* Suggestion Quick Add Buttons */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium py-1">Suggestions:</span>
          {NUTRITION_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onAddBenefit(sug)}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-[#ff6c2f] dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              + {sug.split(" – ")[0]}
            </button>
          ))}
        </div>

        {/* List of active benefits */}
        <div className="space-y-2">
          {nutritionalBenefits.map((benefit, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs"
            >
              <span className="w-5 h-5 rounded-full bg-[#ff6c2f]/10 text-[#ff6c2f] text-[10px] font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <p className="flex-1 text-slate-700 dark:text-slate-300 leading-snug">
                {benefit}
              </p>
              <button
                type="button"
                onClick={() => onRemoveBenefit(idx)}
                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Input to add custom benefit */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newBenefitInput}
            onChange={(e) => onSetNewBenefitInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddBenefit();
              }
            }}
            placeholder="e.g. Rich In Vitamin C – Enhances natural immune defenses."
            className="flex-1 h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
          />
          <button
            type="button"
            onClick={() => onAddBenefit()}
            className="h-10 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Benefit</span>
          </button>
        </div>
      </div>
    </div>
  );
}


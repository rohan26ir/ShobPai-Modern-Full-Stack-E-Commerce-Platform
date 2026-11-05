import React from "react";
import { ShoppingBag } from "lucide-react";
import { Category } from "@/data/categories";

interface GeneralInfoSectionProps {
  name: string;
  slug: string;
  category: string;
  badge: string;
  unit: string;
  shortDesc: string;
  description: string;
  categories?: Category[];
  onUpdate: (key: any, value: any) => void;
}

export function GeneralInfoSection({
  name,
  slug,
  category,
  badge,
  unit,
  shortDesc,
  description,
  categories,
  onUpdate,
}: GeneralInfoSectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <ShoppingBag className="w-4 h-4 text-[#ff6c2f]" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          General Information
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Product Title / Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => onUpdate("name", e.target.value)}
            placeholder="e.g. Organic Crisp Fuji Apples"
            className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Product URL Slug *
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => onUpdate("slug", e.target.value)}
            placeholder="e.g. organic-crisp-fuji-apples"
            className="w-full h-10 px-3.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => onUpdate("category", e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
          >
            <option value="fresh-fruits">Fresh Fruits</option>
            <option value="vegetables">Fresh Vegetables</option>
            <option value="groceries">Groceries & Pantry</option>
            <option value="beverages">Beverages</option>
            <option value="fashion">Fashion & Apparel</option>
            <option value="electronics">Electronics & Tech</option>
            {categories?.map((c) => (
              <option key={c.id || c.slug} value={c.slug || c.name.toLowerCase()}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Unit / Size *
          </label>
          <input
            type="text"
            required
            value={unit}
            onChange={(e) => onUpdate("unit", e.target.value)}
            placeholder="e.g. 1 kg, 500g, or Size : S, M"
            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Badge / Pill
          </label>
          <select
            value={badge}
            onChange={(e) => onUpdate("badge", e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
          >
            <option value="">No Badge</option>
            <option value="Trending">Trending</option>
            <option value="Bestseller">Bestseller</option>
            <option value="Hot Deal">Hot Deal</option>
            <option value="Organic">100% Organic</option>
            <option value="New">New Arrival</option>
            <option value="Popular">Popular</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
          Short Summary (Top Section Highlight)
        </label>
        <input
          type="text"
          value={shortDesc}
          onChange={(e) => onUpdate("shortDesc", e.target.value)}
          placeholder="e.g. Sweet, crisp and pesticide-free fresh orchard apples with golden blush."
          className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
          Full Overview Description (Under Details Tab)
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="Elaborate details about origin, harvest practices, flavor profile, and quality..."
          className="w-full p-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
        />
      </div>
    </div>
  );
}


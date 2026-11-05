"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  ChevronRight,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { TopProduct } from "./types";

interface TopSellingProductsProps {
  products: TopProduct[];
  loading?: boolean;
}

export function TopSellingProducts({ products, loading = false }: TopSellingProductsProps) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs animate-pulse">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-md mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Stock badge styling
  const renderStockBadge = (product: TopProduct) => {
    switch (product.stockStatus) {
      case "in-stock":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
            <CheckCircle2 className="w-3 h-3" />
            <span>{product.stock} in stock</span>
          </span>
        );
      case "low-stock":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/40 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>Only {product.stock} left</span>
          </span>
        );
      case "out-of-stock":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200/60 dark:border-rose-800/40">
            <XCircle className="w-3 h-3" />
            <span>Sold out</span>
          </span>
        );
    }
  };

  // Rank badge styling
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return "bg-[#E5A842] text-slate-950 shadow-xs font-black";
    }
    if (rank === 2) {
      return "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-bold";
    }
    if (rank === 3) {
      return "bg-amber-700/20 text-amber-800 dark:text-amber-300 font-bold";
    }
    return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-semibold";
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-[#E5A842] dark:bg-amber-500/20">
                <Award className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Top Selling Products
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Highest grossing inventory ranked by revenue contribution
            </p>
          </div>
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#E5A842] hover:text-[#d49633] transition-colors"
          >
            <span>Catalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Items List */}
        <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/60">
          {products.map((product) => (
            <div
              key={product.id}
              className="py-3 sm:py-3.5 flex items-center justify-between gap-3 group hover:bg-slate-50/70 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-all"
            >
              {/* Left Group: Rank, Thumbnail, Name, Category */}
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0 ${getRankBadge(
                    product.rank
                  )}`}
                >
                  #{product.rank}
                </span>

                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-700">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="44px"
                  />
                </div>

                <div className="min-w-0">
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-[#E5A842] transition-colors truncate block max-w-[160px] sm:max-w-xs"
                    title={product.name}
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {product.category}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {product.unitsSold.toLocaleString()} sold
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Group: Stock badge & Revenue */}
              <div className="text-right shrink-0">
                <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  ${product.revenue.toLocaleString()}
                </p>
                <div className="mt-1">{renderStockBadge(product)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


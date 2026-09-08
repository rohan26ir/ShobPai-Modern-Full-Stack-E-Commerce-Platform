"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaCopy, FaCheck, FaArrowRight, FaCheckCircle, FaTag } from "react-icons/fa";

import { api } from "@/lib/api";

import promobanner1 from "@/public/sections/promobanner-01.webp";
import promobanner2 from "@/public/sections/promobanner-02.webp";
import promobanner3 from "@/public/sections/promobanner-03.jpg";

interface CouponItem {
  id?: string;
  code: string;
  discountPercentage: number;
  minSpend: number;
  description: string;
  expiresAt?: string | null;
  tag?: string;
}

const DEFAULT_COUPONS: CouponItem[] = [
  {
    code: "FRESH2026",
    discountPercentage: 20,
    minSpend: 25,
    description: "20% off on all organic vegetables and farm produce. Limited time!",
    tag: "Most Popular",
  },
  {
    code: "ORGANIC15",
    discountPercentage: 15,
    minSpend: 40,
    description: "Get 15% off your entire basket on fresh fruits and dairy products.",
    tag: "Sitewide",
  },
  {
    code: "WELCOME10",
    discountPercentage: 10,
    minSpend: 15,
    description: "First-time shopper welcome offer with no minimum items constraint.",
    tag: "New Shopper",
  },
  {
    code: "MEGA25",
    discountPercentage: 25,
    minSpend: 80,
    description: "Save big with 25% off when you stock up with orders over $80.",
    tag: "Bulk Saver",
  },
];

const OFFER_BANNERS = [
  {
    id: "b1",
    subtitle: "Only Today",
    title: "Fresh & Handmade",
    discount: "Save Up To 30%",
    link: "/shop?category=vegetables",
    image: promobanner1,
  },
  {
    id: "b2",
    subtitle: "100% HEALTHY",
    title: "Organic Fresh Fruits",
    discount: "Flat 25% Discount",
    link: "/shop?category=fresh-fruits",
    image: promobanner2,
  },
  {
    id: "b3",
    subtitle: "Prod of Bangladesh",
    title: "Organic Fresh Drinks",
    discount: "Flat 20% Discount",
    link: "/shop?category=beverages",
    image: promobanner3,
  },
];

export default function OffersPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>(DEFAULT_COUPONS);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoupons() {
      try {
        const liveCoupons = await api.getCoupons();
        if (liveCoupons && liveCoupons.length > 0) {
          const formatted: CouponItem[] = liveCoupons.map((c: any) => ({
            id: c.id,
            code: c.code,
            discountPercentage: c.discountPercentage,
            minSpend: c.minSpend,
            description: c.description || `${c.discountPercentage}% discount on your entire purchase!`,
            expiresAt: c.expiresAt,
            tag: c.discountPercentage >= 20 ? "Mega Saver" : "Verified Active",
          }));
          setCoupons(formatted);
        }
      } catch {
        // Keep DEFAULT_COUPONS
      } finally {
        setLoading(false);
      }
    }
    loadCoupons();
  }, []);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(
        <span>
          Coupon <strong>{code}</strong> copied to clipboard!
        </span>,
        {
          icon: <FaCheckCircle className="text-emerald-500" />,
          duration: 3000,
        }
      );
      setTimeout(() => setCopiedCode(null), 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 1. Header matching Category Page style */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          All Offers & Coupons
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our active discount vouchers, special promotions, and seasonal savings. Copy any coupon code to apply at checkout!
        </p>
      </div>

      {/* 2. Coupons Grid or Loading State */}
      {loading && coupons.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          Loading live offers from database...
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          No offers found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {coupons.map((c) => {
            const isCopied = copiedCode === c.code;
            return (
              <div
                key={c.code}
                className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white p-5 flex flex-col justify-between"
              >
                {/* Header Tag & Min Spend */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                      {c.tag || "Active"}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      Min spend: ${c.minSpend}
                    </span>
                  </div>

                  {/* Discount Value */}
                  <div className="mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-gray-900">
                        {c.discountPercentage}%
                      </span>
                      <span className="text-lg font-bold text-[#E5A842]">OFF</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {c.description}
                    </p>
                  </div>
                </div>

                {/* Divider & Copy Button */}
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                  <button
                    onClick={() => handleCopyCode(c.code)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                      isCopied
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-800 hover:border-[#E5A842] hover:bg-amber-50/40"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <FaTag className="h-3 w-3 text-gray-400" />
                      <span className="font-mono tracking-wider">{c.code}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isCopied ? (
                        <>
                          <FaCheck className="h-3 w-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <FaCopy className="h-3 w-3 text-gray-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Promotional Category Banners Section */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
          Featured Deals by Category
        </h2>
        <p className="text-xs text-gray-500 text-center mb-6 max-w-xl mx-auto">
          Save on our hand-selected organic categories with instant discounts
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFER_BANNERS.map((b) => (
            <Link
              key={b.id}
              href={b.link}
              className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow relative min-h-48 p-6 flex flex-col justify-center group"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={b.image}
                  alt={b.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-white/75 group-hover:bg-white/65 transition-colors" />
              </div>

              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-1">
                  {b.subtitle}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {b.title}
                </h3>
                <p className="text-xs font-bold text-[#E5A842] mb-3">
                  {b.discount}
                </p>

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-800 group-hover:text-black">
                  <span>Shop Category</span>
                  <FaArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
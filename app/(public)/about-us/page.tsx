"use client";

import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle, FaLeaf, FaTruck, FaUsers } from "react-icons/fa";

export default function AboutUsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            About Vegist & ShobPai
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2">
            Bringing Farm-Fresh Organic Produce to Your Doorstep
          </h1>
          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            Founded in 2026, Vegist is dedicated to bridging local organic farmers directly with conscious consumers. We eliminate middle-man delays to deliver crisp, pesticide-free fruits and vegetables at peak freshness.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-emerald-50/60 border border-emerald-100 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <FaLeaf className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">100% Certified Organic</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every apple, tomato, and leafy green is grown without synthetic chemicals or toxic pesticides.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-amber-50/60 border border-amber-100 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <FaTruck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Same-Day Express Delivery</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Harvested early in the morning, carefully packed in temperature-controlled vans, and delivered by afternoon.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-teal-50/60 border border-teal-100 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white">
              <FaUsers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Supporting Local Farmers</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We partner with over 45 certified family farms, ensuring fair wages and sustainable soil agricultural practices.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-emerald-950 text-white rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Ready to Taste Real Farm Freshness?
          </h2>
          <p className="text-xs text-emerald-200 mb-6 max-w-lg mx-auto">
            Order your first organic produce box today and receive a 15% discount with code <strong>FRESH2026</strong>.
          </p>
          <Link
            href="/shop"
            className="inline-block rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3.5 text-xs font-bold transition-all shadow-md"
          >
            Explore Fresh Store
          </Link>
        </div>

      </div>
    </div>
  );
}
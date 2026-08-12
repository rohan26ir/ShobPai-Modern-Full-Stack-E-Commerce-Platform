"use client";

import Image from "next/image";
import { FaStar, FaRegStar, FaCheckCircle, FaTrashAlt, FaCommentAlt } from "react-icons/fa";
import { products } from "@/data/products";

export default function ReviewsPage() {
  const reviews = [
    {
      id: "rev-1",
      product: products[0],
      rating: 5,
      date: "August 8, 2026",
      comment: "Super fresh red tomatoes! Perfect for my home-made pasta sauce and organic salads.",
      status: "Verified Purchase",
    },
    {
      id: "rev-2",
      product: products[1],
      rating: 5,
      date: "July 29, 2026",
      comment: "Crisp and juicy sweet apples. Delivered right on time with eco-friendly packaging.",
      status: "Verified Purchase",
    },
    {
      id: "rev-3",
      product: products[2],
      rating: 4,
      date: "July 14, 2026",
      comment: "Great quality milk and cheese. Tastes completely fresh and organic.",
      status: "Verified Purchase",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842]">
        <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
          Feedback & Customer Voice
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
          My Product Reviews & Ratings
        </h1>
        <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
          Review your submitted ratings, star feedback, and verified customer testimonials.
        </p>
      </div>

      {/* Reviews List Cards */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                <Image src={rev.product.images[0]} alt={rev.product.name} fill className="object-cover" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#E5A842]">{rev.product.categoryName}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-semibold text-gray-400">{rev.date}</span>
                </div>

                <h3 className="text-base font-bold text-gray-900">{rev.product.name}</h3>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-current text-[#E5A842]" : "text-gray-200"}`}
                    />
                  ))}
                  <span className="ml-1 text-xs font-bold text-gray-700">{rev.rating}.0</span>
                </div>

                {/* Review Comment */}
                <p className="text-xs text-gray-600 leading-relaxed pt-1 italic">
                  "{rev.comment}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:flex-col md:items-end gap-3 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
                <FaCheckCircle className="h-3 w-3" />
                <span>{rev.status}</span>
              </span>

              <button className="text-gray-400 hover:text-red-500 transition-colors p-2 cursor-pointer" title="Delete Review">
                <FaTrashAlt className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

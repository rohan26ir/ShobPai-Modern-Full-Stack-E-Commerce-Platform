"use client";

import React, { useState } from "react";
import { Star, X, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface ReviewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string | null;
  user: any;
  orderNumber?: string;
  item: {
    productId: string;
    productName: string;
    productImage?: string;
    price?: number;
  };
  onSuccess?: (productId: string) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor 😞",
  2: "Fair 😐",
  3: "Good 🙂",
  4: "Very Good 😊",
  5: "Excellent! 🌟",
};

const QUICK_TAGS = [
  "Fresh & Organic",
  "High Quality",
  "Great Packaging",
  "Fast Delivery",
  "Value for Money",
];

export function ReviewProductModal({
  isOpen,
  onClose,
  token,
  user,
  orderNumber,
  item,
  onSuccess,
}: ReviewProductModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleTagClick = (tag: string) => {
    setComment((prev) => (prev ? `${prev} • ${tag}` : tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMessage("Please write a few words about your experience with this product.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await api.createReview(
        {
          productId: item.productId,
          rating,
          comment: comment.trim(),
          reviewerName: user?.displayName || user?.email?.split("@")[0] || "Verified Buyer",
          avatar: user?.photoURL || undefined,
        },
        token
      );

      toast.success(
        <span>
          Thank you! Review for <strong>{item.productName}</strong> submitted.
        </span>,
        { icon: <CheckCircle2 className="text-emerald-500 w-5 h-5" /> }
      );

      if (onSuccess) {
        onSuccess(item.productId);
      }
      onClose();
    } catch (err: any) {
      const msg = err?.message || "Failed to submit review. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Review Delivered Product
              </h3>
              <span className="text-[11px] text-slate-400">
                Order #{orderNumber || "Completed"} • 1 review per delivered purchase
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Product Preview Card */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-white dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
              <img
                src={
                  item.productImage ||
                  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80"
                }
                alt={item.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                  Delivered
                </span>
                {item.price !== undefined && (
                  <span className="text-xs font-semibold text-slate-500">
                    ${item.price.toFixed(2)}
                  </span>
                )}
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                {item.productName}
              </h4>
            </div>
          </div>

          {/* Star Rating Section */}
          <div className="space-y-1.5 text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              How would you rate this product?
            </span>
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 text-2xl sm:text-3xl transition-transform hover:scale-115 cursor-pointer focus:outline-none"
                  aria-label={`${s} Stars`}
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                      s <= displayRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200 dark:text-slate-700"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block h-4">
              {RATING_LABELS[displayRating] || ""}
            </span>
          </div>

          {/* Quick Feedback Tags */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Quick feedback tags (optional):</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition-colors cursor-pointer bg-white dark:bg-slate-800"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Written Feedback Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Your Review & Experience
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Tell others about the freshness, flavor, delivery condition, and if you would recommend it..."
              className="w-full text-xs rounded-xl p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] resize-none"
            />
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


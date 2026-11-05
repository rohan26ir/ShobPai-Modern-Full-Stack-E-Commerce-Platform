"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  X,
  CreditCard,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function DashboardCartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();

  // Coupon Voucher State
  const [couponCode, setCouponCode] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercentage: number;
    discountAmount: number;
  } | null>(null);

  // Dynamic calculations
  const discountAmount = appliedCoupon
    ? appliedCoupon.discountAmount > 0
      ? appliedCoupon.discountAmount
      : (subtotal * appliedCoupon.discountPercentage) / 100
    : 0;

  // Free shipping threshold at $50
  const freeShippingThreshold = 50;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 4.99;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Handle Coupon Apply
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const res = await api.validateCoupon(couponCode.trim(), subtotal);
      if (res && res.valid) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discountPercentage: res.discountPercentage,
          discountAmount: res.discountAmount,
        });
        toast.success(`Coupon applied! ${res.discountPercentage}% discount added.`);
        setCouponCode("");
      } else {
        // Fallback for demo coupon
        if (couponCode.trim().toUpperCase() === "FRESH2026") {
          setAppliedCoupon({
            code: "FRESH2026",
            discountPercentage: 15,
            discountAmount: (subtotal * 15) / 100,
          });
          toast.success("Coupon FRESH2026 applied! (15% OFF)");
          setCouponCode("");
        } else {
          toast.error(res?.message || "Invalid or expired coupon code. Try 'FRESH2026'");
        }
      }
    } catch {
      if (couponCode.trim().toUpperCase() === "FRESH2026") {
        setAppliedCoupon({
          code: "FRESH2026",
          discountPercentage: 15,
          discountAmount: (subtotal * 15) / 100,
        });
        toast.success("Coupon FRESH2026 applied! (15% OFF)");
        setCouponCode("");
      } else {
        toast.error("Could not validate coupon. Try 'FRESH2026'");
      }
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed.");
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
            <Link href="/dashboard" className="hover:text-[#ff6c2f] transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300">Shopping Cart</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Shopping Cart
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] border border-orange-200/60 dark:border-orange-800/40">
              {cartItems.length} {cartItems.length === 1 ? "Product" : "Products"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your selected products, manage quantities, and proceed directly to checkout.
          </p>
        </div>

        {cartItems.length > 0 && (
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your cart?")) {
                  clearCart();
                  toast.success("Shopping cart cleared.");
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Free Shipping Progress Bar (if items present) */}
      {cartItems.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Truck className="w-4 h-4 text-[#ff6c2f]" />
              {isFreeShipping ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Congratulations! You qualified for FREE Delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="text-[#ff6c2f]">${amountToFreeShipping.toFixed(2)}</strong> more to get <strong className="text-emerald-600 dark:text-emerald-400">FREE Shipping</strong>!
                </span>
              )}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[11px]">
              ${subtotal.toFixed(2)} / ${freeShippingThreshold}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#ff6c2f] h-full transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 3. Main Content: Empty State or Cart Items Grid */}
      {cartItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-10 sm:p-14 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto">
          <div className="h-16 w-16 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Your Shopping Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1.5 mb-6 max-w-sm">
            Looks like you haven&apos;t added any items to your bag yet. Explore our grocery and retail catalog to find fresh items!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff6c2f] hover:bg-[#e05b24] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard/wishlist"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              <span>View Saved Wishlist</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-xs">
              {/* Desktop Header */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <span className="sm:col-span-6">Product Details</span>
                <span className="sm:col-span-2 text-center">Unit Price</span>
                <span className="sm:col-span-2 text-center">Quantity</span>
                <span className="sm:col-span-2 text-right">Subtotal</span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {cartItems.map(({ product, quantity }) => {
                  const itemSubtotal = (product.price || 0) * quantity;

                  return (
                    <div
                      key={product.id}
                      className="p-4 sm:p-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-start sm:items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Product Info (Col 6) */}
                      <div className="sm:col-span-6 flex items-center gap-3.5 w-full">
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shrink-0">
                          {product.images && product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-[#ff6c2f] uppercase tracking-wider block">
                            {product.categoryName || product.category || "Grocery"}
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-[#ff6c2f] transition-colors mt-0.5">
                            <Link href={`/product/${product.slug || product.id}`}>
                              {product.name}
                            </Link>
                          </h3>
                          {product.unit && (
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                              Unit: {product.unit}
                            </span>
                          )}

                          <button
                            onClick={() => {
                              removeFromCart(product.id);
                              toast.success(`${product.name} removed from cart`);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 mt-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Mobile Row for Price, Stepper, Total */}
                      <div className="flex sm:contents items-center justify-between w-full pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        {/* Unit Price (Col 2) */}
                        <div className="sm:col-span-2 sm:text-center">
                          <span className="text-[10px] text-slate-400 font-medium uppercase sm:hidden block">
                            Price
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity Stepper (Col 2) */}
                        <div className="sm:col-span-2 flex items-center justify-center">
                          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/80 p-0.5">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              disabled={quantity <= 1}
                              className="h-7 w-7 rounded-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-800 dark:text-white">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              disabled={(product.stock ?? 99) <= quantity}
                              className="h-7 w-7 rounded-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal (Col 2) */}
                        <div className="sm:col-span-2 sm:text-right">
                          <span className="text-[10px] text-slate-400 font-medium uppercase sm:hidden block">
                            Subtotal
                          </span>
                          <span className="text-sm font-black text-slate-900 dark:text-white">
                            ${itemSubtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Help Note */}
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 px-1">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6c2f] shrink-0" />
              <span>
                Standard home delivery takes 24–48 hours across Bangladesh. Free delivery applies automatically on orders over $50!
              </span>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 shadow-xs sticky top-20">
              <h2 className="text-base font-bold text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Order Summary
              </h2>

              {/* Coupon Voucher Form */}
              <div className="py-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Have a Promotional Code?
                </span>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                          {appliedCoupon.discountPercentage}% discount active
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. FRESH2026"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono uppercase text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {isValidatingCoupon ? "..." : "Apply"}
                    </button>
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="py-4 space-y-2.5 text-xs border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <span>Discount ({appliedCoupon?.code})</span>
                    </span>
                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Estimated Shipping</span>
                  {isFreeShipping ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      ${shippingFee.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 text-[11px]">
                  <span>Estimated Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="py-4 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Total Amount
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Including all discounts & fees
                  </span>
                </div>
                <span className="text-2xl font-black text-[#ff6c2f] tracking-tight">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#ff6c2f] hover:bg-[#e05b24] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/shop"
                  className="w-full block text-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                >
                  Add More Items
                </Link>
              </div>

              {/* Trust & Guarantee Badges */}
              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>256-Bit SSL Encrypted & Bank-Grade Security</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <Truck className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Fast Delivery Across All 64 BD Districts</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <RotateCcw className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Hassle-Free 7-Day Replacement Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


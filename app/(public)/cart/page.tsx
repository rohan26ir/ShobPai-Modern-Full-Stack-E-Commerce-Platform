"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft, FaCheck, FaMinus, FaPlus, FaShoppingBag, FaTag } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { availableCoupons } from "@/data/coupons";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal: rawSubtotal } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<typeof availableCoupons[0] | null>(null);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const matched = availableCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
    );

    if (!matched) {
      setCouponError("Invalid coupon code. Try 'FRESH2026' or 'VEGIST10'");
      setAppliedCoupon(null);
    } else {
      setAppliedCoupon(matched);
    }
  };

  const discountAmount = appliedCoupon
    ? (rawSubtotal * appliedCoupon.discountPercentage) / 100
    : 0;

  const shipping = rawSubtotal > 50 || rawSubtotal === 0 ? 0 : 4.99;
  const grandTotal = Math.max(0, rawSubtotal - discountAmount + shipping);

  return (
    <div className="py-10 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 space-y-8">
        
        {/* Page Header */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
              Shopping Cart
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Review Your Cart ({cartItems.length} items)
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
              Verify your selected fresh organic produce items, apply discount coupons, and proceed to checkout.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl bg-[#E5A842] hover:bg-[#d49633] px-5 py-3 text-xs font-black text-gray-950 transition-colors shadow-md self-start md:self-auto"
          >
            <FaArrowLeft className="h-3.5 w-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 shadow-xs">
            <FaShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Your cart is currently empty</h2>
            <p className="text-xs text-gray-400 mt-1 mb-6">
              Looks like you haven't added any organic produce to your cart yet.
            </p>
            <Link
              href="/shop"
              className="rounded-2xl bg-[#E5A842] px-8 py-3.5 text-xs font-black text-gray-950 shadow-md hover:bg-[#d49633] transition-colors"
            >
              Shop Fresh Groceries Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Table Column (Spans 8) */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-gray-100 pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span className="col-span-6">Product</span>
                <span className="col-span-2 text-center">Price</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-2 text-right">Subtotal</span>
              </div>

              {cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center border-b border-gray-100 pb-4 last:border-b-0"
                >
                  {/* Product Info */}
                  <div className="sm:col-span-6 flex items-center gap-4 w-full">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                        <Link href={`/product/${product.slug}`} className="hover:text-[#E5A842]">
                          {product.name}
                        </Link>
                      </h3>
                      <span className="text-xs text-gray-400">Unit: {product.unit}</span>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="block mt-1 text-[11px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="sm:col-span-2 text-center text-xs font-bold text-gray-700">
                    ${product.price.toFixed(2)}
                  </div>

                  {/* Quantity Controls */}
                  <div className="sm:col-span-2 flex justify-center">
                    <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-0.5">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-600 hover:bg-gray-200 cursor-pointer"
                      >
                        <FaMinus className="h-2.5 w-2.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-600 hover:bg-gray-200 cursor-pointer"
                      >
                        <FaPlus className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="sm:col-span-2 text-right text-sm font-black text-gray-900">
                    ${(product.price * quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Coupon Column (Spans 4) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Coupon Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-900">
                  <FaTag className="text-[#E5A842] h-4 w-4" />
                  <span>Have a Promo Coupon?</span>
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter promo code..."
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-800 outline-hidden focus:border-[#E5A842]"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-[#E5A842] hover:text-gray-950 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <p className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <FaCheck className="h-3 w-3" />
                    <span>Coupon "{appliedCoupon.code}" applied (-{appliedCoupon.discountPercentage}%)</span>
                  </p>
                )}

                {couponError && (
                  <p className="mt-2 text-xs font-semibold text-red-500">{couponError}</p>
                )}
              </div>

              {/* Order Summary Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
                <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">${rawSubtotal.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({appliedCoupon.discountPercentage}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-gray-900">
                      {shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-gray-900">
                  <span className="text-sm font-bold">Total Amount</span>
                  <span className="text-2xl font-black text-gray-900">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block text-center w-full rounded-2xl bg-[#E5A842] hover:bg-[#d49633] py-4 text-sm font-black text-gray-950 shadow-md transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

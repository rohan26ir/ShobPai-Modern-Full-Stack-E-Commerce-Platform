"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaCheckCircle, FaCreditCard, FaLock, FaMoneyBillWave, FaShieldAlt, FaTruck } from "react-icons/fa";
import { products } from "@/data/products";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "gateway">("cod");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+41 79 123 4567",
    address: "West 14th Maria Reichenbach",
    city: "Zürich",
    zip: "8022",
    country: "Switzerland",
    notes: "Leave package at front door.",
  });

  const cartItems = [
    { product: products[0], quantity: 2 },
    { product: products[1], quantity: 1 },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrderPlaced(true);
  };

  if (isOrderPlaced) {
    return (
      <div className="py-16 bg-gray-50/50 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
              <FaCheckCircle className="h-10 w-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Order Confirmed!
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-1 mb-2">
              Thank You For Your Purchase!
            </h1>
            <p className="text-xs text-gray-500 mb-6">
              Order <strong>#VEG-{Math.floor(100000 + Math.random() * 900000)}</strong> has been placed successfully. A confirmation receipt has been sent to <strong>{formData.email}</strong>.
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-left text-xs font-semibold text-emerald-900 mb-8 space-y-1">
              <p>📍 <strong>Shipping To:</strong> {formData.fullName}, {formData.address}, {formData.city}</p>
              <p>💳 <strong>Payment Method:</strong> {paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Online Payment Gateway"}</p>
              <p>📦 <strong>Estimated Delivery:</strong> Tomorrow by 2:00 PM</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="rounded-2xl bg-emerald-600 px-8 py-3.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-md"
              >
                Continue Shopping
              </Link>
              <Link
                href="/orders"
                className="rounded-2xl border border-gray-300 bg-white px-8 py-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Order History
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4">
        
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Secure Checkout
          </span>
          <h1 className="text-3xl font-black text-gray-900 mt-1">
            Complete Your Order
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Address & Payment (Spans 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Shipping Address Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-extrabold text-gray-900">
                <FaTruck className="text-emerald-600 h-4 w-4" />
                <span>1. Shipping Address</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-extrabold text-gray-900">
                <FaLock className="text-emerald-600 h-4 w-4" />
                <span>2. Select Payment Option</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <FaMoneyBillWave className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-gray-500">Pay cash upon delivery</p>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod("gateway")}
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "gateway"
                      ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <FaCreditCard className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Credit Card / Gateway</h4>
                    <p className="text-[11px] text-gray-500">Instant secure card checkout</p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary Sidebar (Spans 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
                Order Items ({cartItems.length})
              </h3>

              <div className="space-y-3">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                      <span className="text-[11px] text-gray-500">Qty: {quantity} × ${product.price.toFixed(2)}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-900">${(product.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900">
                    {shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 border-t border-gray-100 pt-2">
                  <span>Total Due</span>
                  <span className="text-xl text-emerald-700">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
              >
                Place Order Now
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <FaShieldAlt className="text-emerald-600 h-3.5 w-3.5" />
                <span>256-bit Encrypted SSL Payment Protection</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

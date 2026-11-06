"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaCreditCard,
  FaLock,
  FaMoneyBillWave,
  FaShieldAlt,
  FaTruck,
  FaTag,
  FaCheck,
  FaTimes,
  FaShoppingBag,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const { cartItems, clearCart, removeFromCart } = useCart();
  const { token, user, isAdmin } = useAuth();

  // Direct Buy Now state (when user clicks "Buy Now" on product details or modal)
  const [buyNowItem, setBuyNowItem] = useState<{ product: any; quantity: number } | null>(null);
  const [isDirectBuy, setIsDirectBuy] = useState(false);

  useEffect(() => {
    try {
      const isDirect = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("direct") === "true";
      const raw = sessionStorage.getItem("shobpai_buy_now_item");
      if (isDirect && raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.product) {
          setBuyNowItem(parsed);
          setIsDirectBuy(true);
        }
      }
    } catch { }
  }, []);

  const checkoutItems = isDirectBuy && buyNowItem ? [buyNowItem] : cartItems;

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "gateway">("cod");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string>("");

  // Promo Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercentage: number;
    minSpend: number;
    description: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: "",
    city: "Dhaka",
    zip: "1205",
    country: "Bangladesh",
    notes: "",
  });

  // When user auth loads, pre-fill form if fields are empty
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.displayName || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phoneNumber || "",
      }));
    }
  }, [user]);

  // Check if coupon was already applied in cart
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("shobpai_applied_coupon");
      if (saved) {
        setAppliedCoupon(JSON.parse(saved));
      }
    } catch { }
  }, []);

  const subtotal = checkoutItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon
    ? Number(((subtotal * appliedCoupon.discountPercentage) / 100).toFixed(2))
    : 0;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 4.99;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    setIsValidatingCoupon(true);
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.valid) {
        const couponObj = {
          code,
          discountPercentage: res.discountPercentage,
          minSpend: 0,
          description: res.message,
        };
        setAppliedCoupon(couponObj);
        try {
          sessionStorage.setItem("shobpai_applied_coupon", JSON.stringify(couponObj));
        } catch { }
        toast.success(
          <span>
            Coupon <strong>{code}</strong> applied! ({res.discountPercentage}% OFF)
          </span>,
          { icon: <FaCheckCircle className="text-emerald-500" /> }
        );
        setCouponCode("");
      } else {
        const err = res.message || "Invalid or expired coupon code";
        setCouponError(err);
        toast.error(err);
      }
    } catch (err: any) {
      const msg = err?.message || "Invalid or expired coupon code. Try 'FRESH2026'";
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    try {
      sessionStorage.removeItem("shobpai_applied_coupon");
    } catch { }
    toast.success("Coupon removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your street address.");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        guestName: formData.fullName.trim(),
        guestEmail: formData.email.trim(),
        guestPhone: formData.phone.trim(),
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          zip: formData.zip?.trim() || "1205",
          country: formData.country?.trim() || "Bangladesh",
          notes: formData.notes?.trim() || "",
        },
        paymentMethod: paymentMethod === "cod" ? "COD" : "GATEWAY",
        subtotal: Number(subtotal.toFixed(2)),
        shippingFee: Number(shipping.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        totalAmount: Number(total.toFixed(2)),
        couponCode: appliedCoupon?.code || undefined,
        items: checkoutItems.map((item) => ({
          productId: String(item.product.id || ""),
          productName: item.product.name,
          productImage: item.product.images?.[0] || item.product.image || "",
          price: Number(item.product.price),
          quantity: Number(item.quantity),
          unit: item.product.unit || "1 kg",
        })),
        notes: appliedCoupon
          ? `${formData.notes} [Coupon Applied: ${appliedCoupon.code} - ${appliedCoupon.discountPercentage}% OFF]`
          : formData.notes,
      };

      // Call orders API with token (if registered user) or null (if guest)
      const order = await api.createOrder(orderPayload, token || null);
      const finalOrderNumber = order?.orderNumber || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setPlacedOrderNumber(finalOrderNumber);

      toast.success(
        user
          ? `Order #${finalOrderNumber} placed successfully!`
          : `Guest Order #${finalOrderNumber} placed successfully!`
      );

      // Save order snapshot locally for immediate tracking / guest lookup
      try {
        const existing = JSON.parse(localStorage.getItem("shobpai_recent_orders") || "[]");
        const orderSnapshot = {
          id: order?.id || finalOrderNumber,
          orderNumber: finalOrderNumber,
          createdAt: order?.createdAt || new Date().toISOString(),
          status: order?.status || "PENDING",
          paymentMethod: paymentMethod === "cod" ? "COD" : "GATEWAY",
          paymentStatus: "PENDING",
          subtotal,
          shippingFee: shipping,
          discountAmount,
          totalAmount: total,
          guestName: formData.fullName,
          guestEmail: formData.email,
          guestPhone: formData.phone,
          shippingAddress: {
            fullName: formData.fullName,
            address: formData.address,
            city: formData.city,
            zip: formData.zip,
            country: formData.country,
          },
          items: checkoutItems.map((item) => ({
            id: item.product.id,
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.images?.[0] || "",
            price: item.product.price,
            quantity: item.quantity,
            unit: item.product.unit || "1 kg",
          })),
        };
        const updated = [orderSnapshot, ...existing.filter((o: any) => o.orderNumber !== finalOrderNumber)].slice(0, 20);
        localStorage.setItem("shobpai_recent_orders", JSON.stringify(updated));
      } catch { }

      if (isDirectBuy) {
        try {
          sessionStorage.removeItem("shobpai_buy_now_item");
        } catch { }
        if (buyNowItem?.product?.id) {
          removeFromCart(buyNowItem.product.id);
        }
      } else {
        clearCart();
      }
      try {
        sessionStorage.removeItem("shobpai_applied_coupon");
      } catch { }
      setIsOrderPlaced(true);
    } catch (err: any) {
      console.error("Order placement error:", err);
      toast.error(err?.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              Order <strong>#{placedOrderNumber}</strong> has been placed successfully in the database. A confirmation receipt has been sent to <strong>{formData.email}</strong>.
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-left text-xs font-semibold text-emerald-900 mb-8 space-y-1">
              <p>📍 <strong>Shipping To:</strong> {formData.fullName}, {formData.address}, {formData.city}</p>
              <p>💳 <strong>Payment Method:</strong> {paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Online Payment Gateway"}</p>
              <p>📦 <strong>Estimated Delivery:</strong> Maximum 7days</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="rounded-2xl bg-emerald-600 px-8 py-3.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-md"
              >
                Continue Shopping
              </Link>
              {user && (
                <Link
                  href={isAdmin ? "/dashboard/orders" : "/dashboard/user/orders"}
                  className="rounded-2xl border border-gray-300 bg-white px-8 py-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Order History
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0 && !isOrderPlaced) {
    return (
      <div className="py-24 bg-gray-50/50 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-4">
            <FaShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your checkout is empty</h2>
          <p className="text-xs text-gray-500 mb-6">There are no items currently ready for checkout.</p>
          <Link
            href="/shop"
            className="inline-block rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-md"
          >
            Continue Shopping
          </Link>
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

          {/* Guest Checkout Notice or Signed In info */}
          {!user ? (
            <div className="mt-3 p-3.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-200/80 dark:bg-amber-900 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                  ✓
                </span>
                <span>
                  <strong>Guest Checkout:</strong> You do not need to register or sign in to place an order.
                </span>
              </div>
              <div className="text-[11px] text-amber-800 dark:text-amber-300">
                Already have an account?{" "}
                <Link href="/login?redirect=/checkout" className="font-bold underline hover:text-[#ff6c2f]">
                  Log In
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-3 p-3 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 rounded-2xl flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
              <span>
                Ordering as <strong>{user.displayName || user.email}</strong>
              </span>
            </div>
          )}
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
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs outline-hidden focus:border-emerald-500 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. guest@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs outline-hidden focus:border-emerald-500 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01712-345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs outline-hidden focus:border-emerald-500 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs outline-hidden focus:border-emerald-500 min-h-[44px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. House 12, Road 4, Sector 7, Uttara"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs outline-hidden focus:border-emerald-500 min-h-[44px]"
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
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === "cod"
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

                <div
                  onClick={() =>
                    toast("Credit Card / Gateway payment is coming soon! Please use Cash on Delivery (COD) for now.", {
                      icon: "💳",
                    })
                  }
                  className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 cursor-pointer opacity-85 hover:opacity-100 transition-all select-none"
                  title="Credit Card / Gateway (Coming soon)"
                >
                  <FaCreditCard className="h-5 w-5 text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-gray-700">Credit Card / Gateway</h4>
                      <span className="text-[10px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                        Coming soon
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Coming soon</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary Sidebar (Spans 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-gray-900">
                  Order Items ({checkoutItems.length})
                </h3>
                {isDirectBuy && (
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    ⚡ Direct Buy
                  </span>
                )}
              </div>

              {isDirectBuy && cartItems.length > 0 && (
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-center justify-between">
                  <span className="text-[11px] font-semibold">
                    Checking out <strong>1 item</strong> directly.
                  </span>
                  <Link
                    href="/cart"
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    Switch to Full Cart ({cartItems.length}) →
                  </Link>
                </div>
              )}

              <div className="space-y-3">
                {checkoutItems.map(({ product, quantity }) => (
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

              {/* Promo Coupon Card */}
              <div className="border-t border-b border-gray-100 py-3.5 my-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <FaTag className="text-[#E5A842] h-3.5 w-3.5" />
                    <span>Have a Promo Coupon?</span>
                  </div>
                  <Link
                    href="/offers"
                    target="_blank"
                    className="text-[11px] font-bold text-emerald-600 hover:underline"
                  >
                    View Offers
                  </Link>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <FaCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-mono text-xs font-black text-emerald-900 tracking-wider">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[11px] text-emerald-700 block font-medium">
                          {appliedCoupon.discountPercentage}% discount applied (-${discountAmount.toFixed(2)})
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      title="Remove coupon"
                    >
                      <FaTimes className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="e.g. FRESH2026"
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 placeholder-gray-400 outline-hidden focus:border-[#E5A842] uppercase min-h-[44px]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-[#E5A842] hover:text-gray-950 transition-colors cursor-pointer disabled:opacity-50 min-h-[44px] flex items-center justify-center shrink-0"
                      >
                        {isValidatingCoupon ? "Applying..." : "Apply"}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] font-semibold text-red-500">
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Promo Discount ({appliedCoupon.discountPercentage}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900">
                    {shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-gray-900 border-t border-gray-100 pt-3">
                  <span>Total Due</span>
                  <span className="text-xl text-emerald-700">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors min-h-[48px] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <span>Place Order Now</span>
                )}
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

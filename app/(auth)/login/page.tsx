"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "user@shobpai.com");
    router.push("/dashboard");
  };

  return (
    <div className="py-16 bg-gray-50/50 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E5A842]">
              Welcome Back
            </span>
            <h1 className="text-2xl font-black text-gray-900 mt-1">
              Sign In to ShobPai
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Access your saved wishlist, orders, and addresses.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-hidden focus:border-[#E5A842] focus:ring-2 focus:ring-[#E5A842]/30 font-semibold"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-gray-700">Password *</label>
                <Link href="/forgot-password" className="text-[#E5A842] font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-hidden focus:border-[#E5A842] focus:ring-2 focus:ring-[#E5A842]/30 font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#E5A842] py-3.5 text-xs font-black text-gray-950 shadow-md hover:bg-[#d49633] transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-bold text-[#E5A842] hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
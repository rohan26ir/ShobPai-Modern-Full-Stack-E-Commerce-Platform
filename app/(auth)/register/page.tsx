"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Account created successfully!");
  };

  return (
    <div className="py-16 bg-gray-50/50 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Join Vegist
            </span>
            <h1 className="text-2xl font-black text-gray-900 mt-1">
              Create an Account
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Sign up to receive $10 discount voucher on your first order.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-amber-400/50"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-amber-400/50"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-amber-400/50"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-emerald-700 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
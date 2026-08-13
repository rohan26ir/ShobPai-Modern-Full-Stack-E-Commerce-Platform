"use client";

import Image from "next/image";
import { useState } from "react";
import bgFooter from '@/public/bgImage/footer-bg.jpg'

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setEmail("");
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-gray-100 border-t border-gray-200/60">
      {/* Full Width Background Image */}
      <Image
        src={bgFooter}
        alt="Fresh Bakery Background"
        fill
        className="object-cover"
        sizes="100vw"
      />

      {/* Light Overlay */}
      {/* <div className="absolute inset-0 bg-white/70 backdrop-xs" /> */}

      {/* Centered Form Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl mx-auto text-center">

          {/* Headline */}
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
            Get the latest deal
          </h2>

          {/* Subtitle */}
          <p className="text-xs md:text-sm text-gray-700 mb-6 font-semibold">
            Receive 20% off coupon for first shopping
          </p>

          {/* Single Clean Input + Button Form */}
          <form onSubmit={handleSubmit} className="flex max-w-xl mx-auto rounded-sm overflow-hidden bg-white shadow-md border border-gray-200">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full bg-white px-5 py-3.5 text-xs text-gray-800 placeholder-gray-400 outline-hidden"
            />

            <button
              type="submit"
              className="bg-[#E5A842] hover:bg-[#d49633] text-white font-bold px-8 py-3.5 text-xs shrink-0 transition-colors cursor-pointer"
            >
              {isSubmitted ? "Subscribed!" : "Subscribe"}
            </button>
          </form>

          {isSubmitted && (
            <p className="mt-3 text-xs font-extrabold text-emerald-800">
              🎉 Thank you for subscribing! Your 20% coupon code is <strong>FRESH2026</strong>.
            </p>
          )}

        </div>
      </div>
    </section>
  );
}

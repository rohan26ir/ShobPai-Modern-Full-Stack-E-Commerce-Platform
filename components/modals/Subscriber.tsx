"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaEnvelope, FaPaperPlane, FaTimes } from "react-icons/fa";


export default function Subscriber() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [dontShow, setDontShow] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if user previously checked "Don't show again"
    const dismissed = localStorage.getItem("vegist_subscriber_popup_dismissed");
    if (dismissed === "true") return;

    // Show popup after 1.5s delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (dontShow) {
      localStorage.setItem("vegist_subscriber_popup_dismissed", "true");
    }
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      if (dontShow) {
        localStorage.setItem("vegist_subscriber_popup_dismissed", "true");
      }
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/70 cursor-pointer"
          title="Close Popup"
        >
          <FaTimes className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
          {/* Background Image / Left Banner (Spans 5) */}
          <div className="md:col-span-5 relative hidden md:block bg-gray-900">
            <Image
              src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80"
              alt="Organic Harvest"
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-xs font-black uppercase tracking-widest text-[#F0A843]">
                100% Organic
              </span>
              <p className="text-sm font-bold text-white mt-1">Farm Fresh Groceries Delivered Daily</p>
            </div>
          </div>

          {/* Form Content (Spans 7) */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between bg-white text-gray-900">
            <div>
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-amber-50 text-[#F0A843] mb-3">
                <FaEnvelope className="h-5 w-5" />
              </div>

              <span className="block text-xs font-black uppercase tracking-widest text-[#F0A843]">
                Special Discount Offer
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                Get 15% OFF Your Order
              </h2>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Subscribe to our organic weekly newsletter and receive your exclusive discount code <strong>FRESH2026</strong>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-800 outline-hidden focus:border-[#F0A843] focus:ring-2 focus:ring-[#F0A843]/30"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F0A843] hover:bg-[#e09732] py-3.5 text-xs font-black text-gray-950 transition-all shadow-md cursor-pointer"
              >
                <span>{isSubmitted ? "Subscribed!" : "Subscribe Now"}</span>
                <FaPaperPlane className="h-3.5 w-3.5" />
              </button>

              {isSubmitted && (
                <p className="text-xs font-bold text-[#F0A843] text-center pt-1">
                  🎉 Code <strong>FRESH2026</strong> applied! Thank you for subscribing.
                </p>
              )}

              {/* Don't show again checkbox */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-gray-500">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dontShow}
                    onChange={(e) => setDontShow(e.target.checked)}
                    className="rounded-md border-gray-300 text-[#F0A843] focus:ring-[#F0A843] h-3.5 w-3.5"
                  />
                  <span>Don't show this popup again</span>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
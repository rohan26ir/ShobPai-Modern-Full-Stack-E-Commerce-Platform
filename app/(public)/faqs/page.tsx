"use client";

import { useState } from "react";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";

export default function FAQsPage() {
  const faqs = [
    {
      q: "How do you ensure produce remains farm fresh during delivery?",
      a: "All our fruits, vegetables, and dairy items are packed in eco-friendly insulated bags with cold gel packs inside temperature-regulated delivery vehicles.",
    },
    {
      q: "What is your free shipping policy?",
      a: "We offer Free Express Delivery on all orders over $50. For orders under $50, a standard delivery fee of $4.99 applies.",
    },
    {
      q: "Can I place an order as a guest without creating an account?",
      a: "Yes! You can complete your entire purchase as a guest. Simply provide your delivery address at checkout.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We support Cash on Delivery (COD), Credit/Debit Cards, and online payment gateways.",
    },
    {
      q: "What if I receive a damaged or unsatisfactory organic product?",
      a: "We offer a 100% Satisfaction Guarantee. Contact support@shobpai.com within 24 hours of delivery for an instant replacement or refund.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Frequently Asked Questions
          </span>
          <h1 className="text-3xl font-black text-gray-900 mt-1">
            Got Questions? We Have Answers.
          </h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-gray-900 hover:text-emerald-700"
                >
                  <span className="flex items-center gap-3">
                    <FaQuestionCircle className="text-emerald-600 shrink-0 h-4 w-4" />
                    <span>{faq.q}</span>
                  </span>
                  <FaChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? "rotate-180 text-emerald-600" : "text-gray-400"}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-50 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
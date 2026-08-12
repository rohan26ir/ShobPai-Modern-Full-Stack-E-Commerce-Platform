"use client";

import { useState } from "react";
import { FaEnvelope, FaHeadset, FaLocationDot, FaPhone, FaPaperPlane } from "react-icons/fa6";

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Get In Touch
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">
            We'd Love to Hear From You
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            Have questions about our organic produce, delivery times, or wholesale orders? Reach out to our dedicated support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          
          {/* Info Cards Column (Spans 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <FaLocationDot className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Headquarters</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  West 14th Maria Reichenbach, Zürich 8022, Switzerland
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <FaPhone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Phone Support</h4>
                <p className="text-xs text-gray-500 mt-0.5">+41 44123 4567</p>
                <span className="text-[11px] text-emerald-700 font-semibold">Mon - Sun: 7:00 AM - 10:00 PM</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <FaEnvelope className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Email Inquiry</h4>
                <p className="text-xs text-gray-500 mt-0.5">support@shobpai.com</p>
                <p className="text-xs text-gray-500">wholesale@shobpai.com</p>
              </div>
            </div>
          </div>

          {/* Form Column (Spans 7) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-xs">
            <h3 className="text-lg font-extrabold text-gray-900 mb-4 border-b border-gray-100 pb-3">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Inquiry about organic produce delivery"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help you?"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 outline-hidden focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
              >
                <span>{submitted ? "Message Sent!" : "Send Message"}</span>
                <FaPaperPlane className="h-3.5 w-3.5" />
              </button>

              {submitted && (
                <p className="text-xs font-bold text-emerald-700">
                  🎉 Thank you for reaching out! Our support team will get back to you within 2 hours.
                </p>
              )}
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
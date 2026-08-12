"use client";

import { useState } from "react";
import { FaStore, FaTruck, FaGlobe, FaSave, FaCheckCircle } from "react-icons/fa";

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("ShobPai Fresh Organics");
  const [supportEmail, setSupportEmail] = useState("support@shobpai.com");
  const [freeShippingMin, setFreeShippingMin] = useState("50");
  const [currency, setCurrency] = useState("USD");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842]">
        <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
          Configuration
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
          Store Settings & Preferences
        </h1>
        <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
          Manage general store parameters, free shipping thresholds, currency formatting, and notification emails.
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <FaStore className="text-[#E5A842] h-4 w-4" />
          <span>General Store Configuration</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Store Name *</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-hidden focus:border-[#E5A842] font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Support Email *</label>
            <input
              type="email"
              required
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-hidden focus:border-[#E5A842] font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Free Shipping Order Minimum ($)</label>
            <input
              type="number"
              required
              value={freeShippingMin}
              onChange={(e) => setFreeShippingMin(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-hidden focus:border-[#E5A842] font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Default Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-hidden focus:border-[#E5A842] font-semibold"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          {saved ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <FaCheckCircle className="h-4 w-4" /> Settings updated successfully!
            </span>
          ) : (
            <span className="text-xs text-gray-400">All changes apply storewide.</span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#E5A842] hover:bg-[#d49633] px-6 py-3 text-xs font-black text-gray-950 transition-colors shadow-md cursor-pointer"
          >
            <FaSave className="h-3.5 w-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}

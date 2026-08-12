"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBox, FaMapMarkerAlt, FaUser, FaSave, FaCheckCircle } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

export default function AccountPage() {
  const { user } = useCart();
  const [profile, setProfile] = useState({
    name: user ? user.name : "Admin User",
    email: user ? user.email : "admin@shobpai.com",
    phone: "+1 (555) 234-5678",
    address: "West 14th Maria Reichenbach, Zürich 8022, Switzerland",
  });
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
          Profile Settings
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
          Account & Personal Details
        </h1>
        <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
          View and update your personal information, contact email, phone number, and default delivery address.
        </p>
      </div>

      {/* Account Info Form */}
      <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#E5A842] to-amber-300 text-gray-950 font-black text-xl flex items-center justify-center shadow-md">
            {profile.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{profile.name}</h3>
            <span className="text-xs text-gray-400">{profile.email}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-hidden focus:border-[#E5A842]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-hidden focus:border-[#E5A842]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-hidden focus:border-[#E5A842]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Default Shipping Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-hidden focus:border-[#E5A842]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          {saved ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <FaCheckCircle className="h-4 w-4" /> Profile updated successfully!
            </span>
          ) : (
            <span className="text-xs text-gray-400">Member since August 2026</span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#E5A842] hover:bg-[#d49633] px-6 py-3 text-xs font-black text-gray-950 transition-colors shadow-md cursor-pointer"
          >
            <FaSave className="h-3.5 w-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}

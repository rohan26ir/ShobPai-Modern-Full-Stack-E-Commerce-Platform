"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBox, FaMapMarkerAlt, FaUser, FaSave, FaCheckCircle, FaShieldAlt, FaSpinner } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function AccountPage() {
  const { user, isAdmin, token } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.displayName || user?.email?.split("@")[0] || "User",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: "",
    city: "Dhaka",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.displayName || user.email?.split("@")[0] || prev.name,
        email: user.email || prev.email,
        phone: user.phoneNumber || prev.phone,
      }));
    }

    if (token) {
      api.getMyAddresses(token)
        .then((addresses) => {
          if (Array.isArray(addresses) && addresses.length > 0) {
            const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
            setProfile((prev) => ({
              ...prev,
              address: defaultAddr.addressLine || "",
              city: defaultAddr.city || "Dhaka",
              phone: defaultAddr.phone && defaultAddr.phone !== "N/A" ? defaultAddr.phone : prev.phone,
            }));
          }
        })
        .catch(() => {});
    }
  }, [user, token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      // 1. Update Profile (Display Name & Phone Number)
      await api.updateProfile(
        { displayName: profile.name, phoneNumber: profile.phone },
        token
      );

      // 2. Save/Update Default Address in Database
      if (profile.address.trim()) {
        await api.saveDefaultAddress(
          {
            addressLine: profile.address.trim(),
            city: profile.city?.trim() || "Dhaka",
            fullName: profile.name,
            phone: profile.phone || "N/A",
          },
          token
        );
      }

      setSaved(true);
      toast.success("Profile & address saved successfully!");
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      console.error("Failed to update profile and address:", err);
      toast.error(err?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            Profile Settings
          </span>
          {isAdmin && (
            <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black rounded-md uppercase">
              👑 Administrator
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
          Account & Personal Details
        </h1>
        <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
          View and update your personal information, contact email, phone number, and default delivery address saved in Neon PostgreSQL.
        </p>
      </div>

      {/* Account Info Form */}
      <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
          <div className="relative h-14 w-14 rounded-full bg-gradient-to-tr from-[#E5A842] to-amber-300 text-gray-950 font-black text-xl flex items-center justify-center shadow-md overflow-hidden shrink-0">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt={profile.name}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              (profile.name || "U").slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">{profile.name}</h3>
              {isAdmin && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-gray-900 text-amber-400">
                  ADMIN
                </span>
              )}
            </div>
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
              disabled
              value={profile.email}
              className="w-full rounded-xl border border-gray-200 bg-gray-100 text-gray-500 px-4 py-3 font-semibold outline-hidden cursor-not-allowed"
              title="Email is managed via your Firebase authentication login"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="+880 1700-000000"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-hidden focus:border-[#E5A842]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">City / Region</label>
            <input
              type="text"
              placeholder="e.g. Dhaka, Chittagong"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-hidden focus:border-[#E5A842]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-700 mb-1">Default Shipping Address (Street, House, Road, Area)</label>
            <input
              type="text"
              placeholder="e.g. House 12, Road 5, Block B, Banani"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-hidden focus:border-[#E5A842]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          {saved ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <FaCheckCircle className="h-4 w-4" /> Profile & address saved to database!
            </span>
          ) : (
            <span className="text-xs text-gray-400">Saved to Neon PostgreSQL</span>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-[#E5A842] hover:bg-[#d49633] px-6 py-3 text-xs font-black text-gray-950 transition-colors shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? <FaSpinner className="h-3.5 w-3.5 animate-spin" /> : <FaSave className="h-3.5 w-3.5" />}
            <span>{loading ? "Saving..." : "Save Profile & Address"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

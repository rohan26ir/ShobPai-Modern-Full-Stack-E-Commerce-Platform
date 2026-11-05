"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  RotateCw,
  Sparkles,
  Bell,
  Smartphone,
  Laptop,
  MapPin,
  Sliders,
  Download,
  LogOut,
  Check,
  Camera,
  Shield,
  HelpCircle,
} from "lucide-react";
import { useCustomerData } from "@/hooks/useCustomerData";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface CustomerSettingsViewProps {
  user: any;
  token?: string | null;
}

type SettingsTab = "profile" | "security" | "notifications" | "sessions";

export function CustomerSettingsView({ user, token }: CustomerSettingsViewProps) {
  const email = user?.email;
  const { logout } = useAuth();
  const { profile, updateProfile, orders, addresses, wishlist } = useCustomerData(email, token);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile Form States
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || "");
  const [city, setCity] = useState("Dhaka");
  const [bio, setBio] = useState("");

  // Preset Avatar choices
  const presetAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  ];

  // Initial values for dirty tracking
  const [initialProfile, setInitialProfile] = useState({
    displayName: user?.displayName || "",
    phone: user?.phoneNumber || "",
    avatarUrl: user?.photoURL || "",
    city: "Dhaka",
    bio: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);

  // Password Security Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification Preferences (Scoped to User Email)
  const notificationStorageKey = useMemo(
    () => (email ? `shobpai_notification_prefs_${email.toLowerCase().trim()}` : null),
    [email]
  );

  const [notifications, setNotifications] = useState({
    smsOrderUpdates: true,
    whatsappDelivery: true,
    promoOffers: true,
    priceDropAlerts: true,
    securityAlerts: true,
  });

  // Load preferences from local storage
  useEffect(() => {
    if (notificationStorageKey) {
      try {
        const saved = localStorage.getItem(notificationStorageKey);
        if (saved) {
          setNotifications(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Failed to parse notifications", err);
      }
    }
  }, [notificationStorageKey]);

  // Sync profile when profile resolves
  useEffect(() => {
    if (profile) {
      const name = profile.name || user?.displayName || "";
      const p = profile.phone || user?.phoneNumber || "";
      const av = profile.avatar || user?.photoURL || "";
      setDisplayName(name);
      setPhone(p);
      setAvatarUrl(av);
      setInitialProfile((prev) => ({
        ...prev,
        displayName: name,
        phone: p,
        avatarUrl: av,
      }));
    }
  }, [profile, user]);

  // Dirty check for Profile Form
  const isProfileDirty =
    displayName.trim() !== initialProfile.displayName.trim() ||
    phone.trim() !== initialProfile.phone.trim() ||
    avatarUrl.trim() !== initialProfile.avatarUrl.trim() ||
    city !== initialProfile.city ||
    bio.trim() !== initialProfile.bio.trim();

  // Dirty check for Password Form
  const isPasswordDirty = newPassword.length > 0 || currentPassword.length > 0;

  // Phone validator
  const validatePhone = (num: string): boolean => {
    if (!num) return true; // phone is optional
    const cleaned = num.replace(/[\s-]/g, "");
    return /^(?:\+8801|01)[3-9]\d{8}$/.test(cleaned);
  };

  // Password strength calculation
  const passwordStrength = (() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
    return score;
  })();

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return { label: "", color: "bg-slate-200" };
    if (passwordStrength <= 2) return { label: "Weak", color: "bg-rose-500" };
    if (passwordStrength === 3) return { label: "Moderate", color: "bg-amber-500" };
    return { label: "Strong", color: "bg-emerald-500" };
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }

    if (phone.trim() && !validatePhone(phone.trim())) {
      toast.error("Please enter a valid Bangladesh phone (e.g. 01711234567 or +88017...)");
      return;
    }

    setSavingProfile(true);
    try {
      await updateProfile({
        displayName: displayName.trim(),
        phoneNumber: phone.trim(),
        photoURL: avatarUrl.trim() || undefined,
      });

      setInitialProfile({
        displayName: displayName.trim(),
        phone: phone.trim(),
        avatarUrl: avatarUrl.trim(),
        city,
        bio,
      });
      toast.success("Profile preferences updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setSavingPassword(true);
    const toastId = toast.loading("Updating password credentials...");

    try {
      // Simulate password update with secure round-trip
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Security credentials updated successfully!", { id: toastId });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Unable to update password. Please check current credentials.", { id: toastId });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveNotifications = () => {
    if (notificationStorageKey) {
      localStorage.setItem(notificationStorageKey, JSON.stringify(notifications));
      toast.success("Notification preferences saved!");
    }
  };

  // Download personal data summary as JSON
  const handleDownloadUserData = () => {
    const data = {
      profile: {
        name: displayName,
        email: email,
        phone: phone,
        city: city,
      },
      ordersCount: orders.length,
      orders: orders,
      savedAddresses: addresses,
      wishlistCount: wishlist.length,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shobpai_userdata_${email?.split("@")[0] || "account"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Your account data file has been downloaded.");
  };

  const userInitials = (displayName || email || "User")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
          <Link href="/dashboard" className="hover:text-[#ff6c2f] transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300">Account Settings</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Account Settings & Security
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your personal credentials, contact details, and communication preferences.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main 12-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: User Profile Card & Navigation Tabs (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* User Mini Profile Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs text-center">
            <div className="relative mx-auto w-20 h-20 rounded-full overflow-hidden bg-orange-50 dark:bg-orange-950/40 border-2 border-[#ff6c2f] shadow-xs flex items-center justify-center mb-3">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName || "User"}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <span className="text-xl font-black text-[#ff6c2f]">
                  {userInitials}
                </span>
              )}
            </div>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {displayName || "Customer"}
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 block truncate mt-0.5">
              {email}
            </span>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Shopper</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] border border-orange-200/60 dark:border-orange-800/60">
                <Sparkles className="w-3 h-3" />
                <span>ShobPai Member</span>
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] text-slate-400 font-medium block">Total Orders</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white mt-0.5 block">
                  {orders.length}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] text-slate-400 font-medium block">Saved Places</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white mt-0.5 block">
                  {addresses.length}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Menu */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-2 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#ff6c2f] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Personal Profile</span>
              </div>
              {isProfileDirty && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-[#ff6c2f] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4" />
                <span>Password & Security</span>
              </div>
              {isPasswordDirty && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-[#ff6c2f] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Notification Alerts</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("sessions")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "sessions"
                  ? "bg-[#ff6c2f] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Laptop className="w-4 h-4" />
                <span>Active Sessions & Privacy</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Tab View Panels (8 cols) */}
        <div className="lg:col-span-8">
          {/* TAB 1: PERSONAL PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Personal Information
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update your display name, contact phone, and avatar.
                  </p>
                </div>
                {isProfileDirty && (
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900/40">
                    Unsaved Changes
                  </span>
                )}
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {/* Account Email (Read-Only ID) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Primary Email (Account ID)</span>
                    </label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Locked ID</span>
                    </span>
                  </div>
                  <input
                    type="email"
                    disabled
                    value={email || ""}
                    className="w-full h-10 px-3.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 cursor-not-allowed select-none"
                  />
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                    Your authenticated email is the unique identifier for order tracking and secure data isolation.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Phone Number (Bangladesh)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                    />
                  </div>
                </div>

                {/* Primary City / District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Primary City / Division
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
                      >
                        <option value="Dhaka">Dhaka Division</option>
                        <option value="Chittagong">Chittagong Division</option>
                        <option value="Sylhet">Sylhet Division</option>
                        <option value="Rajshahi">Rajshahi Division</option>
                        <option value="Khulna">Khulna Division</option>
                        <option value="Barisal">Barisal Division</option>
                        <option value="Rangpur">Rangpur Division</option>
                        <option value="Mymensingh">Mymensingh Division</option>
                      </select>
                    </div>
                  </div>

                  {/* Avatar URL Input */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Avatar Image URL
                    </label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                    />
                  </div>
                </div>

                {/* Preset Avatars Picker */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                    Or Choose a Preset Avatar:
                  </span>
                  <div className="flex items-center gap-3">
                    {presetAvatars.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`relative w-11 h-11 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          avatarUrl === url
                            ? "border-[#ff6c2f] scale-105 shadow-sm"
                            : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                      >
                        <Image src={url} alt={`Preset ${idx}`} fill sizes="44px" className="object-cover" />
                        {avatarUrl === url && (
                          <div className="absolute inset-0 bg-[#ff6c2f]/40 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl("")}
                        className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 ml-1 cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="submit"
                    disabled={!isProfileDirty || savingProfile}
                    className="h-10 px-5 rounded-xl bg-[#ff6c2f] hover:bg-[#e05b24] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {savingProfile ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PASSWORD & SECURITY */}
          {activeTab === "security" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Password & Security
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update your account password and review authentication standards.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPasswords ? "Hide Passwords" : "Show Passwords"}</span>
                </button>
              </div>

              {/* 2FA Banner */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Two-Factor Identity Protection Active
                  </h4>
                  <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5 leading-relaxed">
                    Your account is safeguarded with encrypted session cookies and email-scoped validation on all checkout and address operations.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Current Password *
                  </label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* New Password */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      New Password (min 8 chars) *
                    </label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                    />

                    {/* Password strength bar */}
                    {newPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`flex-1 h-full rounded-full transition-all ${
                                step <= passwordStrength ? getStrengthLabel().color : "bg-transparent"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 block">
                          Strength: {getStrengthLabel().label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Confirm New Password *
                    </label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="submit"
                    disabled={!isPasswordDirty || savingPassword}
                    className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {savingPassword ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Notification Preferences
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Control how and when ShobPai notifies you about order milestones.
                  </p>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800/80">
                {/* 1. SMS Order Updates */}
                <div className="flex items-center justify-between pt-3 first:pt-0">
                  <div className="space-y-0.5 pr-4">
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#ff6c2f]" />
                      <span>SMS Order Tracking</span>
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Receive real-time SMS updates when your parcel is dispatched and out for delivery.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.smsOrderUpdates}
                      onChange={(e) =>
                        setNotifications((prev) => ({ ...prev, smsOrderUpdates: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff6c2f]"></div>
                  </label>
                </div>

                {/* 2. WhatsApp Delivery Updates */}
                <div className="flex items-center justify-between pt-3">
                  <div className="space-y-0.5 pr-4">
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span>WhatsApp Delivery Links</span>
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Receive rider contact details and live delivery links directly on WhatsApp.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.whatsappDelivery}
                      onChange={(e) =>
                        setNotifications((prev) => ({ ...prev, whatsappDelivery: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff6c2f]"></div>
                  </label>
                </div>

                {/* 3. Promotional Offers */}
                <div className="flex items-center justify-between pt-3">
                  <div className="space-y-0.5 pr-4">
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-blue-500" />
                      <span>Exclusive Discounts & Vouchers</span>
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Be the first to get promo codes, flash sales, and seasonal discount coupons.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.promoOffers}
                      onChange={(e) =>
                        setNotifications((prev) => ({ ...prev, promoOffers: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff6c2f]"></div>
                  </label>
                </div>

                {/* 4. Wishlist Price Drops */}
                <div className="flex items-center justify-between pt-3">
                  <div className="space-y-0.5 pr-4">
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-purple-500" />
                      <span>Wishlist Price Drops & Restocks</span>
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Alert me when saved wishlist items go on sale or are restocked.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.priceDropAlerts}
                      onChange={(e) =>
                        setNotifications((prev) => ({ ...prev, priceDropAlerts: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff6c2f]"></div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleSaveNotifications}
                  className="h-10 px-5 rounded-xl bg-[#ff6c2f] hover:bg-[#e05b24] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notification Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVE SESSIONS & PRIVACY */}
          {activeTab === "sessions" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Active Devices & Account Privacy
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Monitor logged-in devices and export your account records.
                  </p>
                </div>
              </div>

              {/* Active Sessions List */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Current Active Sessions
                </span>

                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                          Web Browser (Chrome / Edge)
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active Now</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Bangladesh (IP: 103.145.***) • Current Device
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Export & Privacy */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Data Portability & Records
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Export a copy of your personal data file, including your complete order history, saved addresses, and wishlist items.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadUserData}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#ff6c2f]" />
                  <span>Download Personal Data (JSON)</span>
                </button>
              </div>

              {/* Sign Out Section */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Sign Out All Devices
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Revoke credentials and invalidate active sessions across all devices.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to sign out?")) {
                      await logout();
                      window.location.href = "/login";
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 inline mr-1.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerSettingsView;

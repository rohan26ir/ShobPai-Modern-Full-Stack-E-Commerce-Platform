"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";
import logoImg from "@/public/logo/sobpai-nav_logo.svg";
import signinImg from "@/public/sections/sign-01.webp";

// Helper to format Firebase error codes into clean user-friendly messages
function formatAuthError(error: any): string {
  if (!error) return "An unexpected error occurred. Please try again.";
  const code = error?.code || "";
  const msg = error?.message || "";

  if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
    return "Invalid email or password. Please verify your credentials.";
  }
  if (code === "auth/user-not-found") {
    return "No account found with this email address. Please create an account.";
  }
  if (code === "auth/email-already-in-use") {
    return "An account with this email address already exists.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Access is temporarily restricted. Please try again in a few minutes.";
  }
  if (code === "auth/network-request-failed") {
    return "Network error. Please check your internet connection.";
  }

  return (
    msg
      .replace("Firebase: ", "")
      .replace(/\(auth\/[^)]+\)\.?/, "")
      .trim() || "Authentication failed. Please try again."
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loginWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Automatically redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Email / Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      setSuccessMsg("Signed in successfully. Redirecting to your dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: any) {
      console.error("Email login error:", err);
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#faf8f5] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-12 overflow-hidden">
      {/* Background Graphic matching sign-01 organic fruits */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src={signinImg}
          alt="ShobPai Fresh Fruits & Groceries"
          fill
          priority
          className="object-cover object-right md:object-right-bottom opacity-90 lg:opacity-100"
        />
        {/* Soft gradient overlay on small screens to ensure text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5]/90 via-[#faf8f5]/60 to-transparent lg:hidden" />
      </div>

      {/* Main Container Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
        
        {/* Form Card Column */}
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Logo & Header */}
          <div className="mb-6 space-y-3">
            <div className="flex justify-center">
              <Link href="/" className="inline-flex items-center gap-2">
                <Image
                  src={logoImg}
                  alt="ShobPai"
                  className="h-11 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Manage your fresh grocery orders, tracked deliveries & rewards
              </p>
            </div>
          </div>

          {/* Glassmorphic Form Card */}
          <div className="bg-white/95 backdrop-blur-xl py-7 px-6 sm:px-9 shadow-2xl shadow-amber-950/10 rounded-3xl border border-white/90 space-y-5">
            {/* Feedback Alerts */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50/95 border border-red-200/80 text-red-700 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
                <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 mt-1" />
                <div className="flex-1 leading-relaxed">{error}</div>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/95 border border-emerald-200/80 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
                <FaCheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="flex-1">{successMsg}</span>
              </div>
            )}

            {/* Email / Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-hidden focus:border-[#E5A842] focus:bg-white focus:ring-2 focus:ring-[#E5A842]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-[#E5A842] hover:text-[#d49633] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-hidden focus:border-[#E5A842] focus:bg-white focus:ring-2 focus:ring-[#E5A842]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-3.5 w-3.5" />
                    ) : (
                      <FaEye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded-md border-slate-300 text-[#E5A842] focus:ring-[#E5A842] accent-[#E5A842]"
                  />
                  <span className="text-xs font-medium text-slate-600">
                    Keep me signed in
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#E5A842] py-3 text-xs font-black text-slate-950 shadow-md shadow-[#E5A842]/20 hover:bg-[#d49633] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <FaSpinner className="animate-spin h-4 w-4" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <FaArrowRight className="h-3 w-3" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Footer Link */}
            <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-extrabold text-[#E5A842] hover:text-[#d49633] hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Security & Privacy Notice */}
          <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <FaShieldAlt className="h-3 w-3 text-slate-400" />
            <span>Encrypted with SSL & Firebase Authentication</span>
          </div>
        </div>

      </div>
    </div>
  );
}
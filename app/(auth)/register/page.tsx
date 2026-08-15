"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FaGoogle,
  FaFacebookF,
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhoneAlt,
  FaSpinner,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaSeedling,
} from "react-icons/fa";
import logoImg from "@/public/logo/sobpai-nav_logo.svg";
import signupImg from "@/public/sections/sign-02.webp";

function formatAuthError(error: any): string {
  if (!error) return "An unexpected error occurred. Please try again.";
  const code = error?.code || "";
  const msg = error?.message || "";

  if (code === "auth/email-already-in-use") {
    return "An account with this email address already exists. Please sign in instead.";
  }
  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }
  if (code === "auth/weak-password") {
    return "Password is too weak. Please use at least 6 characters with a combination of letters and numbers.";
  }
  if (code === "auth/popup-closed-by-user") {
    return "Authentication popup was closed before completing.";
  }

  return msg.replace("Firebase: ", "").replace(/\(auth\/[^)]+\)\.?/, "").trim() || "Failed to create account. Please try again.";
}

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithEmail, loginWithGoogle, loginWithFacebook } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the terms of service and privacy policy to continue.");
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email.trim(), password, name.trim(), phone.trim() || undefined);
      setSuccessMsg("Account created successfully! Redirecting to your dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setSocialLoading("google");
    try {
      await loginWithGoogle();
      setSuccessMsg("Account connected with Google! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(formatAuthError(err));
      }
    } finally {
      setSocialLoading(null);
    }
  };

  const handleFacebookSignup = async () => {
    setError(null);
    setSocialLoading("facebook");
    try {
      await loginWithFacebook();
      setSuccessMsg("Account connected with Facebook! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(formatAuthError(err));
      }
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f7faf5] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-12 overflow-hidden">
      {/* Background Graphic matching sign-02 fresh vegetables */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src={signupImg}
          alt="ShobPai Fresh Organic Vegetables"
          fill
          priority
          className="object-cover object-right md:object-right-bottom opacity-90 lg:opacity-100"
        />
        {/* Soft gradient overlay on small screens */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7faf5]/90 via-[#f7faf5]/60 to-transparent lg:hidden" />
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
                Create your account
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Join ShobPai to enjoy fresh grocery delivery & personalized discounts
              </p>
            </div>
          </div>

          {/* Glassmorphic Form Card */}
          <div className="bg-white/95 backdrop-blur-xl py-7 px-6 sm:px-9 shadow-2xl shadow-emerald-950/10 rounded-3xl border border-white/90 space-y-5">
            {/* Feedback alerts */}
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

            {/* Social Sign Up Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading || !!socialLoading}
                className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
              >
                {socialLoading === "google" ? (
                  <FaSpinner className="animate-spin h-4 w-4 text-slate-600" />
                ) : (
                  <FaGoogle className="text-red-500 h-4 w-4 shrink-0" />
                )}
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleFacebookSignup}
                disabled={loading || !!socialLoading}
                className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border border-[#1877F2] bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
              >
                {socialLoading === "facebook" ? (
                  <FaSpinner className="animate-spin h-4 w-4 text-white" />
                ) : (
                  <FaFacebookF className="text-white h-4 w-4 shrink-0" />
                )}
                <span>Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Or register with email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-hidden focus:border-[#5FA800] focus:bg-white focus:ring-2 focus:ring-[#5FA800]/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
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
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-hidden focus:border-[#5FA800] focus:bg-white focus:ring-2 focus:ring-[#5FA800]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <FaPhoneAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+8801XXXXXXXXX"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-hidden focus:border-[#5FA800] focus:bg-white focus:ring-2 focus:ring-[#5FA800]/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-hidden focus:border-[#5FA800] focus:bg-white focus:ring-2 focus:ring-[#5FA800]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash className="h-3.5 w-3.5" /> : <FaEye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-hidden focus:border-[#5FA800] focus:bg-white focus:ring-2 focus:ring-[#5FA800]/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start pt-0.5">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 mt-0.5 rounded-md border-slate-300 text-[#5FA800] focus:ring-[#5FA800] accent-[#5FA800]"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I agree to ShobPai's{" "}
                    <Link href="/terms" className="text-[#5FA800] font-bold hover:underline">
                      Terms
                    </Link>{" "}
                    &{" "}
                    <Link href="/privacy" className="text-[#5FA800] font-bold hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !!socialLoading}
                className="w-full rounded-2xl bg-[#5FA800] py-3 text-xs font-black text-white shadow-md shadow-[#5FA800]/20 hover:bg-[#528f00] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
              >
                {loading ? (
                  <FaSpinner className="animate-spin h-4 w-4" />
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <FaArrowRight className="h-3 w-3" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom link */}
            <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-extrabold text-[#5FA800] hover:text-[#528f00] hover:underline"
              >
                Sign In
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
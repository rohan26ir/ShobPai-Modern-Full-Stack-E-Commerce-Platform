"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FaEnvelope, FaKey, FaArrowLeft, FaSpinner, FaCheckCircle, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import logoImg from "@/public/logo/logo_shobpai.webp";

function formatAuthError(error: any): string {
  if (!error) return "An unexpected error occurred. Please try again.";
  const code = error?.code || "";
  const msg = error?.message || "";

  if (code === "auth/user-not-found") {
    return "No account found with this email address.";
  }
  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }

  return msg.replace("Firebase: ", "").replace(/\(auth\/[^)]+\)\.?/, "").trim() || "Failed to send reset link. Please try again.";
}

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setSubmitted(true);
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src={logoImg}
              alt="ShobPai"
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        <div className="text-center space-y-1 px-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm text-slate-500">
            Enter your account email to receive a secure recovery link
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50/90 border border-red-200/80 text-red-700 text-xs font-semibold flex items-start gap-2.5">
              <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 mt-1" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {submitted ? (
            <div className="space-y-6 text-center">
              <div className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 text-emerald-900 text-xs space-y-2">
                <FaCheckCircle className="h-7 w-7 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">Password Reset Email Sent</p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  We sent a recovery link to <strong className="text-slate-900">{email}</strong>. Please check your inbox and spam folder.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                >
                  Send to a different email
                </button>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 text-xs font-black text-[#E5A842] hover:text-[#d49633] hover:underline"
                >
                  <FaArrowLeft className="h-3 w-3" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Registered Email Address
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
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-hidden focus:border-[#E5A842] focus:bg-white focus:ring-2 focus:ring-[#E5A842]/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#E5A842] py-3.5 text-xs font-black text-slate-950 shadow-md shadow-[#E5A842]/20 hover:bg-[#d49633] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <FaSpinner className="animate-spin h-4 w-4" />
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <FaArrowRight className="h-3 w-3" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <FaArrowLeft className="h-3 w-3" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Security & Privacy Notice */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <FaShieldAlt className="h-3 w-3 text-slate-400" />
          <span>Encrypted with SSL & Firebase Authentication</span>
        </div>
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FaLock, FaCheckCircle, FaSpinner, FaArrowLeft, FaEye, FaEyeSlash, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import logoImg from "@/public/logo/logo_shobpai.webp";

function formatAuthError(error: any): string {
  if (!error) return "An unexpected error occurred. Please try again.";
  const code = error?.code || "";
  const msg = error?.message || "";

  if (code === "auth/expired-action-code") {
    return "This password reset link has expired. Please request a new link.";
  }
  if (code === "auth/invalid-action-code") {
    return "This password reset link is invalid or has already been used.";
  }
  if (code === "auth/weak-password") {
    return "Password is too weak. Please use at least 6 characters.";
  }

  return msg.replace("Firebase: ", "").replace(/\(auth\/[^)]+\)\.?/, "").trim() || "Failed to update password. Please try again.";
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode") || "";

  const { confirmPasswordReset } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!oobCode) {
      setError("Invalid or missing password reset code in the URL.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(oobCode, newPassword);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 space-y-6">
      {error && (
        <div className="p-4 rounded-2xl bg-red-50/90 border border-red-200/80 text-red-700 text-xs font-semibold flex items-start gap-2.5">
          <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 mt-1" />
          <div className="flex-1 leading-relaxed">{error}</div>
        </div>
      )}

      {success ? (
        <div className="space-y-5 text-center">
          <div className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 text-emerald-900 text-xs space-y-2">
            <FaCheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
            <p className="font-bold text-sm">Password Updated Successfully</p>
            <p className="text-slate-600 text-xs">
              Your password has been changed. You will be redirected to the sign-in page in a few moments...
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 text-xs font-black text-[#5FA800] hover:underline"
          >
            <span>Click here to sign in now</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              New Password *
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-3 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-hidden focus:border-[#5FA800] focus:bg-white focus:ring-2 focus:ring-[#5FA800]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash className="h-3.5 w-3.5" /> : <FaEye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Confirm New Password *
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-3 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-hidden focus:border-[#5FA800] focus:bg-white focus:ring-2 focus:ring-[#5FA800]/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#5FA800] py-3.5 text-xs font-black text-white shadow-md shadow-[#5FA800]/20 hover:bg-[#528f00] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <FaSpinner className="animate-spin h-4 w-4" />
            ) : (
              <>
                <span>Save New Password</span>
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
  );
}

export default function ResetPasswordPage() {
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

        <div className="text-center space-y-1 px-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create new password
          </h1>
          <p className="text-sm text-slate-500">
            Choose a strong password to protect your account
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-slate-500">Verifying session...</div>}>
          <ResetPasswordForm />
        </Suspense>

        {/* Security & Privacy Notice */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <FaShieldAlt className="h-3 w-3 text-slate-400" />
          <span>Encrypted with SSL & Firebase Authentication</span>
        </div>
      </div>
    </div>
  );
}
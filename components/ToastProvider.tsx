"use client";

import { Toaster } from "react-hot-toast";
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from "react-icons/fa";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3200,
        style: {
          background: "#18181B", // Zinc-900 dark theme
          color: "#FAFAFA",
          fontSize: "13px",
          fontWeight: 600,
          borderRadius: "14px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "12px 16px",
        },
        success: {
          icon: <FaCheckCircle className="text-emerald-400 text-lg shrink-0" />,
        },
        error: {
          icon: <FaExclamationCircle className="text-red-400 text-lg shrink-0" />,
        },
        loading: {
          icon: <FaSpinner className="text-[#E5A842] text-lg animate-spin shrink-0" />,
        },
      }}
    />
  );
}

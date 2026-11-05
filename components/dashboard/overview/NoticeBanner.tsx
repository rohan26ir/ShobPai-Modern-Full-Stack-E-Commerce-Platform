"use client";

import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface NoticeBannerProps {
  message?: string;
}

export function NoticeBanner({
  message = "We regret to inform you that our server is currently experiencing technical difficulties...",
}: NoticeBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="rounded-xl border border-[#ffdacb] dark:border-orange-900/40 bg-[#fff1eb] dark:bg-orange-950/25 px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-[#ea580c] dark:text-orange-300 shadow-2xs">
      <div className="flex items-center gap-2 overflow-hidden">
        <AlertTriangle className="w-4 h-4 shrink-0 text-[#ff6c2f]" />
        <span className="truncate font-medium">{message}</span>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="text-[#ea580c]/70 hover:text-[#ea580c] dark:text-orange-400 p-1 rounded-md hover:bg-[#ffdacb]/50 transition-colors cursor-pointer shrink-0"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}


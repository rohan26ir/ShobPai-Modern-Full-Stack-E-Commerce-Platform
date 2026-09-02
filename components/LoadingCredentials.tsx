"use client";

import Image from "next/image";
import logoImg from "@/public/logo/logo_shobpai.webp";

export default function LoadingCredentials() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <Image
          src={logoImg}
          alt="ShobPai"
          className="h-12 w-auto object-contain"
        />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Loading...
        </p>
      </div>
    </div>
  );
}

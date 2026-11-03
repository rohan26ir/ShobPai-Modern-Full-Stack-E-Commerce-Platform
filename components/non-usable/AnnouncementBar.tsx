"use client";

import Link from "next/link";
import { FaTruck, FaPhoneAlt, FaPercent } from "react-icons/fa";

export default function AnnouncementBar() {
  return (
    <div className="hidden md:block bg-gray-900 text-white text-xs py-2 px-4 border-b border-gray-800 overflow-hidden">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Left info */}
        <div className="flex items-center justify-center sm:justify-start gap-4">
          <div className="flex items-center gap-1.5 font-medium text-[11px] sm:text-xs">
            <FaTruck className="text-[#F0A843] h-3.5 w-3.5 shrink-0" />
            <span><span className="text-[#F0A843] font-bold">Free shipping</span> orders from all items</span>
          </div>
        </div>

        {/* Right options */}
        <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4 text-gray-300 text-[11px] sm:text-xs flex-wrap">
          <div className="flex items-center gap-1.5 hover:text-[#F0A843] transition-colors cursor-pointer py-1">
            <FaPhoneAlt className="h-3 w-3 text-[#F0A843] shrink-0" />
            <span>Support: +41 44123 4567</span>
          </div>
          <span className="text-gray-600">|</span>
          <Link href="/about-us" className="hover:text-[#F0A843] transition-colors py-1">
            About us
          </Link>
        </div>
      </div>
    </div>
  );
}

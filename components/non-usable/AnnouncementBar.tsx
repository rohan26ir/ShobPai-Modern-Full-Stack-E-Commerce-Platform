"use client";

import Link from "next/link";
import { FaTruck, FaPhoneAlt, FaPercent } from "react-icons/fa";

export default function AnnouncementBar() {
  return (
    <div className="bg-gray-900 text-white text-xs py-2 px-4 border-b border-gray-800">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <FaTruck className="text-[#F0A843] h-3.5 w-3.5" />
            <span><span className="text-[#F0A843]">Free shipping</span> orders from all items</span>
          </div>
          {/* <span className="hidden md:inline text-gray-700">|</span> */}
          {/* <div className="hidden md:flex items-center gap-1.5 text-gray-300">
            <FaPercent className="text-[#F0A843] h-3 w-3" />
            <span>Use Code: <strong className="text-[#F0A843]">FRESH2026</strong> for 15% OFF</span>
          </div> */}
        </div>

        {/* Right options */}
        <div className="flex items-center gap-4 text-gray-300">
          <div className="flex items-center gap-1 hover:text-[#F0A843] transition-colors cursor-pointer">
            <FaPhoneAlt className="h-3 w-3 text-[#F0A843]" />
            <span>Support: +41 44123 4567</span>
          </div>
          <span>|</span>
          <Link href={"/about-us"} >About us</Link>

        </div>
      </div>
    </div>
  );
}

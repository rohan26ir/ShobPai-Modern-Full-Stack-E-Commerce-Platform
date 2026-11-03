"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaPaperPlane,
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
  FaWhatsapp,
  FaChevronUp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logoImg from "@/public/logo/logo_shobpai.webp";


export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const servicesLinks = [
    { title: "About vegist", url: "/about-us" },
    { title: "Faq's", url: "/faq" },
    { title: "Contact us", url: "/contact-us" },
    { title: "News", url: "/blogs" },
    { title: "Store location", url: "/shop" },
  ];

  const privacyLinks = [
    { title: "Payment policy", url: "/payment-policy" },
    { title: "Privacy policy", url: "/privacy-policy" },
    { title: "Return policy", url: "/return-policy" },
    { title: "Shipping policy", url: "/shipping-policy" },
    { title: "Terms & conditions", url: "/terms-conditions" },
  ];

  const accountLinks = [
    { title: "My account", url: "/account" },
    { title: "My cart", url: "/shop" },
    { title: "Order history", url: "/account" },
    { title: "My wishlist", url: "/wishlist" },
    { title: "My address", url: "/account" },
  ];

  const socialLinks = [
    { name: "WhatsApp", icon: <FaWhatsapp />, href: "#" },
    { name: "Facebook", icon: <FaFacebookF />, href: "#" },
    { name: "Twitter", icon: <FaXTwitter />, href: "#" },
    { name: "Instagram", icon: <FaInstagram />, href: "#" },
    { name: "Pinterest", icon: <FaPinterestP />, href: "#" },
    { name: "YouTube", icon: <FaYoutube />, href: "#" },
  ];

  return (
    <footer className="bg-[#222222] text-gray-300 relative py-12 md:py-16 ">
      <div className="container mx-auto px-4">

        {/* Main 5-Column Grid (2 columns on small device for Services & Account, 5 columns on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Column 1: Brand Logo & Location Contact */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 space-y-4 order-1">
            <Link href="/" className="inline-block">
              <Image
                src={logoImg}
                alt="ShobPai Vegist logo"
                className="h-10 w-auto  brightness-0 invert "
                priority
              />
            </Link>

            <h4 className="text-white font-bold text-sm pt-2">Location</h4>

            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="text-[#E5A842] h-4 w-4 shrink-0 mt-0.5" />
                <span>38 block street arean licard hamonia road sydney, australia</span>
              </li>

              <li className="flex items-center gap-2.5">
                <FaPhoneAlt className="text-[#E5A842] h-3.5 w-3.5 shrink-0" />
                <span>+014-33333-8888-6868</span>
              </li>

              <li className="flex items-center gap-2.5">
                <FaEnvelope className="text-[#E5A842] h-3.5 w-3.5 shrink-0" />
                <a href="mailto:support@shobpai.com" className="hover:text-white transition-colors py-1 inline-block">
                  support@shobpai.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Services (Column 1 on small device) */}
          <div className="col-span-1 order-2">
            <h4 className="text-white font-bold text-sm mb-4">Services</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {servicesLinks.map((link) => (
                <li key={link.title}>
                  <Link href={link.url} className="hover:text-white transition-colors py-1 inline-block">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: My account (Column 2 on small device right beside Services, Column 4 on desktop) */}
          <div className="col-span-1 order-3 lg:order-4">
            <h4 className="text-white font-bold text-sm mb-4">My account</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {accountLinks.map((link) => (
                <li key={link.title}>
                  <Link href={link.url} className="hover:text-white transition-colors py-1 inline-block">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Privacy & terms (Order 4 on small device, Order 3 on desktop) */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 order-4 lg:order-3">
            <h4 className="text-white font-bold text-sm mb-4">Privacy & terms</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:space-y-2 text-xs text-gray-400">
              {privacyLinks.map((link) => (
                <li key={link.title}>
                  <Link href={link.url} className="hover:text-white transition-colors py-1 inline-block">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Get the latest deal */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-4 order-5">
            <h4 className="text-white font-bold text-sm">Get the latest deal</h4>
            <p className="text-xs text-gray-400">
              And receive $20 coupon for first shopping
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubscribe} className="flex items-stretch rounded-xs overflow-hidden">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-white text-gray-800 text-xs px-3.5 py-3 outline-hidden placeholder-gray-400 min-h-[44px]"
              />
              <button
                type="submit"
                className="bg-[#E5A842] hover:bg-[#d49633] text-gray-950 px-4 py-3 text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center justify-center min-h-[44px] min-w-[44px]"
                title="Subscribe"
                aria-label="Subscribe"
              >
                <FaPaperPlane className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Social Icons Row */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="h-9 w-9 sm:h-8 sm:w-8 bg-white text-[#E5A842] hover:bg-[#222222] border border-transparent hover:border-[#E5A842] flex items-center justify-center rounded-xs transition-colors cursor-pointer"
                  title={item.name}
                  aria-label={item.name}
                >
                  <span className="text-[#E5A842] text-xs">{item.icon}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Scroll To Top Button (Bottom Right) */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 h-11 w-11 bg-gray-900/90 hover:bg-gray-900 border-2 border-[#E5A842] text-[#E5A842] hover:border-[#d49633] hover:text-[#d49633] flex items-center justify-center rounded-xl text-xs transition-colors cursor-pointer z-40 shadow-xl"
        title="Scroll to Top"
        aria-label="Scroll to Top"
      >
        <FaChevronUp className="h-3.5 w-3.5" />
      </button>
    </footer>
  );
}
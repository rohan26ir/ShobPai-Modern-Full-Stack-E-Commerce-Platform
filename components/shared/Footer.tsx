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
import logoImg from "@/public/logo/sobpai-nav_logo.svg";


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
    { title: "Payment policy", url: "/privacy" },
    { title: "Privacy policy", url: "/privacy" },
    { title: "Return policy", url: "/privacy" },
    { title: "Shipping policy", url: "/privacy" },
    { title: "Terms & conditions", url: "/terms" },
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

        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Column 1: Brand Logo & Location Contact */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src={logoImg}
                alt="ShobPai Vegist logo"
                className="h-10 w-auto brightness-200 contrast-200"
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
                <a href="mailto:support@shobpai.com" className="hover:text-white transition-colors">
                  support@shobpai.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Services</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {servicesLinks.map((link) => (
                <li key={link.title}>
                  <Link href={link.url} className="hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Privacy & terms */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Privacy & terms</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {privacyLinks.map((link) => (
                <li key={link.title}>
                  <Link href={link.url} className="hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: My account */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">My account</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {accountLinks.map((link) => (
                <li key={link.title}>
                  <Link href={link.url} className="hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Get the latest deal */}
          <div className="space-y-4">
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
                className="w-full bg-white text-gray-800 text-xs px-3.5 py-3 outline-hidden placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-[#E5A842] hover:bg-[#d49633] text-gray-950 px-4 py-3 text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                title="Subscribe"
              >
                <FaPaperPlane className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Social Icons Row */}
            <div className="flex items-center gap-1.5 pt-2">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="h-7 w-7 bg-white text-[#E5A842] hover:bg-[#222222] border border-transparent hover:border-[#E5A842] flex items-center justify-center rounded-xs transition-colors"
                  title={item.name}
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
        className="absolute bottom-6 right-6 h-9 w-9 bg-transparent border-2 border-[#E5A842] text-[#E5A842] hover:border-[#d49633] hover:text-[#d49633] flex items-center justify-center rounded-xs text-xs transition-colors cursor-pointer"
        title="Scroll to Top"
      >
        <FaChevronUp className="h-3.5 w-3.5" />
      </button>
    </footer>
  );
}
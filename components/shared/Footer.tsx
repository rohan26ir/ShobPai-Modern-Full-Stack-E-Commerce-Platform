import Image from "next/image";
import Link from "next/link";
import { ReactElement } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPinterest,
  FaWhatsapp,
} from "react-icons/fa6";
import { FaLocationDot, FaPhone } from "react-icons/fa6";

import logos from "@/public/logo/sobpai-nav_logo.svg";

interface NavLink {
  title: string;
  url: string;
}

interface SocialLink {
  title: string;
  url: string;
  icon: ReactElement;
}

export default function Footer() {
  // Separate link lists for each column
  const services: NavLink[] = [
    { title: "About ShobPai", url: "/about-us" },
    { title: "FAQ's", url: "/faq" },
    { title: "Contact us", url: "/contact" },
    { title: "News", url: "/news" },
    { title: "Store location", url: "/store-location" },
  ];

  const privacyLinks: NavLink[] = [
    { title: "Privacy Policy", url: "/privacy" },
    { title: "Terms of Service", url: "/terms" },
    { title: "Cookie Policy", url: "/cookies" },
    { title: "Security", url: "/security" },
  ];

  const accountLinks: NavLink[] = [
    { title: "My Account", url: "/account" },
    { title: "Order History", url: "/orders" },
    { title: "Wishlist", url: "/wishlist" },
    { title: "Newsletter", url: "/newsletter" },
  ];

  const socials: SocialLink[] = [
    { title: "WhatsApp", url: "https://web.facebook.com/", icon: <FaWhatsapp /> },
    { title: "Facebook", url: "https://web.facebook.com/", icon: <FaFacebook /> },
    { title: "Instagram", url: "https://web.facebook.com/", icon: <FaInstagram /> },
    { title: "Twitter", url: "https://web.facebook.com/", icon: <FaTwitter /> },
    { title: "YouTube", url: "https://web.facebook.com/", icon: <FaYoutube /> },
    { title: "Pinterest", url: "https://web.facebook.com/", icon: <FaPinterest /> },
  ];

  return (
    <footer className="border-t ">
      <div className="container mx-auto px-4 py-10">
        {/* Top section – grid layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand / About */}
          <div className="col-span-3 flex flex-col gap-4">
            <Link href="/">
              <Image
                src={logos}
                alt="ShobPai logo"
                className="h-12 w-auto"
                priority
              />
            </Link>
            <p className="text-sm ">
              {"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make."}
            </p>
            <h3 className="mt-2 font-semibold">Contact us</h3>
            <div className="flex justify-between gap-2 text-sm">
              
              <div className="flex-1 flex-row items-start gap-2">
                <FaLocationDot className="mb-3 shrink-0" />
                <p>West 14th Maria Reichenbach, Zürich 8022, Switzerland</p>
              </div>
              
              <div className="flex-1 items-start gap-4">
                <div><FaPhone className="mb-3 shrink-0" /></div>
                <div>
                  <p>+41 44123 4567</p>
                  <a href="mailto:support@gmail.com" className="">
                    support@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 font-bold text-sm">Services</h3>
            <ul className="space-y-2 text-sm">
              {services.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className="hover:text-blue-600">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy & Terms */}
          <div>
            <h3 className="mb-4 font-bold text-sm ">Privacy & Terms</h3>
            <ul className="space-y-2 text-sm">
              {privacyLinks.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className="hover:text-blue-600">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h3 className="mb-4 font-bold text-4xl">My Account</h3>
            <ul className="space-y-2 text-sm">
              {accountLinks.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className="hover:text-blue-600">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row">
          <div className="text-sm text-gray-600">
            Copyright © 2026 by spacingtech
          </div>
          <div className="flex flex-wrap gap-4 text-2xl">
            {socials.map((social) => (
              <a
                key={social.title}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-blue-600"
                aria-label={social.title}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
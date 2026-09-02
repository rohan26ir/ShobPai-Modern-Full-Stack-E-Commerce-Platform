"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

import promobanner1 from '@/public/sections/promobanner-01.webp';
import promobanner2 from '@/public/sections/promobanner-02.webp';
import promobanner3 from '@/public/sections/promobanner-03.jpg';

export default function PromoBannersSection() {
  const banners = [
    {
      id: "b1",
      subtitle: "Only Today",
      title: "Fresh & hand made",
      discount: "Save Up To 30%",
      image: promobanner1,
      link: "/shop?category=vegetables",
      btnBg: "text-black",
    },
    {
      id: "b2",
      subtitle: "100% HEALTHY",
      title: "Organic Fresh Fruits",
      discount: "Flat 25% Discount",
      image: promobanner2,
      link: "/shop?category=fresh-fruits",
      btnBg: " text-black",
    },
    {
      id: "b3",
      subtitle: "Prod of Bangladesh",
      title: "Organic fresh drinks",
      discount: "Flat 20% Discount",
      image: promobanner3,
      link: "/shop?category=beverages",
      btnBg: "text-black ",
    },
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((b) => (
            <Link
              key={b.id}
              href={b.link}
              className="group relative min-h-55  overflow-hidden  flex items-center p-6 cursor-pointer"
            >
              <div>
                {/* image */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* content */}
                <div className="relative z-10 text-white">
                  <span className="text-[14px]  uppercase tracking-widest text-black/80  ">
                    {b.subtitle}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-black mt-1 mb-1 leading-tight">
                    {b.title}
                  </h3>
                  <p className="text-xs font-bold text-black mb-4">{b.discount}</p>

                  <div
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${b.btnBg}`}
                  >
                    <span>Shop Now</span>
                    <FaArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

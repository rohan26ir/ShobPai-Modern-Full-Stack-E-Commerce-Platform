"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function PromoBannersSection() {
  const banners = [
    {
      id: "b1",
      subtitle: "NATURAL ORGANIC",
      title: "Fresh Vegetables",
      discount: "Save Up To 30%",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
      link: "/shop?category=vegetables",
      btnBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    {
      id: "b2",
      subtitle: "100% HEALTHY",
      title: "Organic Fresh Fruits",
      discount: "Flat 25% Discount",
      image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600&auto=format&fit=crop&q=80",
      link: "/shop?category=fresh-fruits",
      btnBg: "bg-[#E5A842] hover:bg-[#d49633] text-gray-950 font-black",
    },
    {
      id: "b3",
      subtitle: "PURE & FRESH",
      title: "Cold Pressed Juices",
      discount: "Starting At $2.99",
      image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80",
      link: "/shop?category=beverages",
      btnBg: "bg-teal-600 hover:bg-teal-700 text-white",
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
              className="group relative min-h-[220px] rounded-3xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl bg-gray-900 flex items-center p-6 block cursor-pointer"
            >
              <Image
                src={b.image}
                alt={b.title}
                fill
                className="object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              <div className="relative z-10 text-white">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                  {b.subtitle}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white mt-1 mb-1 leading-tight">
                  {b.title}
                </h3>
                <p className="text-xs font-bold text-amber-300 mb-4">{b.discount}</p>

                <div
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${b.btnBg}`}
                >
                  <span>Shop Now</span>
                  <FaArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

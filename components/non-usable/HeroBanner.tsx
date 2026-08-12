"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaLeaf } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HeroBanner() {
  const slides = [
    {
      id: "slide-1",
      badge: "100% Organic & Farm Fresh",
      title: "Fresh Summer Produce Sale",
      description: "Discover local organic fruits, leafy greens, and artisan groceries delivered straight from farm to your kitchen table.",
      discount: "Up to 40% OFF",
      link: "/shop",
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200&auto=format&fit=crop&q=80",
    },
    {
      id: "slide-2",
      badge: "Harvested Daily From Local Farms",
      title: "Special Farm Fresh Vegetables",
      description: "Chemical-free, rich in essential vitamins & minerals. Get farm freshness delivered same day.",
      discount: "Up to 50% OFF",
      link: "/category/vegetables",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&auto=format&fit=crop&q=80",
    },
    {
      id: "slide-3",
      badge: "Sweet & Juicy Orchard Picks",
      title: "Pure & Sweet Organic Fruits",
      description: "Naturally ripened berries, crisp apples, and tropical citrus packed with natural goodness.",
      discount: "Up to 35% OFF",
      link: "/category/fresh-fruits",
      image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=1200&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="py-6 bg-gradient-to-b from-amber-50/30 via-white to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Hero Slider Card (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-xl bg-gray-950">
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              loop={true}
              grabCursor={true}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                bulletActiveClass: "swiper-pagination-bullet-active !bg-[#F0A843] !rounded-full !w-3.5 !h-3.5 !opacity-100",
              }}
              className="w-full h-full min-h-[480px] md:min-h-[560px] lg:min-h-[580px] hero-swiper"
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.id} className="relative flex items-center p-8 md:p-14 lg:p-16 min-h-[480px] md:min-h-[560px] lg:min-h-[580px]">
                  {/* Background Image Overlay */}
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    className="object-cover opacity-45 mix-blend-overlay"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />

                  <div className="relative z-10 max-w-xl text-white my-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0A843]/20 backdrop-blur-md text-[#F0A843] text-xs font-bold uppercase tracking-wider mb-5 border border-[#F0A843]/40">
                      <FaLeaf className="h-3.5 w-3.5" />
                      <span>{slide.badge}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5 text-white drop-shadow-md">
                      {slide.title}
                    </h1>

                    <p className="text-gray-200 text-base md:text-lg mb-8 leading-relaxed line-clamp-3">
                      {slide.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-5">
                      <Link
                        href={slide.link}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#F0A843] hover:bg-[#e09732] text-gray-950 font-black transition-all shadow-xl shadow-[#F0A843]/30 cursor-pointer text-base"
                      >
                        <span>Shop Collection</span>
                        <FaArrowRight className="h-4 w-4" />
                      </Link>

                      <span className="text-base font-extrabold text-white bg-black/40 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10">
                        {slide.discount}
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Secondary Side Promo Banners */}
          <div className="flex flex-col gap-6 justify-between">
            {/* Top Side Banner */}
            <div className="relative flex-1 min-h-[230px] md:min-h-[265px] lg:min-h-[276px] rounded-3xl overflow-hidden bg-gray-900 p-8 flex flex-col justify-center shadow-lg border border-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
                alt="Organic Fruits"
                fill
                className="object-cover opacity-45 mix-blend-overlay"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="relative z-10 text-white">
                <span className="text-[#F0A843] text-xs font-black uppercase tracking-wider">Natural Taste</span>
                <h3 className="text-2xl font-extrabold mt-1 mb-2 text-white">Organic Fresh Fruits</h3>
                <p className="text-xs md:text-sm text-gray-300 mb-5">Sweet & ripe orchard fruits harvested daily.</p>
                <Link href="/category/fresh-fruits" className="text-xs md:text-sm font-bold text-[#F0A843] underline underline-offset-4 hover:text-white inline-flex items-center gap-1">
                  Explore Fruits &rarr;
                </Link>
              </div>
            </div>

            {/* Bottom Side Banner */}
            <div className="relative flex-1 min-h-[230px] md:min-h-[265px] lg:min-h-[276px] rounded-3xl overflow-hidden bg-gray-900 p-8 flex flex-col justify-center shadow-lg border border-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&auto=format&fit=crop&q=80"
                alt="Healthy Smoothies"
                fill
                className="object-cover opacity-45 mix-blend-overlay"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="relative z-10 text-white">
                <span className="text-[#F0A843] text-xs font-black uppercase tracking-wider">Healthy Lifestyle</span>
                <h3 className="text-2xl font-extrabold mt-1 mb-2 text-white">Pure Cold Juices</h3>
                <p className="text-xs md:text-sm text-gray-300 mb-5">100% natural, no added sugar juices.</p>
                <Link href="/category/beverages" className="text-xs md:text-sm font-bold text-[#F0A843] underline underline-offset-4 hover:text-white inline-flex items-center gap-1">
                  Shop Juices &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

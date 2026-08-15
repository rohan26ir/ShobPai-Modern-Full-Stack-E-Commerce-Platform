"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaLeaf } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import herobig1 from '@/public/sections/hero-big-1.webp'
import herobig2 from '@/public/sections/hero-big-2.webp'

import herosma1 from '@/public/sections/hero-small-1.webp'
import herosma2 from '@/public/sections/hero-small-2.webp'

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
      image: herobig1,
    },
    {
      id: "slide-2",
      badge: "Harvested Daily From Local Farms",
      title: "Special Farm Fresh Vegetables",
      description: "Chemical-free, rich in essential vitamins & minerals. Get farm freshness delivered same day.",
      discount: "Up to 50% OFF",
      link: "/category/vegetables",
      image: herobig2,
    },
    {
      id: "slide-3",
      badge: "Sweet & Juicy Orchard Picks",
      title: "Pure & Sweet Organic Fruits",
      description: "Naturally ripened berries, crisp apples, and tropical citrus packed with natural goodness.",
      discount: "Up to 35% OFF",
      link: "/category/fresh-fruits",
      image: herobig1,
    },
  ];

  return (
    <section className="py-6 bg-gradient-to-b from-amber-50/30 via-white to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Hero Slider Card (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 relative overflow-hidden 
                         h-[450px]">
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
                bulletActiveClass: "swiper-pagination-bullet-active !bg-[#F0A843] !rounded-full !w-2.5 !h-2.5 !opacity-100",
              }}
              className="w-full h-full hero-swiper  "
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.id} className="relative flex items-center py-6 px-3  md:p-6 lg:p-8 h-full">
                  {/* Background Image Overlay */}
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    className="object-cover "
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />

                  <div className="relative z-10 max-w-3/6 text-white my-auto top-30 ">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1  text-[#F0A843] text-xs font-bold  mb-3 ">
                      {/* <FaLeaf className="h-3.5 w-3.5" /> */}
                      <span>{slide.badge}</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black leading-tight mb-3 text-black  ">
                      {slide.title}
                    </h2>



                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        href={slide.link}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black hover:bg-[#e09732] text-gray-950 font-black transition-all cursor-pointer text-sm md:text-base"
                      >
                        <span>Shop now</span>
                        {/* <FaArrowRight className="h-4 w-4" /> */}
                      </Link>

                      {/* <span className="text-sm font-extrabold text-white bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
                        {slide.discount}
                      </span> */}
                    </div>
                  </div>

                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Secondary Side Promo Banners */}
          <div className="flex flex-col gap-4 justify-between h-[450px]">
            {/* Top Side Banner */}
            <div className="relative flex-1 overflow-hidden  p-6 flex flex-col justify-center">
              <Image
                // src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
                src={herosma1}
                alt="Organic Fruits"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="relative z-10 text-white">
                <span className="text-black/55 text-xs font-black uppercase tracking-wider">Fresh vegetable</span>
                <h3 className="text-xl md:text-2xl font-extrabold mt-1 mb-1 text-black">Vege chili</h3>
                <p className="text-xs text-black/60 mb-4">start from $9</p>
                <Link href="/category/fresh-fruits" className="text-xs md:text-sm font-bold text-[#F0A843] underline underline-offset-4 hover:text-white inline-flex items-center gap-1">
                  Explore Fruits &rarr;
                </Link>
              </div>
            </div>

            {/* Bottom Side Banner */}
            <div className="relative flex-1 overflow-hidden  p-6 flex flex-col justify-center">
              <Image
                // src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&auto=format&fit=crop&q=80"
                src={herosma2}
                alt="Healthy Smoothies"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="relative z-10 text-white">
                <span className="text-white/70 text-xs font-black uppercase tracking-wider">Healthy Lifestyle</span>
                <h3 className="text-xl md:text-2xl font-extrabold mt-1 mb-1 text-white">Pure Cold Juices</h3>
                <p className="text-xs text-gray-300 mb-4">Top sellng items</p>
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

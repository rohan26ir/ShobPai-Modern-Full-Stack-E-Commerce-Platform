"use client";

import Link from "next/link";
import { useRef } from "react";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import { useShopData } from "@/context/ShopDataContext";
import CategoryCard from "@/components/usable/CategoryCard";

export default function CategorySection() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const { categories, products } = useShopData();

  // Derive dynamic category item counts directly from products catalog
  const categoriesWithCounts = categories.map((cat) => {
    const count = products.filter((p) => p.category === cat.slug).length;
    return {
      ...cat,
      itemCount: count > 0 ? count : (cat.itemCount || 0),
    };
  });

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header with Custom Swiper Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            {/* <span className="text-xs font-black tracking-widest uppercase text-[#E5A842]">
              Browse Categories
            </span> */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
              Shop by Category
            </h2>
          </div>

          <div className="flex items-center gap-4">


            {/* Swiper Previous & Next Arrow Buttons for 1 by 1 Loop Scroll */}
            {/* <div className="flex items-center gap-2">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-xs transition-all hover:border-[#E5A842] hover:bg-[#E5A842] hover:text-gray-950 cursor-pointer"
                title="Previous Category"
              >
                <FaArrowLeft className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-xs transition-all hover:border-[#E5A842] hover:bg-[#E5A842] hover:text-gray-950 cursor-pointer"
                title="Next Category"
              >
                <FaArrowRight className="h-3.5 w-3.5" />
              </button>
            </div> */}


          </div>
        </div>

        {/* Swiper Slider Component */}
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Autoplay]}
          loop={true}
          slidesPerGroup={1}
          spaceBetween={16}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            320: {
              slidesPerView: 3.0,
              spaceBetween: 12,
            },
            480: {
              slidesPerView: 3.0,
              spaceBetween: 14,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            // 1024: {
            //   slidesPerView: 5,
            //   spaceBetween: 20,
            // },
            // 1280: {
            //   slidesPerView: 6,
            //   spaceBetween: 20,
            // },
          }}
          className="py-2"
        >
          {categoriesWithCounts.map((cat) => (
            <SwiperSlide key={cat.id}>
              <CategoryCard category={cat} itemCount={cat.itemCount} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

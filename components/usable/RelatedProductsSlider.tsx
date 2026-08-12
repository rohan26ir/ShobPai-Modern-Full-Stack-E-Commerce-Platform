"use client";

import { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import { Product } from "@/data/products";
import ProductCard from "./ProductCard";

interface RelatedProductsSliderProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export default function RelatedProductsSlider({
  products,
  onQuickView,
}: RelatedProductsSliderProps) {
  const swiperRef = useRef<SwiperClass | null>(null);

  if (products.length === 0) return null;

  return (
    <div className="relative">
      {/* Header with Navigation Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#F0A843]">
            You Might Also Like
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Related Products</h2>
        </div>

        {/* Custom Arrow Buttons for 1 by 1 Loop Scroll */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-xs transition-all hover:border-[#F0A843] hover:bg-[#F0A843] hover:text-gray-950 cursor-pointer"
            title="Previous Product"
          >
            <FaArrowLeft className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-xs transition-all hover:border-[#F0A843] hover:bg-[#F0A843] hover:text-gray-950 cursor-pointer"
            title="Next Product"
          >
            <FaArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Swiper Slider */}
      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Autoplay]}
        loop={true}
        slidesPerGroup={1}
        spaceBetween={20}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
            spaceBetween: 12,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="py-2"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} onQuickView={onQuickView} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

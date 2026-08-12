"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaAngleLeft, FaAngleRight, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { reviews } from "@/data/reviews";

export default function CustomerReviewsSection() {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <section className="py-16 bg-[#FAF6F0] relative overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Centered Section Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            What customer say
          </h2>
        </div>

        {/* Swiper Review Carousel with Side Arrows */}
        <div className="relative max-w-6xl mx-auto px-4 md:px-12">
          {/* Side Navigation Arrow Buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-sm bg-[#F0A843] hover:bg-[#e09732] text-gray-950 shadow-md transition-all cursor-pointer"
            title="Previous Review"
          >
            <FaAngleLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-sm bg-[#F0A843] hover:bg-[#e09732] text-gray-950 shadow-md transition-all cursor-pointer"
            title="Next Review"
          >
            <FaAngleRight className="h-5 w-5" />
          </button>

          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Autoplay]}
            loop={true}
            slidesPerGroup={1}
            spaceBetween={24}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              bulletActiveClass: "swiper-pagination-bullet-active !bg-[#F0A843]",
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="pb-12"
          >
            {reviews.map((rev) => (
              <SwiperSlide key={rev.id}>
                <div className="bg-white p-6 md:p-7 rounded-2xl shadow-xs border border-gray-100/80 flex flex-col justify-between min-h-[220px] transition-all hover:shadow-md">
                  {/* Top Row: Avatar + Name + Rating */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-amber-100 bg-gray-100">
                      <Image
                        src={rev.avatar}
                        alt={rev.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{rev.name}</h4>
                      <div className="flex items-center gap-1 mt-1 text-[#F0A843]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <FaStar key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Testimonial Text */}
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-4">
                    {rev.comment}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}

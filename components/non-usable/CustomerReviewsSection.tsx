"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaStar, FaUser, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { api } from "@/lib/api";

export default function CustomerReviewsSection() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getReviews()
      .then((data) => {
        if (isMounted) {
          setReviewsList(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load customer reviews:", err);
        if (isMounted) {
          setReviewsList([]);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Do not render section if there are no real reviews yet
  if (!loading && reviewsList.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#FAF6F0] relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Centered Section Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E5A842]">
            Verified Feedback
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
            What Our Customers Say
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Real experiences from verified purchasers of our products
          </p>
        </div>

        {/* Swiper Review Carousel */}
        <div className="relative group max-w-6xl mx-auto px-4 md:px-12">
          {reviewsList.length > 1 && (
            <>
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="hidden group-hover:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-sm bg-[#F0A843] hover:bg-[#e09732] text-gray-950 shadow-md transition-all cursor-pointer"
                title="Previous Review"
              >
                <FaAngleLeft className="h-5 w-5" />
              </button>

              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="hidden group-hover:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-sm bg-[#F0A843] hover:bg-[#e09732] text-gray-950 shadow-md transition-all cursor-pointer"
                title="Next Review"
              >
                <FaAngleRight className="h-5 w-5" />
              </button>
            </>
          )}

          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Autoplay]}
            loop={reviewsList.length > 3}
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
                slidesPerView: Math.min(2, reviewsList.length || 1),
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: Math.min(3, reviewsList.length || 1),
                spaceBetween: 24,
              },
            }}
            className="pb-12"
          >
            {reviewsList.map((rev) => (
              <SwiperSlide key={rev.id}>
                <div className="bg-white p-6 md:p-7 rounded-2xl shadow-xs border border-gray-100/80 flex flex-col justify-between min-h-[220px] transition-all hover:shadow-md">
                  <div>
                    {/* Top Row: Avatar + Name + Rating */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-amber-100 bg-gray-100 flex items-center justify-center text-gray-400">
                        {rev.avatar || rev.user?.photoURL ? (
                          <Image
                            src={rev.avatar || rev.user?.photoURL}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <FaUser className="h-5 w-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-gray-900">
                            {rev.reviewerName || rev.user?.displayName || "Verified Buyer"}
                          </h4>
                          <FaCheckCircle className="text-emerald-500 h-3 w-3" title="Verified Purchaser" />
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[#F0A843]">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <FaStar key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Product Name if available */}
                    {rev.product?.name && (
                      <p className="text-[11px] font-semibold text-gray-400 mb-2">
                        Product: {rev.product.name}
                      </p>
                    )}

                    {/* Testimonial Text */}
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-4">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Admin Reply if present */}
                  {rev.adminReply && (
                    <div className="mt-4 pt-3 border-t border-gray-100 pl-2 border-l-2 border-[#E5A842] bg-amber-50/50 p-2 rounded-r-lg">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#b47a1d] mb-0.5">
                        <FaShieldAlt className="h-2.5 w-2.5" />
                        <span>Store Admin Reply</span>
                      </div>
                      <p className="text-[11px] text-gray-600 italic line-clamp-2">
                        {rev.adminReply}
                      </p>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

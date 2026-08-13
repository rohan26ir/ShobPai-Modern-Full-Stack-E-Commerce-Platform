"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import brandlogo1 from '@/public/brand_logos/brand-1.avif'
import brandlogo2 from '@/public/brand_logos/brand-2.png'
import brandlogo3 from '@/public/brand_logos/brand-3.png'
import brandlogo4 from '@/public/brand_logos/brand-4.webp'
import brandlogo5 from '@/public/brand_logos/brand-5.avif'
import brandlogo6 from '@/public/brand_logos/brand-6.avif'
import brandlogo7 from '@/public/brand_logos/brand-7.avif'
import brandlogo8 from '@/public/brand_logos/brand-8.avif'
import Image from "next/image";

export default function BrandLogosSection() {
  const brands = [
    { name: "Organic Farm Co.", logo: brandlogo1 },
    { name: "Green Harvest", logo: brandlogo2 },
    { name: "Pure Bio Foods", logo: brandlogo3 },
    { name: "Eco Fresh Dairy", logo: brandlogo4 },
    { name: "Naturals Choice", logo: brandlogo5 },
    { name: "Sun Valley Organics", logo: brandlogo6 },
    { name: "Bio Green Farm", logo: brandlogo7 },
    { name: "Fresh Harvest Co", logo: brandlogo8 },
  ];

  return (
    <section className="py-8 bg-white border-t border-b border-gray-100/80">
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Autoplay]}
          loop={true}
          slidesPerGroup={1}
          spaceBetween={24}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 16 },
            480: { slidesPerView: 3, spaceBetween: 20 },
            640: { slidesPerView: 4, spaceBetween: 24 },
            768: { slidesPerView: 5, spaceBetween: 28 },
            1024: { slidesPerView: 6, spaceBetween: 32 },
          }}
          className="py-8"
        >
          {brands.map((b, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex items-center justify-center">
                <Image src={b.logo} alt={b.name} className="h-20 w-auto object-contain" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

export default function BrandLogosSection() {
  const brands = [
    { name: "Organic Farm Co.", logo: "🌿 OrganicFarm" },
    { name: "Green Harvest", logo: "🥬 GreenHarvest" },
    { name: "Pure Bio Foods", logo: "🍎 PureBio" },
    { name: "Eco Fresh Dairy", logo: "🥛 EcoFresh" },
    { name: "Naturals Choice", logo: "🌻 Naturals" },
    { name: "Sun Valley Organics", logo: "☀️ SunValley" },
    { name: "Bio Green Farm", logo: "🌱 BioGreen" },
    { name: "Fresh Harvest Co", logo: "🍊 FreshHarvest" },
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
          className="py-2 opacity-75 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-100"
        >
          {brands.map((b, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex items-center justify-center py-3 px-4 text-xs font-extrabold text-gray-700 tracking-wider hover:text-[#E5A842] cursor-pointer transition-colors border border-gray-100 rounded-2xl bg-gray-50/60 hover:bg-amber-50/50 hover:border-[#E5A842]/30">
                <span>{b.logo}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

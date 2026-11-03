"use client";

import Image from "next/image";
import imageService from "@/public/sections/exquisite-service.webp";

export default function FeaturesBanner() {
  const serviceTopics = [
    {
      id: "support",
      title: "Quality support",
      desc: "Always online 24/7",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full text-gray-800"
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
      ),
    },
    {
      id: "delivery",
      title: "Free delivery",
      desc: "Orders from all items",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full text-gray-800"
        >
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      ),
    },
    {
      id: "newsletter",
      title: "Join newsletter",
      desc: "20% off by subscribing",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full text-gray-800"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      ),
    },
    {
      id: "refund",
      title: "Return & refund",
      desc: "Money back guarantee",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full text-gray-800"
        >
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center py-6 sm:py-8 lg:py-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Exquisite Service
          </h2>
        </div>

        {/* Mobile & Tablet Layout (< lg): Image 1st, then 4 topics in 2 columns x 2 rows */}
        <div className="lg:hidden space-y-8">
          {/* 1st: Image */}
          <div className="px-4 max-w-xs sm:max-w-sm mx-auto">
            <Image
              src={imageService}
              alt="Exquisite Service"
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* 2nd: 4 Topics in 2 Columns and 2 Rows */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {serviceTopics.map((topic) => (
              <div
                key={topic.id}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5 sm:gap-4 p-3 sm:p-4 bg-gray-50/70 sm:bg-transparent rounded-2xl border border-gray-100 sm:border-0"
              >
                <div className="rounded-full border border-gray-200 shrink-0 h-13 w-13 sm:h-16 sm:w-16 flex items-center justify-center p-3 sm:p-3.5 bg-white shadow-2xs">
                  {topic.icon}
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-gray-900 leading-snug">
                    {topic.title}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-gray-500 mb-0 mt-0.5">
                    {topic.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout (lg: and above): Original 3-Column Layout Preserved */}
        <div className="hidden lg:grid grid-cols-3 items-center gap-4">
          {/* 1st Column: Quality support & Free delivery */}
          <div className="flex flex-col gap-8 justify-between h-full">
            {serviceTopics.slice(0, 2).map((topic) => (
              <div key={topic.id} className="flex gap-4 items-center">
                <div className="rounded-full border border-gray-200 shrink-0 h-24 w-24 flex items-center justify-center p-6 bg-white shadow-2xs">
                  {topic.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-0">{topic.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 2nd Column: Center Image */}
          <div className="px-4 mx-auto">
            <Image
              src={imageService}
              alt="Exquisite Service"
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* 3rd Column: Join newsletter & Return & refund */}
          <div className="flex flex-col gap-8 justify-between h-full ml-20 xl:ml-28">
            {serviceTopics.slice(2, 4).map((topic) => (
              <div key={topic.id} className="flex gap-4 items-center">
                <div className="rounded-full border border-gray-200 shrink-0 h-24 w-24 flex items-center justify-center p-6 bg-white shadow-2xs">
                  {topic.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-0">{topic.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

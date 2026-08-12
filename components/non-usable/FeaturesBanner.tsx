"use client";

import { FaTruck, FaLeaf, FaShieldAlt, FaHeadset } from "react-icons/fa";

export default function FeaturesBanner() {
  const features = [
    {
      icon: <FaTruck className="h-6 w-6 text-emerald-600" />,
      title: "Free Express Shipping",
      description: "On all orders above $50",
      bgColor: "bg-emerald-50 border-emerald-100",
    },
    {
      icon: <FaLeaf className="h-6 w-6 text-green-600" />,
      title: "100% Organic Certified",
      description: "Directly from trusted local farms",
      bgColor: "bg-green-50 border-green-100",
    },
    {
      icon: <FaShieldAlt className="h-6 w-6 text-teal-600" />,
      title: "Safe & Secure Payment",
      description: "Encrypted checkout & COD",
      bgColor: "bg-teal-50 border-teal-100",
    },
    {
      icon: <FaHeadset className="h-6 w-6 text-amber-600" />,
      title: "24/7 Customer Care",
      description: "Instant support anytime",
      bgColor: "bg-amber-50 border-amber-100",
    },
  ];

  return (
    <section className="py-10 bg-gray-50/70 border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 p-5 rounded-2xl border bg-white shadow-xs transition-transform duration-300 hover:-translate-y-1`}
            >
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${feature.bgColor}`}>
                {feature.icon}
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">{feature.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

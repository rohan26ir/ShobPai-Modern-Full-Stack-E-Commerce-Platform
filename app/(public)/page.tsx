"use client";

import { useState } from "react";
import HeroBanner from "@/components/non-usable/HeroBanner";
import FeaturesBanner from "@/components/non-usable/FeaturesBanner";
import CategorySection from "@/components/non-usable/CategorySection";
import PromoBannersSection from "@/components/non-usable/PromoBannersSection";
import TrendingSection from "@/components/non-usable/TrendingSection";
import FeaturedProductsSection from "@/components/non-usable/FeaturedProductsSection";
import CustomerReviewsSection from "@/components/non-usable/CustomerReviewsSection";
import BrandLogosSection from "@/components/non-usable/BrandLogosSection";
import NewsletterSection from "@/components/non-usable/NewsletterSection";
import ProductQuickViewModal from "@/components/usable/ProductQuickViewModal";
import Subscriber from "@/components/modals/Subscriber";
import { Product } from "@/data/products";

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Banner Slider Section */}
      <HeroBanner />

      {/* 3. Shop by Category Section */}
      <CategorySection />

      
      {/* 2. Features / Value Proposition Section */}
      <FeaturesBanner />


      {/* 4. Promotional 3-Column Banner Grid */}
      <PromoBannersSection />

      {/* 5. Trending Products Section (with filter tabs) */}
      <TrendingSection onQuickView={handleOpenQuickView} />

      {/* 6. Featured Products Section */}
      <FeaturedProductsSection onQuickView={handleOpenQuickView} />

      {/* 7. What Customer Say (Customer Reviews Carousel) */}
      <CustomerReviewsSection />

      {/* 8. Brand Partners Bar */}
      <BrandLogosSection />

      {/* 9. Newsletter Subscription Section */}
      <NewsletterSection />

      {/* Product Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={handleCloseQuickView}
      />

      {/* Auto-popup Subscriber Newsletter Modal */}
      <Subscriber />
    </div>
  );
}
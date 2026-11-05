"use client";

import React, { Suspense } from "react";
import { useProductUpdateForm } from "@/components/dashboard/product-update/useProductUpdateForm";
import { ProductUpdateHeader } from "@/components/dashboard/product-update/ProductUpdateHeader";
import { GeneralInfoSection } from "@/components/dashboard/product-add/GeneralInfoSection";
import { PricingStockSection } from "@/components/dashboard/product-add/PricingStockSection";
import { NutritionSpecsSection } from "@/components/dashboard/product-add/NutritionSpecsSection";
import { ProductMediaSection } from "@/components/dashboard/product-add/ProductMediaSection";
import { VisibilityOptionsSection } from "@/components/dashboard/product-add/VisibilityOptionsSection";
import { ProductDetailPreviewCard } from "@/components/dashboard/product-add/ProductDetailPreviewCard";
import { Loader2 } from "lucide-react";

function ProductUpdateContent() {
  const {
    form,
    categories,
    targetProduct,
    isLoadingProduct,
    numericPrice,
    unitProfit,
    marginPct,
    projectedTotalProfit,
    imageUrlInput,
    setImageUrlInput,
    newBenefitInput,
    setNewBenefitInput,
    isSubmitting,
    isUploading,
    handleUpdateField,
    handleGenerateSku,
    handleAddImageUrl,
    handleRemoveImage,
    handleSetPrimaryImage,
    handleImageUpload,
    handleAddBenefit,
    handleRemoveBenefit,
    handleSubmit,
  } = useProductUpdateForm();

  if (isLoadingProduct) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6c2f]" />
        <span className="text-xs font-semibold">Loading product information...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <ProductUpdateHeader
        productTitle={form.name || targetProduct?.name}
        slug={form.slug || targetProduct?.slug}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Product Specifications */}
        <div className="lg:col-span-8 space-y-6">
          <GeneralInfoSection
            name={form.name}
            slug={form.slug}
            category={form.category}
            badge={form.badge}
            unit={form.unit}
            shortDesc={form.shortDesc}
            description={form.description}
            categories={categories}
            onUpdate={handleUpdateField}
          />

          <PricingStockSection
            price={form.price}
            buyingPrice={form.buyingPrice}
            originalPrice={form.originalPrice}
            discount={form.discount}
            stock={form.stock}
            sku={form.sku}
            unitProfit={unitProfit}
            marginPct={marginPct}
            projectedTotalProfit={projectedTotalProfit}
            onUpdate={handleUpdateField}
            onGenerateSku={handleGenerateSku}
          />

          <NutritionSpecsSection
            storage={form.storage}
            shelfLife={form.shelfLife}
            certifications={form.certifications}
            nutritionalBenefits={form.nutritionalBenefits}
            newBenefitInput={newBenefitInput}
            onSetNewBenefitInput={setNewBenefitInput}
            onAddBenefit={handleAddBenefit}
            onRemoveBenefit={handleRemoveBenefit}
            onUpdate={handleUpdateField}
          />
        </div>

        {/* Right Column (4 cols): Media, Real-time Preview & Visibility */}
        <div className="lg:col-span-4 space-y-6">
          <ProductMediaSection
            images={form.images}
            badge={form.badge}
            imageUrlInput={imageUrlInput}
            isUploading={isUploading}
            onSetImageUrlInput={setImageUrlInput}
            onAddImageUrl={handleAddImageUrl}
            onRemoveImage={handleRemoveImage}
            onSetPrimary={handleSetPrimaryImage}
            onImageUpload={handleImageUpload}
            onPickPreset={(url) =>
              handleUpdateField("images", [url, ...form.images.filter((img) => img !== url)])
            }
          />

          <ProductDetailPreviewCard form={form} numericPrice={numericPrice} />

          <VisibilityOptionsSection
            isFeatured={form.isFeatured}
            isTrending={form.isTrending}
            isDealOfDay={form.isDealOfDay}
            isSubmitting={isSubmitting}
            slug={form.slug}
            onUpdate={handleUpdateField}
            onSubmit={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
}

export default function ProductUpdatePage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#ff6c2f]" />
        </div>
      }
    >
      <ProductUpdateContent />
    </Suspense>
  );
}


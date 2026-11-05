"use client";

import React from "react";
import { useProductAddForm } from "@/components/dashboard/product-add/useProductAddForm";
import { ProductAddHeader } from "@/components/dashboard/product-add/ProductAddHeader";
import { GeneralInfoSection } from "@/components/dashboard/product-add/GeneralInfoSection";
import { PricingStockSection } from "@/components/dashboard/product-add/PricingStockSection";
import { NutritionSpecsSection } from "@/components/dashboard/product-add/NutritionSpecsSection";
import { ProductMediaSection } from "@/components/dashboard/product-add/ProductMediaSection";
import { VisibilityOptionsSection } from "@/components/dashboard/product-add/VisibilityOptionsSection";
import { ProductDetailPreviewCard } from "@/components/dashboard/product-add/ProductDetailPreviewCard";

export default function ProductCreatePage() {
  const {
    form,
    categories,
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
    handleApplyTemplate,
    handleSubmit,
  } = useProductAddForm();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <ProductAddHeader
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onApplyTemplate={handleApplyTemplate}
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Product Data mirroring Fuji Apples details */}
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

        {/* Right Column (4 cols): Media, Live Preview & Visibility placement */}
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


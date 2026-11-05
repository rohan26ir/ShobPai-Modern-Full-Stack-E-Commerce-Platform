import React from "react";
import { Layers, X, Sparkles, Upload, RotateCw } from "lucide-react";
import { Category } from "@/data/categories";
import { COLOR_PRESETS, IMAGE_PRESETS } from "./categories.constants";
import { useCategoryFormModal } from "./useCategoryFormModal";

interface CategoryFormModalProps {
  isOpen: boolean;
  isEdit: boolean;
  initialData?: Category | null;
  onClose: () => void;
  onSuccess: () => void;
  token?: string | null;
}

export function CategoryFormModal({
  isOpen,
  isEdit,
  initialData,
  onClose,
  onSuccess,
  token,
}: CategoryFormModalProps) {
  const {
    name,
    setName,
    slug,
    setSlug,
    description,
    setDescription,
    image,
    setImage,
    bgColor,
    setBgColor,
    isSubmitting,
    isGeneratingAI,
    isUploadingImage,
    handleImageUpload,
    handleGenerateAI,
    handleSubmit,
  } = useCategoryFormModal({ isEdit, initialData, token, onSuccess });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#ff6c2f]" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {isEdit ? "Edit Category" : "Add New Category"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Organic Dairy"
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-200">
                URL Slug <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. organic-dairy"
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono text-[11px] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] transition-all"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-200">Description</label>
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI || !name.trim()}
                  className="text-[11px] font-semibold text-[#ff6c2f] hover:text-[#e0561b] flex items-center gap-1 cursor-pointer disabled:opacity-40 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Generate</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of items in this category..."
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] transition-all"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>Banner Image URL</span>
                <span className="text-[10px] text-slate-400 font-normal">WebP, AVIF, JPEG, PNG, SVG</span>
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] transition-all"
                />
                <label className="h-9 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer text-xs transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingImage ? "Uploading..." : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">Presets:</span>
                {IMAGE_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImage(p.url)}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-50 hover:text-[#ff6c2f] dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-200 block">Badge Color Theme</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COLOR_PRESETS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setBgColor(c.value)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      bgColor === c.value
                        ? "border-[#ff6c2f] bg-orange-50/40 text-slate-900 dark:text-white ring-1 ring-[#ff6c2f]"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                    <span className="truncate">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-8 px-4 rounded-lg bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEdit ? "Update Category" : "Save Category"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

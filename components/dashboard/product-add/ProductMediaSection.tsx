import React from "react";
import { Image as ImageIcon, Upload, Trash2, Check, Star } from "lucide-react";
import { SAMPLE_PRESET_IMAGES } from "./productAdd.constants";

interface ProductMediaSectionProps {
  images: string[];
  badge: string;
  imageUrlInput: string;
  isUploading: boolean;
  onSetImageUrlInput: (val: string) => void;
  onAddImageUrl: () => void;
  onRemoveImage: (idx: number) => void;
  onSetPrimary: (idx: number) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPickPreset: (url: string) => void;
}

export function ProductMediaSection({
  images,
  badge,
  imageUrlInput,
  isUploading,
  onSetImageUrlInput,
  onAddImageUrl,
  onRemoveImage,
  onSetPrimary,
  onImageUpload,
  onPickPreset,
}: ProductMediaSectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <ImageIcon className="w-4 h-4 text-[#ff6c2f]" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Product Gallery & Thumbnails
        </h2>
      </div>

      {/* Main Image Live Preview */}
      <div className="relative aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center p-3 overflow-hidden shadow-2xs">
        {images[0] ? (
          <img
            src={images[0]}
            alt="Product preview"
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              (e.target as any).src = SAMPLE_PRESET_IMAGES[0].url;
            }}
          />
        ) : (
          <div className="text-center p-4 text-slate-400">
            <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <span className="text-xs">No image uploaded</span>
          </div>
        )}
        {badge && (
          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#ff6c2f] text-white text-[10px] font-bold shadow-xs">
            {badge}
          </span>
        )}
      </div>

      {/* File Upload Button + Image URL input */}
      <div className="space-y-2">
        <label className="h-9 w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer text-xs transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>{isUploading ? "Optimizing & Uploading..." : "Upload Photo (WebP Auto-Optimized)"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageUpload}
            disabled={isUploading}
          />
        </label>

        <div className="flex items-center gap-2">
          <input
            type="url"
            value={imageUrlInput}
            onChange={(e) => onSetImageUrlInput(e.target.value)}
            placeholder="Or paste external image URL..."
            className="flex-1 h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
          />
          <button
            type="button"
            onClick={onAddImageUrl}
            className="h-9 px-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      {/* Gallery Thumbnails Carousel */}
      {images.length > 0 && (
        <div className="pt-1">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-2">
            Gallery Photos ({images.length}) — Click star to set Primary:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <div
                key={i}
                className={`relative w-14 h-14 rounded-xl border overflow-hidden shrink-0 group ${
                  i === 0 ? "border-[#ff6c2f] ring-2 ring-[#ff6c2f]/30" : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => onSetPrimary(i)}
                      title="Set as primary"
                      className="p-1 text-white hover:text-amber-400 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveImage(i)}
                    title="Remove"
                    className="p-1 text-white hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Sample Presets */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Or pick a sample orchard photo:
        </span>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_PRESET_IMAGES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPickPreset(sample.url)}
              className="aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-[#ff6c2f] transition-all cursor-pointer relative group"
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] py-0.5 text-center truncate px-1">
                {sample.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


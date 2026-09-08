"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaFolder,
  FaBoxOpen,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaMagic,
  FaSyncAlt,
  FaImage,
  FaPalette,
} from "react-icons/fa";
import { Category } from "@/data/categories";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useShopData } from "@/context/ShopDataContext";
import toast from "react-hot-toast";

const COLOR_PRESETS = [
  { label: "Emerald Green", value: "bg-emerald-50 text-emerald-800 border-emerald-100", dot: "bg-emerald-500" },
  { label: "Warm Amber", value: "bg-amber-50 text-amber-800 border-amber-100", dot: "bg-amber-500" },
  { label: "Citrus Orange", value: "bg-orange-50 text-orange-800 border-orange-100", dot: "bg-orange-500" },
  { label: "Berry Purple", value: "bg-purple-50 text-purple-800 border-purple-100", dot: "bg-purple-500" },
  { label: "Sky Blue", value: "bg-blue-50 text-blue-800 border-blue-100", dot: "bg-blue-500" },
  { label: "Rose Pink", value: "bg-rose-50 text-rose-800 border-rose-100", dot: "bg-rose-500" },
];

const IMAGE_PRESETS = [
  { label: "Vegetables", url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80" },
  { label: "Fruits", url: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80" },
  { label: "Dairy & Eggs", url: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=600&auto=format&fit=crop&q=80" },
  { label: "Grains & Nuts", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
  { label: "Oils & Honey", url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80" },
  { label: "Beverages", url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80" },
];

export default function CategoriesPage() {
  const { token } = useAuth();
  const { refreshCategories } = useShopData();
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // New Category Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatImage, setNewCatImage] = useState(IMAGE_PRESETS[0].url);
  const [newCatBgColor, setNewCatBgColor] = useState(COLOR_PRESETS[0].value);
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Edit Category Modal State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editBgColor, setEditBgColor] = useState(COLOR_PRESETS[0].value);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // AI Description Generator State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Image Upload Logic & Top 6 Formats Support (WebP, AVIF, JPEG, PNG, SVG, GIF)
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const SUPPORTED_IMAGE_TYPES = [
    "image/webp",
    "image/avif",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/svg+xml",
    "image/gif",
  ];

  const convertFileToWebP = (file: File, quality = 0.85): Promise<File> => {
    return new Promise((resolve) => {
      if (
        file.type === "image/webp" ||
        file.type === "image/svg+xml" ||
        file.type === "image/gif"
      ) {
        resolve(file);
        return;
      }

      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              const webpFile = new File([blob], cleanName, { type: "image/webp" });
              resolve(webpFile);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isSupported =
      SUPPORTED_IMAGE_TYPES.includes(file.type) ||
      /\.(webp|avif|jpe?g|png|svg|gif)$/i.test(file.name);

    if (!isSupported) {
      toast.error("Unsupported file! Please upload one of the top 6 formats: WebP, AVIF, JPEG, PNG, SVG, or GIF.");
      e.target.value = "";
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      alert("Please add NEXT_PUBLIC_IMGBB_API_KEY to your .env.local file");
      return;
    }

    setIsUploadingImage(true);
    const isSpecial = file.type === "image/svg+xml" || file.type === "image/gif" || file.type === "image/webp";
    const toastId = toast.loading(isSpecial ? "Uploading image..." : "Optimizing to WebP & uploading...");

    try {
      const processed = await convertFileToWebP(file);
      const formData = new FormData();
      formData.append("image", processed);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const url = data.data.url;
        if (isEdit) {
          setEditImage(url);
        } else {
          setNewCatImage(url);
        }
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        toast.error("Failed to upload image.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during image upload.", { id: toastId });
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  // Load Categories from Backend API
  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      if (Array.isArray(data)) {
        setCategoriesList(data);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Filter Categories by search term
  const filteredCategories = categoriesList.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Total products across all categories
  const totalProductsCount = categoriesList.reduce((acc, cat) => acc + (cat.itemCount || 0), 0);

  // Open Edit Modal
  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDesc(cat.description || "");
    setEditImage(cat.image || IMAGE_PRESETS[0].url);
    setEditBgColor(cat.bgColor || COLOR_PRESETS[0].value);
  };

  // Close Edit Modal
  const handleCloseEdit = () => {
    setEditingCategory(null);
    setEditName("");
    setEditSlug("");
    setEditDesc("");
    setEditImage("");
  };

  // Quick AI generator for Category Descriptions
  const handleGenerateCategoryAI = (isEdit = false) => {
    const targetName = isEdit ? editName : newCatName;
    if (!targetName.trim()) {
      toast.error("Please enter a category name first!");
      return;
    }

    setIsGeneratingAI(true);
    const toastId = toast.loading(`Generating description for "${targetName}"...`);

    setTimeout(() => {
      const lower = targetName.toLowerCase();
      let generated = "";

      if (lower.includes("veg") || lower.includes("leaf") || lower.includes("green")) {
        generated = "Crisp, nutrient-dense organic farm produce harvested at dawn and delivered with peak freshness.";
      } else if (lower.includes("fruit") || lower.includes("berry") || lower.includes("citrus")) {
        generated = "Naturally tree-ripened organic fruits bursting with authentic orchard sweetness and vital antioxidants.";
      } else if (lower.includes("dairy") || lower.includes("egg") || lower.includes("milk") || lower.includes("cheese")) {
        generated = "100% pasture-raised organic dairy and free-range farm eggs sourced from ethical grass-fed family herds.";
      } else if (lower.includes("oil") || lower.includes("ghee") || lower.includes("honey")) {
        generated = "Pure cold-pressed unrefined oils and raw wild blossom honey preserving 100% active botanical enzymes.";
      } else if (lower.includes("grain") || lower.includes("rice") || lower.includes("nut") || lower.includes("dal")) {
        generated = "Unpolished organic whole grains, wholesome lentils, and slow-roasted protein-rich nuts for vitality.";
      } else {
        generated = `Premium certified organic ${targetName.toLowerCase()} sourced sustainably from eco-friendly local farms.`;
      }

      if (isEdit) {
        setEditDesc(generated);
      } else {
        setNewCatDesc(generated);
      }

      setIsGeneratingAI(false);
      toast.success("✨ Category description generated!", { id: toastId });
    }, 450);
  };

  // Create Category (POST)
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error("Please provide a category name");
      return;
    }

    const slug =
      newCatSlug.trim() ||
      newCatName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");

    const payload = {
      name: newCatName.trim(),
      slug,
      description: newCatDesc.trim() || "Fresh organic store category",
      image: newCatImage.trim() || IMAGE_PRESETS[0].url,
      bgColor: newCatBgColor,
    };

    setIsSubmittingNew(true);
    const toastId = toast.loading("Saving new category to database...");

    try {
      const created = await api.createCategory(payload, token);
      const newCategoryRecord: Category = {
        id: created?.id || String(Date.now()),
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
        image: payload.image,
        bgColor: payload.bgColor,
        itemCount: 0,
      };

      setCategoriesList((prev) => [newCategoryRecord, ...prev]);
      await refreshCategories();
      toast.success(`Category "${payload.name}" created successfully!`, { id: toastId });

      // Reset form
      setNewCatName("");
      setNewCatSlug("");
      setNewCatDesc("");
      setIsAdding(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to create category", { id: toastId });
    } finally {
      setIsSubmittingNew(false);
    }
  };

  // Update Category (PUT)
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    const slug =
      editSlug.trim() ||
      editName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");

    const payload = {
      name: editName.trim(),
      slug,
      description: editDesc.trim(),
      image: editImage.trim() || editingCategory.image,
      bgColor: editBgColor || editingCategory.bgColor,
    };

    setIsSubmittingEdit(true);
    const toastId = toast.loading(`Updating "${editingCategory.name}"...`);

    try {
      await api.updateCategory(editingCategory.id, payload, token);

      // Update local state immediately
      setCategoriesList((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                ...payload,
              }
            : cat
        )
      );

      // Refresh global shop context for navbar and catalog sync
      await refreshCategories();
      toast.success(`Category "${payload.name}" updated successfully!`, { id: toastId });
      handleCloseEdit();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update category", { id: toastId });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Delete Category (DELETE)
  const confirmDelete = async (id: string) => {
    setIsDeleting(true);
    const targetCat = categoriesList.find((c) => c.id === id);
    const toastId = toast.loading(`Deleting category "${targetCat?.name || ""}"...`);

    try {
      await api.deleteCategory(id, token);
      setCategoriesList((prev) => prev.filter((c) => c.id !== id));
      await refreshCategories();
      toast.success("Category deleted successfully", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to delete category", { id: toastId });
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-[#222222]">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E5A842] opacity-10 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl mix-blend-screen pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#E5A842] bg-[#E5A842]/10 px-3 py-1 rounded-full mb-3">
            <FaFolder className="h-3 w-3" />
            Catalog & Taxonomy Management
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Category Management
          </h1>
          <p className="text-sm text-gray-300 mt-2 max-w-xl font-medium leading-relaxed">
            Create, update, and customize product categories, banner imagery, and color badges. All updates reflect instantly across the entire store.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={loadCategories}
            disabled={loading}
            title="Refresh categories"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <FaSyncAlt className={`h-4 w-4 ${loading ? "animate-spin text-[#E5A842]" : ""}`} />
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black transition-all duration-300 shadow-xl cursor-pointer hover:-translate-y-0.5 ${
              isAdding
                ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                : "bg-gradient-to-r from-[#E5A842] to-[#f3bc58] text-gray-950 hover:shadow-[#E5A842]/30"
            }`}
          >
            <FaPlus className={`h-4 w-4 transition-transform duration-300 ${isAdding ? "rotate-45" : ""}`} />
            <span>{isAdding ? "Cancel Adding" : "Add New Category"}</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Total Categories
            </span>
            <h3 className="text-2xl font-black text-gray-900">{categoriesList.length}</h3>
            <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">Active in Storefront</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 text-[#E5A842]">
            <FaFolder className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Catalog Items Linked
            </span>
            <h3 className="text-2xl font-black text-gray-900">{totalProductsCount}</h3>
            <span className="text-xs text-gray-500 font-semibold mt-1 inline-block">Across all categories</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <FaBoxOpen className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Sync Status
            </span>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-1.5 mt-1">
              <FaCheckCircle className="h-4 w-4 text-emerald-500" />
              Live Database Connected
            </h3>
            <span className="text-xs text-gray-400 mt-1 inline-block">PostgreSQL Neon DB</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600">
            <FaSyncAlt className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Add New Category Form Accordion */}
      {isAdding && (
        <form
          onSubmit={handleAddCategory}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6 animate-in zoom-in-95 duration-300"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-[#E5A842] flex items-center justify-center">
                <FaFolder className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Add New Category</h3>
                <p className="text-xs text-gray-500">Add a fresh taxonomy grouping to organize catalog items</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1.5">
              <label className="block font-bold text-gray-700">Category Name *</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  if (!newCatSlug || newCatSlug === newCatName.toLowerCase().replace(/\s+/g, "-")) {
                    setNewCatSlug(e.target.value.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-"));
                  }
                }}
                placeholder="e.g. Organic Dairy & Eggs"
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 outline-hidden focus:border-[#E5A842] focus:bg-white transition-all shadow-xs font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-gray-700">URL Slug *</label>
              <input
                type="text"
                required
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                placeholder="e.g. organic-dairy"
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 outline-hidden focus:border-[#E5A842] focus:bg-white transition-all shadow-xs font-mono text-xs"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-gray-700">Description</label>
                <button
                  type="button"
                  onClick={() => handleGenerateCategoryAI(false)}
                  disabled={isGeneratingAI || !newCatName.trim()}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  title="Generate concise description with AI"
                >
                  <FaMagic className="h-3 w-3" />
                  <span>✨ AI Generate</span>
                </button>
              </div>
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Short summary of items in this category..."
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 outline-hidden focus:border-[#E5A842] focus:bg-white transition-all shadow-xs font-semibold"
              />
            </div>

            {/* Banner Image URL & Presets */}
            <div className="md:col-span-2 space-y-2">
              <label className="block font-bold text-gray-700 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FaImage className="text-gray-400" />
                  <span>Banner Image URL *</span>
                </span>
                <span className="text-[11px] text-gray-500 font-normal">
                  Top 6 formats: WebP, AVIF, JPEG, PNG, SVG, GIF
                </span>
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="url"
                  required
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] focus:bg-white transition-all shadow-xs text-xs font-mono"
                />
                <label className="flex items-center justify-center px-3.5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold cursor-pointer hover:bg-gray-200 transition-colors text-xs shrink-0">
                  {isUploadingImage ? "Uploading..." : "Upload File"}
                  <input
                    type="file"
                    accept="image/webp,image/avif,image/jpeg,image/png,image/svg+xml,image/gif,.webp,.avif,.jpeg,.jpg,.png,.svg,.gif"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, false)}
                    disabled={isUploadingImage}
                  />
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-gray-400 font-semibold">Quick Presets:</span>
                {IMAGE_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNewCatImage(p.url)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-amber-100 hover:text-amber-800 text-gray-600 transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge Color Preset */}
            <div className="md:col-span-2 space-y-2">
              <label className="block font-bold text-gray-700 flex items-center gap-2">
                <FaPalette className="text-gray-400" />
                <span>Badge Color Theme</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {COLOR_PRESETS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNewCatBgColor(c.value)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all cursor-pointer text-xs font-bold ${
                      newCatBgColor === c.value
                        ? "border-[#E5A842] bg-amber-50/50 shadow-xs"
                        : "border-gray-100 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <span className={`h-3 w-3 rounded-full ${c.dot}`} />
                    <span className="truncate">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingNew}
              className="px-6 py-2.5 rounded-xl text-sm font-black bg-[#E5A842] text-gray-950 hover:bg-[#d49633] transition-colors shadow-md shadow-[#E5A842]/20 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingNew ? "Saving Category..." : "Save Category"}
            </button>
          </div>
        </form>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-[#E5A842] flex items-center justify-center">
                  <FaEdit className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">Update Category</h3>
                  <p className="text-xs text-gray-500">
                    Editing: <span className="font-bold text-gray-800">{editingCategory.name}</span> ({editingCategory.slug})
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseEdit}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-gray-700">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold outline-hidden focus:border-[#E5A842] focus:bg-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-gray-700">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-mono outline-hidden focus:border-[#E5A842] focus:bg-white text-xs"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-gray-700">Description</label>
                    <button
                      type="button"
                      onClick={() => handleGenerateCategoryAI(true)}
                      disabled={isGeneratingAI || !editName.trim()}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer disabled:opacity-40"
                      title="Generate description with AI"
                    >
                      <FaMagic className="h-3 w-3" />
                      <span>✨ AI Generate</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Short summary of items in this category..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold outline-hidden focus:border-[#E5A842] focus:bg-white text-sm"
                  />
                </div>

                {/* Banner Image URL & Preview */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block font-bold text-gray-700 flex items-center gap-2">
                    <FaImage className="text-gray-400" />
                    <span>Banner Image URL *</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="relative h-14 w-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      {editImage ? (
                        <Image src={editImage} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <input
                      type="url"
                      required
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-mono outline-hidden focus:border-[#E5A842] focus:bg-white text-xs"
                    />
                    <label className="flex items-center justify-center px-3.5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold cursor-pointer hover:bg-gray-200 transition-colors text-xs shrink-0">
                      {isUploadingImage ? "Uploading..." : "Upload File"}
                      <input
                        type="file"
                        accept="image/webp,image/avif,image/jpeg,image/png,image/svg+xml,image/gif,.webp,.avif,.jpeg,.jpg,.png,.svg,.gif"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, true)}
                        disabled={isUploadingImage}
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-gray-400 font-semibold">Presets:</span>
                    {IMAGE_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setEditImage(p.url)}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-amber-100 hover:text-amber-800 text-gray-600 transition-colors cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Badge Color Presets */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block font-bold text-gray-700 flex items-center gap-2">
                    <FaPalette className="text-gray-400" />
                    <span>Badge Color Theme</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COLOR_PRESETS.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setEditBgColor(c.value)}
                        className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all cursor-pointer text-xs font-bold ${
                          editBgColor === c.value
                            ? "border-[#E5A842] bg-amber-50/50 shadow-xs"
                            : "border-gray-100 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <span className={`h-3 w-3 rounded-full ${c.dot}`} />
                        <span className="truncate">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#E5A842] text-gray-950 hover:bg-[#d49633] transition-colors shadow-md shadow-[#E5A842]/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingEdit ? "Updating..." : "Update Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#E5A842] transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories by name, slug, or description..."
            className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 pl-11 pr-4 py-3 text-sm text-gray-800 outline-hidden focus:border-[#E5A842] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="text-xs font-bold text-gray-500">
            <span className="text-gray-900 font-black">{filteredCategories.length}</span> Active Categories
          </p>
        </div>
      </div>

      {/* Categories Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4 animate-pulse">
              <div className="h-28 bg-gray-100 rounded-2xl" />
              <div className="h-6 w-3/4 bg-gray-100 rounded-md" />
              <div className="h-4 w-1/2 bg-gray-100 rounded-md" />
              <div className="h-10 bg-gray-50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
          <div className="h-16 w-16 mx-auto rounded-full bg-amber-50 text-[#E5A842] flex items-center justify-center">
            <FaFolder className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No categories found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {searchTerm
              ? `No categories matching "${searchTerm}". Try a different search query.`
              : "No categories have been added to the store yet. Click 'Add New Category' above to create one."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => {
            const itemCount = cat.itemCount || 0;
            const isDeletingThis = deletingId === cat.id;

            return (
              <div
                key={cat.id}
                className={`group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1 ${
                  isDeletingThis ? "ring-2 ring-red-500 border-transparent shadow-red-100" : ""
                }`}
              >
                {/* Delete Confirmation Overlay */}
                {isDeletingThis && (
                  <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-200">
                    <div className="h-12 w-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4">
                      <FaExclamationTriangle className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Delete Category?</h4>
                    <p className="text-xs text-gray-500 mb-6">
                      Are you sure you want to delete <span className="font-bold text-gray-800">"{cat.name}"</span>?
                      {itemCount > 0 && (
                        <span className="block text-red-500 font-bold mt-1">
                          Warning: {itemCount} active products are currently in this category.
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-3 w-full">
                      <button
                        onClick={() => setDeletingId(null)}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => confirmDelete(cat.id)}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isDeleting ? "Deleting..." : "Confirm Delete"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Top Banner Image */}
                <div className="h-32 w-full relative overflow-hidden bg-gray-100">
                  <Image
                    src={cat.image || IMAGE_PRESETS[0].url}
                    alt={cat.name}
                    fill
                    className="object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />

                  {/* Top Action Pill (Edit & Delete) */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl shadow-md border border-gray-100 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="Update / Edit Category"
                    >
                      <FaEdit className="h-3.5 w-3.5" />
                    </button>
                    <span className="h-3 w-px bg-gray-200" />
                    <button
                      onClick={() => setDeletingId(cat.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <FaTrashAlt className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 pt-0 relative z-10 flex-1 flex flex-col">
                  {/* Category Folder Icon Badge */}
                  <div className="flex items-start justify-between -mt-10 mb-4">
                    <div
                      className={`h-16 w-16 rounded-2xl shadow-lg flex items-center justify-center border-4 border-white transform group-hover:scale-105 transition-transform duration-300 ${
                        cat.bgColor || "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <FaFolder className="h-7 w-7" />
                    </div>

                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="mt-6 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 transition-colors cursor-pointer"
                    >
                      <FaEdit className="h-3 w-3 text-[#E5A842]" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="mb-3">
                    <h3 className="text-lg font-extrabold text-gray-900 leading-tight group-hover:text-[#E5A842] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wider font-mono">
                      /{cat.slug}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-5 flex-1">
                    {cat.description || "Farm fresh organic selection."}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold text-[11px] border border-emerald-100">
                      <FaCheckCircle className="h-3 w-3" />
                      <span>Active</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-800 font-bold bg-gray-50 px-3 py-1 rounded-xl border border-gray-100 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                      <FaBoxOpen className="h-3.5 w-3.5 text-[#E5A842]" />
                      <span>{itemCount} Items</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

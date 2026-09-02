"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FaBoxOpen,
  FaExclamationTriangle,
  FaPlus,
  FaSearch,
  FaShoppingBag,
  FaTag,
  FaTrashAlt,
  FaEdit,
  FaChartLine,
  FaTimes,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";
import { products as initialProducts, Product } from "@/data/products";
import { categories } from "@/data/categories";

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCatFilter, setSelectedCatFilter] = useState("all");

  // New product form state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: "",
    price: 0,
    originalPrice: 0,
    discount: 0,
    category: "vegetables",
    stock: 50,
    unit: "1 kg",
    badge: "NEW",
    images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"],
    shortDescription: "Fresh organic farm produce.",
    description: "Carefully sourced from certified organic farms, celebrated for cultivating the finest produce. Each item is meticulously hand-picked at the perfect stage of ripeness to ensure superior quality.",
    nutritionalBenefits: [
      "Rich In Dietary Fibre – Supports healthy digestion and helps maintain bowel regularity.",
      "High in Natural Energy – Contains natural sugars that provide an instant energy boost.",
      "Packed with Essential Minerals – Good source of potassium, magnesium, calcium, and iron.",
      "Loaded with Antioxidants – Helps protect cells from oxidative stress and supports heart health."
    ],
    isFeatured: true,
    isTrending: false,
  });

  const [newProdNutritionalText, setNewProdNutritionalText] = useState(
    "Rich In Dietary Fibre – Supports healthy digestion and helps maintain bowel regularity.\nHigh in Natural Energy – Contains natural sugars that provide an instant energy boost.\nPacked with Essential Minerals – Good source of potassium, magnesium, calcium, and iron.\nLoaded with Antioxidants – Helps protect cells from oxidative stress and supports heart health."
  );

  // Edit product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProd, setEditProd] = useState<Partial<Product>>({});
  const [editProdNutritionalText, setEditProdNutritionalText] = useState("");

  // Image Upload Logic
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditMode = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      alert("Please add NEXT_PUBLIC_IMGBB_API_KEY to your .env.local file");
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const url = data.data.url;
        if (isEditMode) {
          setEditProd(prev => ({ ...prev, images: [...(prev.images || []), url] }));
        } else {
          setNewProd(prev => ({ ...prev, images: [...(prev.images || []), url] }));
        }
      } else {
        alert("Failed to upload image.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during upload.");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number, isEditMode = false) => {
    if (isEditMode) {
      setEditProd(prev => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index)
      }));
    } else {
      setNewProd(prev => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index)
      }));
    }
  };

  // Low stock products filter (stock <= 40)
  const lowStockProducts = productList.filter((p) => p.stock <= 40);

  const handleDeleteProduct = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setEditProd({ ...p });
    const benefitsText = p.nutritionalBenefits
      ? p.nutritionalBenefits.join("\n")
      : "Rich In Dietary Fibre – Supports healthy digestion and helps maintain bowel regularity.\nHigh in Natural Energy – Contains natural sugars that provide an instant energy boost.\nPacked with Essential Minerals – Good source of potassium, magnesium, calcium, and iron.";
    setEditProdNutritionalText(benefitsText);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editProd.name) return;

    const matchedCat = categories.find((c) => c.slug === editProd.category);
    const catName = matchedCat ? matchedCat.name : (editProd.category || "").toUpperCase();

    const origPrice = Number(editProd.originalPrice) || 0;
    const discount = Number(editProd.discount) || 0;
    const price = discount > 0 ? Number((origPrice - (origPrice * discount / 100)).toFixed(2)) : origPrice;
    const benefits = editProdNutritionalText
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);

    setProductList((prev) =>
      prev.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: editProd.name || p.name,
              slug: (editProd.name || p.name).toLowerCase().replace(/\s+/g, "-"),
              price: price,
              originalPrice: origPrice,
              discount: discount,
              category: editProd.category || p.category,
              categoryName: catName,
              stock: Number(editProd.stock) || 0,
              unit: editProd.unit || p.unit,
              badge: editProd.badge,
              images: editProd.images && editProd.images.length > 0 ? editProd.images : p.images,
              shortDescription: editProd.shortDescription || p.shortDescription,
              description: editProd.description || p.description,
              nutritionalBenefits: benefits.length > 0 ? benefits : p.nutritionalBenefits,
              isFeatured: editProd.isFeatured ?? p.isFeatured,
              isTrending: editProd.isTrending ?? p.isTrending,
              isDealOfDay: editProd.isDealOfDay ?? p.isDealOfDay,
              rating: editProd.rating !== undefined ? Number(editProd.rating) : p.rating,
              reviewsCount: editProd.reviewsCount !== undefined ? Number(editProd.reviewsCount) : p.reviewsCount,
              sold: editProd.sold !== undefined ? Number(editProd.sold) : p.sold,
              storage: editProd.storage,
              shelfLife: editProd.shelfLife,
              certifications: editProd.certifications,
            }
          : p
      )
    );
    setEditingProduct(null);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.originalPrice) return;

    const matchedCat = categories.find((c) => c.slug === newProd.category);
    const catName = matchedCat ? matchedCat.name : (newProd.category || "VEGETABLES").toUpperCase();

    const origPrice = Number(newProd.originalPrice) || 0;
    const discount = Number(newProd.discount) || 0;
    const price = discount > 0 ? Number((origPrice - (origPrice * discount / 100)).toFixed(2)) : origPrice;

    const benefits = newProdNutritionalText
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);

    const createdProd: Product = {
      id: String(Date.now()),
      name: newProd.name,
      slug: newProd.name.toLowerCase().replace(/\s+/g, "-"),
      price: price,
      originalPrice: origPrice,
      discount: discount,
      images: newProd.images && newProd.images.length > 0 ? newProd.images : ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"],
      category: newProd.category || "vegetables",
      categoryName: catName,
      rating: newProd.rating !== undefined ? Number(newProd.rating) : 5.0,
      reviewsCount: newProd.reviewsCount !== undefined ? Number(newProd.reviewsCount) : 1,
      sold: newProd.sold !== undefined ? Number(newProd.sold) : 120,
      stock: Number(newProd.stock) || 50,
      unit: newProd.unit || "1 kg",
      badge: newProd.badge || "NEW",
      shortDescription: newProd.shortDescription || "Fresh organic produce.",
      description: newProd.description || "Carefully sourced from certified organic farms, celebrated for cultivating the finest produce.",
      nutritionalBenefits: benefits,
      isFeatured: newProd.isFeatured ?? true,
      isTrending: newProd.isTrending ?? false,
      isDealOfDay: newProd.isDealOfDay ?? false,
      storage: newProd.storage,
      shelfLife: newProd.shelfLife,
      certifications: newProd.certifications,
    };

    setProductList([createdProd, ...productList]);
    setIsAddingProduct(false);
    setNewProd({
      name: "",
      price: 0,
      originalPrice: 0,
      category: "vegetables",
      stock: 50,
      unit: "1 kg",
      badge: "NEW",
      images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"],
      shortDescription: "Fresh organic farm produce.",
      description: "Hand-picked farm fresh organic produce.",
    });
  };

  const filteredProducts = productList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCatFilter === "all" || p.category === selectedCatFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842]">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            Inventory Control
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Product Management & Catalog Editor
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            Add new organic items, edit pricing, stock levels, Full Product Details & Nutritional Benefits.
          </p>
        </div>
        <button
          onClick={() => setIsAddingProduct(!isAddingProduct)}
          className="flex items-center gap-2 rounded-xl bg-[#E5A842] hover:bg-[#d49633] px-5 py-3 text-xs font-black text-gray-950 transition-colors shadow-md cursor-pointer self-start md:self-auto"
        >
          <FaPlus className="h-3.5 w-3.5" />
          <span>{isAddingProduct ? "Cancel Form" : "Add New Product"}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Products</span>
            <h3 className="text-2xl font-black text-gray-900">{productList.length}</h3>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 text-[#E5A842]">
            <FaBoxOpen className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Low Stock Alerts</span>
            <h3 className="text-2xl font-black text-red-600">{lowStockProducts.length}</h3>
          </div>
          <div className="p-3.5 rounded-2xl bg-red-50 text-red-500">
            <FaExclamationTriangle className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Categories</span>
            <h3 className="text-2xl font-black text-gray-900">{categories.length}</h3>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <FaTag className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Featured Items</span>
            <h3 className="text-2xl font-black text-gray-900">{productList.filter(p => p.isFeatured).length}</h3>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-600">
            <FaStar className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Add New Product Form */}
      {isAddingProduct && (
        <form onSubmit={handleAddProductSubmit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-6">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <FaPlus className="text-[#E5A842] h-4 w-4" />
            <span>Add Product to Catalog (data/products.ts format)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={newProd.name || ""}
                onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                placeholder="e.g. Fresh Organic Hass Avocado"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Category *</label>
              <select
                value={newProd.category}
                onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] font-semibold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name} ({cat.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Original Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={newProd.originalPrice || ""}
                onChange={(e) => setNewProd({ ...newProd, originalPrice: Number(e.target.value) })}
                placeholder="4.99"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Discount Offer (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newProd.discount || ""}
                onChange={(e) => setNewProd({ ...newProd, discount: Number(e.target.value) })}
                placeholder="10"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Stock Level *</label>
              <input
                type="number"
                required
                value={newProd.stock || ""}
                onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                placeholder="50"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Unit Measure</label>
              <input
                type="text"
                value={newProd.unit || "1 kg"}
                onChange={(e) => setNewProd({ ...newProd, unit: e.target.value })}
                placeholder="e.g. 1 kg / 500 g / 1 bunch"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Badge Tag</label>
              <select
                value={newProd.badge || ""}
                onChange={(e) => setNewProd({ ...newProd, badge: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] font-semibold"
              >
                <option value="">None</option>
                <option value="NEW">NEW</option>
                <option value="HOT">HOT</option>
                <option value="SALE">SALE</option>
                <option value="ORGANIC">ORGANIC</option>
                <option value="BESTSELLER">BESTSELLER</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="block font-bold text-gray-700 mb-1">Storage</label>
              <input
                type="text"
                value={newProd.storage || ""}
                onChange={(e) => setNewProd({ ...newProd, storage: e.target.value })}
                placeholder="e.g. Refrigerate at 4°C"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] font-semibold"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block font-bold text-gray-700 mb-1">Shelf Life</label>
              <input
                type="text"
                value={newProd.shelfLife || ""}
                onChange={(e) => setNewProd({ ...newProd, shelfLife: e.target.value })}
                placeholder="e.g. 5 - 7 Days"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] font-semibold"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block font-bold text-gray-700 mb-1">Certifications</label>
              <input
                type="text"
                value={newProd.certifications || ""}
                onChange={(e) => setNewProd({ ...newProd, certifications: e.target.value })}
                placeholder="e.g. 100% USDA Organic"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] font-semibold"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block font-bold text-gray-700 mb-1">Product Images</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold cursor-pointer hover:bg-gray-200 transition-colors">
                    {isUploadingImage ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, false)}
                      disabled={isUploadingImage}
                    />
                  </label>
                  <span className="text-xs text-gray-500">Upload via ImgBB</span>
                </div>
                
                {newProd.images && newProd.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {newProd.images.map((url, idx) => (
                      <div key={idx} className="relative h-16 w-16 rounded-xl overflow-hidden border border-gray-200 group">
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx, false)}
                          className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-1 flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={newProd.isFeatured ?? true}
                onChange={(e) => setNewProd({ ...newProd, isFeatured: e.target.checked })}
                className="h-5 w-5 text-[#E5A842] rounded-md border-gray-300"
              />
              <label className="font-bold text-gray-700">Featured</label>
            </div>

            <div className="md:col-span-1 flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={newProd.isTrending ?? false}
                onChange={(e) => setNewProd({ ...newProd, isTrending: e.target.checked })}
                className="h-5 w-5 text-[#E5A842] rounded-md border-gray-300"
              />
              <label className="font-bold text-gray-700">Trending</label>
            </div>

            <div className="md:col-span-1 flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={newProd.isDealOfDay ?? false}
                onChange={(e) => setNewProd({ ...newProd, isDealOfDay: e.target.checked })}
                className="h-5 w-5 text-[#E5A842] rounded-md border-gray-300"
              />
              <label className="font-bold text-gray-700">Deal of the Day</label>
            </div>

            <div className="md:col-span-3">
              <label className="block font-bold text-gray-700 mb-1">Short Description (Product Card Summary)</label>
              <input
                type="text"
                value={newProd.shortDescription || ""}
                onChange={(e) => setNewProd({ ...newProd, shortDescription: e.target.value })}
                placeholder="Summary description for product cards..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] font-semibold"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block font-bold text-gray-700 mb-1">Product Details (Full Narrative Description)</label>
              <textarea
                rows={3}
                value={newProd.description || ""}
                onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                placeholder="Detailed origin, harvest process, taste, texture, and culinary uses..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] font-semibold"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block font-bold text-gray-700 mb-1">
                Nutritional Benefits (Enter 1 benefit per line with title: "Title – Description")
              </label>
              <textarea
                rows={4}
                value={newProdNutritionalText}
                onChange={(e) => setNewProdNutritionalText(e.target.value)}
                placeholder="Rich In Dietary Fibre – Supports healthy digestion.\nHigh in Natural Energy – Instant energy boost."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842] font-semibold font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddingProduct(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#E5A842] text-gray-950 hover:bg-[#d49633] cursor-pointer"
            >
              Save New Product
            </button>
          </div>
        </form>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Update Product Details & Benefits</h3>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <FaTimes className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editProd.name || ""}
                    onChange={(e) => setEditProd({ ...editProd, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold outline-hidden focus:border-[#E5A842]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={editProd.category}
                    onChange={(e) => setEditProd({ ...editProd, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold outline-hidden focus:border-[#E5A842]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name} ({cat.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Original Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editProd.originalPrice || ""}
                    onChange={(e) => setEditProd({ ...editProd, originalPrice: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold outline-hidden focus:border-[#E5A842]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Discount Offer (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editProd.discount || ""}
                    onChange={(e) => setEditProd({ ...editProd, discount: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold outline-hidden focus:border-[#E5A842]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Level</label>
                  <input
                    type="number"
                    required
                    value={editProd.stock || ""}
                    onChange={(e) => setEditProd({ ...editProd, stock: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold outline-hidden focus:border-[#E5A842]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Unit Measure</label>
                  <input
                    type="text"
                    value={editProd.unit || ""}
                    onChange={(e) => setEditProd({ ...editProd, unit: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold outline-hidden focus:border-[#E5A842]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Badge Tag</label>
                  <select
                    value={editProd.badge || ""}
                    onChange={(e) => setEditProd({ ...editProd, badge: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold outline-hidden focus:border-[#E5A842]"
                  >
                    <option value="">None</option>
                    <option value="NEW">NEW</option>
                    <option value="HOT">HOT</option>
                    <option value="SALE">SALE</option>
                    <option value="ORGANIC">ORGANIC</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                  </select>
                </div>

                <div className="md:col-span-1">
                  <label className="block font-bold text-gray-700 mb-1">Storage</label>
                  <input
                    type="text"
                    value={editProd.storage || ""}
                    onChange={(e) => setEditProd({ ...editProd, storage: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold outline-hidden focus:border-[#E5A842]"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block font-bold text-gray-700 mb-1">Shelf Life</label>
                  <input
                    type="text"
                    value={editProd.shelfLife || ""}
                    onChange={(e) => setEditProd({ ...editProd, shelfLife: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold outline-hidden focus:border-[#E5A842]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Certifications</label>
                  <input
                    type="text"
                    value={editProd.certifications || ""}
                    onChange={(e) => setEditProd({ ...editProd, certifications: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold outline-hidden focus:border-[#E5A842]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Product Images</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold cursor-pointer hover:bg-gray-200 transition-colors">
                        {isUploadingImage ? "Uploading..." : "Upload Image"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, true)}
                          disabled={isUploadingImage}
                        />
                      </label>
                      <span className="text-xs text-gray-500">Upload via ImgBB</span>
                    </div>
                    
                    {editProd.images && editProd.images.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {editProd.images.map((url, idx) => (
                          <div key={idx} className="relative h-16 w-16 rounded-xl overflow-hidden border border-gray-200 group">
                            <img src={url} alt="" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx, true)}
                              className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <FaTimes className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Full Description (Product Details)</label>
                  <textarea
                    rows={3}
                    value={editProd.description || ""}
                    onChange={(e) => setEditProd({ ...editProd, description: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold outline-hidden focus:border-[#E5A842]"
                  />
                </div>

                <div className="md:col-span-1 flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    checked={editProd.isFeatured ?? true}
                    onChange={(e) => setEditProd({ ...editProd, isFeatured: e.target.checked })}
                    className="h-5 w-5 text-[#E5A842] rounded-md border-gray-300"
                  />
                  <label className="font-bold text-gray-700">Featured</label>
                </div>

                <div className="md:col-span-1 flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    checked={editProd.isTrending ?? false}
                    onChange={(e) => setEditProd({ ...editProd, isTrending: e.target.checked })}
                    className="h-5 w-5 text-[#E5A842] rounded-md border-gray-300"
                  />
                  <label className="font-bold text-gray-700">Trending</label>
                </div>

                <div className="md:col-span-2 flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    checked={editProd.isDealOfDay ?? false}
                    onChange={(e) => setEditProd({ ...editProd, isDealOfDay: e.target.checked })}
                    className="h-5 w-5 text-[#E5A842] rounded-md border-gray-300"
                  />
                  <label className="font-bold text-gray-700">Deal of the Day</label>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    Nutritional Benefits (1 bullet per line)
                  </label>
                  <textarea
                    rows={4}
                    value={editProdNutritionalText}
                    onChange={(e) => setEditProdNutritionalText(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold font-mono text-[11px] outline-hidden focus:border-[#E5A842]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#E5A842] text-gray-950 hover:bg-[#d49633] cursor-pointer"
                >
                  Save Product Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar + Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by name or category..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-xs text-gray-800 outline-hidden focus:border-[#E5A842]"
              />
            </div>

            <select
              value={selectedCatFilter}
              onChange={(e) => setSelectedCatFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 outline-hidden focus:border-[#E5A842]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs font-bold text-gray-500">
            Showing <span className="text-gray-900 font-black">{filteredProducts.length}</span> products
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-100 bg-gray-50/80 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Badge / Unit</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block">{p.name}</span>
                        <span className="text-[10px] text-gray-400">{p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#5FA800] font-bold">{p.categoryName}</td>
                  <td className="py-3.5 px-4 font-black text-gray-900">
                    ${p.price.toFixed(2)}
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-[11px] font-normal text-gray-400 line-through ml-1.5">
                        ${p.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.stock <= 20
                          ? "bg-red-50 text-red-600"
                          : p.stock <= 40
                          ? "bg-amber-50 text-[#E5A842]"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {p.stock} left
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      {p.badge && (
                        <span className="bg-[#E5A842] text-gray-950 px-2 py-0.5 rounded text-[10px] font-black">
                          {p.badge}
                        </span>
                      )}
                      <span className="text-gray-500 text-[11px] font-medium">{p.unit}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 text-gray-500 hover:text-[#E5A842] transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <FaTrashAlt className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

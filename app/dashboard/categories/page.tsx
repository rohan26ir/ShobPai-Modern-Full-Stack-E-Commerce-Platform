"use client";

import { useState } from "react";
import Image from "next/image";
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaFolder, FaBoxOpen, FaCheckCircle, FaChevronRight, FaExclamationTriangle } from "react-icons/fa";
import { categories as initialCategories, Category } from "@/data/categories";
import { products } from "@/data/products";

export default function CategoriesPage() {
  const [categoriesList, setCategoriesList] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredCategories = categoriesList.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/\s+/g, "-");
    const newCat: Category = {
      id: String(Date.now()),
      name: newCatName,
      slug: slug,
      description: newCatDesc || "Fresh organic store category",
      itemCount: 0,
      bgColor: "bg-gray-50 text-gray-800 border-gray-100",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    };

    setCategoriesList([newCat, ...categoriesList]);
    setNewCatName("");
    setNewCatSlug("");
    setNewCatDesc("");
    setIsAdding(false);
  };

  const confirmDelete = (id: string) => {
    setCategoriesList((prev) => prev.filter((c) => c.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-[#222222]">
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E5A842] opacity-10 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#E5A842] bg-[#E5A842]/10 px-3 py-1 rounded-full mb-3">
            <FaFolder className="h-3 w-3" />
            Inventory Management
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Category Management
          </h1>
          <p className="text-sm text-gray-300 mt-2 max-w-xl font-medium leading-relaxed">
            Create, edit, and organize product categories, icon badges, and catalog groupings.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`relative z-10 flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black transition-all duration-300 shadow-xl cursor-pointer hover:-translate-y-1 ${
            isAdding 
              ? "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-gray-200/50" 
              : "bg-gradient-to-r from-[#E5A842] to-[#f3bc58] text-gray-950 hover:shadow-[#E5A842]/30"
          }`}
        >
          <FaPlus className={`h-4 w-4 transition-transform duration-300 ${isAdding ? "rotate-45" : ""}`} />
          <span>{isAdding ? "Cancel Adding" : "Add New Category"}</span>
        </button>
      </div>

      {/* Add New Category Form */}
      {isAdding && (
        <form onSubmit={handleAddCategory} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-[#E5A842] flex items-center justify-center">
              <FaFolder className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">
              New Product Category
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1.5">
              <label className="block font-bold text-gray-700">Category Name *</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Organic Dairy & Eggs"
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 outline-hidden focus:border-[#E5A842] focus:bg-white transition-all shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-gray-700">URL Slug (Optional)</label>
              <input
                type="text"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                placeholder="e.g. organic-dairy"
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 outline-hidden focus:border-[#E5A842] focus:bg-white transition-all shadow-xs"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="block font-bold text-gray-700">Description</label>
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Short summary of items in this category"
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 outline-hidden focus:border-[#E5A842] focus:bg-white transition-all shadow-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-black bg-[#E5A842] text-gray-950 hover:bg-[#d49633] transition-colors shadow-md shadow-[#E5A842]/20"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#E5A842] transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories by name or slug..."
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((cat) => {
          const itemCount = products.filter((p) => p.category === cat.slug).length;
          const isDeleting = deletingId === cat.id;

          return (
            <div
              key={cat.id}
              className={`group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1 ${isDeleting ? "ring-2 ring-red-500 border-transparent shadow-red-100" : ""}`}
            >
              {/* Delete Confirmation Overlay */}
              {isDeleting && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-200">
                  <div className="h-12 w-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4">
                    <FaExclamationTriangle className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Delete Category?</h4>
                  <p className="text-sm text-gray-500 mb-6">
                    This action cannot be undone and may affect {itemCount} items.
                  </p>
                  <div className="flex items-center gap-3 w-full">
                    <button
                      onClick={() => setDeletingId(null)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => confirmDelete(cat.id)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Image Header Background */}
              <div className="h-28 w-full relative overflow-hidden bg-gray-100">
                <Image 
                  src={cat.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"}
                  alt={cat.name}
                  fill
                  className="object-cover opacity-70 group-hover:scale-110 group-hover:opacity-90 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
              </div>

              <div className="p-6 pt-0 relative z-10 flex-1 flex flex-col">
                <div className="flex items-start justify-between -mt-10 mb-5">
                  <div className={`h-20 w-20 rounded-2xl shadow-xl flex items-center justify-center text-3xl border-4 border-white transform group-hover:scale-105 transition-transform duration-300 ${cat.bgColor || "bg-amber-50 text-amber-600"}`}>
                    <FaFolder className="h-8 w-8" />
                  </div>
                  
                  <button
                    onClick={() => setDeletingId(cat.id)}
                    className="p-3 mt-10 text-gray-400 hover:text-white hover:bg-red-500 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100 shadow-sm hover:shadow-red-500/30"
                    title="Delete Category"
                  >
                    <FaTrashAlt className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-[#E5A842] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">
                    /{cat.slug}
                  </p>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6 flex-1">
                  {cat.description || "Farm fresh organic selection."}
                </p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                  <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full font-bold text-xs border border-emerald-100">
                    <FaCheckCircle className="h-3.5 w-3.5" />
                    <span>Active</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-800 font-bold text-sm bg-gray-50 px-4 py-1.5 rounded-xl border border-gray-100 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                    <FaBoxOpen className="h-4 w-4 text-[#E5A842]" />
                    <span>{itemCount} Items</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


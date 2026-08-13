"use client";

import { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaFolder, FaBoxOpen, FaCheckCircle } from "react-icons/fa";
import { categories as initialCategories, Category } from "@/data/categories";
import { products } from "@/data/products";

export default function CategoriesPage() {
  const [categoriesList, setCategoriesList] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [isAdding, setIsAdding] = useState(false);

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

  const handleDeleteCategory = (id: string) => {
    setCategoriesList((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            Inventory Management
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Category Management
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            Create, edit, and organize product categories, icon badges, and catalog groupings.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded-xl bg-[#E5A842] hover:bg-[#d49633] px-5 py-3 text-xs font-black text-gray-950 transition-colors shadow-md cursor-pointer self-start md:self-auto"
        >
          <FaPlus className="h-3.5 w-3.5" />
          <span>{isAdding ? "Cancel" : "Add New Category"}</span>
        </button>
      </div>

      {/* Add New Category Form */}
      {isAdding && (
        <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
            Add New Product Category
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Organic Dairy & Eggs"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">URL Slug (Optional)</label>
              <input
                type="text"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                placeholder="e.g. organic-dairy"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Short summary of items in this category"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-hidden focus:border-[#E5A842]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-black bg-[#E5A842] text-gray-950 hover:bg-[#d49633]"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories by name or slug..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-xs text-gray-800 outline-hidden focus:border-[#E5A842]"
          />
        </div>

        <p className="text-xs font-bold text-gray-500">
          Showing <span className="text-gray-900 font-black">{filteredCategories.length}</span> categories
        </p>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const itemCount = products.filter((p) => p.category === cat.slug).length;
          return (
            <div
              key={cat.id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-amber-50 text-[#E5A842] flex items-center justify-center font-bold text-lg border border-amber-100">
                    <FaFolder className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-gray-400">
                      /{cat.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <FaTrashAlt className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {cat.description || "Farm fresh organic selection."}
              </p>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold text-[11px]">
                  <FaCheckCircle className="h-3 w-3" />
                  <span>Active</span>
                </div>

                <div className="flex items-center gap-1 text-gray-800 font-bold">
                  <FaBoxOpen className="h-3.5 w-3.5 text-[#E5A842]" />
                  <span>{itemCount} Products</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { FaStore, FaClock, FaCheckCircle, FaExclamationTriangle, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

type StoreStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

export default function MyStorePage() {
  // Mock state for demonstration. In a real app, this comes from the backend.
  const [storeStatus, setStoreStatus] = useState<StoreStatus>("NONE");
  const [storeName, setStoreName] = useState("");
  const [storeDesc, setStoreDesc] = useState("");

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !storeDesc.trim()) return;
    
    // Simulate API call to submit store application
    setTimeout(() => {
      setStoreStatus("PENDING");
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842]">
        <span className="text-xs font-black uppercase tracking-widest text-[#E5A842] flex items-center gap-2 mb-2">
          <FaStore className="h-3 w-3" />
          Seller Dashboard
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          My Store
        </h1>
        <p className="text-xs md:text-sm text-gray-300 mt-2 max-w-xl">
          Apply to become a seller on ShobPai, manage your store details, and list products for sale.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {storeStatus === "NONE" && (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center text-[#E5A842] mb-4 shadow-sm border border-amber-100">
                <FaStore className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Become a Seller</h2>
              <p className="text-sm text-gray-500 mt-2">
                Open your own store on ShobPai and reach thousands of customers. Fill out the application below.
              </p>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Store Name *</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Organic Farm Fresh"
                  className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:border-[#E5A842] focus:bg-white outline-hidden transition-all shadow-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Store Description *</label>
                <textarea
                  required
                  value={storeDesc}
                  onChange={(e) => setStoreDesc(e.target.value)}
                  rows={4}
                  placeholder="Tell us about the products you plan to sell..."
                  className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:border-[#E5A842] focus:bg-white outline-hidden transition-all shadow-xs resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#E5A842] hover:bg-[#d49633] text-gray-950 font-black py-3.5 rounded-xl transition-all shadow-lg shadow-[#E5A842]/20 flex items-center justify-center gap-2"
                >
                  <FaCheckCircle />
                  Submit Store Application
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">
                  By submitting, you agree to our Seller Terms & Conditions. Approvals usually take 24-48 hours.
                </p>
              </div>
            </form>
          </div>
        )}

        {storeStatus === "PENDING" && (
          <div className="bg-white rounded-3xl p-10 border border-amber-100 shadow-xl shadow-amber-100/50 text-center flex flex-col items-center">
            <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center text-[#E5A842] mb-6">
              <FaClock className="h-10 w-10 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Application Pending</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Your store application for <span className="font-bold text-gray-900">"{storeName || "your store"}"</span> is currently under review by our administration team. 
            </p>
            <div className="mt-8 bg-gray-50 border border-gray-100 rounded-xl p-4 w-full max-w-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center justify-center gap-2 text-amber-600 font-bold">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E5A842]"></span>
                </span>
                Awaiting Admin Approval
              </div>
            </div>
          </div>
        )}

        {storeStatus === "APPROVED" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl shadow-emerald-50 text-center flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-5 rounded-bl-full pointer-events-none" />
              <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 shadow-sm border border-emerald-100">
                <FaCheckCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Store Approved!</h2>
              <p className="text-sm text-gray-600 mb-6">
                Congratulations, your store is now live and ready for products.
              </p>
              
              <Link 
                href="/dashboard/admin" 
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
              >
                <FaShoppingBag />
                Manage Store Products
                <FaArrowRight className="h-3 w-3 ml-1 opacity-70" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center text-center">
                <span className="text-3xl font-black text-gray-900 mb-1">0</span>
                <span className="text-xs font-bold text-gray-500 uppercase">Active Products</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center text-center">
                <span className="text-3xl font-black text-gray-900 mb-1">$0.00</span>
                <span className="text-xs font-bold text-gray-500 uppercase">Total Sales</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center text-center">
                <span className="text-3xl font-black text-gray-900 mb-1">0</span>
                <span className="text-xs font-bold text-gray-500 uppercase">Orders Received</span>
              </div>
            </div>
          </div>
        )}

        {storeStatus === "REJECTED" && (
          <div className="bg-white rounded-3xl p-10 border border-red-100 shadow-xl shadow-red-50 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4">
              <FaExclamationTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Application Rejected</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
              Unfortunately, your store application was not approved at this time. Please contact support for more details.
            </p>
            <button 
              onClick={() => setStoreStatus("NONE")}
              className="text-sm font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 px-6 py-2.5 rounded-xl transition-colors"
            >
              Re-apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

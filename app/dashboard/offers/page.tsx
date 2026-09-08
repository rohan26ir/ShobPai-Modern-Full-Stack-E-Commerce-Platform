"use client";

import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
  FaTag,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaCheck,
  FaCopy,
  FaTimes,
  FaPercent,
  FaCalendarAlt,
  FaDollarSign,
  FaExclamationTriangle,
  FaSyncAlt,
  FaToggleOn,
  FaToggleOff,
  FaCheckCircle,
} from "react-icons/fa";

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export interface CouponData {
  id: string;
  code: string;
  discountPercentage: number;
  minSpend: number;
  description: string;
  isActive: boolean;
  expiresAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_COUPONS: CouponData[] = [
  {
    id: "c1",
    code: "FRESH2026",
    discountPercentage: 20,
    minSpend: 25,
    description: "20% off on all organic vegetables and farm produce.",
    isActive: true,
    expiresAt: null,
  },
  {
    id: "c2",
    code: "ORGANIC15",
    discountPercentage: 15,
    minSpend: 40,
    description: "Get 15% off your entire basket on fresh fruits and dairy products.",
    isActive: true,
    expiresAt: null,
  },
  {
    id: "c3",
    code: "WELCOME10",
    discountPercentage: 10,
    minSpend: 15,
    description: "First-time shopper welcome offer with no minimum items constraint.",
    isActive: true,
    expiresAt: null,
  },
  {
    id: "c4",
    code: "MEGA25",
    discountPercentage: 25,
    minSpend: 80,
    description: "Save big with 25% off when you stock up with orders over $80.",
    isActive: true,
    expiresAt: null,
  },
];

export default function DashboardOffersPage() {
  const { token, isAdmin } = useAuth();

  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Create / Edit modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [formCode, setFormCode] = useState("");
  const [formDiscount, setFormDiscount] = useState<number | "">(20);
  const [formMinSpend, setFormMinSpend] = useState<number | "">(0);
  const [formDesc, setFormDesc] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formExpiresAt, setFormExpiresAt] = useState("");

  // Delete modal state
  const [deletingCoupon, setDeletingCoupon] = useState<CouponData | null>(null);

  // Load coupons from backend
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await api.getCoupons(false);
      if (Array.isArray(data) && data.length > 0) {
        setCoupons(data);
      } else {
        setCoupons(DEFAULT_COUPONS);
      }
    } catch {
      setCoupons(DEFAULT_COUPONS);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Open Create Form
  const handleOpenCreate = () => {
    setFormCode("");
    setFormDiscount(20);
    setFormMinSpend(0);
    setFormDesc("");
    setFormIsActive(true);
    setFormExpiresAt("");
    setIsCreateOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (coupon: CouponData) => {
    setEditingCoupon(coupon);
    setFormCode(coupon.code);
    setFormDiscount(coupon.discountPercentage);
    setFormMinSpend(coupon.minSpend || 0);
    setFormDesc(coupon.description || "");
    setFormIsActive(coupon.isActive);
    setFormExpiresAt(
      coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split("T")[0] : ""
    );
  };

  // Submit Create or Update
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = formCode.trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a valid coupon code");
      return;
    }

    const discount = Number(formDiscount);
    if (isNaN(discount) || discount < 1 || discount > 100) {
      toast.error("Discount percentage must be between 1 and 100");
      return;
    }

    const minSpend = Number(formMinSpend) || 0;
    const description = formDesc.trim() || `${discount}% discount on store purchases`;
    const expiresAt = formExpiresAt ? new Date(formExpiresAt).toISOString() : null;

    setIsSubmitting(true);

    try {
      if (editingCoupon) {
        // UPDATE
        await api.updateCoupon(
          editingCoupon.id,
          {
            code,
            discountPercentage: discount,
            minSpend,
            description,
            isActive: formIsActive,
            expiresAt,
          },
          token
        );

        setCoupons((prev) =>
          prev.map((c) =>
            c.id === editingCoupon.id
              ? {
                  ...c,
                  code,
                  discountPercentage: discount,
                  minSpend,
                  description,
                  isActive: formIsActive,
                  expiresAt,
                }
              : c
          )
        );

        toast.success(
          <span>
            Coupon <strong>{code}</strong> updated successfully!
          </span>,
          { icon: <FaCheckCircle className="text-emerald-500" /> }
        );
        setEditingCoupon(null);
      } else {
        // CREATE
        const newCouponPayload = {
          code,
          discountPercentage: discount,
          minSpend,
          description,
          isActive: formIsActive,
          expiresAt: expiresAt || undefined,
        };

        const res = await api.createCoupon(newCouponPayload, token);
        const created: CouponData = res?.id
          ? res
          : {
              id: String(Date.now()),
              ...newCouponPayload,
              expiresAt,
            };

        setCoupons((prev) => [created, ...prev]);

        toast.success(
          <span>
            Coupon <strong>{code}</strong> created successfully!
          </span>,
          { icon: <FaCheckCircle className="text-emerald-500" /> }
        );
        setIsCreateOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Toggle Status
  const handleToggleActive = async (coupon: CouponData) => {
    const nextStatus = !coupon.isActive;

    // Optimistic UI
    setCoupons((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, isActive: nextStatus } : c))
    );

    try {
      await api.updateCoupon(coupon.id, { isActive: nextStatus }, token);
      toast.success(
        nextStatus
          ? `Coupon ${coupon.code} activated`
          : `Coupon ${coupon.code} paused`
      );
    } catch {
      // Revert on failure
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, isActive: coupon.isActive } : c))
      );
      toast.error("Failed to update status");
    }
  };

  // Delete Coupon
  const handleConfirmDelete = async () => {
    if (!deletingCoupon) return;

    const idToDelete = deletingCoupon.id;
    const codeToDelete = deletingCoupon.code;

    try {
      await api.deleteCoupon(idToDelete, token);
      setCoupons((prev) => prev.filter((c) => c.id !== idToDelete));
      toast.success(`Coupon "${codeToDelete}" deleted`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete coupon");
    } finally {
      setDeletingCoupon(null);
    }
  };

  // Filtered List
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchSearch =
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (statusFilter === "ACTIVE") return matchSearch && c.isActive;
      if (statusFilter === "INACTIVE") return matchSearch && !c.isActive;
      return matchSearch;
    });
  }, [coupons, searchTerm, statusFilter]);

  // Stats
  const totalCount = coupons.length;
  const activeCount = coupons.filter((c) => c.isActive).length;
  const maxDiscount = coupons.length > 0 ? Math.max(...coupons.map((c) => c.discountPercentage)) : 0;
  const avgDiscount =
    coupons.length > 0
      ? Math.round(
          coupons.reduce((acc, c) => acc + c.discountPercentage, 0) / coupons.length
        )
      : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Page Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-[#222222]">
        {/* Glow Spheres */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E5A842] opacity-10 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl mix-blend-screen pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#E5A842] bg-[#E5A842]/10 px-3 py-1 rounded-full mb-3">
            <FaTag className="h-3 w-3" />
            Promotions & Campaigns
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Offers & Coupons
          </h1>
          <p className="text-sm text-gray-300 mt-2 max-w-xl font-medium leading-relaxed">
            Create, update, toggle, and manage discount promo codes and seasonal vouchers for customer checkout.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchCoupons();
            }}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10 cursor-pointer"
            title="Refresh coupons from database"
          >
            <FaSyncAlt className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black transition-all duration-300 shadow-xl cursor-pointer hover:-translate-y-1 bg-gradient-to-r from-[#E5A842] to-[#f3bc58] text-gray-950 hover:shadow-[#E5A842]/30"
          >
            <FaPlus className="h-4 w-4" />
            <span>Create Offer</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Offers
            </span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalCount}</h3>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FaTag className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Active Coupons
            </span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</h3>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FaCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Max Discount
            </span>
            <h3 className="text-2xl font-black text-[#E5A842] mt-1">{maxDiscount}%</h3>
          </div>
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-[#E5A842] flex items-center justify-center">
            <FaPercent className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Average Savings
            </span>
            <h3 className="text-2xl font-black text-purple-600 mt-1">{avgDiscount}%</h3>
          </div>
          <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FaDollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. Search and Status Filters */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
          <input
            type="text"
            placeholder="Search by coupon code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:border-black focus:outline-hidden"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {status === "ALL" ? "All Coupons" : status === "ACTIVE" ? "Active" : "Paused"}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Coupons Grid / Table */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse space-y-4">
              <div className="h-6 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-36 bg-gray-300 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 text-[#E5A842] flex items-center justify-center mx-auto">
            <FaTag className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">No coupons found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              {searchTerm || statusFilter !== "ALL"
                ? "No promo codes match your search criteria. Try adjusting your filters."
                : "Get started by creating your first promotional discount coupon."}
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#E5A842] px-5 py-2.5 text-xs font-bold text-gray-950 shadow-md hover:bg-[#d49633] transition-colors cursor-pointer"
          >
            <FaPlus className="h-3 w-3" />
            <span>Create Offer</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-md flex flex-col justify-between ${
                c.isActive ? "border-gray-200" : "border-gray-200/60 opacity-75 bg-gray-50/50"
              }`}
            >
              <div>
                {/* Header: Code & Active Pill */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black tracking-wider bg-gray-100 text-gray-900 px-3 py-1 rounded-lg border border-gray-200">
                      {c.code}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(c.code);
                        toast.success(`Copied "${c.code}"`);
                      }}
                      className="text-gray-400 hover:text-black transition-colors cursor-pointer p-1"
                      title="Copy code"
                    >
                      <FaCopy className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      c.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {c.isActive ? "Active" : "Paused"}
                  </span>
                </div>

                {/* Discount & Min Spend */}
                <div className="mb-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-gray-900">
                      {c.discountPercentage}%
                    </span>
                    <span className="text-base font-extrabold text-[#E5A842]">DISCOUNT</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="font-semibold">
                      Min Order: ${c.minSpend > 0 ? c.minSpend.toFixed(2) : "0 (No Minimum)"}
                    </span>
                    {c.expiresAt && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                          <FaCalendarAlt className="h-3 w-3" />
                          Exp: {new Date(c.expiresAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                  {c.description}
                </p>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                {/* Status Toggle */}
                <button
                  onClick={() => handleToggleActive(c)}
                  className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                    c.isActive
                      ? "text-emerald-700 hover:bg-emerald-50"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                  title={c.isActive ? "Click to pause coupon" : "Click to activate coupon"}
                >
                  {c.isActive ? (
                    <>
                      <FaToggleOn className="h-4 w-4 text-emerald-600" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <FaToggleOff className="h-4 w-4 text-gray-400" />
                      <span>Paused</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit coupon"
                  >
                    <FaEdit className="h-3.5 w-3.5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeletingCoupon(c)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete coupon"
                  >
                    <FaTrashAlt className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Create / Edit Coupon Modal */}
      {(isCreateOpen || editingCoupon) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-[#E5A842] flex items-center justify-center">
                  <FaTag className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">
                    {editingCoupon ? "Edit Offer / Coupon" : "Create New Coupon"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {editingCoupon ? `Updating coupon ${editingCoupon.code}` : "Configure coupon parameters"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingCoupon(null);
                }}
                className="text-gray-400 hover:text-black transition-colors cursor-pointer p-2"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH30, HARVEST20"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono font-bold tracking-wider text-gray-900 focus:border-black focus:outline-hidden"
                />
              </div>

              {/* Discount Percentage & Min Spend Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Discount (%) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    placeholder="e.g. 20"
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 focus:border-black focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Min Spend ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 30"
                    value={formMinSpend}
                    onChange={(e) => setFormMinSpend(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 focus:border-black focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe offer terms, e.g. 20% off on all organic products"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:border-black focus:outline-hidden"
                />
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  value={formExpiresAt}
                  onChange={(e) => setFormExpiresAt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 focus:border-black focus:outline-hidden"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between pt-2 pb-2">
                <span className="text-xs font-bold text-gray-700">Coupon Status</span>
                <button
                  type="button"
                  onClick={() => setFormIsActive(!formIsActive)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    formIsActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {formIsActive ? <FaToggleOn className="h-4 w-4 text-emerald-600" /> : <FaToggleOff className="h-4 w-4" />}
                  <span>{formIsActive ? "Active" : "Paused"}</span>
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingCoupon(null);
                  }}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-[#E5A842] text-gray-950 text-xs font-black shadow-md hover:bg-[#d49633] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingCoupon ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Modal */}
      {deletingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <FaExclamationTriangle className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-gray-900">Delete Coupon?</h3>
              <p className="text-xs text-gray-500 mt-2">
                Are you sure you want to permanently delete coupon{" "}
                <strong className="text-gray-900 font-mono font-black">{deletingCoupon.code}</strong>? Customers will no longer be able to use this promo code.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingCoupon(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-black shadow-md hover:bg-red-600 transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

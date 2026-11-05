"use client";

import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Home,
  Building,
  CheckCircle2,
  Pencil,
  Trash2,
  Phone,
  User,
  X,
  RotateCw,
  AlertTriangle,
} from "lucide-react";
import { useCustomerData, AddressItem } from "@/hooks/useCustomerData";
import toast from "react-hot-toast";

// Common Bangladesh Districts for reliable selection
const BD_DISTRICTS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Gazipur",
  "Narayanganj",
  "Cox's Bazar",
  "Bogra",
];

interface CustomerAddressesViewProps {
  user: any;
  token?: string | null;
}

export function CustomerAddressesView({ user, token }: CustomerAddressesViewProps) {
  const email = user?.email;
  const {
    addresses,
    loadingAddresses,
    saveAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useCustomerData(email, token);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState<string>("Home");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingAddress(null);
    setFullName(user?.displayName || "");
    setPhone(user?.phoneNumber || "");
    setTitle("Home");
    setAddressLine("");
    setCity("Dhaka");
    setDistrict("Dhaka");
    setPostalCode("");
    setDeliveryNotes("");
    setIsDefault(addresses.length === 0);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (addr: AddressItem) => {
    setEditingAddress(addr);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setTitle(addr.title || "Home");
    setAddressLine(addr.addressLine);
    setCity(addr.city);
    setDistrict(addr.district);
    setPostalCode(addr.postalCode || "");
    setDeliveryNotes(addr.deliveryNotes || "");
    setIsDefault(addr.isDefault);
    setErrors({});
    setModalOpen(true);
  };

  // Bangladeshi phone number validator
  const validatePhone = (num: string): boolean => {
    const cleaned = num.replace(/[\s-]/g, "");
    // matches 01XXXXXXXXX or +8801XXXXXXXXX
    const bdRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    return bdRegex.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Please enter recipient full name";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Invalid Bangladesh phone (e.g. 01711234567 or +8801812345678)";
    }

    if (!addressLine.trim() || addressLine.trim().length < 5) {
      newErrors.addressLine = "Please enter detailed street/house address (at least 5 characters)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the form errors");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        title,
        addressLine: addressLine.trim(),
        city: city.trim(),
        district: district.trim(),
        postalCode: postalCode.trim() || undefined,
        deliveryNotes: deliveryNotes.trim() || undefined,
        isDefault,
      };

      if (editingAddress) {
        await updateAddress(editingAddress.id, payload);
      } else {
        await saveAddress(payload);
      }

      setModalOpen(false);
    } catch {
      toast.error("Failed to save address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    await deleteAddress(deletingId);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Delivery Addresses & Address Book
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your saved delivery locations for fast 1-click checkout
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="h-9 px-4 rounded-xl bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* 2. Addresses Grid */}
      {loadingAddresses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-44 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 animate-pulse"
            />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-10 text-center text-slate-400 space-y-3 shadow-xs">
          <MapPin className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            No delivery addresses saved yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Add your primary residence or office address so our couriers can deliver your fresh groceries seamlessly.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ff6c2f] text-white text-xs font-bold hover:bg-[#e0561b] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs transition-all relative flex flex-col justify-between ${
                addr.isDefault
                  ? "border-[#ff6c2f] ring-1 ring-[#ff6c2f]/40 dark:border-[#ff6c2f]"
                  : "border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div>
                {/* Card Top: Type badge & Default pill */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center">
                      {addr.title === "Office" ? (
                        <Building className="w-4 h-4" />
                      ) : (
                        <Home className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                      {addr.title || "Home"}
                    </span>
                  </div>

                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Default</span>
                    </span>
                  )}
                </div>

                {/* Recipient Details */}
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {addr.fullName}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  {addr.addressLine}
                </p>

                <p className="text-xs text-slate-400 mt-0.5">
                  {addr.city}, {addr.district} {addr.postalCode ? `(${addr.postalCode})` : ""}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{addr.phone}</span>
                </div>

                {addr.deliveryNotes && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400/90 bg-amber-50/70 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200/50 dark:border-amber-900/40 mt-2.5">
                    <strong>Note:</strong> {addr.deliveryNotes}
                  </p>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                {!addr.isDefault ? (
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-[#ff6c2f] hover:underline font-bold cursor-pointer"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">Primary destination</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(addr)}
                    title="Edit address"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingId(addr.id)}
                    title="Delete address"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Add / Edit Address Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#ff6c2f]" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {editingAddress ? "Edit Delivery Address" : "Add New Address"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 [scrollbar-width:thin]">
              {/* Address Title: Home vs Office */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Address Label
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Home", "Office", "Other"].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setTitle(lbl)}
                      className={`h-9 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        title === lbl
                          ? "border-[#ff6c2f] bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] font-bold"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {lbl === "Home" && <Home className="w-3.5 h-3.5" />}
                      {lbl === "Office" && <Building className="w-3.5 h-3.5" />}
                      {lbl === "Other" && <MapPin className="w-3.5 h-3.5" />}
                      <span>{lbl}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className={`w-full h-9 px-3 text-xs rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] ${
                      errors.fullName ? "border-rose-500" : "border-slate-200 dark:border-slate-700"
                    }`}
                  />
                  {errors.fullName && (
                    <span className="text-[10px] text-rose-500 mt-0.5 block">
                      {errors.fullName}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number (Bangladesh) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className={`w-full h-9 px-3 text-xs rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] ${
                      errors.phone ? "border-rose-500" : "border-slate-200 dark:border-slate-700"
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-rose-500 mt-0.5 block">
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* District & City Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    District *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setCity(e.target.value);
                    }}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
                  >
                    {BD_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    City / Area / Thana *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Uttara / Dhanmondi"
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                  />
                </div>
              </div>

              {/* Detailed Street Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Street Address & House Details *
                </label>
                <textarea
                  rows={2}
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="House number, road number, flat/floor, landmark..."
                  className={`w-full p-2.5 text-xs rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] ${
                    errors.addressLine ? "border-rose-500" : "border-slate-200 dark:border-slate-700"
                  }`}
                />
                {errors.addressLine && (
                  <span className="text-[10px] text-rose-500 mt-0.5 block">
                    {errors.addressLine}
                  </span>
                )}
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Notes / Courier Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Ring the bell twice; leave with guard if absent"
                  className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
                />
              </div>

              {/* Set as Default Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="defaultAddressToggle"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded border-slate-300 text-[#ff6c2f] focus:ring-[#ff6c2f] cursor-pointer"
                />
                <label
                  htmlFor="defaultAddressToggle"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Set as my primary default delivery address
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-9 px-5 rounded-xl bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingAddress ? "Save Changes" : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Delete Address?
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Are you sure you want to remove this delivery address?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="h-8 px-3.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default CustomerAddressesView;


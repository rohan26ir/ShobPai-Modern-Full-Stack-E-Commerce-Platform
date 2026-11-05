import React from "react";
import { X, Calendar, RotateCw, Check } from "lucide-react";
import { Order } from "./orders.types";

interface EditOrderModalProps {
  order: Order | null;
  onClose: () => void;
  editStatus: string;
  setEditStatus: (status: string) => void;
  editPaymentStatus: string;
  setEditPaymentStatus: (status: string) => void;
  editDeliveryDate: string;
  setEditDeliveryDate: (date: string) => void;
  editDeliveryNote: string;
  setEditDeliveryNote: (note: string) => void;
  extendDeliveryDays: (days: number) => void;
  onSave: () => void;
  savingEdit: boolean;
}

export function EditOrderModal({
  order,
  onClose,
  editStatus,
  setEditStatus,
  editPaymentStatus,
  setEditPaymentStatus,
  editDeliveryDate,
  setEditDeliveryDate,
  editDeliveryNote,
  setEditDeliveryNote,
  extendDeliveryDays,
  onSave,
  savingEdit,
}: EditOrderModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6c2f] block">
              Admin Action
            </span>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
              Edit Order #{order.orderNumber || order.id.slice(0, 8)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Fulfillment Status
            </label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
            >
              <option value="PENDING">PENDING</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Payment Status
            </label>
            <select
              value={editPaymentStatus}
              onChange={(e) => setEditPaymentStatus(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f] cursor-pointer"
            >
              <option value="PAID">PAID</option>
              <option value="UNPAID">UNPAID</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
          </div>

          {/* Delivery Time Extension Section */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#ff6c2f]" />
                <span>Estimated Delivery Date</span>
              </label>
              {editDeliveryDate && (
                <span className="text-[11px] font-medium text-[#ff6c2f] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-md">
                  {new Date(editDeliveryDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* Date Input */}
            <input
              type="date"
              value={editDeliveryDate}
              onChange={(e) => setEditDeliveryDate(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
            />

            {/* Quick Presets */}
            <div>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                Quick Extend Delivery Time
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: "+1 Day", days: 1 },
                  { label: "+2 Days", days: 2 },
                  { label: "+3 Days", days: 3 },
                  { label: "+5 Days", days: 5 },
                  { label: "+1 Week", days: 7 },
                ].map((preset) => (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => extendDeliveryDays(preset.days)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#ff6c2f] hover:text-[#ff6c2f] dark:hover:border-[#ff6c2f] dark:hover:text-[#ff6c2f] bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Extension Reason / Delivery Note */}
            <div className="pt-1">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                Extension Reason / Delivery Note
              </label>
              <input
                type="text"
                placeholder="e.g. Courier delay, weather condition, customer request..."
                value={editDeliveryNote}
                onChange={(e) => setEditDeliveryNote(e.target.value)}
                className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff6c2f]"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={savingEdit}
            className="px-4 py-2 rounded-xl bg-[#ff6c2f] hover:bg-[#e0561b] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            {savingEdit ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}


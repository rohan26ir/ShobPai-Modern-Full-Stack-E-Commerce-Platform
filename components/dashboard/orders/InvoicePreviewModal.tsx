import React from "react";
import { Printer, FileDown, RotateCw, X } from "lucide-react";
import { Order } from "./orders.types";
import { InvoicePrintTable } from "./InvoicePrintTable";
import { InvoiceAddresses } from "./InvoiceAddresses";

interface InvoicePreviewModalProps {
  order: Order | null;
  onClose: () => void;
  onDownloadPdf: (order: Order) => void;
  isGeneratingPdf: boolean;
}

export function InvoicePreviewModal({
  order,
  onClose,
  onDownloadPdf,
  isGeneratingPdf,
}: InvoicePreviewModalProps) {
  if (!order) return null;

  const orderNum = order.orderNumber || order.id?.slice(0, 8).toUpperCase() || "JH56A1";
  const customerName = order.user?.displayName || order.guestName || "Customer";
  const customerEmail = order.user?.email || order.guestEmail || "customer@example.com";
  const customerPhone =
    order.user?.phoneNumber ||
    order.guestPhone ||
    order.shippingAddress?.phone ||
    "+880 1711-000000";
  const addressLine = order.shippingAddress?.addressLine || "Dhanmondi, Dhaka";
  const cityState = order.shippingAddress?.city
    ? `${order.shippingAddress.city}, Bangladesh`
    : "Dhaka, Bangladesh";

  const items =
    order.items && order.items.length > 0
      ? order.items
      : [
          {
            name: "ToasterMaster Toaster",
            model: "Model: BHT432",
            quantity: 1,
            unitPrice: 50.0,
            discount: 2,
            total: 49.0,
          },
          {
            name: "QuickHeat Pro Microwave Oven",
            model: "Model: A789",
            quantity: 1,
            unitPrice: 150.0,
            discount: 10,
            total: 135.0,
          },
        ];

  const subtotal = order.subtotal || order.totalAmount || 184.0;
  const discountAmount = order.discountAmount || (order.discount ? order.discount : 15.0);
  const totalAmount = order.totalAmount || 169.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white text-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl overflow-hidden my-8">
        {/* Geometric Yellow Accent Blocks */}
        <div className="absolute top-0 right-0 w-24 h-12 bg-[#FFE01B] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#FFE01B] pointer-events-none" />

        {/* Top Modal Controls */}
        <div className="flex items-center justify-end gap-2 mb-6 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            title="Print Invoice"
            className="h-8 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={() => onDownloadPdf(order)}
            disabled={isGeneratingPdf}
            title="Download PDF"
            className="h-8 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight font-sans">
                Invoice
              </h1>
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-widest text-slate-900 mt-1">
                #{orderNum}
              </div>
            </div>

            <div className="text-right pr-6">
              <span className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#ff6c2f] uppercase block font-sans">
                shob<span className="text-slate-900">Pai</span>
              </span>
            </div>
          </div>

          {/* 2-Column Addresses */}
          <InvoiceAddresses
            customerName={customerName}
            addressLine={addressLine}
            cityState={cityState}
            customerEmail={customerEmail}
            customerPhone={customerPhone}
          />

          {/* Items Table */}
          <InvoicePrintTable items={items} />

          {/* Financial Summary Box */}
          <div className="flex justify-end pt-4">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <span className="font-bold text-slate-800">Subtotal</span>
                <span className="text-slate-800 font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <span className="font-bold text-slate-800">Discount</span>
                <span className="text-slate-800 font-medium">${discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <span className="font-bold text-slate-900 leading-tight">Total Amount Paid</span>
                <span className="text-slate-900 font-bold text-sm">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-900">Total Due</span>
                <span className="text-slate-900 font-bold text-sm">$0</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="pt-8 space-y-2 text-[11px] text-slate-500 italic">
            <p>Please note: Orders ship within 2 to 5 business days.</p>
            <p>Please inspect all fresh items and products upon receiving.</p>
            <p>Queries: +880 1700-000000 | support@shobpai.com</p>
            <p className="font-bold not-italic text-slate-900 pt-3">
              Thank you for shopping with shobPai!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

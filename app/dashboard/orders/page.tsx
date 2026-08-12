"use client";

import {
  FaBox,
  FaCheckCircle,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import jsPDF from "jspdf";

export interface OrderItem {
  id: string;
  date: string;
  total: number;
  itemsCount: number;
  status: string;
  paymentMethod: string;
  items: string;
  customerName?: string;
  customerEmail?: string;
}

export default function OrdersPage() {
  const orders: OrderItem[] = [
    {
      id: "ORD-9482",
      date: "August 10, 2026",
      total: 84.50,
      itemsCount: 4,
      status: "Delivered",
      paymentMethod: "Visa •••• 4242",
      items: "Organic Red Tomatoes (2 kg), Fresh Honeycrisp Apples (1 kg), Bio Creamy Cheese (500 g)",
      customerName: "Sophia Martinez",
      customerEmail: "sophia.m@example.com",
    },
    {
      id: "ORD-9481",
      date: "August 02, 2026",
      total: 32.00,
      itemsCount: 2,
      status: "Processing",
      paymentMethod: "Mastercard •••• 8812",
      items: "Organic Cold Pressed Juices (2 L), Fresh Strawberries (500 g)",
      customerName: "Liam Johnson",
      customerEmail: "liam.j@example.com",
    },
    {
      id: "ORD-9480",
      date: "July 24, 2026",
      total: 124.90,
      itemsCount: 7,
      status: "Delivered",
      paymentMethod: "PayPal",
      items: "Organic Carrots (3 kg), Mixed Dry Fruits & Nuts (1 kg), Fresh Wholewheat Bakery Bread (2 loaves)",
      customerName: "Emma Williams",
      customerEmail: "emma.w@example.com",
    },
    {
      id: "ORD-9479",
      date: "July 11, 2026",
      total: 56.20,
      itemsCount: 3,
      status: "Delivered",
      paymentMethod: "Visa •••• 4242",
      items: "Sea Fish Salmon Fillet (1 kg), Fresh Summer Watermelon (1 pc)",
      customerName: "Noah Brown",
      customerEmail: "noah.b@example.com",
    },
  ];

  const generatePDF = (order: OrderItem) => {
    const doc = new jsPDF();

    // Store Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(34, 34, 34);
    doc.text("ShobPai Fresh Organics", 20, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Official Invoice & Purchase Receipt", 20, 31);
    doc.text("Support Email: support@shobpai.com | www.shobpai.com", 20, 36);

    // Accent Line
    doc.setDrawColor(229, 168, 66); // #E5A842
    doc.setLineWidth(1.5);
    doc.line(20, 42, 190, 42);

    // Order Meta Info Box
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 34, 34);
    doc.text(`INVOICE NUMBER: ${order.id}`, 20, 52);
    doc.text(`DATE: ${order.date}`, 130, 52);

    doc.setFont("helvetica", "normal");
    doc.text(`Customer: ${order.customerName || "Valued Customer"}`, 20, 60);
    doc.text(`Email: ${order.customerEmail || "customer@example.com"}`, 20, 66);
    doc.text(`Payment: ${order.paymentMethod}`, 130, 60);
    doc.text(`Order Status: ${order.status}`, 130, 66);

    // Table Header
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 76, 170, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("ITEM DESCRIPTION", 25, 81.5);
    doc.text("QTY", 140, 81.5);
    doc.text("AMOUNT", 165, 81.5);

    // Items List
    doc.setFont("helvetica", "normal");
    const itemList = order.items.split(",");
    let startY = 92;

    itemList.forEach((itemText) => {
      doc.text(itemText.trim(), 25, startY);
      doc.text("1", 142, startY);
      doc.text(`$${(order.total / itemList.length).toFixed(2)}`, 165, startY);
      startY += 8;
    });

    // Divider Line
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(20, startY + 4, 190, startY + 4);

    // Totals Summary
    const subtotal = Math.max(0, order.total - 4.99);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", 130, startY + 14);
    doc.text(`$${subtotal.toFixed(2)}`, 165, startY + 14);

    doc.text("Shipping:", 130, startY + 22);
    doc.text("$4.99", 165, startY + 22);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(229, 168, 66);
    doc.text("Total Paid:", 130, startY + 34);
    doc.text(`$${order.total.toFixed(2)}`, 165, startY + 34);

    // Footer Thank You
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(140, 140, 140);
    doc.text("Thank you for shopping with ShobPai Fresh Organics!", 20, startY + 50);

    // Directly open PDF in a new tab (about:blank window blob)
    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            Purchase History
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            My Orders & Invoices
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            Track active deliveries and click "Invoice" to directly open & print official PDF receipts.
          </p>
        </div>

        <span className="text-xs font-black bg-[#E5A842] text-gray-950 px-4 py-2 rounded-xl shadow-md self-start md:self-auto">
          {orders.length} Total Orders
        </span>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#E5A842]/40 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-[#E5A842] shrink-0 border border-amber-100">
                <FaBox className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-black text-gray-900">{order.id}</h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      order.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-amber-50 text-[#E5A842] border border-amber-100"
                    }`}
                  >
                    <FaCheckCircle className="h-2.5 w-2.5" />
                    <span>{order.status}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Placed on <strong className="text-gray-800">{order.date}</strong> • {order.itemsCount} Items • {order.paymentMethod}
                </p>
                <p className="text-xs text-gray-400 italic line-clamp-1">
                  {order.items}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
              <span className="text-lg font-black text-gray-900">
                ${order.total.toFixed(2)}
              </span>

              {/* Directly generate & open PDF on click without modal */}
              <button
                onClick={() => generatePDF(order)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-[#E5A842] hover:text-gray-950 transition-colors shadow-xs cursor-pointer"
              >
                <FaFileInvoiceDollar className="h-3.5 w-3.5" />
                <span>Invoice</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

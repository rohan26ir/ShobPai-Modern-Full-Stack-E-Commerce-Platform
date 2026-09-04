"use client";

import { useState, useEffect } from "react";
import {
  FaBox,
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaSyncAlt,
} from "react-icons/fa";
import jsPDF from "jspdf";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function OrdersPage() {
  const { user, isAdmin, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (isAdmin && token) {
        const data = await api.adminListOrders(undefined, token);
        setOrders(Array.isArray(data) ? data : []);
      } else if (token) {
        const data = await api.getMyOrders(token);
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isAdmin, token]);

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    if (!token || !isAdmin) return;
    setUpdatingId(orderId);
    try {
      await api.adminUpdateOrderStatus(orderId, nextStatus, token);
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const generatePDF = (order: any) => {
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
    doc.text(`INVOICE NUMBER: ${order.orderNumber || order.id}`, 20, 52);
    doc.text(`DATE: ${new Date(order.createdAt).toLocaleDateString()}`, 130, 52);

    doc.setFont("helvetica", "normal");
    const customerName = order.user?.displayName || order.guestName || user?.displayName || "Customer";
    const customerEmail = order.user?.email || order.guestEmail || user?.email || "customer@example.com";
    doc.text(`Customer: ${customerName}`, 20, 60);
    doc.text(`Email: ${customerEmail}`, 20, 66);
    doc.text(`Payment: ${order.paymentMethod || "Cash on Delivery"}`, 130, 60);
    doc.text(`Status: ${order.status}`, 130, 66);

    // Items Table Header
    doc.setFillColor(248, 248, 248);
    doc.rect(20, 76, 170, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text("ORDERED ITEMS", 25, 81.5);
    doc.text("QTY", 130, 81.5);
    doc.text("SUBTOTAL", 160, 81.5);

    // Items List
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);

    let startY = 92;
    if (order.items && order.items.length > 0) {
      order.items.forEach((item: any) => {
        const title = item.product?.name || item.productId || "Organic Item";
        doc.text(title.slice(0, 45), 25, startY);
        doc.text(String(item.quantity || 1), 132, startY);
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 160, startY);
        startY += 8;
      });
    } else {
      doc.text("Farm Fresh Organics Package", 25, startY);
      doc.text("1", 132, startY);
      doc.text(`$${order.totalAmount?.toFixed(2)}`, 160, startY);
      startY += 8;
    }

    // Divider Line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(20, startY + 2, 190, startY + 2);

    // Pricing Breakdown
    const finalY = startY + 12;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Order Subtotal:", 125, finalY);
    doc.text(`$${(order.subtotal || order.totalAmount).toFixed(2)}`, 165, finalY);

    doc.text("Shipping & Handling:", 125, finalY + 6);
    doc.text(`$${(order.shippingFee || 0).toFixed(2)}`, 165, finalY + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(229, 168, 66);
    doc.text("Grand Total:", 125, finalY + 15);
    doc.text(`$${order.totalAmount?.toFixed(2)}`, 165, finalY + 15);

    // Footer Guarantee
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      "Thank you for shopping organic with ShobPai! Hand-picked farm fresh quality guaranteed.",
      20,
      270
    );

    // Trigger Browser Download
    doc.save(`ShobPai-Invoice-${order.orderNumber || order.id}.pdf`);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            {isAdmin ? "Admin Order Fulfillment" : "Purchase History"}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            {isAdmin ? "All Platform Orders" : "My Orders"}
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            {isAdmin
              ? "Manage customer shipments, update fulfillment stages, and export official billing invoices."
              : "Review your completed organic produce orders, check tracking statuses, and download receipts."}
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <FaSyncAlt className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Orders List / Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading orders from server...</div>
        ) : orders.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center p-6">
            <FaBox className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-800">No Orders Found</h3>
            <p className="text-xs text-gray-400 mt-1">
              {isAdmin
                ? "No customer orders have been placed in the database yet."
                : "You haven't placed any orders yet. Visit our shop to start ordering fresh produce!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-4">Order ID</th>
                  <th className="py-4 px-4">Date</th>
                  {isAdmin && <th className="py-4 px-4">Customer</th>}
                  <th className="py-4 px-4">Items</th>
                  <th className="py-4 px-4">Total</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {orders.map((order) => {
                  const itemsSummary =
                    order.items?.map((i: any) => `${i.product?.name || i.productId} (${i.quantity})`).join(", ") ||
                    `${order.items?.length || 1} Item(s)`;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-4 font-black text-gray-900">
                        {order.orderNumber || order.id}
                      </td>
                      <td className="py-4 px-4 text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      {isAdmin && (
                        <td className="py-4 px-4 text-gray-900 whitespace-nowrap">
                          {order.user?.displayName || order.guestName || order.user?.email || "Guest"}
                        </td>
                      )}
                      <td className="py-4 px-4 text-gray-600 max-w-xs truncate" title={itemsSummary}>
                        {itemsSummary}
                      </td>
                      <td className="py-4 px-4 font-black text-gray-900 whitespace-nowrap">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isAdmin ? (
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="text-[10px] font-bold px-2 py-1 rounded-lg border border-gray-200 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              order.status === "DELIVERED"
                                ? "bg-emerald-50 text-emerald-600"
                                : order.status === "PENDING"
                                ? "bg-amber-50 text-[#E5A842]"
                                : order.status === "CANCELLED"
                                ? "bg-red-50 text-red-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => generatePDF(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#E5A842] hover:text-gray-950 text-gray-700 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          <FaFileInvoiceDollar className="h-3.5 w-3.5" />
                          <span>Invoice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

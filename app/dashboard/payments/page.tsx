"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FaCreditCard,
  FaDollarSign,
  FaCalendarAlt,
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaSyncAlt,
  FaReceipt,
} from "react-icons/fa";
import jsPDF from "jspdf";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function PaymentsPage() {
  const { user, isAdmin, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentsData = async () => {
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
      console.error("Failed to load payment transactions:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, [isAdmin, token]);

  const { thisMonthTotal, lifetimeTotal, paidOrdersCount } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let thisMonth = 0;
    let lifetime = 0;
    let paidCount = 0;

    orders.forEach((ord) => {
      const amt = Number(ord.totalAmount) || 0;
      lifetime += amt;
      if (ord.paymentStatus === "PAID" || ord.status === "DELIVERED") {
        paidCount++;
      }

      const ordDate = new Date(ord.createdAt);
      if (ordDate.getMonth() === currentMonth && ordDate.getFullYear() === currentYear) {
        thisMonth += amt;
      }
    });

    return {
      thisMonthTotal: thisMonth,
      lifetimeTotal: lifetime,
      paidOrdersCount: paidCount,
    };
  }, [orders]);

  const paymentStats = [
    {
      title: isAdmin ? "This Month Revenue" : "This Month Payment",
      value: `$${thisMonthTotal.toFixed(2)}`,
      period: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
      icon: FaCalendarAlt,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: isAdmin ? "Total Completed Orders" : "Total Paid Orders",
      value: `${paidOrdersCount} Paid`,
      period: "Processed Successfully",
      icon: FaCreditCard,
      color: "bg-amber-50 text-[#E5A842]",
    },
    {
      title: isAdmin ? "Total Platform Revenue" : "Total Lifetime Spent",
      value: `$${lifetimeTotal.toFixed(2)}`,
      period: "All Time Cumulative",
      icon: FaDollarSign,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const generateReceiptPDF = (order: any) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("ShobPai Payment Receipt", 20, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Receipt ID: TXN-${order.orderNumber || order.id}`, 20, 35);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 42);
    doc.text(`Customer: ${order.user?.displayName || order.guestName || user?.displayName || "Customer"}`, 20, 49);
    doc.text(`Payment Method: ${order.paymentMethod || "Cash on Delivery"}`, 20, 56);
    doc.text(`Payment Status: ${order.paymentStatus || "COMPLETED"}`, 20, 63);
    doc.text(`Amount Paid: $${order.totalAmount?.toFixed(2)}`, 20, 70);
    doc.save(`Receipt-${order.orderNumber || order.id}.pdf`);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            Financial Transactions
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            {isAdmin ? "Platform Billing & Payments" : "Payments & Spending Summary"}
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            {isAdmin
              ? "Monitor real customer payments, billing histories, and financial statements recorded in the database."
              : "Review your monthly spendings, total lifetime purchases, and download official payment receipts."}
          </p>
        </div>

        <button
          onClick={fetchPaymentsData}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <FaSyncAlt className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Payment Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paymentStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  {stat.title}
                </span>
                <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                <span className="text-[11px] font-semibold text-gray-500 mt-1 block">
                  {stat.period}
                </span>
              </div>

              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Real Transactions Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Recorded Payment Records</h3>
            <p className="text-xs text-gray-400">Transactions processed in database</p>
          </div>
          <span className="text-xs font-bold text-gray-400">{orders.length} Records</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading payment records from server...</div>
        ) : orders.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center p-6">
            <FaReceipt className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-800">No Payment Records Found</h3>
            <p className="text-xs text-gray-400 mt-1">
              Payment records will appear here as soon as orders are placed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-4">Transaction / Order</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Method</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-black text-gray-900">
                      {ord.orderNumber || ord.id}
                    </td>
                    <td className="py-4 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {ord.paymentMethod === "COD" ? "Cash on Delivery" : ord.paymentMethod || "Card / Online"}
                    </td>
                    <td className="py-4 px-4 font-black text-gray-900 whitespace-nowrap">
                      ${ord.totalAmount?.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.paymentStatus === "PAID"
                            ? "bg-emerald-50 text-emerald-600"
                            : ord.paymentStatus === "FAILED"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-[#E5A842]"
                        }`}
                      >
                        <FaCheckCircle className="h-2.5 w-2.5" />
                        <span>{ord.paymentStatus || "PENDING"}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => generateReceiptPDF(ord)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#E5A842] hover:text-gray-950 text-gray-700 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <FaFileInvoiceDollar className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

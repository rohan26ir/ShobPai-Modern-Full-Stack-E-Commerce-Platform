"use client";

import { FaCreditCard, FaDollarSign, FaCalendarAlt, FaHistory, FaCheckCircle, FaFileInvoiceDollar } from "react-icons/fa";

export default function PaymentsPage() {
  const paymentStats = [
    { title: "This Month Payment", value: "$140.50", period: "August 2026", icon: FaCalendarAlt, color: "bg-emerald-50 text-emerald-600" },
    { title: "Last 6 Months Payment", value: "$840.20", period: "Feb - Jul 2026", icon: FaCreditCard, color: "bg-amber-50 text-[#E5A842]" },
    { title: "Total Lifetime Spent", value: "$1,650.00", period: "Overall Orders", icon: FaDollarSign, color: "bg-purple-50 text-purple-600" },
  ];

  const paymentHistory = [
    { id: "TXN-88401", date: "Aug 10, 2026", method: "Visa •••• 4242", amount: "$84.50", status: "Successful", orderId: "ORD-9482" },
    { id: "TXN-88392", date: "Aug 02, 2026", method: "Mastercard •••• 8812", amount: "$56.00", status: "Successful", orderId: "ORD-9481" },
    { id: "TXN-87910", date: "Jul 24, 2026", method: "PayPal (sophia@ex.com)", amount: "$124.90", status: "Successful", orderId: "ORD-9480" },
    { id: "TXN-87422", date: "Jul 11, 2026", method: "Visa •••• 4242", amount: "$94.20", status: "Successful", orderId: "ORD-9479" },
    { id: "TXN-86901", date: "Jun 28, 2026", method: "Apple Pay", amount: "$210.00", status: "Successful", orderId: "ORD-9455" },
    { id: "TXN-85410", date: "May 15, 2026", method: "Mastercard •••• 8812", amount: "$180.60", status: "Successful", orderId: "ORD-9410" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842]">
        <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
          Financial History
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
          Payments & Spending Analytics
        </h1>
        <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
          Review your monthly billing summaries, 6-month payment trends, total lifetime spent, and download transaction receipts.
        </p>
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

      {/* Payment History Table */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <FaHistory className="text-[#E5A842] h-4 w-4" />
            <h3 className="text-base">Payment Transaction History</h3>
          </div>
          <span className="text-xs font-semibold text-gray-400">Total 6 Transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-100 bg-gray-50/80 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              {paymentHistory.map((pt) => (
                <tr key={pt.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="py-4 px-4 font-extrabold text-gray-900">{pt.id}</td>
                  <td className="py-4 px-4 text-[#E5A842] font-bold">{pt.orderId}</td>
                  <td className="py-4 px-4 text-gray-700">{pt.method}</td>
                  <td className="py-4 px-4 font-black text-gray-900 text-sm">{pt.amount}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
                      <FaCheckCircle className="h-3 w-3" />
                      <span>{pt.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-gray-400 font-medium">{pt.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

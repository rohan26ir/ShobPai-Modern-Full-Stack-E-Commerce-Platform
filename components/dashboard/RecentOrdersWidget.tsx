import React from "react";
import Link from "next/link";
import { FaChevronRight, FaBoxOpen } from "react-icons/fa";

interface RecentOrdersWidgetProps {
  orders: any[];
  isAdmin: boolean;
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export const RecentOrdersWidget = React.memo(function RecentOrdersWidget({
  orders,
  isAdmin,
}: RecentOrdersWidgetProps) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {isAdmin ? "Recent Store Orders" : "My Recent Purchases"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {isAdmin ? "Latest incoming customer orders" : "Your latest farm-fresh deliveries"}
            </p>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-xs font-bold text-[#E5A842] hover:text-[#d49633] flex items-center gap-1 transition-colors"
          >
            View All <FaChevronRight className="h-2.5 w-2.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-gray-400 flex flex-col items-center">
            <FaBoxOpen className="h-10 w-10 text-gray-200 mb-2" />
            <p className="text-xs font-semibold">No orders recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs text-gray-600">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold uppercase text-gray-400">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">{isAdmin ? "Customer" : "Items"}</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 5).map((order) => {
                  const badgeClass = statusStyles[order.status] || "bg-gray-50 text-gray-600 border-gray-200";
                  const dateStr = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Recent";

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        <Link
                          href={`/dashboard/orders`}
                          className="hover:underline text-gray-800"
                        >
                          #{order.orderNumber || order.id.slice(-6)}
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        {isAdmin
                          ? order.user?.displayName || order.guestName || "Customer"
                          : `${order.items?.length || 1} item(s)`}
                      </td>
                      <td className="py-3 px-3 text-gray-400">{dateStr}</td>
                      <td className="py-3 px-3 font-bold text-gray-900">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Showing {Math.min(orders.length, 5)} of {orders.length} orders</span>
        <Link
          href="/dashboard/orders"
          className="font-bold text-gray-800 hover:text-[#E5A842] transition-colors"
        >
          Manage All Orders →
        </Link>
      </div>
    </div>
  );
});

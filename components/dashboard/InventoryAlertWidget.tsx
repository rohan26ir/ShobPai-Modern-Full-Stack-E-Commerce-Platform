import React, { useMemo } from "react";
import Link from "next/link";
import { FaExclamationTriangle, FaCheckCircle, FaPlus } from "react-icons/fa";
import { Product } from "@/data/products";

interface InventoryAlertWidgetProps {
  products: Product[];
  isAdmin: boolean;
}

export const InventoryAlertWidget = React.memo(function InventoryAlertWidget({
  products,
  isAdmin,
}: InventoryAlertWidgetProps) {
  const lowStockItems = useMemo(() => {
    return products.filter((p) => p.stock <= 5).slice(0, 4);
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => p.stock === 0).length;
  }, [products]);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {isAdmin ? "Inventory Health Alerts" : "Farm Fresh Arrivals"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {isAdmin
                ? "Items requiring replenishment"
                : "Seasonal items picked fresh today"}
            </p>
          </div>
          {isAdmin && outOfStockCount > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200">
              {outOfStockCount} Out of Stock
            </span>
          )}
        </div>

        <div className="space-y-3 mt-4">
          {lowStockItems.length === 0 ? (
            <div className="py-8 text-center text-gray-400 flex flex-col items-center">
              <FaCheckCircle className="h-8 w-8 text-emerald-400 mb-2" />
              <p className="text-xs font-semibold text-gray-600">
                All inventory levels are healthy!
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                No products currently below the safety threshold.
              </p>
            </div>
          ) : (
            lowStockItems.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    <FaExclamationTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Category: {prod.categoryName || prod.category || "General"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${
                      prod.stock === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {prod.stock === 0 ? "Out of Stock" : `${prod.stock} left`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs">
        {isAdmin ? (
          <>
            <Link
              href="/dashboard/admin"
              className="font-bold text-[#E5A842] hover:text-[#d49633] transition-colors flex items-center gap-1.5"
            >
              <FaPlus className="h-3 w-3" /> Add / Restock Products
            </Link>
            <Link
              href="/dashboard/admin"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              Catalog Manager →
            </Link>
          </>
        ) : (
          <Link
            href="/shop"
            className="font-bold text-[#E5A842] hover:text-[#d49633] transition-colors"
          >
            Explore Organic Catalog →
          </Link>
        )}
      </div>
    </div>
  );
});

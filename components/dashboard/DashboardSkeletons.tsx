import React from "react";

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl bg-white p-5 border border-gray-100 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-2.5 flex-1">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-6 w-28 bg-gray-300 rounded" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </div>
          <div className="h-12 w-12 rounded-xl bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full animate-pulse bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-8 w-24 bg-gray-100 rounded-xl" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 bg-gray-200 rounded flex-1"
                style={{ opacity: 1 - r * 0.12 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function WidgetSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
      <div className="h-5 w-32 bg-gray-200 rounded" />
      <div className="space-y-2.5">
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-100 rounded w-4/6" />
      </div>
    </div>
  );
}

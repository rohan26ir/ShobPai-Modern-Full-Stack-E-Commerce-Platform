import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const PaginationControls = React.memo(function PaginationControls({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: PaginationControlsProps) {
  if (totalCount === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 text-xs text-gray-500">
      <div className="flex items-center gap-2">
        <span>
          Showing <span className="font-bold text-gray-900">{startItem}</span> to{" "}
          <span className="font-bold text-gray-900">{endItem}</span> of{" "}
          <span className="font-bold text-gray-900">{totalCount}</span> results
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-3">
            <span className="text-gray-400">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-800 outline-none focus:border-[#E5A842]"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
        >
          <FaChevronLeft className="h-3 w-3" />
        </button>

        <span className="px-3 font-semibold text-gray-700">
          Page <span className="text-gray-900 font-bold">{currentPage}</span> of{" "}
          <span className="text-gray-900 font-bold">{totalPages}</span>
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
        >
          <FaChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
});

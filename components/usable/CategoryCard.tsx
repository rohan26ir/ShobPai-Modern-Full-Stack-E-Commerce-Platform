"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/data/categories";

interface CategoryCardProps {
  category: Category;
  itemCount?: number;
}

export default function CategoryCard({ category, itemCount }: CategoryCardProps) {
  const displayCount = itemCount !== undefined ? itemCount : category.itemCount;

  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group relative flex items-center gap-3 sm:gap-4 overflow-hidden bg-white p-3 sm:p-4 transition-all duration-300 min-h-[44px]"
    >
      <div className={`relative flex h-16 w-16 sm:h-20 sm:w-20 md:h-32 md:w-32 lg:h-36 lg:w-36 items-center justify-center overflow-hidden rounded-full shrink-0 ${category.bgColor}`}>
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 70px, (max-width: 1024px) 130px, 150px"
        />
      </div>

      <div className="min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-gray-800 transition-colors group-hover:text-[#E5A842] truncate">
          {category.name}
        </h4>
        <span className="text-[11px] sm:text-xs font-semibold text-gray-500 block">
          {displayCount} {displayCount === 1 ? "Item" : "Items"}
        </span>
      </div>
    </Link>
  );
}

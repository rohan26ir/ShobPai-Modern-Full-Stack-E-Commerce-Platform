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
      className="group relative flex items-center gap-4 overflow-hidden  bg-white p-4 transition-all duration-300 "
    >
      <div className={`relative flex h-20 md:h-40 w-20 md:w-40 items-center justify-center overflow-hidden rounded-full   ${category.bgColor}`}>
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover h-20 md:h-40 w-20 md:w-40 "
        sizes="100px"
        />
      </div>

      <div>
        <h4 className="text-sm font-bold text-gray-800 transition-colors group-hover:text-[#E5A842]">
          {category.name}
        </h4>
        <span className="text-xs font-semibold text-gray-500">
          {displayCount} {displayCount === 1 ? "Item" : "Items"}
        </span>
      </div>
    </Link>
  );
}

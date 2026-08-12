"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaCalendarAlt, FaComments } from "react-icons/fa";
import { blogPosts } from "@/data/blogs";

export default function LatestNewsSection() {
  return (
    <section className="py-14 bg-gray-50/50 border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-600">
            From Our Blog
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
            Latest News & Healthy Tips
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Explore articles about organic farming, fresh nutrition, and seasonal recipes.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs transition-all duration-300 hover:border-emerald-200 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-emerald-500 h-3 w-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaComments className="text-emerald-500 h-3 w-3" />
                    {post.commentsCount} Comments
                  </span>
                </div>

                <h3 className="line-clamp-2 text-base font-bold text-gray-800 transition-colors group-hover:text-emerald-700">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="mt-2 line-clamp-2 text-xs text-gray-500 leading-relaxed">
                  {post.snippet}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <span>Read Full Article</span>
                    <FaArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

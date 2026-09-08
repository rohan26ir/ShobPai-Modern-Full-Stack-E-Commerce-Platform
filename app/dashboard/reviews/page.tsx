"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaRegStar, FaCheckCircle, FaTrashAlt, FaCommentAlt, FaSyncAlt, FaShieldAlt, FaReply } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function ReviewsPage() {
  const { user, isAdmin, token } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [savingReply, setSavingReply] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const data = await api.getReviews();
        setReviews(Array.isArray(data) ? data : []);
      } else if (token) {
        const data = await api.getMyReviews(token);
        setReviews(Array.isArray(data) ? data : []);
      } else {
        const data = await api.getReviews();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [isAdmin, token]);

  const handleAdminReplySubmit = async (reviewId: string) => {
    if (!token || !replyText.trim()) return;
    setSavingReply(true);
    try {
      const updated = await api.replyReview(reviewId, replyText.trim(), token);
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, adminReply: updated.adminReply, adminReplyAt: updated.adminReplyAt }
            : r
        )
      );
      toast.success("Reply submitted successfully!");
      setReplyingId(null);
      setReplyText("");
    } catch (err: any) {
      console.error("Failed to submit admin reply:", err);
      toast.error(err?.message || "Failed to submit reply");
    } finally {
      setSavingReply(false);
    }
  };


  const handleDeleteReview = async (id: string) => {
    if (!token) return;
    setDeletingId(id);
    try {
      await api.deleteReview(id, token);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted");
    } catch (err: any) {
      console.error("Failed to delete review:", err);
      toast.error(err?.message || "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#222222] text-white rounded-3xl p-6 md:p-8 shadow-xl border-b-4 border-[#E5A842] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E5A842]">
            Feedback & Ratings
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            {isAdmin ? "All Product Reviews" : "My Product Reviews"}
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            {isAdmin
              ? "Monitor and moderate customer reviews across the platform in Neon PostgreSQL."
              : "Review your submitted ratings, star feedback, and product opinions."}
          </p>
        </div>

        <button
          onClick={fetchReviews}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <FaSyncAlt className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Reviews List Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-sm text-gray-400 shadow-xs">
            Loading reviews from server...
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-xs">
            <FaCommentAlt className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-800">No Reviews Found</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mb-4">
              {isAdmin
                ? "No customer reviews have been submitted to the database yet."
                : "You haven't submitted any reviews yet. Browse our store products to leave your feedback!"}
            </p>
            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-xl bg-[#E5A842] text-gray-950 font-bold text-xs hover:bg-[#d49633] transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                  {rev.product?.images?.[0] ? (
                    <Image src={rev.product.images[0]} alt={rev.product.name || "Product"} fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-300">
                      <FaCommentAlt className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">
                      {rev.product?.name || "Organic Store Product"}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <FaCheckCircle className="h-2.5 w-2.5" />
                      <span>{rev.reviewerName || rev.user?.displayName || "Verified Buyer"}</span>
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 my-1.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s}>
                        {s <= rev.rating ? <FaStar className="h-3 w-3" /> : <FaRegStar className="h-3 w-3 text-gray-300" />}
                      </span>
                    ))}
                    <span className="text-[11px] font-bold text-gray-700 ml-1">
                      {rev.rating}.0
                    </span>
                    <span className="text-[10px] text-gray-400 ml-2">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
                    "{rev.comment}"
                  </p>

                  {/* Admin Reply Block */}
                  {rev.adminReply && (
                    <div className="mt-3 pl-3.5 py-2.5 pr-3 bg-amber-50/70 border-l-4 border-[#E5A842] rounded-r-xl space-y-1 max-w-xl">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#b47a1d]">
                        <FaShieldAlt className="h-3 w-3" />
                        <span>Store Admin Reply</span>
                        {rev.adminReplyAt && (
                          <span className="text-[10px] text-gray-400 font-normal">
                            • {new Date(rev.adminReplyAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-700 italic leading-relaxed">
                        {rev.adminReply}
                      </p>
                    </div>
                  )}

                  {/* Inline Admin Reply Box */}
                  {isAdmin && replyingId === rev.id && (
                    <div className="mt-3 p-3 bg-amber-50/40 border border-amber-200 rounded-2xl space-y-2 max-w-xl">
                      <label className="block text-[11px] font-bold text-[#b47a1d]">
                        {rev.adminReply ? "Edit Admin Reply" : "Reply to Customer Review"}
                      </label>
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type official store reply..."
                        className="w-full text-xs p-2.5 rounded-xl border border-amber-300 bg-white outline-hidden focus:border-[#E5A842]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingId(null);
                            setReplyText("");
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={savingReply || !replyText.trim()}
                          onClick={() => handleAdminReplySubmit(rev.id)}
                          className="text-xs font-bold bg-[#E5A842] hover:bg-[#d49633] text-gray-950 px-4 py-1.5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {savingReply ? "Saving..." : rev.adminReply ? "Update Reply" : "Post Reply"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setReplyingId(replyingId === rev.id ? null : rev.id);
                      setReplyText(rev.adminReply || "");
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-[#b47a1d] hover:bg-amber-100 transition-colors cursor-pointer"
                    title="Reply to review"
                  >
                    <FaReply className="h-3 w-3" />
                    <span>{rev.adminReply ? "Edit Reply" : "Reply"}</span>
                  </button>
                )}

                {(isAdmin || (user && rev.userId === user.id)) && (
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    disabled={deletingId === rev.id}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 text-xs font-semibold p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete review"
                  >
                    <FaTrashAlt className="h-3.5 w-3.5" />
                    <span>{deletingId === rev.id ? "Deleting..." : "Delete"}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

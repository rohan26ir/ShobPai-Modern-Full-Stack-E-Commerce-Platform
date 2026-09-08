"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  FaCheckCircle,
  FaHeart,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaStar,
  FaTruck,
  FaShieldAlt,
  FaRedo,
  FaUser,
  FaChevronDown,
  FaCamera,
} from "react-icons/fa";
import { Product } from "@/data/products";
import { api } from "@/lib/api";
import RelatedProductsSlider from "@/components/usable/RelatedProductsSlider";
import ProductQuickViewModal from "@/components/usable/ProductQuickViewModal";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { user, token, isAdmin } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setLoadingProduct(true);
    api.getProduct(slug).then((data) => {
      if (isMounted) {
        setProduct(data);
        setLoadingProduct(false);
      }
    }).catch(() => {
      if (isMounted) setLoadingProduct(false);
    });
    return () => { isMounted = false; };
  }, [slug]);

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // Reviews section states - Real live API data with purchase verification
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [canReviewStatus, setCanReviewStatus] = useState<{ canReview: boolean; reason?: string } | null>(null);
  const [checkingCanReview, setCheckingCanReview] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [activeAdminReplyId, setActiveAdminReplyId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const [newReview, setNewReview] = useState({
    author: "",
    email: "",
    rating: 5,
    title: "",
    comment: "",
    image: "",
  });

  // Fetch real reviews from backend
  const fetchProductReviews = async (productId: string) => {
    setLoadingReviews(true);
    try {
      const data = await api.getReviews(productId);
      setReviewsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setReviewsList([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Initial 5-star verified review when no user reviews have been posted yet
  const initialFiveStarReview = useMemo(() => {
    if (!product) return null;
    return {
      id: `initial-5star-${product.id}`,
      rating: 5,
      reviewerName: "Rohan Ahmed",
      designation: "Verified Buyer",
      title: "Outstanding fresh organic quality!",
      comment: `Extremely fresh, crispy and delicious ${product.name.toLowerCase()}! 100% genuine farm-fresh organic taste and arrived in pristine condition. Exceeded expectations!`,
      createdAt: (product as any)?.createdAt || "2026-03-01T10:00:00.000Z",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80",
    };
  }, [product]);

  // Display reviews: real database reviews if present, otherwise initial 1 review with 5 star
  const displayReviews = useMemo(() => {
    if (reviewsList && reviewsList.length > 0) {
      return reviewsList;
    }
    return initialFiveStarReview ? [initialFiveStarReview] : [];
  }, [reviewsList, initialFiveStarReview]);

  const effectiveReviewsCount = displayReviews.length;

  const effectiveRating = useMemo(() => {
    if (displayReviews.length === 0) return 5.0;
    const totalScore = displayReviews.reduce(
      (sum, rev) => sum + (Number(rev.rating) || 5),
      0
    );
    return Math.round((totalScore / displayReviews.length) * 10) / 10;
  }, [displayReviews]);

  // Check purchase eligibility when product or token changes
  useEffect(() => {
    if (!product?.id) return;
    fetchProductReviews(product.id);

    if (token) {
      setCheckingCanReview(true);
      api.canReview(product.id, token)
        .then((res) => setCanReviewStatus(res))
        .catch(() => setCanReviewStatus({ canReview: false, reason: "Purchase verification error" }))
        .finally(() => setCheckingCanReview(false));
    } else {
      setCanReviewStatus(null);
      setCheckingCanReview(false);
    }
  }, [product?.id, token]);


  const isWishlisted = product ? isInWishlist(product.id) : false;

  // Auto-rotate product images every 4 seconds unless hovered/interacting
  useEffect(() => {
    if (!autoRotate || !product?.images || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % product.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoRotate, product?.images]);

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity((prev) => Math.min(product?.stock || 50, prev + 1));

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    try {
      sessionStorage.setItem(
        "shobpai_buy_now_item",
        JSON.stringify({ product, quantity })
      );
    } catch {}
    router.push("/checkout?direct=true");
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;
    if (!token) {
      setReviewError("Please sign in to your customer account to submit a review.");
      return;
    }
    if (!newReview.comment.trim()) {
      setReviewError("Please provide a review comment.");
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);
    try {
      const created = await api.createReview(
        {
          productId: product.id,
          rating: newReview.rating,
          comment: newReview.comment,
          reviewerName: newReview.author || user?.displayName || "Verified Buyer",
          avatar: newReview.image || user?.photoURL || undefined,
        },
        token
      );
      setReviewsList((prev) => [created, ...prev]);
      setShowReviewForm(false);
      setNewReview({ author: "", email: "", rating: 5, title: "", comment: "", image: "" });
    } catch (err: any) {
      setReviewError(err?.message || "Only verified buyers who purchased this product can leave a review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAdminReplySubmit = async (reviewId: string) => {
    if (!token || !adminReplyText.trim()) return;
    setSubmittingReply(true);
    try {
      const updated = await api.replyReview(reviewId, adminReplyText.trim(), token);
      setReviewsList((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, adminReply: updated.adminReply, adminReplyAt: updated.adminReplyAt }
            : r
        )
      );
      setActiveAdminReplyId(null);
      setAdminReplyText("");
    } catch (err: any) {
      alert(err?.message || "Failed to submit admin reply.");
    } finally {
      setSubmittingReply(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="py-24 text-center min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Loading product details from database...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-sm text-gray-500">The product you are looking for does not exist.</p>
        <Link href="/shop" className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700">
          Back to Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = [] as Product[];

  return (
    <div className="py-8 bg-white">
      <div className="container mx-auto px-4">

        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-[#F0A843]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#F0A843]">Shop</Link>
          <span>/</span>
          <Link href={`/category/${product.category}`} className="hover:text-[#F0A843]">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">{product.name}</span>
        </div>

        {/* Product Details Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14">

          {/* Gallery Column (Spans 6) */}
          <div
            className="lg:col-span-6 flex flex-col justify-between"
            onMouseEnter={() => setAutoRotate(false)}
            onMouseLeave={() => setAutoRotate(true)}
          >
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 shadow-xs">
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover transition-all duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {product.discount && (
                <span className="absolute top-4 left-4 rounded-full bg-red-500 px-3.5 py-1 text-xs font-extrabold text-white shadow-md">
                  -{product.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-[#F0A843] ring-2 ring-[#F0A843]/30"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Specifications & Purchase Column (Spans 6) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#F0A843]">
                {product.categoryName} • Unit: {product.unit}
              </span>
              <h1 className="mt-1 text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-3 text-sm">
                <div className="flex items-center text-[#F0A843]">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(effectiveRating)
                          ? "fill-[#F0A843] text-[#F0A843]"
                          : i < effectiveRating
                          ? "fill-[#F0A843] text-[#F0A843] opacity-75"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1.5 font-bold text-gray-800">{effectiveRating.toFixed(1)}</span>
                </div>
                <span className="text-gray-400">|</span>
                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className="text-xs font-semibold text-gray-600 hover:text-[#F0A843] hover:underline cursor-pointer"
                >
                  {effectiveReviewsCount} Customer {effectiveReviewsCount === 1 ? "Review" : "Reviews"}
                </button>
                <span className="text-gray-400">|</span>
                <span className="text-xs font-bold text-[#F0A843]">
                  {product.sold || 120} Sold
                </span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-black text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through font-semibold">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="ml-2 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-[#F0A843]">
                  In Stock ({product.stock} available)
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <FaTruck className="text-[#F0A843] h-4 w-4" />
                  <span>Free Express Delivery ($50+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#F0A843] h-4 w-4" />
                  <span>100% Organic Farm Fresh</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-[#F0A843] h-4 w-4" />
                  <span>100% Satisfaction Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaRedo className="text-[#F0A843] h-4 w-4" />
                  <span>7 Days Fresh Return Policy</span>
                </div>
              </div>
            </div>

            {/* Actions: Quantity + Add to Cart + Buy Now */}
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 p-1">
                  <button
                    onClick={handleDecrease}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-600 shadow-xs hover:bg-gray-100"
                  >
                    <FaMinus className="h-3 w-3" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-600 shadow-xs hover:bg-gray-100"
                  >
                    <FaPlus className="h-3 w-3" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 rounded-2xl py-3.5 px-6 font-bold text-gray-950 transition-all shadow-md cursor-pointer ${
                    isAdded
                      ? "bg-gray-900 text-white"
                      : "bg-[#F0A843] hover:bg-[#e09732] shadow-[#F0A843]/20"
                  }`}
                >
                  <FaShoppingBag className="h-4 w-4" />
                  <span>{isAdded ? "Added to Cart!" : "Add to Cart"}</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={handleToggleWishlist}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 transition-colors cursor-pointer ${
                    isWishlisted ? "bg-red-50 text-red-500 border-red-200" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                  title="Wishlist"
                >
                  <FaHeart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Buy Now CTA */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="block text-center w-full py-3.5 px-6 rounded-2xl bg-gray-900 hover:bg-black text-white !text-white font-black text-sm transition-all shadow-md cursor-pointer"
              >
                <span className="text-white !text-white font-black">Buy Now (Instant Checkout)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Tabbed Info & Reviews */}
        <div className="mb-16 rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex border-b border-gray-100 gap-8 mb-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab("desc")}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === "desc" ? "border-[#F0A843] text-[#F0A843]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Full Description
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === "specs" ? "border-[#F0A843] text-[#F0A843]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Nutrition & Origin
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === "reviews" ? "border-[#F0A843] text-[#F0A843]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Reviews ({effectiveReviewsCount})
            </button>
          </div>

          {activeTab === "desc" && (
            <div className="space-y-6 text-xs md:text-sm text-gray-700 leading-relaxed font-normal">
              {/* Product Details Header with accent line */}
              <div>
                <h3 className="text-base font-bold text-gray-900 border-b-2 border-[#E5A842] inline-block pb-1 mb-3">
                  Product Details
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description ||
                    `${product.name} are carefully sourced from certified organic farms, celebrated for cultivating the finest produce. Each item is meticulously hand-picked at the perfect stage of ripeness to ensure superior quality, uniform size, and a naturally deep, authentic hue. 100% natural and free from artificial colors, flavors, or preservatives, retaining their authentic taste and rich nutritional goodness.`}
                </p>
              </div>

              {/* Nutritional Benefits List */}
              <div className="pt-2">
                <h4 className="text-sm font-extrabold text-gray-900 mb-3">
                  Nutritional Benefits:
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-gray-700">
                  {(
                    product.nutritionalBenefits || [
                      "Rich In Dietary Fibre – Supports healthy digestion and helps maintain bowel regularity.",
                      "High in Natural Energy – Contains natural sugars like glucose, fructose, and sucrose that provide an instant energy boost.",
                      "Packed with Essential Minerals – A good source of potassium, magnesium, calcium, and iron for overall body function and vitality.",
                      "Loaded with Antioxidants – Helps protect cells from oxidative stress and supports heart health.",
                      "Promotes Bone Strength – The presence of minerals such as calcium and phosphorus contributes to strong and healthy bones.",
                      "Supports Heart Health – Low in fat and cholesterol-free, aids in maintaining healthy cholesterol levels.",
                      "Boosts Immunity – Natural nutrients, vitamins, and antioxidants enhance the body's immune defense system.",
                      "Improves Brain Function – Rich in natural compounds that may help enhance memory and cognitive performance.",
                    ]
                  ).map((benefit, idx) => {
                    const parts = benefit.split(" – ");
                    return (
                      <li key={idx} className="leading-relaxed">
                        {parts.length > 1 ? (
                          <>
                            <strong className="text-gray-900 font-bold">{parts[0]}</strong> – {parts[1]}
                          </>
                        ) : (
                          benefit
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-gray-700">
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                <span>Category</span>
                <span className="text-gray-900 font-bold">{product.categoryName}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                <span>Storage</span>
                <span className="text-gray-900 font-bold">{product.storage || "Refrigerate at 4°C - 8°C"}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                <span>Shelf Life</span>
                <span className="text-gray-900 font-bold">{product.shelfLife || "5 - 7 Days"}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                <span>Certifications</span>
                <span className="text-[#F0A843] font-black">{product.certifications || "100% USDA Organic"}</span>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8">
              {/* Centered Main Title */}
              <h2 className="text-xl font-bold text-gray-800 text-center">
                Customer Reviews
              </h2>

              {/* Dynamic 3-Column Header Summary */}
              {(() => {
                const totalCount = displayReviews.length;
                const avgScore = effectiveRating;
                const starBreakdown = [5, 4, 3, 2, 1].map((s) => {
                  const cnt = displayReviews.filter((r) => Math.round(Number(r.rating) || 5) === s).length;
                  const pct = totalCount > 0 ? (cnt / totalCount) * 100 : 0;
                  return { star: s, count: cnt, percent: pct };
                });

                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-gray-100 pb-8">
                    {/* Column 1: Average Rating & Verified badge */}
                    <div className="flex flex-col items-center justify-center text-center space-y-1 md:border-r border-gray-200 pr-4">
                      <div className="flex items-center gap-1.5 text-[#F0A843] text-lg font-bold">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <FaStar
                              key={i}
                              className={`h-4 w-4 ${
                                i <= Math.round(avgScore) ? "fill-current text-amber-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-700 text-sm font-semibold ml-1">
                          {avgScore.toFixed(2)} out of 5
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs font-semibold text-gray-500">
                        <span>Based on {totalCount} verified {totalCount === 1 ? "review" : "reviews"}</span>
                        <FaCheckCircle className="text-emerald-500 h-3.5 w-3.5" />
                      </div>
                    </div>

                    {/* Column 2: Rating Bar Breakdown */}
                    <div className="space-y-1.5 text-xs text-gray-500 px-4 md:border-r border-gray-200">
                      {starBreakdown.map(({ star, count, percent }) => (
                        <div key={star} className="flex items-center gap-2">
                          <div className="flex text-amber-400 text-xs w-20 justify-end">
                            {[...Array(star)].map((_, i) => (
                              <FaStar key={i} className="h-3 w-3 fill-current text-amber-400" />
                            ))}
                            {[...Array(5 - star)].map((_, i) => (
                              <FaStar key={i} className="h-3 w-3 text-gray-300" />
                            ))}
                          </div>
                          <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-[#222222] h-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="w-3 text-right text-gray-600 font-bold">{count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Column 3: Write a Review Button with Purchase Check */}
                    <div className="flex flex-col items-center md:items-end gap-2">
                      <button
                        onClick={() => {
                          setReviewError(null);
                          setShowReviewForm(!showReviewForm);
                        }}
                        className="bg-[#65ac14] hover:bg-[#579810] text-white font-bold text-xs px-6 py-3 rounded-md shadow-xs transition-colors cursor-pointer"
                      >
                        {showReviewForm ? "Cancel Review" : "Write a review"}
                      </button>
                      <span className="text-[11px] text-gray-400 font-medium">
                        Verified purchasers only
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Interactive Write a Review Form or Purchase Notice */}
              {showReviewForm && (
                <div className="max-w-xl mx-auto">
                  {!token ? (
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center space-y-3">
                      <h4 className="text-sm font-bold text-amber-900">Sign In Required</h4>
                      <p className="text-xs text-amber-700">
                        Only verified customers who purchased this item can leave a review. Please sign in with your buyer account.
                      </p>
                      <Link
                        href="/login"
                        className="inline-block bg-[#65ac14] hover:bg-[#579810] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
                      >
                        Sign In to Review
                      </Link>
                    </div>
                  ) : checkingCanReview ? (
                    <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl text-center text-xs text-gray-500">
                      Verifying order purchase history...
                    </div>
                  ) : canReviewStatus?.canReview === false ? (
                    <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center space-y-2">
                      <h4 className="text-sm font-bold text-red-900">Purchase Required to Review</h4>
                      <p className="text-xs text-red-700">
                        {canReviewStatus.reason || "You can only review products that you have purchased and received. No qualifying purchase was found for your account."}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Once you order this item, you will be able to share your verified review here!
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleAddReviewSubmit}
                      className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Write Your Customer Review</h4>
                          <span className="text-[11px] text-emerald-600 font-semibold">Verified Buyer Eligible</span>
                        </div>
                        <span className="text-xs text-gray-500">Posting as {user?.displayName || "Verified Customer"}</span>
                      </div>

                      {reviewError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                          {reviewError}
                        </div>
                      )}

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Rating</label>
                        <div className="flex gap-1 text-amber-400 text-base">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="cursor-pointer"
                            >
                              <FaStar className={star <= newReview.rating ? "text-amber-400" : "text-gray-300"} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Your Name</label>
                          <input
                            type="text"
                            value={newReview.author || user?.displayName || ""}
                            onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                            placeholder={user?.displayName || "Your name"}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 outline-hidden focus:border-[#65ac14]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Your Email</label>
                          <input
                            type="email"
                            disabled
                            value={user?.email || ""}
                            className="w-full rounded-lg border border-gray-200 bg-gray-100 text-gray-500 px-3 py-2 outline-hidden cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Review Comment *</label>
                        <textarea
                          required
                          rows={3}
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          placeholder="Share your experience with this organic product..."
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 outline-hidden focus:border-[#65ac14]"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="px-5 py-2 rounded-lg bg-[#65ac14] hover:bg-[#579810] text-white font-bold cursor-pointer disabled:opacity-50"
                        >
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Review Cards Grid */}
              {loadingReviews && reviewsList.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  Loading verified customer reviews...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="border border-gray-200 rounded-xl p-5 bg-white space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Row: Rating Stars + Date */}
                        <div className="flex items-center justify-between">
                          <div className="flex text-amber-400 text-xs">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < rev.rating ? "fill-current text-amber-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-gray-400 font-medium">
                            {new Date(rev.createdAt || rev.date || Date.now()).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Author Row with Icon and Verified Buyer Tag */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-7 w-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 text-xs overflow-hidden shrink-0">
                            {rev.avatar || rev.user?.photoURL ? (
                              <Image
                                src={rev.avatar || rev.user.photoURL}
                                alt=""
                                width={28}
                                height={28}
                                className="object-cover h-full w-full"
                              />
                            ) : (
                              <FaUser className="h-3 w-3" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-800">
                              {rev.reviewerName || rev.author || rev.user?.displayName || "Verified Customer"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              <FaCheckCircle className="h-2.5 w-2.5" />
                              <span>Verified Buyer</span>
                            </span>
                          </div>
                        </div>

                        {/* Review Comment */}
                        <div className="mt-2.5">
                          <p className="text-xs text-gray-600 leading-relaxed font-normal">
                            {rev.comment}
                          </p>
                        </div>

                        {/* Admin Reply Display */}
                        {rev.adminReply && (
                          <div className="mt-3.5 pl-3.5 py-2.5 pr-3 bg-amber-50/70 border-l-4 border-[#E5A842] rounded-r-lg space-y-1">
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
                      </div>

                      {/* Admin inline reply form if logged in as Admin */}
                      {isAdmin && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          {activeAdminReplyId === rev.id ? (
                            <div className="space-y-2">
                              <textarea
                                rows={2}
                                value={adminReplyText}
                                onChange={(e) => setAdminReplyText(e.target.value)}
                                placeholder="Type your official reply as store admin..."
                                className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-amber-50/30 outline-hidden focus:border-[#E5A842]"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveAdminReplyId(null);
                                    setAdminReplyText("");
                                  }}
                                  className="text-[11px] text-gray-500 hover:text-gray-700 px-2 py-1 cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={submittingReply || !adminReplyText.trim()}
                                  onClick={() => handleAdminReplySubmit(rev.id)}
                                  className="text-[11px] font-bold bg-[#E5A842] hover:bg-[#d49633] text-gray-950 px-3 py-1 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                  {submittingReply ? "Saving..." : rev.adminReply ? "Update Reply" : "Post Reply"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveAdminReplyId(rev.id);
                                setAdminReplyText(rev.adminReply || "");
                              }}
                              className="text-[11px] font-semibold text-[#b47a1d] hover:text-[#915f12] flex items-center gap-1 cursor-pointer"
                            >
                              <FaShieldAlt className="h-2.5 w-2.5" />
                              <span>{rev.adminReply ? "Edit Admin Reply" : "Reply to Customer as Admin"}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          )}
        </div>

        {/* Related Products Section with Swiper 1 by 1 Loop */}
        <section className="pt-6">
          <RelatedProductsSlider
            products={relatedProducts}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        </section>

      </div>

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

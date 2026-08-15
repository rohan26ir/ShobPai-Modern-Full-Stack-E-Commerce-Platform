"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaHeart,
  FaSearch,
  FaShoppingBag,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
  FaAppleAlt,
  FaCarrot,
  FaFish,
  FaDrumstickBite,
  FaBreadSlice,
  FaSeedling,
} from "react-icons/fa";
import {
  GiCrab,
  GiPeanut,
  GiGrapes,
  GiOrangeSlice,
  GiWatermelon,
  GiCheeseWedge,
  GiHoneyJar,
} from "react-icons/gi";
import { FiUser, FiHeart, FiShoppingBag } from "react-icons/fi";

import AnnouncementBar from "@/components/non-usable/AnnouncementBar";
import CartDrawer from "@/components/usable/CartDrawer";
import { categories } from "@/data/categories";
import logoImg from "@/public/logo/sobpai-nav_logo.svg";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { cartCount, wishlistCount } = useCart();
  const { user, role, isAdmin } = useAuth();
  const userIsLoggedIn = !!user && role !== "GUEST";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);

  // Listen to window scroll position (triggers instantly on any scroll > 0)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categoriesList = [
    { label: "All Categories", value: "all" },
    { label: "Fresh Fruits", value: "fresh-fruits" },
    { label: "Fresh Vegetables", value: "vegetables" },
    { label: "Dairy & Cheese", value: "dairy" },
    { label: "Bakery & Breads", value: "bakery" },
    { label: "Cold Juices", value: "beverages" },
    { label: "Organic Meat", value: "meat" },
  ];

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    // { name: "Categories", href: "/categories" },
    { name: "Collections", href: "/collections" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact", href: "/contact-us" },
  ];

  // Helper to render Category Icons in #5FA800 color
  const renderCategoryIcon = (slug: string) => {
    const iconClass = "text-[#5FA800] h-4 w-4 shrink-0";
    switch (slug) {
      case "fresh-fruits":
        return <FaAppleAlt className={iconClass} />;
      case "seafood":
        return <GiCrab className={iconClass} />;
      case "meat":
        return <FaDrumstickBite className={iconClass} />;
      case "vegetables":
        return <FaCarrot className={iconClass} />;
      case "dryfruits":
        return <GiPeanut className={iconClass} />;
      case "blackberry":
        return <GiGrapes className={iconClass} />;
      case "beverages":
        return <GiOrangeSlice className={iconClass} />;
      case "sea-fish":
        return <FaFish className={iconClass} />;
      case "summer-fruit":
        return <GiWatermelon className={iconClass} />;
      case "dairy":
        return <GiCheeseWedge className={iconClass} />;
      case "bakery":
        return <FaBreadSlice className={iconClass} />;
      case "honey":
        return <GiHoneyJar className={iconClass} />;
      default:
        return <FaSeedling className={iconClass} />;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    const queryStr = params.toString();
    router.push(queryStr ? `/shop?${queryStr}` : "/shop");
  };

  const collectionMegaCards = [
    {
      id: "fruits",
      title: "Fresh Fruits",
      image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80",
      href: "/shop?category=fresh-fruits",
    },
    {
      id: "veggies",
      title: "Fresh Vegetables",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
      href: "/shop?category=vegetables",
    },
    {
      id: "dairy",
      title: "Dairy & Cheese",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&auto=format&fit=crop&q=80",
      href: "/shop?category=dairy",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top Announcement Bar (Instantly hidden on scroll) */}
      {!isScrolled && <AnnouncementBar />}

      {/* Middle Sticky Header: Logo, Search Bar, 3 Action Icons (Account, Wishlist, Cart) */}
      <div className={`bg-white border-b border-gray-100 ${isScrolled ? "shadow-md py-3" : "py-4"}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 md:gap-8">

            {/* Brand Logo */}
            <Link href="/" className="shrink-0 flex items-center gap-2">
              <Image
                src={logoImg}
                alt="ShobPai E-Commerce"
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Search Bar Form (Simple & Clean) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-xl items-center rounded-sm border border-gray-300 bg-white overflow-hidden focus-within:border-gray-500 transition-colors"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search our store"
                className="w-full bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-hidden"
              />

              <button
                type="submit"
                className="bg-transparent text-gray-700 hover:text-gray-950 px-4 py-2.5 text-sm flex items-center justify-center transition-colors cursor-pointer"
                title="Search"
              >
                <FaSearch className="h-4 w-4" />
              </button>
            </form>

            {/* Action Controls (Account, Wishlist, Cart matching reference screenshot 1-to-1) */}
            <div className="flex items-center gap-5 sm:gap-6">
              {/* Account / Login Icon */}
              <Link
                href={userIsLoggedIn ? "/dashboard" : "/login"}
                className="text-gray-900 hover:text-[#E5A842] transition-colors p-1 flex items-center gap-1.5"
                title={userIsLoggedIn ? `My Dashboard (${user?.displayName || user?.email || "User"})` : "Sign In / Login"}
              >
                <FiUser className="h-6 w-6 stroke-[1.75]" />
                {userIsLoggedIn && isAdmin && (
                  <span className="hidden xl:inline-block px-1.5 py-0.5 bg-[#E5A842] text-gray-950 text-[9px] font-black rounded uppercase">
                    Admin
                  </span>
                )}
              </Link>

              {/* Wishlist Icon with Golden Badge */}
              <Link
                href="/wishlist"
                className="relative text-gray-900 hover:text-[#E5A842] transition-colors p-1"
                title="Wishlist"
              >
                <FiHeart className="h-6 w-6 stroke-[1.75]" />
                <span className="absolute -top-1 -right-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#E5A842] text-[10px] font-bold text-white shadow-2xs">
                  {wishlistCount}
                </span>
              </Link>

              {/* Cart Icon with Golden Badge & Drawer Trigger */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative text-gray-900 hover:text-[#E5A842] transition-colors p-1 cursor-pointer"
                title="Open Shopping Cart"
              >
                <FiShoppingBag className="h-6 w-6 stroke-[1.75]" />
                <span className="absolute -top-1 -right-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#E5A842] text-[10px] font-bold text-white shadow-2xs">
                  {cartCount}
                </span>
              </button>

              {/* Mobile Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
              </button>
            </div>

          </div>

          {/* Mobile Search input form */}
          <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden">
            <div className="flex items-center rounded-sm border border-gray-300 bg-white overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search our store"
                className="w-full bg-transparent px-3 py-2 text-xs text-gray-800 placeholder-gray-400 outline-hidden"
              />
              <button type="submit" className="bg-transparent text-gray-700 p-2.5">
                <FaSearch className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Main Navigation Bar (Instantly hidden on scroll) */}
      {!isScrolled && (
        <nav className="border-t border-gray-100 bg-[#222222] hidden md:block">
          <div className="container mx-auto px-4 relative">
            <div className="flex items-center justify-between">

              {/* Category Dropdown button with Unique Colored React Icons */}
              <div className="relative group">
                <button className="flex items-center gap-3 bg-[#F0A843] hover:bg-[#e09732] text-gray-950 font-black text-xs px-5 py-3 rounded-t-xl transition-colors cursor-pointer min-w-[240px] justify-between">
                  <div className="flex items-center gap-2">
                    <FaBars className="h-3.5 w-3.5" />
                    <span>ALL CATEGORIES</span>
                  </div>
                  <FaChevronDown className="h-3 w-3 text-gray-800" />
                </button>

                {/* Hover Dropdown Menu with Distinct Icons */}
                <div className="absolute top-full left-0 hidden group-hover:block w-60 bg-white border border-gray-100 shadow-2xl rounded-b-2xl py-2 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-800 hover:bg-amber-50/80 hover:text-[#F0A843] transition-colors border-b border-gray-50/60 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        {renderCategoryIcon(cat.slug)}
                        <span>{cat.name}</span>
                      </div>
                      <FaChevronRight className="h-2.5 w-2.5 text-gray-300 group-hover:text-[#F0A843]" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Navigation Links with Collections 3-Card Mega Dropdown */}
              <ul className="flex items-center gap-8 text-xs font-bold text-white">
                {navLinks.map((link) => {
                  if (link.name === "Collections") {
                    return (
                      <li key={link.name} className="static group/collections py-3">
                        <Link
                          href={link.href}
                          className="inline-flex items-center gap-1.5 hover:text-[#F0A843] transition-colors cursor-pointer"
                        >
                          <span>{link.name}</span>
                          <FaChevronDown className="h-2.5 w-2.5 text-gray-400 group-hover/collections:text-[#F0A843] transition-transform duration-200 group-hover/collections:rotate-180" />
                        </Link>

                        {/* Mega Menu Dropdown with 3 Full-Width Cards */}
                        <div className="absolute top-full left-0 w-full pt-1 invisible opacity-0 translate-y-1 group-hover/collections:visible group-hover/collections:opacity-100 group-hover/collections:translate-y-0 transition-all duration-200 z-50 pointer-events-none group-hover/collections:pointer-events-auto">
                          <div className="w-full bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
                            {/* 3 Cards Grid */}
                            <div className="grid grid-cols-3 gap-6">
                              {collectionMegaCards.map((card) => (
                                <Link
                                  key={card.id}
                                  href={card.href}
                                  className="group/card relative rounded-2xl overflow-hidden bg-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 block"
                                >
                                  {/* Card Image */}
                                  <div className="relative h-44 w-full overflow-hidden">
                                    <Image
                                      src={card.image}
                                      alt={card.title}
                                      fill
                                      className="object-cover group-hover/card:scale-108 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                                    {/* Category Title Only */}
                                    <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                                      <h4 className="text-base font-extrabold text-white group-hover/card:text-[#F0A843] transition-colors drop-shadow-md tracking-wide">
                                        {card.title}
                                      </h4>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="py-3 inline-block hover:text-[#F0A843] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Right promotion text */}
              <div className="text-xs font-bold text-[#F0A843] hidden lg:block">
                🌿 100% Organic Fresh Guarantee
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <ul className="space-y-2 text-sm font-semibold text-gray-800">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#F0A843]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </header>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaChartPie,
  FaShoppingBag,
  FaBox,
  FaUserCircle,
  FaStore,
  FaBars,
  FaTimes,
  FaBell,
  FaSearch,
  FaSignOutAlt,
  FaChevronRight,
  FaEnvelope,
  FaFolder,
  FaUsers,
  FaChartLine,
  FaCog,
  FaCreditCard,
  FaStar,
  FaHeart,
} from "react-icons/fa";
import logoImg from "@/public/logo/sobpai-nav_logo.svg";
import { useCart } from "@/context/CartContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminItems = [
    { name: "Overview", href: "/dashboard", icon: FaChartPie },
    { name: "Products", href: "/dashboard/admin", icon: FaShoppingBag },
    { name: "Categories", href: "/dashboard/categories", icon: FaFolder },
    { name: "Customers", href: "/dashboard/customers", icon: FaUsers },
    { name: "Analytics", href: "/dashboard/analytics", icon: FaChartLine },
  ];

  const userItems = [
    { name: "Orders", href: "/dashboard/orders", icon: FaBox },
    { name: "Cart", href: "/cart", icon: FaShoppingBag },
    { name: "Payments", href: "/dashboard/payments", icon: FaCreditCard },
    { name: "Reviews", href: "/dashboard/reviews", icon: FaStar },
    { name: "Wishlist", href: "/dashboard/wishlist", icon: FaHeart },
    { name: "Account", href: "/dashboard/account", icon: FaUserCircle },
    { name: "Settings", href: "/dashboard/settings", icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-gray-50/80 flex flex-col md:flex-row">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-64 bg-gray-900 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Top Logo */}
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logoImg}
                alt="ShobPai"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#E5A842] text-gray-950 px-2 py-0.5 rounded-md">
                Admin
              </span>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white p-1 cursor-pointer"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
            {/* Admin Management Section */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E5A842] px-3 block mb-2">
                Admin Management
              </span>
              <ul className="space-y-1 text-xs font-bold">
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                          isActive
                            ? "bg-[#E5A842] text-gray-950 font-black shadow-md"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${isActive ? "text-gray-950" : "text-[#E5A842]"}`} />
                          <span>{item.name}</span>
                        </div>
                        <FaChevronRight className={`h-2.5 w-2.5 opacity-60 ${isActive ? "text-gray-950" : "text-gray-500"}`} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* User Account Section */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5FA800] px-3 block mb-2">
                Customer Portal
              </span>
              <ul className="space-y-1 text-xs font-bold">
                {userItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                          isActive
                            ? "bg-[#5FA800] text-white font-black shadow-md"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#5FA800]"}`} />
                          <span>{item.name}</span>
                        </div>
                        <FaChevronRight className={`h-2.5 w-2.5 opacity-60 ${isActive ? "text-white" : "text-gray-500"}`} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Storefront Link */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 px-3 block mb-2">
                Online Store
              </span>
              <ul className="space-y-1 text-xs font-bold">
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
                  >
                    <FaStore className="h-4 w-4 text-[#5FA800]" />
                    <span>Store</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* User Profile Pill at Sidebar Bottom */}
          <div className="p-4 border-t border-gray-800 bg-gray-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#E5A842] text-gray-950 font-black text-sm flex items-center justify-center shadow-xs">
                {user ? user.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-tight">
                  {user ? user.name : "Admin User"}
                </span>
                <span className="text-[10px] font-medium text-gray-400">
                  {user ? user.email : "admin@shobpai.com"}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-gray-400 hover:text-red-400 p-2 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <FaSignOutAlt className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar / Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-2xs">
          {/* Mobile Sidebar Toggle & Search Bar */}
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <FaBars className="h-4 w-4" />
            </button>

            {/* Dashboard Search */}
            <div className="relative flex-1 hidden sm:block">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, products, customers..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 outline-hidden focus:border-[#E5A842] focus:ring-2 focus:ring-[#E5A842]/30 transition-all"
              />
            </div>
          </div>

          {/* Right Header Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 hover:bg-amber-50 hover:text-[#E5A842] hover:border-[#E5A842]/40 transition-colors cursor-pointer" title="Notifications">
              <FaBell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-2xs">
                3
              </span>
            </button>

            {/* Messages Icon */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 hover:bg-amber-50 hover:text-[#E5A842] hover:border-[#E5A842]/40 transition-colors cursor-pointer" title="Messages">
              <FaEnvelope className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E5A842] text-[9px] font-bold text-gray-950 shadow-2xs">
                2
              </span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

            {/* Admin Avatar & Greeting */}
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#E5A842] to-amber-300 text-gray-950 font-black text-xs flex items-center justify-center shadow-xs">
                {user ? user.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-xs font-extrabold text-gray-900 leading-tight">
                  {user ? user.name : "Admin User"}
                </span>
                <span className="text-[10px] font-bold text-[#5FA800]">Online Manager</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

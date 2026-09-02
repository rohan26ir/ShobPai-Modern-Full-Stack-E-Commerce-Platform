"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  FaShieldAlt,
  FaLock,
  FaSpinner,
  FaUserCheck,
} from "react-icons/fa";
import logoImg from "@/public/logo/logo_shobpai.webp";
import { useAuth } from "@/context/AuthContext";
import LoadingCredentials from "@/components/LoadingCredentials";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isAdmin, loading, logout, setManualRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin routes definition
  const adminItems = [
    { name: "Overview", href: "/dashboard", icon: FaChartPie },
    { name: "Products", href: "/dashboard/admin", icon: FaShoppingBag },
    { name: "Categories", href: "/dashboard/categories", icon: FaFolder },
    { name: "Customers", href: "/dashboard/customers", icon: FaUsers },
    { name: "Analytics", href: "/dashboard/analytics", icon: FaChartLine },
    { name: "Account Profile", href: "/dashboard/account", icon: FaUserCircle },
  ];

  // Customer Portal routes definition
  const userItems = [
    { name: "My Orders", href: "/dashboard/orders", icon: FaBox },
    { name: "My Wishlist", href: "/dashboard/wishlist", icon: FaHeart },
    { name: "My Store", href: "/dashboard/my-store", icon: FaStore },
    { name: "Shopping Cart", href: "/cart", icon: FaShoppingBag },
    { name: "Saved Payments", href: "/dashboard/payments", icon: FaCreditCard },
    { name: "My Reviews", href: "/dashboard/reviews", icon: FaStar },
    { name: "Account Profile", href: "/dashboard/account", icon: FaUserCircle },
  ];

  // Determine if current route is an admin-only path
  const isAdminOnlyRoute = [
    "/dashboard/admin",
    "/dashboard/categories",
    "/dashboard/customers",
    "/dashboard/analytics",
  ].some((route) => pathname.startsWith(route));

  // If loading authentication state
  if (loading) {
    return <LoadingCredentials />;
  }

  // If unauthenticated (Guest)
  if (!user && role === "GUEST") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full text-center space-y-5">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 text-[#E5A842] border border-amber-200 flex items-center justify-center mx-auto">
            <FaLock className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">
              Authentication Required
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Please sign in with your Firebase credentials to access the ShobPai dashboard.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="flex-1 rounded-2xl bg-[#E5A842] py-3 text-xs font-black text-gray-950 shadow-md hover:bg-[#d49633] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Go to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If regular user attempts to access an admin-only route
  const showAdminRestrictedWarning = !isAdmin && isAdminOnlyRoute;

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
        className={`fixed md:sticky top-0 z-50 h-screen w-64 bg-gray-900 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
              <span
                className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isAdmin
                  ? "bg-[#E5A842] text-gray-950"
                  : "bg-[#5FA800] text-white"
                  }`}
              >
                {isAdmin ? "Admin" : "Customer"}
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
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {/* Admin Section (Shown for Admins) */}
            {isAdmin && (
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
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${isActive
                            ? "bg-[#E5A842] text-gray-950 font-black shadow-md"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`h-4 w-4 ${isActive ? "text-gray-950" : "text-[#E5A842]"
                                }`}
                            />
                            <span>{item.name}</span>
                          </div>
                          <FaChevronRight
                            className={`h-2.5 w-2.5 opacity-60 ${isActive ? "text-gray-950" : "text-gray-500"
                              }`}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Customer Portal Section (Hidden for Admins) */}
            {!isAdmin && (
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
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${isActive
                            ? "bg-[#5FA800] text-white font-black shadow-md"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`h-4 w-4 ${isActive ? "text-white" : "text-[#5FA800]"
                                }`}
                            />
                            <span>{item.name}</span>
                          </div>
                          <FaChevronRight
                            className={`h-2.5 w-2.5 opacity-60 ${isActive ? "text-white" : "text-gray-500"
                              }`}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

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
                    <span>Back to Store</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* User Profile Pill at Sidebar Bottom */}
          <div className="p-4 border-t border-gray-800 bg-gray-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-9 w-9 rounded-full font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${isAdmin
                  ? "bg-[#E5A842] text-gray-950"
                  : "bg-[#5FA800] text-white"
                  }`}
              >
                {user?.displayName
                  ? user.displayName.slice(0, 2).toUpperCase()
                  : user?.email
                    ? user.email.slice(0, 2).toUpperCase()
                    : "US"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white leading-tight truncate">
                  {user?.displayName || (isAdmin ? "Admin User" : "Customer")}
                </span>
                <span className="text-[10px] font-medium text-gray-400 truncate">
                  {user?.email || (user?.phoneNumber ? user.phoneNumber : "firebase-user")}
                </span>
              </div>
            </div>

            <button
              onClick={async () => {
                await logout();
                router.push("/login");
              }}
              className="text-gray-400 hover:text-red-400 p-2 transition-colors cursor-pointer shrink-0"
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

            {/* Search bar removed per user request */}
          </div>

          {/* Right Header Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Status Pill */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${isAdmin
                ? "bg-amber-50 text-amber-900 border-amber-200"
                : "bg-emerald-50 text-emerald-900 border-emerald-200"
                }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${isAdmin ? "bg-[#E5A842]" : "bg-[#5FA800]"
                  }`}
              />
              <span>{isAdmin ? "Admin Console" : "Customer Portal"}</span>
            </div>

            {/* Notification Bell */}
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 hover:bg-amber-50 hover:text-[#E5A842] hover:border-[#E5A842]/40 transition-colors cursor-pointer"
              title="Notifications"
            >
              <FaBell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-2xs">
                3
              </span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

            {/* Avatar & User Profile */}
            <div className="flex items-center gap-2.5">
              <div
                className={`relative h-9 w-9 rounded-full font-black text-xs flex items-center justify-center shadow-xs overflow-hidden shrink-0 ${isAdmin
                  ? "bg-gradient-to-tr from-[#E5A842] to-amber-300 text-gray-950"
                  : "bg-gradient-to-tr from-[#5FA800] to-emerald-300 text-white"
                  }`}
              >
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : user?.displayName ? (
                  user.displayName.slice(0, 2).toUpperCase()
                ) : user?.email ? (
                  user.email.slice(0, 2).toUpperCase()
                ) : (
                  "US"
                )}
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-xs font-extrabold text-gray-900 leading-tight">
                  {user?.displayName || (isAdmin ? "Admin User" : "Customer")}
                </span>
                <span
                  className={`text-[10px] font-bold ${isAdmin ? "text-[#E5A842]" : "text-[#5FA800]"
                    }`}
                >
                  {isAdmin ? "System Administrator" : "Verified Customer"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body or Access Denied Screen */}
        <main className="flex-1 p-4 md:p-8">
          {showAdminRestrictedWarning ? (
            <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-red-100 shadow-xl text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-red-50 text-red-500 border border-red-200 flex items-center justify-center mx-auto">
                <FaShieldAlt className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                Administrator Access Required
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                The section you are attempting to view (<strong>{pathname}</strong>) requires administrative clearance. You are currently signed in with standard Customer privileges.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E5A842] text-gray-950 font-black text-xs hover:bg-[#d49633] transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors"
                >
                  Go to My Orders
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

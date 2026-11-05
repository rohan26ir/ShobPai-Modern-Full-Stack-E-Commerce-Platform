"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars, FaShieldAlt, FaLock } from "react-icons/fa";
import {
  Moon,
  Sun,
  Bell,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoadingCredentials from "@/components/LoadingCredentials";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, role, isAdmin, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isPinned, setIsPinned] = useState(true); // By default show sidebar expanded

  // Sync dark mode class on initial mount & pin preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);

      const savedPin = localStorage.getItem("shobpai_sidebar_pinned");
      if (savedPin !== null) {
        setIsPinned(savedPin === "true");
      } else {
        // By default show sidebar expanded
        setIsPinned(true);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (typeof document !== "undefined") {
        if (next) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return next;
    });
  };

  const handleSetIsPinned = (pinned: boolean) => {
    setIsPinned(pinned);
    if (typeof window !== "undefined") {
      localStorage.setItem("shobpai_sidebar_pinned", String(pinned));
    }
  };

  // Freeze body scrolling on mobile when sidebar drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Determine if current route is an admin-only path
  const isAdminOnlyRoute = [
    "/dashboard/products",
    "/dashboard/product",
    "/dashboard/products/create",
    "/dashboard/product-add",
    "/product-add",
    "/dashboard/admin",
    "/dashboard/categories",
    "/dashboard/offers",
    "/dashboard/customers",
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
              className="flex-1 rounded-2xl bg-[#E5A842] py-3 text-xs font-black text-gray-950 shadow-md hover:bg-[#d49633] transition-colors text-center"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors text-center"
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
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 transition-colors duration-200">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating Card Sidebar Component (with Mini Collapsed Rail, Hover Expansion & Tooltips) */}
      <Sidebar
        user={user}
        isAdmin={isAdmin}
        logout={logout}
        mobileOpen={sidebarOpen}
        setMobileOpen={setSidebarOpen}
        isPinned={isPinned}
        setIsPinned={handleSetIsPinned}
      />

      {/* Main Content Column with dynamic padding-left to smoothly pair with the Floating Sidebar */}
      <div
        className={`flex-1 min-w-0 flex flex-col min-h-screen transition-[padding] duration-300 ease-in-out ${
          isPinned ? "md:pl-72" : "md:pl-28"
        }`}
      >
        {/* Sticky Top Header with Backdrop Blur */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between shadow-2xs transition-colors duration-200">
          {/* Mobile Sidebar Hamburger Toggle & Desktop Sidebar Toggle + Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 transition-colors cursor-pointer"
              aria-label="Open Sidebar"
            >
              <FaBars className="h-4 w-4" />
            </button>

            {/* Desktop Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => handleSetIsPinned(!isPinned)}
              title={isPinned ? "Collapse sidebar" : "Expand sidebar"}
              className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={isPinned ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isPinned ? (
                <PanelLeftClose className="w-4 h-4 text-[#ff6c2f]" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
            </button>

            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:inline">
              WELCOME!
            </span>
          </div>

          {/* Right Header Quick Action Cluster */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
              className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                type="button"
                title="Notifications"
                className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
              </button>
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                3
              </span>
            </div>

            {/* Settings */}
            <Link
              href="/dashboard/account"
              title="Dashboard Settings"
              className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* User Profile Avatar with Initial & Green Dot */}
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>
                    {user?.displayName?.[0]?.toUpperCase() ||
                      user?.email?.[0]?.toUpperCase() ||
                      "A"}
                  </span>
                )}
              </div>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900" />
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-3 sm:p-4 md:p-8 min-w-0 max-w-full">
          {showAdminRestrictedWarning ? (
            <div className="max-w-xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-red-100 dark:border-red-950/40 shadow-xl text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 border border-red-200 dark:border-red-800/40 flex items-center justify-center mx-auto">
                <FaShieldAlt className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Administrator Access Required
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The section you are attempting to view (<strong>{pathname}</strong>) requires administrative clearance. You are currently signed in with standard Customer privileges.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#ff6c2f] hover:bg-[#ea580c] text-white font-bold text-xs transition-colors cursor-pointer text-center shadow-xs"
                >
                  Return to Dashboard
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-center"
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

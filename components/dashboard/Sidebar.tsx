"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderKanban,
  Boxes,
  Tag,
  Users,
  UserCircle,
  MapPin,
  Package,
  Heart,
  ShoppingCart,
  Store,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
  X,
  Sliders,
  type LucideIcon,
} from "lucide-react";

// ============================================================================
// Data-Driven Navigation Types & Configuration
// ============================================================================

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: "Overview",
    items: [
      { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    groupTitle: "Catalog & Inventory",
    items: [
      { title: "Products", href: "/dashboard/products", icon: ShoppingBag },
      { title: "Categories", href: "/dashboard/categories", icon: FolderKanban },
      { title: "Inventory", href: "/dashboard/inventory", icon: Boxes },
    ],
  },
  {
    groupTitle: "Sales & Transactions",
    items: [
      { title: "Orders", href: "/dashboard/orders", icon: Package },
      { title: "Offers & Coupons", href: "/dashboard/offers", icon: Tag },
    ],
  },
  {
    groupTitle: "Customer Management",
    items: [
      { title: "Customers", href: "/dashboard/customers", icon: Users },
    ],
  },
  {
    groupTitle: "System & Settings",
    items: [
      { title: "Store Setup", href: "/dashboard/setup", icon: Sliders },
      { title: "Account Profile", href: "/dashboard/account", icon: UserCircle },
    ],
  },
];

export const CUSTOMER_NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: "Overview",
    items: [
      { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    groupTitle: "Shopping & Orders",
    items: [
      { title: "My Orders", href: "/dashboard/user/orders", icon: Package },
      { title: "Shopping Cart", href: "/dashboard/cart", icon: ShoppingCart },
      { title: "My Wishlist", href: "/dashboard/wishlist", icon: Heart },
    ],
  },
  {
    groupTitle: "Account & Preferences",
    items: [
      { title: "Delivery Addresses", href: "/dashboard/user/addresses", icon: MapPin },
      { title: "Account & Security", href: "/dashboard/user/settings", icon: UserCircle },
    ],
  },
];

const STOREFRONT_ITEM: NavItem = {
  title: "Back to Store",
  href: "/",
  icon: Store,
};

// ============================================================================
// Component Props
// ============================================================================

interface SidebarProps {
  user: any;
  isAdmin: boolean;
  logout: () => Promise<void>;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
}

export function Sidebar({
  user,
  isAdmin,
  logout,
  mobileOpen,
  setMobileOpen,
  isPinned,
  setIsPinned,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navGroups = isAdmin ? ADMIN_NAV_GROUPS : CUSTOMER_NAV_GROUPS;

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE OFF-CANVAS DRAWER (< md)                                        */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-r border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <div className="h-8 w-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center border border-orange-100 dark:border-orange-900/40">
              <Store className="w-4 h-4 text-[#ff6c2f]" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
              shob<span className="text-[#ff6c2f]">Pai</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Categorized Nav Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-5 [scrollbar-width:thin]">
          {navGroups.map((group, groupIdx) => (
            <div key={group.groupTitle} className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 block mb-1.5">
                {group.groupTitle}
              </span>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-[#ff6c2f] text-white shadow-md shadow-orange-500/20"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.title}</span>
                        </div>
                        {item.badge ? (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-100 dark:bg-orange-900/60 text-[#ff6c2f]">
                            {item.badge}
                          </span>
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Storefront Section */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 block mb-1.5">
              Storefront
            </span>
            <Link
              href={STOREFRONT_ITEM.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all"
            >
              <Store className="w-4 h-4 text-[#ff6c2f]" />
              <span>{STOREFRONT_ITEM.title}</span>
            </Link>
          </div>
        </nav>

        {/* Mobile User Bottom Bar */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#ff6c2f] to-orange-400 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="truncate text-xs">
              <p className="font-bold truncate text-slate-900 dark:text-white">
                {user?.displayName || (isAdmin ? "Admin User" : "Customer")}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || "Signed In"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. DESKTOP FLOATING CARD SIDEBAR (>= md)                                   */}
      {/*    - Expanded: w-64 full categorized navigation + collapse toggle          */}
      {/*    - Collapsed: w-20 rail, centered compact logo, visual divider lines,    */}
      {/*      and high-contrast floating tooltips on hover                          */}
      {/* ========================================================================= */}
      <aside
        className={`hidden md:flex fixed top-3 left-3 bottom-3 z-40 flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-black/50 transition-all duration-300 ease-in-out select-none ${
          isPinned ? "w-64 overflow-hidden" : "w-20 overflow-visible"
        }`}
        aria-label="Desktop Dashboard Sidebar"
      >
        <div className={`flex flex-col h-full min-h-0 ${!isPinned ? "overflow-visible" : ""}`}>
          {/* ======================================================================= */}
          {/* A. ADAPTIVE SIDEBAR HEADER                                              */}
          {/*    - Expanded: Brand Logo + Text on Left, Collapse Button on Right      */}
          {/*    - Collapsed: Center Compact Logo only (NO expand icon in header)      */}
          {/*                 Clicking compact logo reopens / expands the sidebar     */}
          {/* ======================================================================= */}
          <div
            className={`h-16 px-4 flex items-center border-b border-slate-100 dark:border-slate-800/80 shrink-0 ${
              isPinned ? "justify-between" : "justify-center"
            }`}
          >
            {isPinned ? (
              <>
                {/* Expanded: Full Brand Logo + Name */}
                <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
                  <div className="h-9 w-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-900/40">
                    <Store className="w-5 h-5 text-[#ff6c2f]" />
                  </div>
                  <div className="flex flex-col whitespace-nowrap">
                    <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                      shob<span className="text-[#ff6c2f]">Pai</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Dashboard</span>
                  </div>
                </Link>

                {/* Expanded: Collapse Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsPinned(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                  title="Collapse sidebar"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </>
            ) : (
              /* Collapsed: Centered Compact Logo (Click to expand, NO hover flyout/tooltip) */
              <button
                type="button"
                onClick={() => setIsPinned(true)}
                className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6c2f] flex items-center justify-center border border-orange-100 dark:border-orange-900/40 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-all cursor-pointer"
                title="Click to expand sidebar"
                aria-label="Expand sidebar"
              >
                <Store className="w-5 h-5 text-[#ff6c2f]" />
              </button>
            )}
          </div>

          {/* ======================================================================= */}
          {/* B. CATEGORIZED NAVIGATION LINKS AREA                                    */}
          {/*    - Expanded: Group Titles with Uppercase Headers                      */}
          {/*    - Collapsed: Divider Lines between Groups & Flyout Card on Hover     */}
          {/* ======================================================================= */}
          <nav
            className={`flex-1 px-3 py-3 space-y-4 ${
              isPinned
                ? "overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#94a3b8_transparent]"
                : "overflow-visible"
            }`}
          >
            {navGroups.map((group, groupIdx) => (
              <div key={group.groupTitle} className="space-y-1">
                {/* Section Header or Divider Line */}
                {isPinned ? (
                  /* Expanded: Accessible Section Title */
                  <div className="h-5 px-3 flex items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block whitespace-nowrap">
                      {group.groupTitle}
                    </span>
                  </div>
                ) : (
                  /* Collapsed: Visual Divider Line (omitted before very first group) */
                  groupIdx > 0 && (
                    <div className="py-1 px-2">
                      <hr className="border-t border-slate-200/70 dark:border-slate-800/80" />
                    </div>
                  )
                )}

                {/* Group Items */}
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    // -----------------------------------------------------------
                    // B1. Collapsed Mode: Dual-layer Icon + Flyout Card on Hover
                    // -----------------------------------------------------------
                    if (!isPinned) {
                      return (
                        <li key={item.href} className="relative group/navitem flex justify-center">
                          {/* Static Rail Icon (Fits inside w-20 rail) */}
                          <Link
                            href={item.href}
                            className={`h-11 w-12 rounded-xl flex items-center justify-center transition-all ${
                              isActive
                                ? "bg-[#ff6c2f] text-white shadow-md shadow-orange-500/25 font-bold"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/70"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 ${
                                isActive ? "text-white" : "text-slate-600 dark:text-slate-400"
                              }`}
                            />
                          </Link>

                          {/* Floating Flyout Card: Opens that menu with Icon + Name + Chevron */}
                          <Link
                            href={item.href}
                            className={`absolute left-1 top-0 h-11 w-56 px-3.5 rounded-xl z-50 flex items-center justify-between transition-all duration-200 pointer-events-none group-hover/navitem:pointer-events-auto opacity-0 group-hover/navitem:opacity-100 translate-x-2 group-hover/navitem:translate-x-0 shadow-lg ${
                              isActive
                                ? "bg-[#ff6c2f] text-white font-bold border border-[#ff6c2f] shadow-orange-500/20"
                                : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:text-[#ff6c2f] dark:hover:text-[#ff6c2f] border border-slate-200/90 dark:border-slate-800 shadow-slate-200/50 dark:shadow-black/50"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Icon
                                className={`w-4 h-4 shrink-0 ${
                                  isActive ? "text-white" : "text-[#ff6c2f]"
                                }`}
                              />
                              <span className="text-xs font-bold whitespace-nowrap truncate">
                                {item.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {item.badge && (
                                <span
                                  className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                                    isActive
                                      ? "bg-white/20 text-white"
                                      : "bg-orange-100 dark:bg-orange-950/60 text-[#ff6c2f]"
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                              <ChevronRight
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isActive ? "text-white/80" : "text-slate-400"
                                }`}
                              />
                            </div>
                          </Link>
                        </li>
                      );
                    }

                    // -----------------------------------------------------------
                    // B2. Expanded Mode: Full Width Row with Active Indicator
                    // -----------------------------------------------------------
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center justify-between px-3 h-10 rounded-xl transition-all ${
                            isActive
                              ? "bg-[#ff6c2f] text-white shadow-md shadow-orange-500/25 font-bold"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/70"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? "text-white" : "text-slate-500 dark:text-slate-400"
                              }`}
                            />
                            <span className="text-xs font-semibold whitespace-nowrap truncate">
                              {item.title}
                            </span>
                          </div>

                          {item.badge ? (
                            <span
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-orange-100 dark:bg-orange-950/60 text-[#ff6c2f]"
                              }`}
                            >
                              {item.badge}
                            </span>
                          ) : (
                            <ChevronRight
                              className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                                isActive ? "text-white" : "text-slate-400 opacity-60"
                              }`}
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {/* Visual Separation for Storefront */}
            {isPinned ? (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                <div className="h-5 px-3 flex items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block whitespace-nowrap">
                    Storefront
                  </span>
                </div>
                <Link
                  href={STOREFRONT_ITEM.href}
                  className="flex items-center justify-between px-3 h-10 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Store className="w-4 h-4 text-[#ff6c2f] shrink-0" />
                    <span className="text-xs font-semibold whitespace-nowrap truncate">
                      {STOREFRONT_ITEM.title}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-60 shrink-0" />
                </Link>
              </div>
            ) : (
              <div className="pt-1">
                <div className="py-1 px-2">
                  <hr className="border-t border-slate-200/70 dark:border-slate-800/80" />
                </div>
                <div className="relative group/storeitem flex justify-center">
                  {/* Static Rail Icon */}
                  <Link
                    href={STOREFRONT_ITEM.href}
                    className="h-11 w-12 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition-all"
                  >
                    <Store className="w-4 h-4 text-[#ff6c2f]" />
                  </Link>

                  {/* Floating Flyout Card for Storefront */}
                  <Link
                    href={STOREFRONT_ITEM.href}
                    className="absolute left-1 top-0 h-11 w-56 px-3.5 rounded-xl z-50 flex items-center justify-between transition-all duration-200 pointer-events-none group-hover/storeitem:pointer-events-auto opacity-0 group-hover/storeitem:opacity-100 translate-x-2 group-hover/storeitem:translate-x-0 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:text-[#ff6c2f] dark:hover:text-[#ff6c2f] border border-slate-200/90 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-black/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Store className="w-4 h-4 text-[#ff6c2f] shrink-0" />
                      <span className="text-xs font-bold whitespace-nowrap truncate">
                        {STOREFRONT_ITEM.title}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </Link>
                </div>
              </div>
            )}
          </nav>

          {/* ======================================================================= */}
          {/* C. BOTTOM RAIL: COLLAPSED EXPAND TRIGGER & USER PROFILE                 */}
          {/* ======================================================================= */}
          {!isPinned && (
            <div className="px-3 py-2 flex justify-center">
              <button
                type="button"
                onClick={() => setIsPinned(true)}
                className="h-8 w-11 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* User Profile Footer */}
          <div
            className={`p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 shrink-0 ${
              !isPinned ? "relative group/user flex justify-center" : ""
            }`}
          >
            {isPinned ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
                  <div className="relative shrink-0">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#ff6c2f] to-orange-400 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                      {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">
                      {user?.displayName || (isAdmin ? "Admin User" : "Customer")}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 truncate">
                      {user?.email || "Authenticated"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Collapsed Mode: Centered Avatar */}
                <div className="relative cursor-pointer">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#ff6c2f] to-orange-400 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                </div>

                {/* Popout User Card on Hover */}
                <div className="absolute left-full bottom-2 ml-3 w-56 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl z-50 pointer-events-none group-hover/user:pointer-events-auto opacity-0 group-hover/user:opacity-100 -translate-x-1 group-hover/user:translate-x-0 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="truncate text-xs">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {user?.displayName || (isAdmin ? "Admin User" : "Customer")}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {user?.email || "Authenticated"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

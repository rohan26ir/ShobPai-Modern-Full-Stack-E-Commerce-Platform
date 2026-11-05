"use client";

import React, { useState } from "react";
import {
  Moon,
  Sun,
  Bell,
  Settings,
  Clock,
  Search,
} from "lucide-react";

interface LarkonTopBarProps {
  userDisplayName?: string | null;
  userPhotoURL?: string | null;
}

export function LarkonTopBar({ userDisplayName, userPhotoURL }: LarkonTopBarProps) {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 px-1">
      {/* Left: Clean Heading */}
      <div>
        <h1 className="text-sm sm:text-base font-extrabold tracking-wider text-slate-700 dark:text-slate-200 uppercase">
          WELCOME!
        </h1>
      </div>

      {/* Right: Quick Action Controls + Search */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          title="Toggle Dark Mode"
          className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications with Badge */}
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
        <button
          type="button"
          title="Dashboard Settings"
          className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Activity / Clock */}
        <button
          type="button"
          title="Activity History"
          className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Clock className="w-4 h-4" />
        </button>

        {/* User Profile Avatar */}
        <div className="relative">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 ring-2 ring-slate-100 dark:ring-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
            {userPhotoURL ? (
              <img
                src={userPhotoURL}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{userDisplayName?.[0]?.toUpperCase() || "A"}</span>
            )}
          </div>
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900" />
        </div>

        {/* Search Pill Input */}
        <div className="relative w-full sm:w-44 md:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full h-8 pl-8 pr-3 text-xs rounded-full bg-slate-100/90 dark:bg-slate-800 border-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-400 transition-all"
          />
        </div>
      </div>
    </div>
  );
}

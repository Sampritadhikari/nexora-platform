"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  User as UserIcon,
  LogOut,
  Settings,
  Globe,
  Server,
  FileText,
  LifeBuoy,
  Shield,
  ChevronDown,
  Sun,
  Moon,
  ExternalLink,
  Sparkles
} from "lucide-react";

export function UserProfileDropdown() {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  const avatarUrl = user.avatar_url || user.picture;
  const isGoogleAccount =
    !!avatarUrl?.includes("googleusercontent.com") ||
    user.email?.endsWith("@gmail.com");

  // Get user initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button with Profile Picture */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={`group flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border transition-all duration-200 cursor-pointer ${
          isOpen
            ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-400/30"
            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400 hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800/80"
        }`}
      >
        {/* Avatar Image or Initials */}
        <div className="relative flex-shrink-0">
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              alt={user.name || "User"}
              onError={() => setImgError(true)}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-500/40 group-hover:ring-emerald-500 transition-all shadow-sm"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs shadow-sm ring-2 ring-emerald-500/30">
              {getInitials(user.name)}
            </div>
          )}

          {/* Online Active Status Beacon */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
          </span>
        </div>

        {/* User First Name (Visible on medium screens and up) */}
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight max-w-[110px] truncate">
            {user.name?.split(" ")[0] || "Account"}
          </span>
          <span className="text-[10px] text-slate-400 font-medium leading-none">
            {isAdmin ? "Admin" : "Customer"}
          </span>
        </div>

        {/* Dropdown Chevron */}
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-emerald-600" : "group-hover:text-slate-600"
          }`}
        />
      </button>

      {/* Luxury Profile Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-72 origin-top-right rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-2 shadow-2xl shadow-slate-900/15 ring-1 ring-black/5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* User Profile Header Card */}
          <div className="p-3 mb-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="relative shrink-0">
              {avatarUrl && !imgError ? (
                <img
                  src={avatarUrl}
                  alt={user.name || "User"}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-emerald-500/50 shadow-md"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-sm shadow-md">
                  {getInitials(user.name)}
                </div>
              )}
              {isGoogleAccount && (
                <div
                  className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow ring-1 ring-slate-200 dark:ring-slate-700"
                  title="Signed in with Google"
                >
                  <svg className="h-2.5 w-2.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                {user.name || "Nexora Member"}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {user.email}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {isAdmin ? "Admin" : "Active Tenant"}
                </span>
                {isGoogleAccount && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    • Google Linked
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-0.5">
            <Link
              href={isAdmin ? "/admin" : "/dashboard"}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>{isAdmin ? "Admin Console" : "Infrastructure Dashboard"}</span>
            </Link>

            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <UserIcon className="h-4 w-4 text-blue-500" />
              <span>My Profile & Contact</span>
            </Link>

            <Link
              href="/dashboard/domains"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <Globe className="h-4 w-4 text-teal-500" />
              <span>Active Domains</span>
            </Link>

            <Link
              href="/dashboard/hosting"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <Server className="h-4 w-4 text-indigo-500" />
              <span>Cloud Hosting Packages</span>
            </Link>

            <Link
              href="/dashboard/invoices"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <FileText className="h-4 w-4 text-amber-500" />
              <span>Invoices & Billing</span>
            </Link>

            <Link
              href="/dashboard/support"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <LifeBuoy className="h-4 w-4 text-rose-500" />
              <span>Support & Help Tickets</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

          {/* Additional Settings & Quick Toggle */}
          <div className="space-y-0.5">
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <Settings className="h-4 w-4 text-slate-500" />
              <span>Account & Security Settings</span>
            </Link>

            {/* Quick Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-500" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600" />
                )}
                <span>Theme: {theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {theme === "dark" ? "Switch Light" : "Switch Dark"}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

          {/* Logout Option */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-rose-500" />
            <span>Sign Out of Nexora</span>
          </button>
        </div>
      )}
    </div>
  );
}

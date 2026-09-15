"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Server,
  ShoppingCart,
  FileText,
  RefreshCw,
  LifeBuoy,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { BRAND } from "@/config/brand";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { BrandLogo } from "./BrandLogo";

export function CustomerSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Domains", href: "/dashboard/domains", icon: Globe },
    { label: "Hosting", href: "/dashboard/hosting", icon: Server },
    { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
    { label: "Renewals", href: "/dashboard/renewals", icon: RefreshCw },
    { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#080B0A] flex flex-col justify-between min-h-screen">
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800">
          <BrandLogo href="/" size="sm" subtitle="Customer Console" />
          <ThemeToggle />
        </div>

        {/* User Card */}
        <div className="p-3.5 mx-3 my-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Customer Console
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
            {user?.name || "Customer Account"}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {user?.email}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? "bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

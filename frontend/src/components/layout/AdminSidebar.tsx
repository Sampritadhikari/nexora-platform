"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Layers,
  LifeBuoy,
  Cpu,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { BRAND } from "@/config/brand";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "../ui/Badge";
import { BrandLogo } from "./BrandLogo";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Products & TLDs", href: "/admin/products", icon: Layers },
    { label: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
    { label: "System Status", href: "/admin/system", icon: Cpu },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#080B0A] flex flex-col justify-between min-h-screen">
      <div>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <BrandLogo href="/admin" size="md" subtitle="Admin Console" />
          <ThemeToggle />
        </div>

        {/* Admin Info */}
        <div className="p-4 mx-3 my-3 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40">
          <p className="text-xs font-semibold text-red-900 dark:text-red-300 truncate">
            {user?.name || "System Admin"}
          </p>
          <p className="text-[11px] text-red-700/80 dark:text-red-400/80 truncate">
            {user?.email}
          </p>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold"
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

      {/* Bottom */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit Admin to Store</span>
        </Link>
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

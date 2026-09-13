"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Globe, Server, ArrowRight, ShieldCheck, User } from "lucide-react";
import { BRAND } from "@/config/brand";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/Button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  const navLinks = [
    { label: "Domains", href: "/domains" },
    { label: "Hosting", href: "/hosting" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#080B0A]/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-md shadow-brand-600/30 group-hover:bg-brand-700 transition-all">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {BRAND.name}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative rounded-lg px-3.5 py-1.5 text-sm font-semibold border border-transparent text-slate-800 dark:text-slate-300 hover:text-black dark:hover:text-white hover:border-brand-500/70 bg-transparent hover:shadow-[0_0_18px_-2px_rgba(16,185,129,0.35)] transition-all duration-200"
                >
                  {/* Glowing bottom stroke line - ONLY on mouse hover */}
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-transparent group-hover:bg-brand-500 dark:group-hover:bg-brand-400 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.9)] transition-all duration-200" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1211] text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-[0_0_18px_-2px_rgba(16,185,129,0.4)] transition-all duration-200"
            aria-label="View Cart"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-md shadow-brand-500/40 animate-pulse">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* Auth Controls */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href={isAdmin ? "/admin" : "/dashboard"}>
                <Button variant="outline" size="sm" className="gap-2 hover:border-brand-500/50 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)] transition-all duration-200">
                  <User className="h-3.5 w-3.5" />
                  {isAdmin ? "Admin Console" : "Dashboard"}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 hover:shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)] transition-all duration-200">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] transition-all duration-200">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-1.5 shadow-md shadow-brand-500/20 hover:shadow-[0_0_22px_-2px_rgba(16,185,129,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full">
                    {isAdmin ? "Admin Console" : "Customer Dashboard"}
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

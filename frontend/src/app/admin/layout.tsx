"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, ArrowRight, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Allow unrestricted access to the dedicated admin login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/admin/login");
      }
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
        <div className="space-y-4 text-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-red-500 border-t-transparent mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Verifying Administrative Privileges...</p>
        </div>
      </div>
    );
  }

  // If unauthenticated, render nothing while redirecting to admin login
  if (!isAuthenticated) {
    return null;
  }

  // STRICT BARRIER: If user is authenticated as a CUSTOMER, strictly deny access to admin console
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-4 py-12 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-slate-900/90 p-8 text-center shadow-2xl shadow-red-950/40 backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 mb-5">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 mb-3">
            403 Forbidden Access
          </div>
          <h2 className="font-display text-xl font-bold text-white mb-2">
            Administrative Console Restricted
          </h2>
          <p className="text-xs text-slate-300 mb-2 leading-relaxed">
            Your logged-in account (<span className="text-emerald-400 font-semibold">{user?.email}</span>) is recognized as a <span className="font-bold text-emerald-400">Customer Account</span>.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Customer accounts are strictly partitioned from the Executive Administration Console. You can only view and manage infrastructure in the Customer Console.
          </p>

          <div className="space-y-2.5">
            <Link href="/dashboard" className="block w-full">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 text-xs gap-2">
                <span>Go to Customer Console</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={logout}
              className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs py-2 gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out & Switch Account</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-[#070A12] text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

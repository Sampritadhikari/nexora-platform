"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/layout/BrandLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);

      // Verify that user actually has administrative privileges
      const storedUserStr = localStorage.getItem("nexora_user");
      let parsedUser = null;
      if (storedUserStr) {
        try {
          parsedUser = JSON.parse(storedUserStr);
        } catch {}
      }

      if (parsedUser && parsedUser.role && parsedUser.role.toUpperCase() === "ADMIN") {
        router.push("/admin");
      } else {
        // Customer attempted to login to admin console
        logout();
        setError(
          "Access Denied: This account does not possess executive administrative privileges. Customer accounts must sign in via the standard customer portal."
        );
      }
    } catch (err: any) {
      setError(err.message || "Invalid administrative credentials. Access attempt logged.");
    } finally {
      setLoading(false);
    }
  };

  const setAdminDemo = () => {
    setEmail("admin@nexora.io");
    setPassword("NexoraAdmin@2026!");
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#070A12] text-white selection:bg-red-500 selection:text-white">
      {/* Background Subtle Red Radial Accent */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/20 via-transparent to-transparent" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="flex justify-center mb-6">
          <BrandLogo href="/" size="lg" subtitle="Admin Access" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Executive Administration Gate</span>
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-white">
          Restricted Infrastructure Access
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Enter authorized administrative credentials to access platform controls and telemetry.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="rounded-2xl border border-red-500/20 bg-slate-900/90 p-8 shadow-2xl shadow-red-950/50 backdrop-blur-xl">
          {error && (
            <div className="mb-5 rounded-xl bg-red-950/50 p-4 text-xs font-medium text-red-300 border border-red-800/60 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nexora.io"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="md"
              loading={loading}
              className="w-full mt-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 border-none font-semibold h-11"
            >
              Authenticate to Admin Console
            </Button>
          </form>

          {/* Quick-Fill for authorized administrative testing */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 mb-2.5">
              Authorized Test Credentials:
            </p>
            <button
              type="button"
              onClick={setAdminDemo}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 hover:border-red-500/50 transition-colors cursor-pointer"
            >
              Fill Admin Credentials (admin@nexora.io)
            </button>
          </div>
        </div>

        {/* Back to Customer Portal */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Not an administrator? Return to Customer Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

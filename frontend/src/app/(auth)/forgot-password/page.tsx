"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { BRAND } from "@/config/brand";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BrandLogo } from "@/components/layout/BrandLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await authApi.forgotPassword(email);
    } catch {
      // Ignored for privacy & security
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#070A12] transition-colors">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-6">
          <BrandLogo href="/" size="lg" />
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Reset your password
        </h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-900/5">
          {submitted ? (
            <div className="text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Request Dispatched
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                If an account exists with the provided address, a secure reset link has been dispatched to your inbox.
              </p>
              <Link href="/login">
                <Button variant="outline" size="sm" className="mt-6 w-full gap-1.5">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />

              <Button type="submit" size="md" loading={loading} className="w-full mt-2">
                Send Reset Instructions
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

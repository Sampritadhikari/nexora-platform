"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/config/brand";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    company: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        address: formData.address || undefined,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
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
          Create your account
        </h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Get started with enterprise-grade domains and cloud hosting.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-900/5">
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 dark:bg-red-950/40 p-3.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60">
              {error}
            </div>
          )}

          {/* Google OAuth One-Click Registration */}
          <div className="mb-6">
            <GoogleSignInButton text="Sign up with Google" onError={(err) => setError(err)} />
            
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">
                  Or register with email
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Samarth Verma"
              />
              <Input
                label="Email Address *"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sam@example.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password *"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 8 characters"
              />
              <Input
                label="Confirm Password *"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Repeat password"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
              <Input
                label="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Apex Labs (Optional)"
              />
            </div>

            <Input
              label="Billing Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street, City, State, Postal Code"
            />

            <Button type="submit" size="md" loading={loading} className="w-full mt-4">
              Create Account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

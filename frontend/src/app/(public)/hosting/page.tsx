"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { hostingApi } from "@/lib/api";
import { HostingCard } from "@/components/hosting/HostingCard";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Server, HardDrive, ShieldCheck, Zap } from "lucide-react";

export default function HostingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hostingApi.getPlans().then(setPlans).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 bg-transparent text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Badge variant="brand" className="mb-4">
              Web & Cloud Hosting
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Cloud infrastructure built for high performance
            </h1>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Pure enterprise NVMe storage, free automatic SSL certificates, automated backup redundancy, and 99.9% uptime SLA.
            </p>
          </div>
        </section>

        {/* Plans Grid */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-96 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((p) => (
                  <HostingCard key={p.id} plan={p} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="py-16 bg-slate-50/60 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                Detailed Technical Specifications
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Transparent resource quotas across all packages
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                    <th className="p-4 text-left font-semibold text-slate-900 dark:text-white">Feature</th>
                    <th className="p-4 text-center font-semibold text-slate-900 dark:text-white">Starter</th>
                    <th className="p-4 text-center font-semibold text-brand-600 dark:text-brand-400">Business</th>
                    <th className="p-4 text-center font-semibold text-slate-900 dark:text-white">Professional</th>
                    <th className="p-4 text-center font-semibold text-slate-900 dark:text-white">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-center">
                  <tr>
                    <td className="p-4 text-left font-medium text-slate-900 dark:text-slate-200">Websites Allowed</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">1</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">5</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">10</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">50</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-left font-medium text-slate-900 dark:text-slate-200">NVMe SSD Storage</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">10 GB</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">50 GB</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">100 GB</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">250 GB</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-left font-medium text-slate-900 dark:text-slate-200">Monthly Bandwidth</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">Unmetered</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">Unmetered</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">Unmetered</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">Unmetered</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-left font-medium text-slate-900 dark:text-slate-200">Business Emails</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">5</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">25</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">100</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">500</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-left font-medium text-slate-900 dark:text-slate-200">SSL Certificate</td>
                    <td className="p-4 text-emerald-600">Free SSL</td>
                    <td className="p-4 text-emerald-600 font-semibold">Free Wildcard</td>
                    <td className="p-4 text-emerald-600">Free Wildcard</td>
                    <td className="p-4 text-emerald-600">Free Wildcard</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-left font-medium text-slate-900 dark:text-slate-200">Backups Frequency</td>
                    <td className="p-4 text-slate-400">Weekly</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">Daily Automated</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">Real-Time Hourly</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">Real-Time Hourly</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-left font-medium text-slate-900 dark:text-slate-200">Staging & Git Deploy</td>
                    <td className="p-4 text-slate-400">-</td>
                    <td className="p-4 text-slate-400">-</td>
                    <td className="p-4 text-emerald-600">Included</td>
                    <td className="p-4 text-emerald-600">Included</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-left font-medium text-slate-900 dark:text-slate-200">Dedicated IPv4</td>
                    <td className="p-4 text-slate-400">-</td>
                    <td className="p-4 text-slate-400">-</td>
                    <td className="p-4 text-emerald-600">Included</td>
                    <td className="p-4 text-emerald-600">Included</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

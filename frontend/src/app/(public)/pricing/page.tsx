"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { hostingApi, domainsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { HostingCard } from "@/components/hosting/HostingCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [tlds, setTlds] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"hosting" | "domains">("hosting");

  useEffect(() => {
    hostingApi.getPlans().then(setPlans).catch(console.error);
    domainsApi.getTlds().then(setTlds).catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <section className="py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Badge variant="brand" className="mb-4">
              Transparent Pricing
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Predictable infrastructure costs
            </h1>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              No hidden fees, no bait-and-switch renewal multipliers, and no surprise add-ons.
            </p>

            {/* Tab switch */}
            <div className="mt-8 inline-flex items-center rounded-xl bg-slate-200/80 dark:bg-slate-800/80 p-1.5 border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => setActiveTab("hosting")}
                className={`rounded-lg px-6 py-2 text-sm font-medium transition-all ${
                  activeTab === "hosting"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Web Hosting Plans
              </button>
              <button
                onClick={() => setActiveTab("domains")}
                className={`rounded-lg px-6 py-2 text-sm font-medium transition-all ${
                  activeTab === "domains"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Domain Extensions (TLDs)
              </button>
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {activeTab === "hosting" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((p) => (
                  <HostingCard key={p.id} plan={p} />
                ))}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="grid grid-cols-4 p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                  <span>Extension</span>
                  <span>1st Year Reg.</span>
                  <span>Annual Renewal</span>
                  <span>Action</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tlds.map((item) => (
                    <div key={item.tld} className="grid grid-cols-4 p-4 text-sm items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-slate-900 dark:text-white text-base">
                          {item.tld}
                        </span>
                        {item.is_popular && <Badge variant="brand">Popular</Badge>}
                      </div>
                      <span className="font-semibold text-brand-600 dark:text-brand-400">
                        {formatCurrency(item.registration_price)}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        {formatCurrency(item.renewal_price)}
                      </span>
                      <div>
                        <Link href={`/domains`}>
                          <Button size="sm" variant="outline">
                            Search Domain
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

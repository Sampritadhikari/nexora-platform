"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DomainSearchBar } from "@/components/domain/DomainSearchBar";
import { domainsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Globe, Shield, RefreshCw, Zap } from "lucide-react";

export default function DomainsPage() {
  const [tlds, setTlds] = useState<any[]>([]);

  useEffect(() => {
    domainsApi.getTlds().then(setTlds).catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 bg-transparent text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Badge variant="brand" className="mb-4">
              Domain Registration
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Claim your digital identity
            </h1>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Direct domain registry integration with instant DNS propagation, WHOIS privacy protection, and transparent renewal pricing.
            </p>

            <div className="mt-8">
              <DomainSearchBar />
            </div>
          </div>
        </section>

        {/* Complete TLD Pricing Table */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Supported Domain Extensions & Authoritative Rates
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Prices include ICANN fees and automated nameserver routing.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="grid grid-cols-4 p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                <span>TLD Extension</span>
                <span>Registration (1st Year)</span>
                <span>Annual Renewal</span>
                <span>Domain Transfer</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {tlds.map((item) => (
                  <div key={item.tld} className="grid grid-cols-4 p-4 text-sm items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
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
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatCurrency(item.transfer_price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Props */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <Shield className="h-5 w-5 text-brand-500 mb-3" />
                <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Free WHOIS Privacy
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Keep your personal contact details, email, and phone number hidden from spam harvesters.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <Zap className="h-5 w-5 text-brand-500 mb-3" />
                <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-slate-100">
                  DNS Management
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Configure A, CNAME, MX, and TXT records with instant worldwide edge propagation.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <RefreshCw className="h-5 w-5 text-brand-500 mb-3" />
                <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Automatic Renewals
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Never risk losing an established domain with proactive countdown tracking and auto-renewal.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

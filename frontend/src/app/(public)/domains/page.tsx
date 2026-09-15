"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DomainSearchBar } from "@/components/domain/DomainSearchBar";
import { domainsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Globe, Shield, RefreshCw, Zap, ArrowRight } from "lucide-react";

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

            {/* Value Props - Upgraded Glowing and Hover Effects */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Free WHOIS Privacy */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-7 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/25 hover:-translate-y-2 hover:border-emerald-500/50 transition-all duration-300 backdrop-blur-md">
                {/* Top Glowing Laser Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Corner Radial Glow */}
                <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_16px_rgba(16,185,129,0.5)] group-hover:scale-110">
                      <Shield className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                      PRIVACY SHIELD
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    Free WHOIS Privacy
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Keep your personal contact details, email, and phone number hidden from spam harvesters and data brokers.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Zero Hidden Fees
                  </span>
                  <span className="text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {/* Card 2: DNS Management */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-7 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/15 dark:hover:shadow-cyan-500/25 hover:-translate-y-2 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-md">
                {/* Top Glowing Laser Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Corner Radial Glow */}
                <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-sm transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white group-hover:shadow-[0_0_16px_rgba(6,182,212,0.5)] group-hover:scale-110">
                      <Zap className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
                      ANYCAST EDGE
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    DNS Management
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Configure A, CNAME, MX, and TXT records with instant worldwide edge propagation and sub-second updates.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    Instant Edge Sync
                  </span>
                  <span className="text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {/* Card 3: Automatic Renewals */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-7 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/15 dark:hover:shadow-indigo-500/25 hover:-translate-y-2 hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-md">
                {/* Top Glowing Laser Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Corner Radial Glow */}
                <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_16px_rgba(99,102,241,0.5)] group-hover:scale-110">
                      <RefreshCw className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
                      LIFECYCLE OPS
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Automatic Renewals
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Never risk losing an established domain with proactive countdown tracking, email alerts, and auto-renewal.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Countdown Safeguard
                  </span>
                  <span className="text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

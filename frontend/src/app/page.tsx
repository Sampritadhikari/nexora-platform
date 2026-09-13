"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Server,
  Lock,
  Headphones,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  Globe,
} from "lucide-react";
import { BRAND } from "@/config/brand";
import { hostingApi, domainsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DomainSearchBar } from "@/components/domain/DomainSearchBar";
import { HostingCard } from "@/components/hosting/HostingCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

export default function HomePage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [tlds, setTlds] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [plansData, tldsData] = await Promise.all([
          hostingApi.getPlans(),
          domainsApi.getTlds(),
        ]);
        setPlans(plansData);
        setTlds(tldsData);
      } catch (err) {
        console.error("Failed to load plans/tlds", err);
      } finally {
        setLoadingPlans(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32 border-b border-slate-200/80 dark:border-slate-800/80">
          {/* Subtle technical grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/10 via-gold-500/5 to-transparent pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-800/60 bg-brand-50/50 dark:bg-brand-950/40 px-3.5 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300 mb-6">
                <span className="flex h-1.5 w-1.5 rounded-full bg-brand-600 dark:bg-brand-400 animate-pulse" />
                Enterprise-Grade Cloud Infrastructure
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                {BRAND.heroHeadline}
              </h1>
              <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {BRAND.heroSubheadline}
              </p>
            </div>

            {/* Live Hero Domain Search Component */}
            <div className="mt-8 mb-12">
              <DomainSearchBar />
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/domains">
                <Button size="lg" className="gap-2">
                  Find Your Domain
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/hosting">
                <Button variant="outline" size="lg">
                  Explore Hosting
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* TRUST INDICATORS */}
        <section className="py-12 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 mb-3">
                  <Cpu className="h-5 w-5" />
                </div>
                <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Reliable Infrastructure
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  99.9% guaranteed uptime SLA on NVMe cloud nodes
                </p>
              </div>

              <div className="p-4">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mb-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Secure Platform
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Automated SSL, DDoS defense, and container isolation
                </p>
              </div>

              <div className="p-4">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 mb-3">
                  <Zap className="h-5 w-5" />
                </div>
                <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Fast Deployment
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Automated DNS propagation and instant server provisioning
                </p>
              </div>

              <div className="p-4">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 mb-3">
                  <Headphones className="h-5 w-5" />
                </div>
                <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  24/7 Human Support
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Direct ticket access to senior systems engineers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOSTING PLANS SECTION (Database Driven) */}
        <section id="hosting" className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Badge variant="brand" className="mb-3">
                High-Performance Hosting
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Engineered for speed, stability, and scale
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Transparent annual billing with no hidden fees or renewal price traps.
              </p>
            </div>

            {loadingPlans ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <Skeleton key={n} className="h-96 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                  <HostingCard key={plan.id} plan={plan} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* DOMAIN PRICING TABLE SECTION */}
        <section className="py-16 bg-slate-50/60 dark:bg-slate-900/30 border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <Badge variant="brand" className="mb-2">
                  TLD Registry
                </Badge>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Popular extensions, transparent rates
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Real-time database-backed registrar pricing with free DNS management and WHOIS privacy.
                </p>
              </div>
              <Link href="/domains">
                <Button variant="outline" size="sm" className="gap-1.5">
                  View All Extensions
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {tlds.slice(0, 6).map((item) => (
                <div
                  key={item.tld}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center hover:border-brand-500/50 transition-all"
                >
                  <span className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    {item.tld}
                  </span>
                  <div className="mt-2">
                    <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                      {formatCurrency(item.registration_price)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">/1st year</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="brand" className="mb-3">
                The Nexora Advantage
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Everything you need to run high-uptime digital assets
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "NVMe Flash Storage",
                  desc: "Enterprise PCIe Gen4 solid state drives deliver 4x faster database transactions compared to standard SATA SSDs.",
                  icon: Zap,
                },
                {
                  title: "Unified Management Console",
                  desc: "Manage DNS zone records, server allocations, automated backups, and billing from one cohesive dashboard.",
                  icon: Layers,
                },
                {
                  title: "Secure by Design",
                  desc: "Zero plain-text credentials, isolated OS containers, automated wildcard SSL certificates, and brute-force mitigation.",
                  icon: Lock,
                },
                {
                  title: "Predictable, Transparent Billing",
                  desc: "Strictly server-side authoritative invoice generation with zero surprise fees or hidden renewal markups.",
                  icon: ShieldCheck,
                },
                {
                  title: "Proactive Renewal Tracking",
                  desc: "Automated countdown tracking at 30, 15, 7, and 1-day intervals to safeguard your domains against accidental expiration.",
                  icon: RefreshCw,
                },
                {
                  title: "Dedicated Human Support",
                  desc: "Resolve critical technical questions swiftly with engineers who understand DNS, routing, and server administration.",
                  icon: Headphones,
                },
              ].map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={i}
                    className="group relative rounded-2xl border border-slate-200 dark:border-[#1B2220] bg-white dark:bg-[#0E1211]/80 p-7 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-brand-500/60 dark:hover:border-brand-500/60 shadow-sm hover:shadow-2xl hover:shadow-brand-500/15 cursor-pointer overflow-hidden"
                  >
                    {/* Ambient subtle light sheen inside card on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.06] via-transparent to-gold-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mb-5 border border-brand-200/60 dark:border-brand-800/40 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] transition-all duration-300">
                        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-3" />
                      </div>
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 bg-slate-50/60 dark:bg-slate-900/30 border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <Badge variant="brand" className="mb-2">
                Workflow
              </Badge>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                From domain search to live deployment in minutes
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Search Domain", desc: "Query real-time availability across global TLD registries." },
                { step: "02", title: "Choose Hosting", desc: "Select the compute allocation matched to your application traffic." },
                { step: "03", title: "Verify & Pay", desc: "Complete seamless checkout with server-verified payment gateways." },
                { step: "04", title: "Instant Provision", desc: "Automated provisioning hooks activate your DNS and server accounts." },
              ].map((s, idx) => (
                <div key={idx} className="relative p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="font-display text-3xl font-extrabold text-brand-600/30 dark:text-brand-400/20 block mb-2">
                    {s.step}
                  </span>
                  <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-20 lg:py-24 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Ready to launch your next project?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Join engineering teams and businesses hosting their mission-critical websites on {BRAND.name}.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/domains">
                <Button size="lg" className="gap-2 px-8">
                  Find Your Domain
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/hosting">
                <Button variant="outline" size="lg">
                  Explore Hosting Packages
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

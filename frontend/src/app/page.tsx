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
  Search,
  CreditCard,
  Sparkles,
  ChevronDown,
  Terminal,
  Activity,
  Award,
  Star,
  Check,
  HardDrive,
  Clock,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { BRAND } from "@/config/brand";
import { hostingApi, domainsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LiveBackgroundTheme } from "@/components/layout/LiveBackgroundTheme";
import { DomainSearchBar } from "@/components/domain/DomainSearchBar";
import { HostingCard } from "@/components/hosting/HostingCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

// Fallback high-performance plans for immediate rendering
const FALLBACK_PLANS = [
  {
    id: "plan-starter",
    name: "Starter Cloud",
    slug: "starter-cloud",
    description: "Ideal for personal projects, portfolios, and blogs requiring dependable cloud speed.",
    monthly_price: 199,
    price: 159, // billed yearly
    renewal_price: 199,
    storage: "25 GB NVMe Gen4",
    bandwidth: "Unmetered",
    website_limit: 1,
    email_limit: 5,
    ssl_enabled: true,
    backup_enabled: true,
    is_popular: false,
    features: [
      "1 Website hosted",
      "25 GB PCIe 4.0 NVMe Storage",
      "Free Let's Encrypt SSL",
      "Unmetered Monthly Bandwidth",
      "5 Professional Business Emails",
      "1-Click WordPress & Node Installer",
      "Standard DDoS Mitigation",
    ],
  },
  {
    id: "plan-business",
    name: "Business Pro",
    slug: "business-pro",
    description: "Built for scaling businesses, e-commerce stores, and high-traffic applications.",
    monthly_price: 399,
    price: 319, // billed yearly
    renewal_price: 399,
    storage: "100 GB NVMe Gen4",
    bandwidth: "Unmetered",
    website_limit: 100,
    email_limit: 50,
    ssl_enabled: true,
    backup_enabled: true,
    is_popular: true,
    features: [
      "100 Websites hosted",
      "100 GB PCIe 4.0 NVMe Storage",
      "Free 1st Year Domain Included",
      "2x vCPU & RAM Power Allocation",
      "Daily Automated Cloud Backups",
      "Global CDN & Edge Caching",
      "Real-time Malware & Web Firewall",
      "Priority 24/7 Expert Support",
    ],
  },
  {
    id: "plan-enterprise",
    name: "Turbo Enterprise",
    slug: "turbo-enterprise",
    description: "Maximum compute capacity with dedicated isolated resources and dedicated IP.",
    monthly_price: 799,
    price: 639, // billed yearly
    renewal_price: 799,
    storage: "250 GB NVMe Gen4",
    bandwidth: "Unmetered",
    website_limit: 999,
    email_limit: 200,
    ssl_enabled: true,
    backup_enabled: true,
    is_popular: false,
    features: [
      "Unlimited Websites hosted",
      "250 GB Ultra-Fast NVMe SSD",
      "Dedicated Static IP Address",
      "4x Compute Performance Allocation",
      "Staging Environments & Git Push",
      "Advanced Anycast DNS Management",
      "Custom PHP/Python/Node Runtimes",
      "Direct VIP Engineer Escalation",
    ],
  },
  {
    id: "plan-vps",
    name: "Managed Cloud VPS",
    slug: "managed-cloud-vps",
    description: "Virtual Private Server with isolated kernel, root access, and zero resource contention.",
    monthly_price: 1499,
    price: 1199, // billed yearly
    renewal_price: 1499,
    storage: "500 GB NVMe SSD",
    bandwidth: "10 TB High-Speed",
    website_limit: 9999,
    email_limit: 500,
    ssl_enabled: true,
    backup_enabled: true,
    is_popular: false,
    features: [
      "4 Dedicated vCPU Cores (AMD EPYC)",
      "16 GB ECC DDR5 RAM",
      "500 GB Pure NVMe RAID-10",
      "Full Root & SSH Terminal Access",
      "Docker & Kubernetes Ready",
      "99.99% Financial SLA Guarantee",
      "Bespoke Migration Specialist Assigned",
    ],
  },
];

const EDGE_LOCATIONS = [
  { city: "Mumbai, IN", code: "BOM-1", ping: "12 ms", status: "Operational", load: "24%" },
  { city: "Singapore, SG", code: "SIN-1", ping: "28 ms", status: "Operational", load: "38%" },
  { city: "Frankfurt, DE", code: "FRA-1", ping: "92 ms", status: "Operational", load: "42%" },
  { city: "New York, US", code: "NYC-1", ping: "135 ms", status: "Operational", load: "31%" },
];

const FAQS = [
  {
    q: "How fast is domain registration and DNS propagation on Nexora?",
    a: "Domain activation is instantaneous upon payment confirmation. Powered by our multi-region Anycast DNS architecture, DNS records propagate across global root servers within 2 to 10 minutes instead of the conventional 24-48 hours.",
  },
  {
    q: "Can I migrate my existing websites from another host to Nexora for free?",
    a: "Yes, 100% free of charge! Our senior technical team manages end-to-end migrations for WordPress, cPanel accounts, databases, and custom web applications with zero downtime.",
  },
  {
    q: "What makes Nexora NVMe Cloud faster than standard shared hosting?",
    a: "We run PCIe 4.0 NVMe solid state drives delivering up to 7,450 MB/s read speeds (4x faster than SATA SSDs), isolated CloudLinux OS kernels per tenant, LiteSpeed enterprise web servers, and automated Redis object caching.",
  },
  {
    q: "Are SSL certificates and WHOIS domain privacy really free?",
    a: "Yes. Every domain registered and hosting package activated on Nexora includes lifetime auto-renewing Let's Encrypt Wildcard SSL certificates and complete WHOIS privacy masking at no hidden cost.",
  },
  {
    q: "What payment methods are supported on checkout?",
    a: "We accept all Indian and international payment methods via Razorpay and Stripe: UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay, Amex), Net Banking (50+ banks), and Corporate Wallets.",
  },
  {
    q: "Is there a money-back satisfaction guarantee?",
    a: "Yes! All cloud hosting plans are backed by our 30-day unconditional, no-questions-asked full refund guarantee.",
  },
];

export default function HomePage() {
  const [plans, setPlans] = useState<any[]>(FALLBACK_PLANS);
  const [isAnnual, setIsAnnual] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedLocation, setSelectedLocation] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const fetchedPlans = await hostingApi.getPlans();
        if (Array.isArray(fetchedPlans) && fetchedPlans.length > 0) {
          setPlans(fetchedPlans);
        }
      } catch (err) {
        // Fallback plans already initialized
      }
    }
    loadData();
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 overflow-x-hidden">
      {/* Live Animated Background Theme (Particles, Kinetic Beams, Ambient Aurora Orbs) */}
      <LiveBackgroundTheme />

      <Navbar />

      <main className="relative z-10 flex-1">
        {/* ========================================================
            HERO SECTION (Ultra-clean, crisp, attractive light aesthetic)
           ======================================================== */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-emerald-500/[0.05] via-transparent to-transparent">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/15 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            {/* Top Announcement Pill */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 dark:border-emerald-800/60 bg-white/90 dark:bg-emerald-950/40 px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Nexora 2.0 Live</span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span>PCIe Gen4 NVMe Cloud & Sub-10ms Anycast DNS</span>
              </div>
            </div>

            {/* Hero Headlines */}
            <div className="text-center max-w-4xl mx-auto mb-10">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                High-Speed Cloud Hosting & Domains Built for{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                  Unstoppable Performance
                </span>
              </h1>
              <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                Deploy ultra-low latency websites, mission-critical applications, and registered domains with surgical precision. 99.99% uptime guaranteed.
              </p>
            </div>

            {/* Live Hero Domain Search Component with integrated authoritative Trending TLD chips */}
            <div className="mt-8 mb-10 max-w-3xl mx-auto">
              <DomainSearchBar />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#hosting">
                <Button size="lg" className="gap-2 shadow-lg shadow-emerald-500/20 px-8 py-3.5 text-base font-semibold">
                  <Zap className="h-4 w-4" />
                  Explore Cloud Hosting
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <Link href="/domains">
                <Button variant="outline" size="lg" className="px-8 py-3.5 text-base font-semibold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50">
                  <Globe className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                  Search Any Domain
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 pt-10 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">4.9/5 Rating</span>
                <span className="text-xs text-slate-500">Over 10,000+ happy tenants</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-emerald-600 font-display font-bold text-lg mb-1">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>99.99%</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Uptime Guarantee</span>
                <span className="text-xs text-slate-500">Backed by SLA policy</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-emerald-600 font-display font-bold text-lg mb-1">
                  <Zap className="h-5 w-5 text-emerald-500" />
                  <span>&lt; 15 ms</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Edge Response</span>
                <span className="text-xs text-slate-500">India & Asian Tier-1 data nodes</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-emerald-600 font-display font-bold text-lg mb-1">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <span>24/7/365</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Expert Support</span>
                <span className="text-xs text-slate-500">&lt; 5-minute response time</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            LIVE INTERACTIVE EDGE NETWORK & LATENCY SIMULATOR (Glowing & Interactive)
           ======================================================== */}
        <section className="py-14 bg-slate-50/60 dark:bg-slate-900/30 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Outer Glowing Container Wrapper */}
            <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-emerald-500/50 via-teal-400/30 to-emerald-500/50 shadow-[0_0_35px_-5px_rgba(16,185,129,0.25)] dark:shadow-[0_0_45px_-5px_rgba(16,185,129,0.35)] transition-all duration-300 hover:shadow-[0_0_50px_-2px_rgba(16,185,129,0.35)]">
              {/* Inner Container Card with Glassmorphism */}
              <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 rounded-[22px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 sm:p-8 overflow-hidden">
                {/* Ambient Soft Glow Orbs */}
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Left Telemetry Overview */}
                <div className="max-w-md relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
                    </span>
                    <span>LIVE GLOBAL CLOUD TELEMETRY</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Ultra-Fast Edge Routing Worldwide
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Our Anycast network connects your visitors to the nearest cloud pop with zero latency bottleneck.
                  </p>

                  {/* Active Selected Node Live Indicator */}
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Selected Node:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{EDGE_LOCATIONS[selectedLocation].city}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{EDGE_LOCATIONS[selectedLocation].ping}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-slate-500">Load {EDGE_LOCATIONS[selectedLocation].load}</span>
                  </div>
                </div>

                {/* Glowing Interactive Edge Node Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full lg:w-auto relative z-10">
                  {EDGE_LOCATIONS.map((node, i) => {
                    const isSelected = selectedLocation === i;
                    return (
                      <button
                        key={node.code}
                        type="button"
                        onClick={() => setSelectedLocation(i)}
                        className={`group relative rounded-2xl p-4 text-left transition-all duration-300 ease-out cursor-pointer ${
                          isSelected
                            ? "border-2 border-emerald-500 bg-gradient-to-b from-emerald-500/[0.14] via-emerald-500/[0.04] to-white dark:to-slate-900 shadow-[0_0_25px_rgba(16,185,129,0.35)] ring-2 ring-emerald-400/40 -translate-y-1 scale-[1.03]"
                            : "border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-800/60 shadow-sm hover:-translate-y-1.5 hover:scale-[1.04] hover:border-emerald-400 hover:shadow-[0_10px_25px_-5px_rgba(16,185,129,0.3)] hover:bg-gradient-to-b hover:from-emerald-500/[0.08] hover:to-white dark:hover:to-slate-800"
                        }`}
                      >
                        {/* Glowing Indicator Dot */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[11px] font-mono font-bold transition-colors ${
                              isSelected
                                ? "text-emerald-700 dark:text-emerald-300"
                                : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-600"
                            }`}
                          >
                            {node.code}
                          </span>
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_#10B981]"></span>
                          </span>
                        </div>

                        {/* City Name */}
                        <div
                          className={`text-xs sm:text-sm font-bold transition-colors truncate ${
                            isSelected
                              ? "text-emerald-950 dark:text-white"
                              : "text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300"
                          }`}
                        >
                          {node.city}
                        </div>

                        {/* Ping & Status with spacing */}
                        <div className="mt-3 flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Zap className="h-3 w-3 text-emerald-500 animate-pulse" />
                            {node.ping}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                            {node.status}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            HOSTING PLANS & PRICING TABLE (Interactive Monthly/Annual Toggle)
           ======================================================== */}
        <section id="hosting" className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="brand" className="mb-3 px-3 py-1 text-xs">
                Cloud Web Hosting
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Engineered for speed, stability, and scale
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Transparent billing with no hidden renewal traps. Switch billing cycles anytime.
              </p>

              {/* Billing Cycle Switcher */}
              <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80">
                <button
                  type="button"
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    !isAnnual
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnnual(true)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isAnnual
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="bg-emerald-400/30 text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    Save 20% + Free Domain
                  </span>
                </button>
              </div>
            </div>

            {/* Hosting Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => {
                const effectivePrice = isAnnual ? plan.price : (plan.monthly_price || Math.round(plan.price * 1.25));
                const adjustedPlan = {
                  ...plan,
                  price: effectivePrice,
                };
                return <HostingCard key={plan.id || plan.slug} plan={adjustedPlan} />;
              })}
            </div>

            {/* Guarantee Callout Banner */}
            <div className="mt-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-500/[0.05] to-teal-500/[0.05] p-6 text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">30-Day Money-Back Guarantee</h4>
                  <p className="text-xs text-slate-500">Test our speed risk-free. No questions asked full refund.</p>
                </div>
              </div>
              <Link href="/hosting">
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  Compare All Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            THE NEXORA ADVANTAGE: BENTO GRID FEATURES
           ======================================================== */}
        <section className="py-20 lg:py-28 bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="brand" className="mb-3 px-3 py-1 text-xs">
                Architectural Superiority
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Everything you need to run high-uptime digital assets
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Crafted for businesses, startups, and developers who demand rock-solid cloud infrastructure.
              </p>
            </div>

            {/* Bento Grid with Ultra-Premium Glowing Hover Effects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: NVMe */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-8 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/25 hover:-translate-y-2 hover:border-emerald-500/60 transition-all duration-300 backdrop-blur-md cursor-pointer">
                {/* Top Glowing Laser Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Corner Radial Glow */}
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] group-hover:scale-110">
                      <Zap className="h-6 w-6" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                      7,450 MB/s Pure NVMe
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    PCIe 4.0 NVMe Storage
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Direct bus connection delivers up to 7,450 MB/s read operations. Database queries execute up to 5x faster than conventional cloud SATA disks.
                  </p>
                </div>
              </div>

              {/* Feature 2: Anycast DNS */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/15 dark:hover:shadow-blue-500/25 hover:-translate-y-2 hover:border-blue-500/60 transition-all duration-300 backdrop-blur-md cursor-pointer">
                {/* Top Glowing Laser Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Corner Radial Glow */}
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-110">
                      <Globe className="h-6 w-6" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20">
                      Sub-10ms Global DNS
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Sub-10ms Anycast DNS
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    24 edge routing hubs across Mumbai, Singapore, Frankfurt, and North America announce your DNS records simultaneously for instantaneous resolution.
                  </p>
                </div>
              </div>

              {/* Feature 3: DDoS & Firewall */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-8 shadow-sm hover:shadow-2xl hover:shadow-purple-500/15 dark:hover:shadow-purple-500/25 hover:-translate-y-2 hover:border-purple-500/60 transition-all duration-300 backdrop-blur-md cursor-pointer">
                {/* Top Glowing Laser Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Corner Radial Glow */}
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-500/10 dark:bg-purple-500/15 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-sm transition-all duration-300 group-hover:bg-purple-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:scale-110">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20">
                      3-Sec Inline Mitigation
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Autonomous DDoS Shield
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Layer-3, 4, and 7 inline filtering mitigates volumetric flood attacks and HTTP scraping within 3 seconds without throttling legitimate visitors.
                  </p>
                </div>
              </div>

              {/* Feature 4: 1-Click Installs */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-8 shadow-sm hover:shadow-2xl hover:shadow-amber-500/15 dark:hover:shadow-amber-500/25 hover:-translate-y-2 hover:border-amber-500/60 transition-all duration-300 backdrop-blur-md cursor-pointer">
                {/* Top Glowing Laser Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Corner Radial Glow */}
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-500/10 dark:bg-amber-500/15 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] group-hover:scale-110">
                      <Cpu className="h-6 w-6" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20">
                      1-Click Auto Provision
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    1-Click Modern Frameworks
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Instant deployment recipes for WordPress, Next.js, Node.js, Python FastAPI, Laravel, and Docker containers with automated database provisioning.
                  </p>
                </div>
              </div>

              {/* Feature 5: Automated Backups */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-8 shadow-sm hover:shadow-2xl hover:shadow-teal-500/15 dark:hover:shadow-teal-500/25 hover:-translate-y-2 hover:border-teal-500/60 transition-all duration-300 backdrop-blur-md cursor-pointer">
                {/* Top Glowing Laser Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Corner Radial Glow */}
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-600 dark:text-teal-400 shadow-sm transition-all duration-300 group-hover:bg-teal-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] group-hover:scale-110">
                      <RefreshCw className="h-6 w-6" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20">
                      Nightly Offsite Vault
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    Daily Cloud Snapshots
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Automated nightly offsite backups stored in geographically separate vaults. Restore entire databases or single files with 1-click simplicity.
                  </p>
                </div>
              </div>

              {/* Feature 6: Human Engineers */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-8 shadow-sm hover:shadow-2xl hover:shadow-rose-500/15 dark:hover:shadow-rose-500/25 hover:-translate-y-2 hover:border-rose-500/60 transition-all duration-300 backdrop-blur-md cursor-pointer">
                {/* Top Glowing Laser Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Corner Radial Glow */}
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-rose-500/10 dark:bg-rose-500/15 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] group-hover:scale-110">
                      <Headphones className="h-6 w-6" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20">
                      24/7 Human Linux Team
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    24/7 Dedicated Engineers
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    No automated chatbots or generic outsourced scripts. Connect directly with senior cloud Linux systems administrators within minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            DEVELOPER EXPERIENCE SHOWCASE (CLI / Git / Terminal)
           ======================================================== */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="brand" className="mb-3 px-3 py-1 text-xs">
                  Developer First
                </Badge>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Deploy via CLI, Git push, or our intuitive dashboard
                </h2>
                <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Whether you prefer orchestrating infrastructure through code or using our unified administrative control panel, Nexora adapts to your development workflow.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    {
                      title: "Native Git Integration",
                      desc: "Push to main branch triggers automated builds and rolling zero-downtime updates.",
                    },
                    {
                      title: "RESTful Infrastructure APIs",
                      desc: "Automate domain registration, DNS record modifications, and server scaling programmatically.",
                    },
                    {
                      title: "Role-Based Access Control",
                      desc: "Grant granular permissions to developers, billing managers, and system auditors.",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mt-0.5">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link href="/register">
                    <Button className="gap-2 shadow-lg shadow-emerald-500/20">
                      Create Developer Account
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Modern Terminal Window */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>nexora-cli v2.4.0</span>
                  </div>
                  <div className="w-12" />
                </div>

                {/* Terminal Body */}
                <div className="p-6 font-mono text-xs sm:text-sm space-y-3 leading-relaxed">
                  <div className="text-slate-400">
                    <span className="text-emerald-400">$</span> nexora deploy --environment=production
                  </div>
                  <div className="text-slate-400 pl-4">
                    🔍 Detecting framework... <span className="text-emerald-300 font-bold">Next.js 14 (App Router)</span>
                  </div>
                  <div className="text-slate-400 pl-4">
                    ⚡ Connecting to Edge Node: <span className="text-white">BOM-1 (Mumbai, India)</span>
                  </div>
                  <div className="text-slate-400 pl-4">
                    🔒 Provisioning Wildcard SSL: <span className="text-emerald-400">*.nexora.io [ACTIVE]</span>
                  </div>
                  <div className="text-slate-400 pl-4">
                    📦 Allocating PCIe NVMe Container... <span className="text-emerald-400">250 GB [READY]</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-emerald-400 font-bold">
                    ✨ Deployment successful! Live URL:
                  </div>
                  <div className="text-teal-300 underline font-semibold pl-4">
                    https://console.nexora.io [RTT: 12ms]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            CUSTOMER TESTIMONIALS & SOCIAL PROOF
           ======================================================== */}
        <section className="py-20 bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Badge variant="brand" className="mb-3 px-3 py-1 text-xs">
                Real Customer Stories
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Trusted by high-growth startups and engineers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    "Migrating our SaaS from AWS to Nexora reduced our monthly infrastructure costs by 60% while our page load times improved from 1.8s down to 320ms.",
                  author: "Aditya Verma",
                  role: "Chief Technology Officer, PayScale India",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
                },
                {
                  quote:
                    "The instant DNS propagation and NVMe read speed are unbelievable. Setting up client domains used to take half a day, now it's done in under 5 minutes.",
                  author: "Rohan Mukherjee",
                  role: "Founder, CloudCraft Digital",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
                },
                {
                  quote:
                    "Support is phenomenal. Whenever we've filed a complex NGINX reverse-proxy question, an actual systems engineer replies with the working config in 5 minutes.",
                  author: "Sneha Kapur",
                  role: "Lead DevOps Architect, Omnify Health",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <img
                      src={item.avatar}
                      alt={item.author}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{item.author}</div>
                      <div className="text-xs text-slate-500">{item.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            FREQUENTLY ASKED QUESTIONS (FAQ Accordion)
           ======================================================== */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Badge variant="brand" className="mb-3 px-3 py-1 text-xs">
                Got Questions?
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Everything you need to know about domain transfers, hosting SLAs, and migrations.
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <span className="font-display text-base font-bold text-slate-900 dark:text-white pr-4">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-emerald-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            FINAL HIGH-CONVERTING BOTTOM CALL TO ACTION
           ======================================================== */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-12 lg:p-16 text-center text-white shadow-2xl shadow-emerald-500/20">
              {/* Background Glow Accent */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none" />

              <div className="relative max-w-3xl mx-auto space-y-6">
                <Badge variant="gold" className="px-3 py-1 font-bold text-xs uppercase tracking-wider">
                  Ready in 60 Seconds
                </Badge>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                  Accelerate Your Online Infrastructure Today
                </h2>
                <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of developers, agencies, and enterprises building high-performance websites on Nexora Cloud.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Link href="/register">
                    <Button size="lg" className="bg-white text-emerald-800 hover:bg-slate-100 font-bold px-8 shadow-lg">
                      Get Started for Free
                      <ArrowRight className="h-4 w-4 ml-2 text-emerald-700" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/40 text-white hover:bg-white/10 font-bold px-8"
                    >
                      Talk to an Infrastructure Engineer
                    </Button>
                  </Link>
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

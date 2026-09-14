import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Cpu, Lock, Terminal, Globe, Award, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Badge variant="brand" className="mb-4">
              About Nexora
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Infrastructure engineered for unwavering trust
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We founded Nexora on a singular principle: hosting infrastructure should be as dependable and straightforward as clean electricity.
            </p>
          </div>
        </section>

        {/* Narrative & Principles */}
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate dark:prose-invert max-w-none mb-16">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                The Nexora Philosophy
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-4">
                For over a decade, web hosting has been dominated by legacy conglomerates offering confusing tier upgrades, hidden renewal price traps, bloated control panels, and underpowered servers packed beyond capacity.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Nexora replaces this friction with modern software architecture. By coupling automated DNS provisioning directly to dedicated NVMe SSD compute clusters and enforcing server-side verified transactions, we deliver the speed of modern cloud infrastructure with the simplicity of managed hosting.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Cpu,
                  title: "NVMe-First Architecture",
                  tag: "PCIe Gen4 Solid State",
                  desc: "We run solely on enterprise PCIe Gen4 solid state drives with high-frequency compute cores, ensuring your databases and dynamic web apps render with minimal time-to-first-byte.",
                  pill: "Sub-millisecond I/O",
                  badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                  iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]",
                },
                {
                  icon: Lock,
                  title: "Security Without Compromise",
                  tag: "Zero-Trust Perimeter",
                  desc: "Every domain and hosting container comes with automated wildcard SSL encryption, automated DDoS mitigation, zero plain-text credential persistence, and regular snapshot backups.",
                  pill: "Automated SSL & DDoS",
                  badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
                  iconClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]",
                },
                {
                  icon: Terminal,
                  title: "Developer Ergonomics",
                  tag: "Programmatic Control",
                  desc: "Full support for standard protocols, customizable authoritative DNS zones, staging environments, and clean REST APIs for programmatic orchestration.",
                  pill: "REST API & DNS Zones",
                  badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
                  iconClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]",
                },
                {
                  icon: ShieldCheck,
                  title: "Transparent Governance",
                  tag: "Authoritative Ledger",
                  desc: "All pricing is stored authoritatively in our central database. You will never experience surprise renewal hikes, fabricated discount timers, or hostage fees.",
                  pill: "100% Price Integrity",
                  badgeClass: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20",
                  iconClass: "bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-8 shadow-sm hover:shadow-2xl hover:shadow-brand-500/15 dark:hover:shadow-brand-500/25 hover:-translate-y-2 hover:border-brand-500/50 transition-all duration-300 backdrop-blur-md overflow-hidden"
                  >
                    {/* Top Glowing Laser Accent */}
                    <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Corner Ambient Glow Orb */}
                    <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-brand-500/10 dark:bg-brand-500/15 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                    <div>
                      {/* Header with Icon and Tag Pill */}
                      <div className="flex items-center justify-between mb-5">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border border-transparent transition-all duration-300 shadow-sm ${item.iconClass}`}>
                          <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wide border ${item.badgeClass}`}>
                          {item.tag}
                        </span>
                      </div>

                      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Footer Micro-tag with Glow Pulse */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
                        {item.pill}
                      </span>
                      <span className="text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BRAND } from "@/config/brand";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Cpu, Lock, Terminal, Globe, Award } from "lucide-react";

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
                  desc: "We run solely on enterprise PCIe Gen4 solid state drives with high-frequency compute cores, ensuring your databases and dynamic web apps render with minimal time-to-first-byte."
                },
                {
                  icon: Lock,
                  title: "Security Without Compromise",
                  desc: "Every domain and hosting container comes with automated wildcard SSL encryption, automated DDoS mitigation, zero plain-text credential persistence, and regular snapshot backups."
                },
                {
                  icon: Terminal,
                  title: "Developer Ergonomics",
                  desc: "Full support for standard protocols, customizable authoritative DNS zones, staging environments, and clean REST APIs for programmatic orchestration."
                },
                {
                  icon: ShieldCheck,
                  title: "Transparent Governance",
                  desc: "All pricing is stored authoritatively in our central database. You will never experience surprise renewal hikes, fabricated discount timers, or hostage fees."
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
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

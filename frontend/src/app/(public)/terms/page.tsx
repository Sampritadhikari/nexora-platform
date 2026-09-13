import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BRAND } from "@/config/brand";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
            Last updated: September 14, 2026 • Governed by {BRAND.legalName}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Agreement to Terms</h2>
              <p>
                By creating an account, registering domain names, or provisioning hosting services on {BRAND.name}, you agree to abide by these Terms of Service and all applicable ICANN regulations and regional telecommunications laws.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Domain Registration & WHOIS</h2>
              <p>
                Domain registration is subject to the policies of the respective Top-Level Domain (TLD) registry and ICANN. {BRAND.name} acts as an authoritative registrar interface. You acknowledge that domain registration fees are non-refundable once the domain string has been transmitted and registered with the registry.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Hosting Services & Acceptable Use</h2>
              <p>
                Hosting packages are intended for legitimate web applications, APIs, and websites. You agree not to use the services for unauthorized port scanning, malware distribution, phishing, outbound spam, or illegal denial-of-service activities. Violations result in immediate account termination.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">4. Service Level Agreement (SLA)</h2>
              <p>
                {BRAND.name} guarantees a 99.9% monthly network and compute node uptime. In the event of unscheduled downtime exceeding the SLA threshold, eligible accounts may request pro-rated hosting service credits through our support portal.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">5. Invoicing & Renewals</h2>
              <p>
                All renewal charges are processed according to the authoritative rates published in our pricing schedule. Renewal reminders are dispatched at 30, 15, 7, and 1-day intervals. Expired domains enter a grace period in accordance with registry guidelines before release.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

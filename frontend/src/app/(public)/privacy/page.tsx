import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BRAND } from "@/config/brand";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
            Last updated: September 14, 2026 • Compliant with global privacy standards
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Information We Collect</h2>
              <p>
                We collect your contact details (name, email address, phone number, billing address) when you register an account, order services, or submit technical support requests. Password credentials are cryptographically salted and hashed using PBKDF2; plain-text passwords are never stored or logged.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. How Information is Used</h2>
              <p>
                Information is strictly used to fulfill registrar and hosting provisioning agreements, generate legal tax invoices, process server-verified payment transactions, transmit critical expiration reminder notices, and authenticate sessions via encrypted JWT tokens.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. WHOIS Privacy Protection</h2>
              <p>
                Where permitted by the applicable registry, {BRAND.name} automatically masks personal registrant details in public WHOIS directories to protect against identity harvesting and malicious spam.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">4. Data Security & Retention</h2>
              <p>
                We enforce strict transport security (TLS 1.3), network firewalls, and role-based access controls to safeguard administrative databases. We never sell, lease, or monetize customer data.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

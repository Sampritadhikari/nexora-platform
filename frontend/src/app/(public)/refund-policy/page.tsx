import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BRAND } from "@/config/brand";

export default function RefundPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
            Last updated: September 14, 2026
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Web Hosting 30-Day Guarantee</h2>
              <p>
                We offer a full 30-day money-back guarantee on all new shared, cloud, and business hosting packages. If you are unsatisfied with the performance, reliability, or uptime of your hosting environment within the first 30 days of purchase, you may request a 100% refund via our billing support tickets.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Domain Name Registrations</h2>
              <p>
                Due to registry cost structures enforced by ICANN and top-level domain operators, domain registration and domain renewal fees are irreversible and non-refundable once the domain has been successfully provisioned.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Renewal Cancellations</h2>
              <p>
                You may disable auto-renewal for any active service at any time directly through your Customer Dashboard. If auto-renew is disabled, no further renewal fees will be charged, and the service will terminate naturally at the conclusion of the active term.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">4. Processing Refunds</h2>
              <p>
                Approved refunds are credited back to the original payment source within 5 to 7 business days, accompanied by an updated electronic credit note invoice.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

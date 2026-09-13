import React from "react";
import Link from "next/link";
import { ShieldCheck, Activity } from "lucide-react";
import { BRAND } from "@/config/brand";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070A12] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {BRAND.name}
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              {BRAND.description}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                All Systems Operational ({BRAND.sla})
              </span>
            </div>
          </div>

          {/* Infrastructure */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Infrastructure
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/domains" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Domain Registry
                </Link>
              </li>
              <li>
                <Link href="/hosting" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  NVMe Cloud Hosting
                </Link>
              </li>
              <li>
                <Link href="/hosting#business" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Business Packages
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Transparent Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Support & Company
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  About Nexora
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/dashboard/support" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Support Tickets
                </Link>
              </li>
              <li>
                <a href={`mailto:${BRAND.supportEmail}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {BRAND.supportEmail}
                </a>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Legal & Security
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>{BRAND.copyright}</p>
          <p className="flex items-center gap-1">
            <span>Built with precision for mission-critical web applications</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

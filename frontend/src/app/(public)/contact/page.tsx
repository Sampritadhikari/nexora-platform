"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BRAND } from "@/config/brand";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight, Sparkles, Clock } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "GENERAL",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="brand" className="mb-3">
              Get In Touch
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Direct communication with engineering & sales
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Have questions regarding custom enterprise configurations, migration, or domain transfers? Reach out below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact details - 3 interactive glowing cards */}
            <div className="space-y-6">
              {/* Card 1: Technical Support */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-6 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/25 hover:-translate-y-2 hover:border-emerald-500/50 transition-all duration-300 backdrop-blur-md">
                {/* Top Glowing Laser Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Corner Radial Glow */}
                <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_16px_rgba(16,185,129,0.5)] group-hover:scale-110">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                      24/7 TICKETS
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    Technical Support
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-4 leading-relaxed">
                    For existing customer tickets, DNS propagation queries, and container operations.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <a href={`mailto:${BRAND.supportEmail}`} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
                    {BRAND.supportEmail}
                  </a>
                  <span className="text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {/* Card 2: Sales & Advisory */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-6 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/15 dark:hover:shadow-cyan-500/25 hover:-translate-y-2 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-md">
                {/* Top Glowing Laser Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Corner Radial Glow */}
                <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-sm transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white group-hover:shadow-[0_0_16px_rgba(6,182,212,0.5)] group-hover:scale-110">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
                      DIRECT LINE
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    Sales & Infrastructure Advisory
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-4 leading-relaxed">
                    Monday to Friday, 9:00 AM - 7:00 PM IST for enterprise bespoke clusters.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    {BRAND.phone}
                  </span>
                  <span className="text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {/* Card 3: Corporate Headquarters */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-6 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/15 dark:hover:shadow-indigo-500/25 hover:-translate-y-2 hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-md">
                {/* Top Glowing Laser Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Corner Radial Glow */}
                <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_16px_rgba(99,102,241,0.5)] group-hover:scale-110">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
                      HQ CAMPUS
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Corporate Headquarters
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-4 leading-relaxed">
                    {BRAND.address}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Registered Entity
                  </span>
                  <span className="text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>

            {/* Form - Upgraded with Glowing Border and Ambient Lighting */}
            <div className="lg:col-span-2 group relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-8 sm:p-10 shadow-sm hover:shadow-2xl hover:shadow-brand-500/10 dark:hover:shadow-brand-500/20 hover:border-brand-500/40 transition-all duration-300 backdrop-blur-md">
              {/* Top Glowing Laser Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Corner Ambient Glow Orb */}
              <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-brand-500/10 dark:bg-brand-500/15 blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

              {/* Form Header with Live SLA status indicator */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    Send an Inquiry
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Directly routed to technical architects and account executives.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                  </span>
                  SLA Response &lt; 4 Hours
                </div>
              </div>

              {submitted ? (
                <div className="py-12 text-center relative z-10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 shadow-md shadow-emerald-500/20 mb-4">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    Inquiry Transmitted Successfully
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out to Nexora. A senior infrastructure engineer has been assigned and will reply within 2-4 business hours.
                  </p>
                  <Button size="sm" variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                    Send Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Work Email"
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="GENERAL">General Inquiries</option>
                      <option value="SALES">Enterprise & High-Volume Hosting</option>
                      <option value="DOMAINS">Domain Portfolio & Registry</option>
                      <option value="BILLING">Invoicing & Billing Verification</option>
                    </select>
                  </div>

                  <Input
                    label="Subject"
                    required
                    placeholder="Brief description of your query"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Message Details
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please specify your technical requirements, current traffic volume, or questions..."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 shadow-sm transition-all"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button type="submit" size="md" className="w-full sm:w-auto px-8 gap-2 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] transition-all">
                    Submit Inquiry
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

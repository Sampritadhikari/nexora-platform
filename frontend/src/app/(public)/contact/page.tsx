"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BRAND } from "@/config/brand";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

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
            {/* Contact details */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <Mail className="h-5 w-5 text-brand-500 mb-3" />
                <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Technical Support
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2">
                  For existing customer tickets and operational questions.
                </p>
                <a href={`mailto:${BRAND.supportEmail}`} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  {BRAND.supportEmail}
                </a>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <Phone className="h-5 w-5 text-brand-500 mb-3" />
                <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Sales & Infrastructure Advisory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2">
                  Monday to Friday, 9:00 AM - 7:00 PM IST
                </p>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {BRAND.phone}
                </span>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <MapPin className="h-5 w-5 text-brand-500 mb-3" />
                <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Corporate Headquarters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {BRAND.address}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 mb-4">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    Message Received
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Thank you for contacting Nexora. A senior infrastructure engineer will respond within 2-4 business hours.
                  </p>
                  <Button size="sm" variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                    Send Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                      Message Details
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please specify your technical requirements, current traffic volume, or questions..."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button type="submit" size="md" className="w-full sm:w-auto px-8">
                    Submit Inquiry
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

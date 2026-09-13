"use client";

import React from "react";
import { Check, Zap, Server, Shield, HardDrive } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

interface HostingCardProps {
  plan: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    renewal_price: number;
    storage: string;
    bandwidth: string;
    website_limit: number;
    email_limit: number;
    ssl_enabled: boolean;
    backup_enabled: boolean;
    is_popular: boolean;
    features: string[];
  };
}

export function HostingCard({ plan }: HostingCardProps) {
  const { addItem, items } = useCart();
  const inCart = items.some(
    (i) => i.product_type === "HOSTING" && i.product_reference === plan.slug
  );

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 ${
        plan.is_popular
          ? "border-gold-500/80 bg-white dark:bg-[#0E1211] shadow-lg shadow-gold-500/5 ring-1 ring-gold-500/30 hover:border-gold-400 hover:shadow-2xl hover:shadow-gold-500/20 hover:ring-2 hover:ring-gold-400/50"
          : "border-slate-200 dark:border-[#1B2220] bg-white dark:bg-[#0E1211]/70 hover:border-brand-500/60 dark:hover:border-brand-500/60 shadow-sm hover:shadow-xl hover:shadow-brand-500/15"
      }`}
    >
      {/* Subtle hover gradient background glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {plan.is_popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <Badge variant="gold" className="px-3 py-1 shadow-md shadow-gold-500/20 font-bold tracking-wider uppercase text-[11px] group-hover:scale-105 transition-transform">
            Most Popular
          </Badge>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">
            {plan.name}
          </h3>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 min-h-[36px] leading-relaxed">
          {plan.description}
        </p>

        {/* Pricing */}
        <div className="mt-5 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(plan.price)}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              /year
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Renews at {formatCurrency(plan.renewal_price)}/yr. Taxes apply at checkout.
          </p>
        </div>

        {/* Core Specs Highlights */}
        <div className="grid grid-cols-2 gap-2 my-5 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <HardDrive className="h-3.5 w-3.5 text-brand-500 shrink-0" />
            <span className="truncate">{plan.storage}</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <Server className="h-3.5 w-3.5 text-brand-500 shrink-0" />
            <span className="truncate">{plan.website_limit === 1 ? "1 Website" : `${plan.website_limit} Websites`}</span>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-2.5 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Included Features
          </p>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button
        variant={plan.is_popular ? "primary" : "outline"}
        size="md"
        className="w-full mt-4"
        onClick={() => {
          if (!inCart) {
            addItem({
              product_type: "HOSTING",
              product_reference: plan.slug,
              name: `Web Hosting: ${plan.name} Plan`,
              unit_price: plan.price,
              meta_info: { billing_period: "YEARLY" },
            });
          }
        }}
      >
        {inCart ? "Selected in Cart ✓" : "Choose Hosting Plan"}
      </Button>
    </div>
  );
}

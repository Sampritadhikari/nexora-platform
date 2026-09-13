"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck, Globe, Server } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, subtotal, tax, taxRate, total, clearCart, loading } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Review Your Cart
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Domain registrations and cloud hosting packages are ready for deployment.
              </p>
            </div>
            {items.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-600">
                Clear Cart
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="Your cart is empty"
              description="Explore our domain registry or select an enterprise hosting package to get started."
              actionText="Find a Domain"
              actionHref="/domains"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product_reference}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shrink-0">
                        {item.product_type === "DOMAIN" ? (
                          <Globe className="h-5 w-5" />
                        ) : (
                          <Server className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-base">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className="capitalize">{item.product_type.toLowerCase()}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>Term: 1 Year</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="text-right">
                        <span className="font-display font-bold text-slate-900 dark:text-slate-100 text-base">
                          {formatCurrency(item.unit_price * item.quantity)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">excl. taxes</span>
                      </div>
                      <button
                        onClick={() => removeItem(item.product_reference)}
                        className="rounded-lg p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>
                    Free WHOIS Privacy & SSL Encryption are automatically bundled with eligible selections.
                  </span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 pb-4 border-b border-slate-100 dark:border-slate-800">
                  Order Summary
                </h3>

                <div className="space-y-3 py-4 text-xs border-b border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Standard GST ({taxRate}%)</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(tax)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between py-4 font-display font-bold text-base text-slate-900 dark:text-white">
                  <span>Total Due</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <Link href="/checkout">
                  <Button size="lg" className="w-full gap-2 mt-2" loading={loading}>
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <p className="mt-4 text-center text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                  Prices calculated dynamically from central database records. Verified upon order creation.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

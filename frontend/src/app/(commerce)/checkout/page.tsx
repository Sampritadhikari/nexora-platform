"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ordersApi, paymentsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, tax, taxRate, total, clearCart } = useCart();

  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Payment gateway simulation modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [intentData, setIntentData] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setBillingName(user.name || "");
      setBillingEmail(user.email || "");
      setBillingPhone(user.phone || "");
      setBillingAddress(user.address || "");
    }
  }, [user]);

  // If cart is empty and no order completed, redirect to cart
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push("/cart");
    }
  }, [items, orderComplete, router]);

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError("Please sign in or register to complete your order.");
      return;
    }

    try {
      setLoading(true);

      // 1. Create Order on backend (server calculates authoritative pricing)
      const order = await ordersApi.create({
        items: items.map((i) => ({
          product_type: i.product_type,
          product_reference: i.product_reference,
          name: i.name,
          quantity: i.quantity,
          meta_info: i.meta_info,
        })),
        billing_name: billingName,
        billing_email: billingEmail,
        billing_phone: billingPhone,
        billing_address: billingAddress,
      });

      // 2. Request Payment Intent from backend
      const intent = await paymentsApi.createIntent(order.id, paymentMethod);
      setIntentData(intent);
      setModalOpen(true);
    } catch (err: any) {
      setError(err.message || "Failed to initiate checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmMockPayment = async () => {
    if (!intentData) return;
    try {
      setVerifying(true);
      // 3. Server-side verification of payment token
      const verifyRes = await paymentsApi.verify({
        order_id: intentData.order_id,
        transaction_id: intentData.transaction_id,
        client_token: intentData.client_token,
        payment_method: paymentMethod,
      });

      // 4. Clear cart and set success state
      clearCart();
      setModalOpen(false);
      setOrderComplete({
        order_id: intentData.order_id,
        order_number: intentData.order_number,
        amount: intentData.amount,
        currency: intentData.currency,
        transaction_id: verifyRes.transaction_id,
      });
    } catch (err: any) {
      setError(err.message || "Payment verification failed.");
      setModalOpen(false);
    } finally {
      setVerifying(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="mx-auto max-w-xl px-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 mb-6">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <Badge variant="success" className="mb-3">
              Payment Verified & Provisioned
            </Badge>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Order <span className="font-semibold text-slate-900 dark:text-white">{orderComplete.order_number}</span> has been processed. Your domains and cloud hosting accounts are actively provisioned.
            </p>

            <div className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-left text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono text-slate-900 dark:text-white">{orderComplete.transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(orderComplete.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold text-emerald-600">ACTIVE</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/dashboard/orders/${orderComplete.order_id}`}>
                <Button className="w-full sm:w-auto gap-2">
                  View Order Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full sm:w-auto">
                  Go to Customer Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Checkout & Provisioning
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Confirm your billing details and complete secure payment authorization.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-950/40 p-4 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mb-6 p-4 rounded-xl border border-brand-200 dark:border-brand-900/60 bg-brand-50/50 dark:bg-brand-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-brand-900 dark:text-brand-200">
                <span className="font-semibold">Have a Nexora account?</span> Sign in to speed up checkout and link services to your dashboard.
              </div>
              <div className="flex gap-2">
                <Link href="/login">
                  <Button size="sm" variant="outline">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <form id="checkout-form" onSubmit={handleInitiatePayment} className="space-y-6">
                {/* Customer Information */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                  <h2 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <span>1. Customer & Billing Information</span>
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name *"
                        required
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                        placeholder="Samarth Verma"
                      />
                      <Input
                        label="Billing Email *"
                        type="email"
                        required
                        value={billingEmail}
                        onChange={(e) => setBillingEmail(e.target.value)}
                        placeholder="sam@example.com"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={billingPhone}
                        onChange={(e) => setBillingPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                      <Input
                        label="Billing Address"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        placeholder="Street, City, Postal Code"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                  <h2 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <span>2. Select Payment Method</span>
                  </h2>
                  <div className="space-y-3">
                    {[
                      { id: "CREDIT_CARD", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay, Amex" },
                      { id: "UPI", label: "UPI & Instant QR", desc: "Google Pay, PhonePe, Paytm, BHIM" },
                      { id: "NETBANKING", label: "NetBanking", desc: "All major Indian and international banks" },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === opt.id
                            ? "border-brand-500 bg-brand-50/20 dark:bg-brand-950/20"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={opt.id}
                          checked={paymentMethod === opt.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mt-1 text-brand-600 focus:ring-brand-500"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {opt.label}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {opt.desc}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500">
                    <Lock className="h-3.5 w-3.5 text-emerald-500" />
                    <span>256-Bit SSL Encrypted Server-Side Token Verification</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Summary */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
                Order Review ({items.length} items)
              </h3>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {items.map((i) => (
                  <div key={i.product_reference} className="flex justify-between text-xs">
                    <div className="truncate pr-2">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{i.name}</p>
                      <p className="text-[10px] text-slate-400">Qty: {i.quantity}</p>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 shrink-0">
                      {formatCurrency(i.unit_price * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>GST ({taxRate}%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-display font-bold text-base text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Total Amount</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                size="lg"
                loading={loading}
                disabled={!isAuthenticated}
                className="w-full mt-2"
              >
                {isAuthenticated ? `Authorize & Pay ${formatCurrency(total)}` : "Sign In to Complete Order"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Gateway Simulation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nexora Secure Gateway Simulation"
        description="Development Mock Payment Provider Integration"
      >
        {intentData && (
          <div className="space-y-4 pt-2">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Ref</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{intentData.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Authorized Gateway</span>
                <span className="font-medium text-slate-900 dark:text-white">MockPaymentGateway v1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Calculated Charge</span>
                <span className="font-bold text-base text-brand-600 dark:text-brand-400">{formatCurrency(intentData.amount)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Clicking below simulates immediate gateway authorization and sends the cryptographically signed transaction token to the FastAPI backend for verification.
            </p>

            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                loading={verifying}
                onClick={handleConfirmMockPayment}
                className="w-full"
              >
                Simulate Successful Payment
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setModalOpen(false)}
                disabled={verifying}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}

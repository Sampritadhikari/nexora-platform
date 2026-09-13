"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ordersApi, invoicesApi } from "@/lib/api";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  Globe,
  Server,
  Terminal,
} from "lucide-react";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getOrderDetails(id).then(setOrder).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Order could not be found.</p>
        <Link href="/dashboard/orders">
          <Button variant="outline" size="sm" className="mt-4">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const steps = [
    { label: "Order Created", done: true },
    { label: "Payment Confirmed", done: order.status !== "PENDING" },
    { label: "Provisioning", done: ["PROVISIONING", "ACTIVE"].includes(order.status) },
    { label: "Active & Deployed", done: order.status === "ACTIVE" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Order {order.order_number}
              </h1>
              <Badge variant={order.status === "ACTIVE" ? "success" : "default"}>
                {order.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Placed on {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>

        <Link href="/dashboard/invoices">
          <Button variant="outline" size="sm" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            View Invoices
          </Button>
        </Link>
      </div>

      {/* Lifecycle Progress Bar */}
      <Card className="p-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Order Lifecycle Status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                  step.done
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                }`}
              >
                {step.done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
              </div>
              <span className={`text-xs font-medium ${step.done ? "text-slate-900 dark:text-white font-semibold" : "text-slate-400"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Items Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Itemized Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                    {item.product_type === "DOMAIN" ? <Globe className="h-4 w-4" /> : <Server className="h-4 w-4" />}
                  </div>
                  <div>
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white block">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Ref: {item.product_reference} • Quantity: {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax (GST)</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between font-display font-bold text-base text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Total Paid</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provisioning Notes */}
      {order.provisioning_notes && (
        <Card className="p-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Automated Provisioning Log
          </h3>
          <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {order.provisioning_notes}
          </pre>
        </Card>
      )}
    </div>
  );
}

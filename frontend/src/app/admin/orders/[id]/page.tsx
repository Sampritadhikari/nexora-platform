"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowLeft, RefreshCw, CheckCircle2, AlertTriangle, Globe, Server } from "lucide-react";

export default function AdminOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [retryResult, setRetryResult] = useState<string | null>(null);

  const loadOrder = async () => {
    try {
      const data = await adminApi.getOrderDetails(id);
      setOrder(data);
    } catch (err) {
      console.error("Failed to load order details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleRetryProvisioning = async () => {
    try {
      setRetrying(true);
      setRetryResult(null);
      const res = await adminApi.retryProvisioning(id);
      await loadOrder();
      setRetryResult(`Provisioning executed: ${res.order_status}`);
    } catch (err: any) {
      alert(err.message || "Retry failed.");
    } finally {
      setRetrying(false);
    }
  };

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
        <p className="text-sm text-slate-500">Order not found.</p>
        <Link href="/admin/orders">
          <Button variant="outline" size="sm" className="mt-4">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Order {order.order_number}
              </h1>
              <Badge
                variant={
                  order.status === "ACTIVE"
                    ? "success"
                    : order.status === "PROVISIONING_FAILED"
                    ? "danger"
                    : "brand"
                }
              >
                {order.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tenant ID: {order.user_id} • Created: {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>

        {/* Action Button: Retry Provisioning */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={order.status === "PROVISIONING_FAILED" ? "danger" : "outline"}
            loading={retrying}
            onClick={handleRetryProvisioning}
            className="gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry Provisioning
          </Button>
        </div>
      </div>

      {retryResult && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono">
          {retryResult}
        </div>
      )}

      {/* Order Info & Amounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Taxable Net Subtotal
          </span>
          <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(order.subtotal)}
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            GST Tax Amount
          </span>
          <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(order.tax)}
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Charge
          </span>
          <span className="font-display text-2xl font-bold text-brand-600 dark:text-brand-400">
            {formatCurrency(order.total)}
          </span>
        </Card>
      </div>

      {/* Line items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Purchased Items ({order.items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.items.map((i: any) => (
              <div key={i.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-sm text-slate-900 dark:text-white block">{i.name}</span>
                  <span className="text-slate-400">Type: {i.product_type} • Reference: {i.product_reference}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{formatCurrency(i.total)}</span>
                  <span className="block text-[10px] text-slate-400">Qty: {i.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Provisioning log */}
      <Card className="p-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Provisioning Telemetry & Notes
        </h3>
        <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
          {order.provisioning_notes || "No provisioning messages recorded."}
        </pre>
      </Card>
    </div>
  );
}

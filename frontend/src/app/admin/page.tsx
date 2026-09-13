"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Users,
  Globe,
  Server,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  LifeBuoy,
  RefreshCw,
  ArrowRight,
  Layers,
  Cpu,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Executive Administration Console
            </h1>
            <Badge variant="danger">PRODUCTION V1</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time platform telemetry powered by PostgreSQL database metrics. Zero fabricated numbers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <Button size="sm" className="gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Manage Products
            </Button>
          </Link>
          <Link href="/admin/system">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Cpu className="h-3.5 w-3.5" />
              System Status
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Verified Revenue
            </span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <span className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(stats?.total_revenue || 0)}
            </span>
          )}
          <p className="text-[11px] text-slate-400 mt-1">From server-verified paid orders</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Customers
            </span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <span className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.total_customers ?? 0}
            </span>
          )}
          <p className="text-[11px] text-slate-400 mt-1">Registered tenant accounts</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Provisioned Domains
            </span>
            <Globe className="h-4 w-4 text-indigo-500" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <span className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.active_domains ?? 0}
            </span>
          )}
          <p className="text-[11px] text-slate-400 mt-1">Active registrar records</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Hosting Accounts
            </span>
            <Server className="h-4 w-4 text-emerald-500" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <span className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.active_hosting ?? 0}
            </span>
          )}
          <p className="text-[11px] text-slate-400 mt-1">Provisioned server containers</p>
        </Card>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Orders</span>
            <ShoppingCart className="h-4 w-4 text-slate-400" />
          </div>
          <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {loading ? <Skeleton className="h-6 w-12" /> : (stats?.total_orders ?? 0)}
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pending Payments</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {loading ? <Skeleton className="h-6 w-12" /> : (stats?.pending_payments ?? 0)}
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase">Open Support Tickets</span>
            <LifeBuoy className="h-4 w-4 text-rose-500" />
          </div>
          <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {loading ? <Skeleton className="h-6 w-12" /> : (stats?.open_tickets ?? 0)}
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase">Renewals (Next 30d)</span>
            <RefreshCw className="h-4 w-4 text-purple-500" />
          </div>
          <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {loading ? <Skeleton className="h-6 w-12" /> : (stats?.upcoming_renewals_30_days ?? 0)}
          </span>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/customers">
          <Card className="p-6 hover:border-red-500/50 transition-all cursor-pointer">
            <Users className="h-6 w-6 text-blue-500 mb-3" />
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Customer Directory
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Search, filter, view customer portfolios, and toggle account suspension status.
            </p>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="p-6 hover:border-red-500/50 transition-all cursor-pointer">
            <ShoppingCart className="h-6 w-6 text-emerald-500 mb-3" />
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Order Orchestration
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Track provisioning lifecycles and trigger manual retries on failed server allocations.
            </p>
          </Card>
        </Link>

        <Link href="/admin/products">
          <Card className="p-6 hover:border-red-500/50 transition-all cursor-pointer">
            <Layers className="h-6 w-6 text-purple-500 mb-3" />
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Product & Pricing Management
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Create, adjust prices, edit storage quotas, and activate/deactivate TLDs or plans.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}

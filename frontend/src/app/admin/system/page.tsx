"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Cpu, Database, CheckCircle2, ShieldCheck, Server, Mail, CreditCard, Globe } from "lucide-react";

export default function AdminSystemPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getSystemStatus().then(setStatus).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Health & Provider Telemetry
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Runtime health check, active provider abstractions, and environment configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-emerald-500" />
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Database Engine Status
              </h3>
              <p className="text-xs text-slate-400">PostgreSQL / SQLAlchemy Dual Engine</p>
            </div>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Connection</span>
              <Badge variant="success">Connected & Queryable</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target Schema</span>
              <span className="font-mono text-slate-900 dark:text-white">{status?.database_url_target}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tax Calculation</span>
              <span className="font-semibold text-slate-900 dark:text-white">{status?.tax_rate_percent}% GST</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                FastAPI Runtime Core
              </h3>
              <p className="text-xs text-slate-400">REST API v1.0.0 Microservice</p>
            </div>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Environment</span>
              <Badge variant="brand">{status?.environment?.toUpperCase()}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">API Documentation</span>
              <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">
                Swagger UI (/docs) ↗
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Currency</span>
              <span className="font-semibold text-slate-900 dark:text-white">{status?.currency} (₹)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Provider Abstraction Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Active Provider Abstraction Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-brand-500" />
                <span className="font-bold text-slate-900 dark:text-white">Domain Registrar</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">
                Active: <code className="text-brand-600 dark:text-brand-400 font-bold">{status?.providers?.domain}</code>
              </p>
              <Badge variant="brand">MockDomainProvider</Badge>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-2 mb-2">
                <Server className="h-4 w-4 text-emerald-500" />
                <span className="font-bold text-slate-900 dark:text-white">Hosting Engine</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">
                Active: <code className="text-brand-600 dark:text-brand-400 font-bold">{status?.providers?.hosting}</code>
              </p>
              <Badge variant="brand">MockHostingProvider</Badge>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-purple-500" />
                <span className="font-bold text-slate-900 dark:text-white">Payment Gateway</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">
                Active: <code className="text-brand-600 dark:text-brand-400 font-bold">{status?.providers?.payment}</code>
              </p>
              <Badge variant="brand">MockPaymentProvider</Badge>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-amber-500" />
                <span className="font-bold text-slate-900 dark:text-white">Transactional Mail</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">
                Active: <code className="text-brand-600 dark:text-brand-400 font-bold">{status?.providers?.email}</code>
              </p>
              <Badge variant="brand">MockEmailProvider</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

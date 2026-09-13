"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { hostingApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  ArrowLeft,
  Server,
  HardDrive,
  Activity,
  Globe,
  Terminal,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function HostingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cpanelModalOpen, setCpanelModalOpen] = useState(false);

  useEffect(() => {
    hostingApi.getAccountDetails(id).then(setAccount).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Hosting account could not be found.</p>
        <Link href="/dashboard/hosting">
          <Button variant="outline" size="sm" className="mt-4">
            Back to Hosting
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
          <Link href="/dashboard/hosting">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {account.domain_name}
              </h1>
              <Badge variant="success">{account.status}</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Host: {account.server_hostname} • IP: {account.server_ip}
            </p>
          </div>
        </div>

        <Button onClick={() => setCpanelModalOpen(true)} className="gap-2">
          <Terminal className="h-4 w-4" />
          Open Control Panel
        </Button>
      </div>

      {/* Resource Allocation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              NVMe Disk Allocation
            </span>
            <HardDrive className="h-4 w-4 text-brand-500" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>1.4 GB Used</span>
              <span className="text-slate-500">10 GB Total</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full w-[14%]" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">High-speed PCIe Gen4 NVMe flash array</p>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Traffic
            </span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>12.4 GB Transferred</span>
              <span className="text-slate-500">Unmetered</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[12%]" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">10 Gbps redundant multi-homed backbone</p>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Account Security
            </span>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Active Container Isolation</p>
            <p className="text-[11px] text-slate-400 mt-1">PHP 8.3 • HTTP/3 enabled • Wildcard SSL Active</p>
          </div>
        </Card>
      </div>

      {/* Account Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Provisioning & System Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Provisioned Domain</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm">{account.domain_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Control Panel Username</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white text-sm">{account.cpanel_username || "nxr_user"}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Server Hostname</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white text-sm">{account.server_hostname}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Dedicated Server IP</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white text-sm">{account.server_ip}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Account Activation Date</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm">{formatDate(account.start_date)}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Current Term Expiry</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm">{formatDate(account.expiry_date)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Panel SSO Modal (Placeholder for Mock Mode) */}
      <Modal
        isOpen={cpanelModalOpen}
        onClose={() => setCpanelModalOpen(false)}
        title="Nexora Cloud Control Panel"
        description="Single Sign-On (SSO) Connection Environment"
      >
        <div className="space-y-4 pt-2 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Instance Domain</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{account.domain_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">System Username</span>
              <span className="font-mono text-slate-900 dark:text-white">{account.cpanel_username || "nxr_user"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Active Provider</span>
              <span className="font-medium text-brand-600 dark:text-brand-400">MockHostingProvider (Local Development Mode)</span>
            </div>
          </div>

          <p className="text-slate-500 leading-relaxed">
            In development mode, server provisioning and panel sessions are managed through the <code className="text-brand-600 dark:text-brand-400">MockHostingProvider</code> abstraction. When connected to live cPanel, DirectAdmin, or Kubernetes nodes in production, this button launches an authenticated direct SSO token session without exposing root credentials.
          </p>

          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => setCpanelModalOpen(false)}>
              Close Panel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

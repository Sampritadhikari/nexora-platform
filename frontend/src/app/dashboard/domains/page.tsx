"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { domainsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Globe, Plus, Settings, RefreshCw, ExternalLink } from "lucide-react";

export default function CustomerDomainsPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDomains = async () => {
    try {
      const data = await domainsApi.getUserDomains();
      setDomains(data);
    } catch (err) {
      console.error("Failed to load domains", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDomains();
  }, []);

  const handleToggleAutoRenew = async (id: string, current: boolean) => {
    try {
      await domainsApi.toggleAutoRenew(id, !current);
      setDomains((prev) =>
        prev.map((d) => (d.id === id ? { ...d, auto_renew: !current } : d))
      );
    } catch (err) {
      alert("Failed to update auto-renew preference.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Domains
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your registered domains, authoritative nameservers, and DNS routing.
          </p>
        </div>
        <Link href="/domains">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Register New Domain
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : domains.length === 0 ? (
        <EmptyState
          icon={Globe}
          title="No domains registered yet"
          description="Register your first custom domain name or transfer an existing portfolio."
          actionText="Search Domain"
          actionHref="/domains"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Expires On</TableHead>
              <TableHead>Auto-Renew</TableHead>
              <TableHead className="text-right">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((dom) => (
              <TableRow key={dom.id}>
                <TableCell className="font-semibold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-brand-500" />
                    <span>{dom.domain_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={dom.status === "ACTIVE" ? "success" : "default"}>
                    {dom.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {formatDate(dom.registration_date)}
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {formatDate(dom.expiry_date)}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleToggleAutoRenew(dom.id, dom.auto_renew)}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                      dom.auto_renew
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {dom.auto_renew ? "Enabled" : "Disabled"}
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/domains/${dom.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Settings className="h-3 w-3" />
                      Manage DNS
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

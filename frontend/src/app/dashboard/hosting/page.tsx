"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { hostingApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Server, Plus, Settings, ExternalLink } from "lucide-react";

export default function CustomerHostingPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hostingApi.getUserAccounts().then(setAccounts).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Hosting Packages
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Active cloud instances, compute metrics, and control panel credentials.
          </p>
        </div>
        <Link href="/hosting">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Hosting Package
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <EmptyState
          icon={Server}
          title="No hosting packages active"
          description="Deploy ultra-fast NVMe cloud hosting for your websites and APIs."
          actionText="Explore Hosting"
          actionHref="/hosting"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Primary Domain</TableHead>
              <TableHead>Server Hostname</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Renewal Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((acc) => (
              <TableRow key={acc.id}>
                <TableCell className="font-semibold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-emerald-500" />
                    <span>{acc.domain_name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-mono text-slate-500">
                  {acc.server_hostname}
                </TableCell>
                <TableCell>
                  <Badge variant={acc.status === "ACTIVE" ? "success" : "default"}>
                    {acc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {formatDate(acc.start_date)}
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {formatDate(acc.expiry_date)}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/hosting/${acc.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Settings className="h-3 w-3" />
                      Manage Server
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

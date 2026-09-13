"use client";

import React, { useEffect, useState } from "react";
import { renewalsApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { RefreshCw, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

export default function CustomerRenewalsPage() {
  const [renewals, setRenewals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const loadRenewals = async () => {
    try {
      const data = await renewalsApi.getUserRenewals();
      setRenewals(data);
    } catch (err) {
      console.error("Failed to load renewals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRenewals();
  }, []);

  const handleToggleAutoRenew = async (id: string, current: boolean) => {
    try {
      await renewalsApi.toggleAutoRenew(id, !current);
      setRenewals((prev) =>
        prev.map((r) => (r.id === id ? { ...r, auto_renew: !current } : r))
      );
    } catch {
      alert("Failed to toggle auto-renewal.");
    }
  };

  const handleRenewNow = async (id: string) => {
    try {
      setRenewingId(id);
      await renewalsApi.renewNow(id);
      await loadRenewals();
    } catch {
      alert("Failed to process renewal.");
    } finally {
      setRenewingId(null);
    }
  };

  const getDaysLeft = (expiryDateStr: string) => {
    const diff = new Date(expiryDateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Renewal Lifecycle Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated alerts dispatched at 30, 15, 7, and 1-day intervals prior to expiration.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : renewals.length === 0 ? (
        <EmptyState
          icon={RefreshCw}
          title="No upcoming renewals"
          description="Your active domains and hosting accounts are up to date."
          actionText="Explore Services"
          actionHref="/domains"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Resource</TableHead>
              <TableHead>Resource Type</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead>Renewal Rate</TableHead>
              <TableHead>Auto-Renew</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renewals.map((r) => {
              const daysLeft = getDaysLeft(r.expiry_date);
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {r.resource_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="brand">{r.resource_type}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {formatDate(r.expiry_date)}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 dark:text-white text-xs">
                    {formatCurrency(r.renewal_price)}/yr
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleAutoRenew(r.id, r.auto_renew)}
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                        r.auto_renew
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {r.auto_renew ? "Active" : "Off"}
                    </button>
                  </TableCell>
                  <TableCell>
                    {daysLeft <= 7 ? (
                      <Badge variant="danger" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {daysLeft} days left
                      </Badge>
                    ) : daysLeft <= 30 ? (
                      <Badge variant="warning" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {daysLeft} days left
                      </Badge>
                    ) : (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Healthy ({daysLeft}d)
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      loading={renewingId === r.id}
                      onClick={() => handleRenewNow(r.id)}
                    >
                      Renew Now
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

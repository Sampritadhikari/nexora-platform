"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { LifeBuoy, MessageSquare, Filter } from "lucide-react";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const loadTickets = async (status?: string) => {
    try {
      setLoading(true);
      const data = await adminApi.getTickets(status || undefined);
      setTickets(data);
    } catch (err) {
      console.error("Failed to load tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets(statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Support Ticket Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global ticket queue across all customer accounts.
          </p>
        </div>

        <select
          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Tickets</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="WAITING_FOR_CUSTOMER">WAITING_FOR_CUSTOMER</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          No support tickets matching this filter.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket #</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  {t.ticket_number}
                </TableCell>
                <TableCell className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm max-w-xs truncate">
                  {t.subject}
                </TableCell>
                <TableCell>
                  <Badge variant="default">{t.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={t.priority === "CRITICAL" ? "danger" : t.priority === "HIGH" ? "warning" : "default"}>
                    {t.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={t.status === "CLOSED" ? "default" : t.status === "RESOLVED" ? "success" : "brand"}>
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {formatDate(t.updated_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/support/${t.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <MessageSquare className="h-3 w-3" />
                      Reply & Resolve
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

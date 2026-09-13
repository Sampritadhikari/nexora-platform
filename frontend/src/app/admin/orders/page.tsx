"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ShoppingCart, Eye, RefreshCw } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const loadOrders = async (filter?: string) => {
    try {
      setLoading(true);
      const data = await adminApi.getOrders(filter || undefined);
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Order Orchestration & Provisioning
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track customer purchase intents, gateway confirmations, and automated server provisioning.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="PENDING">PENDING</option>
            <option value="PAYMENT_CONFIRMED">PAYMENT_CONFIRMED</option>
            <option value="PROVISIONING">PROVISIONING</option>
            <option value="PROVISIONING_FAILED">PROVISIONING_FAILED</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          No orders found matching the filter criteria.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer / Tenant ID</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total (Tax Incl.)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Placed</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  {o.order_number}
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-500 max-w-xs truncate">
                  {o.user_id}
                </TableCell>
                <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                  {o.items?.length || 1} item(s)
                </TableCell>
                <TableCell className="font-bold text-slate-900 dark:text-white text-xs">
                  {formatCurrency(o.total)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      o.status === "ACTIVE"
                        ? "success"
                        : o.status === "PROVISIONING_FAILED"
                        ? "danger"
                        : o.status === "PENDING"
                        ? "warning"
                        : "brand"
                    }
                  >
                    {o.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {formatDate(o.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/orders/${o.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      Manage Order
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

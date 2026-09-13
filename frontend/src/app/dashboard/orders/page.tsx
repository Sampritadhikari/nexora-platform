"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ordersApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ShoppingCart, Eye } from "lucide-react";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getUserOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Order History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review your purchase history, server provisioning records, and payment receipts.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No orders found"
          description="Your placed orders and billing records will appear here."
          actionText="Explore Services"
          actionHref="/hosting"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date Placed</TableHead>
              <TableHead>Line Items</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Lifecycle Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono font-medium text-slate-900 dark:text-white text-xs">
                  {o.order_number}
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {formatDate(o.created_at)}
                </TableCell>
                <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                  {o.items?.length || 1} item(s)
                </TableCell>
                <TableCell className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(o.total)}
                </TableCell>
                <TableCell>
                  <Badge variant={o.status === "ACTIVE" ? "success" : o.status === "PENDING" ? "warning" : "default"}>
                    {o.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/orders/${o.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      View Order
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

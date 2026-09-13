"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { invoicesApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { FileText, Printer } from "lucide-react";

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invoicesApi.getUserInvoices().then(setInvoices).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tax Invoices & Receipts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official GST-compliant electronic invoices generated from database transaction records.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices generated yet"
          description="Invoices are automatically issued whenever an infrastructure order is confirmed."
          actionText="View Hosting Packages"
          actionHref="/hosting"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Taxable Subtotal</TableHead>
              <TableHead>GST</TableHead>
              <TableHead>Total Paid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono font-semibold text-slate-900 dark:text-white text-xs">
                  {inv.invoice_number}
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {formatDate(inv.issued_at)}
                </TableCell>
                <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                  {formatCurrency(inv.amount)}
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {formatCurrency(inv.tax)}
                </TableCell>
                <TableCell className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(inv.total)}
                </TableCell>
                <TableCell>
                  <Badge variant="success">{inv.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/invoices/${inv.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Printer className="h-3 w-3" />
                      View Invoice
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

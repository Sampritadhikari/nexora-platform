"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { invoicesApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BRAND } from "@/config/brand";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowLeft, Printer } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";

export default function InvoiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invoicesApi.getDetails(id).then(setInvoice).finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full max-w-3xl mx-auto" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Invoice not found.</p>
        <Link href="/dashboard/invoices">
          <Button variant="outline" size="sm" className="mt-4">
            Back to Invoices
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Invoice {invoice.invoice_number}
          </h1>
        </div>
        <Button onClick={handlePrint} size="sm" className="gap-2">
          <Printer className="h-4 w-4" />
          Print / Save PDF
        </Button>
      </div>

      {/* Printable Invoice Paper */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 shadow-sm text-slate-900 dark:text-slate-100 print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="mb-2">
              <BrandLogo size="lg" />
            </div>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              {BRAND.legalName}<br />
              {BRAND.address}<br />
              Email: {BRAND.supportEmail}
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <Badge variant="success" className="text-xs px-3 py-1 uppercase tracking-wider mb-2">
              {invoice.status}
            </Badge>
            <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">
              INVOICE #: {invoice.invoice_number}
            </p>
            <p className="text-xs text-slate-500">
              Date: {formatDate(invoice.issued_at)}
            </p>
            <p className="text-xs text-slate-500">
              Currency: INR (₹)
            </p>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="my-8">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 pb-2 text-slate-400 font-semibold uppercase">
                <th className="text-left py-2">Description</th>
                <th className="text-center py-2">Billing Term</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoice.order?.items?.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-3 text-slate-900 dark:text-white font-medium">
                    {item.name}
                    <span className="block text-[11px] text-slate-400 font-normal">
                      Ref: {item.product_reference}
                    </span>
                  </td>
                  <td className="py-3 text-center text-slate-500">
                    1 Year Annual
                  </td>
                  <td className="py-3 text-right font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td className="py-3 text-slate-900 dark:text-white font-medium">
                    Infrastructure Services Package
                  </td>
                  <td className="py-3 text-center text-slate-500">Annual</td>
                  <td className="py-3 text-right font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(invoice.amount)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Subtotal / GST / Total */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal (Net)</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(invoice.amount)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (18%)</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(invoice.tax)}</span>
              </div>
              <div className="flex justify-between font-display font-bold text-base text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Paid</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer notes */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center leading-relaxed">
          <p>This is a computer-generated tax invoice verified by Nexora Automated Billing Services.</p>
          <p>For billing discrepancies or VAT queries, open a support ticket under the Billing department.</p>
        </div>
      </div>
    </div>
  );
}

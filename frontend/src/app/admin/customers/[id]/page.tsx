"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowLeft, User, Globe, Server, ShoppingCart, LifeBuoy } from "lucide-react";

export default function AdminCustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getCustomerDetails(id).then(setData).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Customer not found.</p>
        <Link href="/admin/customers">
          <Button variant="outline" size="sm" className="mt-4">
            Back to Customers
          </Button>
        </Link>
      </div>
    );
  }

  const { customer, domains, hosting, orders, tickets } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/admin/customers">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {customer.name}
              </h1>
              <Badge variant={customer.status === "ACTIVE" ? "success" : "danger"}>
                {customer.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ID: {customer.id} • Registered: {formatDate(customer.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Info Card */}
      <Card className="p-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Contact & Legal Entity Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Email Address</span>
            <span className="font-mono font-medium text-slate-900 dark:text-white text-sm">{customer.email}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Phone Number</span>
            <span className="font-medium text-slate-900 dark:text-white text-sm">{customer.phone || "Not provided"}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Company / Organization</span>
            <span className="font-medium text-slate-900 dark:text-white text-sm">{customer.company || "Individual"}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Billing Address</span>
            <span className="text-slate-700 dark:text-slate-300">{customer.address || "Not provided"}</span>
          </div>
        </div>
      </Card>

      {/* Resource Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Domains */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-brand-500" />
              <CardTitle className="text-base font-bold">Registered Domains ({domains.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {domains.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No domains registered by this customer.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {domains.map((d: any) => (
                  <div key={d.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">{d.domain_name}</span>
                      <p className="text-[11px] text-slate-400">Expires: {formatDate(d.expiry_date)}</p>
                    </div>
                    <Badge variant={d.status === "ACTIVE" ? "success" : "default"}>{d.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Hosting */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-base font-bold">Hosting Accounts ({hosting.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {hosting.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No active hosting accounts.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {hosting.map((h: any) => (
                  <div key={h.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">{h.domain_name}</span>
                      <p className="text-[11px] text-slate-400">{h.server_hostname} ({h.server_ip})</p>
                    </div>
                    <Badge variant={h.status === "ACTIVE" ? "success" : "default"}>{h.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Orders */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-indigo-500" />
            <CardTitle className="text-base font-bold">Order History ({orders.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">No orders recorded.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o: any) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs text-slate-900 dark:text-white font-medium">
                      {o.order_number}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{formatDate(o.created_at)}</TableCell>
                    <TableCell className="text-xs font-bold">{formatCurrency(o.total)}</TableCell>
                    <TableCell>
                      <Badge variant={o.status === "ACTIVE" ? "success" : "default"}>{o.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/orders/${o.id}`}>
                        <Button variant="ghost" size="sm">Inspect</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

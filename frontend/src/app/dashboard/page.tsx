"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { domainsApi, hostingApi, ordersApi, invoicesApi, renewalsApi, supportApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Globe,
  Server,
  RefreshCw,
  ShoppingCart,
  FileText,
  LifeBuoy,
  ArrowRight,
  Plus,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  const [domains, setDomains] = useState<any[]>([]);
  const [hosting, setHosting] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [renewals, setRenewals] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [domData, hostData, ordData, invData, renData, tickData] = await Promise.all([
          domainsApi.getUserDomains(),
          hostingApi.getUserAccounts(),
          ordersApi.getUserOrders(),
          invoicesApi.getUserInvoices(),
          renewalsApi.getUserRenewals(),
          supportApi.getUserTickets(),
        ]);
        setDomains(domData);
        setHosting(hostData);
        setOrders(ordData);
        setInvoices(invData);
        setRenewals(renData);
        setTickets(tickData);
      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {getGreeting()}, {firstName}.
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Infrastructure Console • Active tenant account: {user?.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/domains">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Register Domain
            </Button>
          </Link>
          <Link href="/hosting">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Server className="h-3.5 w-3.5" />
              Add Hosting
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Active Domains", val: domains.length, icon: Globe, href: "/dashboard/domains", color: "text-blue-500" },
          { label: "Active Hosting", val: hosting.length, icon: Server, href: "/dashboard/hosting", color: "text-emerald-500" },
          { label: "Upcoming Renewals", val: renewals.filter((r) => r.status === "UPCOMING").length, icon: RefreshCw, href: "/dashboard/renewals", color: "text-amber-500" },
          { label: "Total Orders", val: orders.length, icon: ShoppingCart, href: "/dashboard/orders", color: "text-indigo-500" },
          { label: "Issued Invoices", val: invoices.length, icon: FileText, href: "/dashboard/invoices", color: "text-purple-500" },
          { label: "Open Tickets", val: tickets.filter((t) => t.status !== "CLOSED").length, icon: LifeBuoy, href: "/dashboard/support", color: "text-rose-500" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link key={idx} href={item.href}>
              <Card className="hover:border-brand-500/50 transition-all p-4 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                    {item.label}
                  </span>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                {loading ? (
                  <Skeleton className="h-7 w-12" />
                ) : (
                  <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {item.val}
                  </span>
                )}
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Active Services & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Domains Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-bold">Your Active Domains</CardTitle>
            <Link href="/dashboard/domains" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : domains.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                You do not have any registered domains yet.
                <div className="mt-3">
                  <Link href="/domains">
                    <Button size="sm">Search Domain</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {domains.slice(0, 4).map((d) => (
                  <div key={d.id} className="flex items-center justify-between py-3">
                    <div>
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {d.domain_name}
                      </span>
                      <p className="text-[11px] text-slate-400">Expires {formatDate(d.expiry_date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Active</Badge>
                      <Link href={`/dashboard/domains/${d.id}`}>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Hosting Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-bold">Active Cloud Hosting</CardTitle>
            <Link href="/dashboard/hosting" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : hosting.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No active hosting packages on this account.
                <div className="mt-3">
                  <Link href="/hosting">
                    <Button size="sm">Explore Hosting</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {hosting.slice(0, 4).map((h) => (
                  <div key={h.id} className="flex items-center justify-between py-3">
                    <div>
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {h.domain_name}
                      </span>
                      <p className="text-[11px] text-slate-400">Server: {h.server_hostname}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Active</Badge>
                      <Link href={`/dashboard/hosting/${h.id}`}>
                        <Button variant="ghost" size="sm">Control Panel</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-bold">Recent Invoices & Orders</CardTitle>
          <Link href="/dashboard/orders" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            Order History <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : orders.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No orders recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 pb-2">
                    <th className="pb-2">Order #</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id}>
                      <td className="py-2.5 font-mono font-medium text-slate-900 dark:text-white">{o.order_number}</td>
                      <td className="py-2.5 text-slate-500">{formatDate(o.created_at)}</td>
                      <td className="py-2.5 font-bold">{formatCurrency(o.total)}</td>
                      <td className="py-2.5">
                        <Badge variant={o.status === "ACTIVE" ? "success" : "default"}>{o.status}</Badge>
                      </td>
                      <td className="py-2.5 text-right">
                        <Link href={`/dashboard/orders/${o.id}`}>
                          <Button variant="ghost" size="sm">Details</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

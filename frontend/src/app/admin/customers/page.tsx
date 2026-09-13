"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Users, Search, Eye, ShieldAlert, CheckCircle } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadCustomers = async (searchTerm?: string) => {
    try {
      setLoading(true);
      const data = await adminApi.getCustomers(searchTerm);
      setCustomers(data);
    } catch (err) {
      console.error("Failed to load customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCustomers(search);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const next = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (confirm(`Are you sure you want to change this customer's account status to ${next}?`)) {
      try {
        await adminApi.updateCustomerStatus(id, next);
        setCustomers((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: next } : c))
        );
      } catch (err: any) {
        alert(err.message || "Failed to update customer status.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered customer tenants, company accounts, and access status.
          </p>
        </div>
      </div>

      {/* Search Filter Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <Input
          placeholder="Search by customer name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" size="md">
          Search
        </Button>
      </form>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          No customer accounts found matching your query.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {c.name}
                </TableCell>
                <TableCell className="text-xs font-mono text-slate-600 dark:text-slate-300">
                  {c.email}
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {c.company || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={c.status === "ACTIVE" ? "success" : "danger"}>
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {formatDate(c.created_at)}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <button
                    onClick={() => handleToggleStatus(c.id, c.status)}
                    className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
                  >
                    {c.status === "ACTIVE" ? "Suspend" : "Unsuspend"}
                  </button>
                  <Link href={`/admin/customers/${c.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      View Portfolio
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

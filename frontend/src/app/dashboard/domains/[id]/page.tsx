"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { domainsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowLeft, Globe, Shield, RefreshCw, Server, Plus, Edit2, CheckCircle2 } from "lucide-react";

export default function DomainDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [domain, setDomain] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nsModalOpen, setNsModalOpen] = useState(false);
  const [dnsModalOpen, setDnsModalOpen] = useState(false);

  const [ns1, setNs1] = useState("");
  const [ns2, setNs2] = useState("");
  const [updatingNs, setUpdatingNs] = useState(false);

  // New DNS Record Form
  const [recordType, setRecordType] = useState("A");
  const [recordName, setRecordName] = useState("");
  const [recordValue, setRecordValue] = useState("");
  const [recordTtl, setRecordTtl] = useState("3600");

  const loadDetails = async () => {
    try {
      const data = await domainsApi.getDetails(id);
      setDomain(data);
      if (data.nameservers && data.nameservers.length >= 2) {
        setNs1(data.nameservers[0]);
        setNs2(data.nameservers[1]);
      }
    } catch (err) {
      console.error("Failed to fetch domain details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  const handleUpdateNameservers = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdatingNs(true);
      await domainsApi.updateNameservers(id, [ns1.trim(), ns2.trim()]);
      await loadDetails();
      setNsModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to update nameservers.");
    } finally {
      setUpdatingNs(false);
    }
  };

  const handleAddDnsRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordName || !recordValue) return;

    const newRecord = {
      type: recordType,
      name: recordName,
      value: recordValue,
      ttl: parseInt(recordTtl) || 3600,
    };

    const existingDns = domain.dns_records || [];
    setDomain({
      ...domain,
      dns_records: [...existingDns, newRecord],
    });

    setRecordName("");
    setRecordValue("");
    setDnsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Domain could not be found or access is restricted.</p>
        <Link href="/dashboard/domains">
          <Button variant="outline" size="sm" className="mt-4">
            Back to Domains
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/domains">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {domain.domain_name}
              </h1>
              <Badge variant="success">{domain.status}</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Registration Date: {formatDate(domain.registration_date)} • Expiry: {formatDate(domain.expiry_date)}
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-emerald-500" />
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">WHOIS Privacy</h4>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Protected & Masked</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-blue-500" />
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Auto-Renewal</h4>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {domain.auto_renew ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5 text-purple-500" />
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">DNS Zone</h4>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Nexora Anycast DNS</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Authoritative Nameservers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">Authoritative Nameservers</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Point your domain to custom DNS providers like Cloudflare or Nexora Default NS.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setNsModalOpen(true)} className="gap-1.5">
            <Edit2 className="h-3 w-3" />
            Change Nameservers
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(domain.nameservers || ["ns1.nexoradns.com", "ns2.nexoradns.com"]).map((ns: string, i: number) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs font-mono font-medium text-slate-700 dark:text-slate-300"
              >
                NS{i + 1}: {ns}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DNS Records Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">DNS Zone Records</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage routing records (A, CNAME, MX, TXT) across global edge nameservers.
            </p>
          </div>
          <Button size="sm" onClick={() => setDnsModalOpen(true)} className="gap-1.5">
            <Plus className="h-3 w-3" />
            Add Record
          </Button>
        </CardHeader>
        <CardContent>
          {(!domain.dns_records || domain.dns_records.length === 0) ? (
            <p className="text-xs text-slate-500 py-4 text-center">No custom DNS records present.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Host / Name</TableHead>
                  <TableHead>Value / Target</TableHead>
                  <TableHead>TTL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domain.dns_records.map((r: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Badge variant="brand">{r.type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-900 dark:text-white">
                      {r.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-300">
                      {r.value}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {r.ttl}s
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Nameserver Edit Modal */}
      <Modal
        isOpen={nsModalOpen}
        onClose={() => setNsModalOpen(false)}
        title="Update Authoritative Nameservers"
        description={`Specify custom DNS resolvers for ${domain.domain_name}`}
      >
        <form onSubmit={handleUpdateNameservers} className="space-y-4 pt-2">
          <Input
            label="Primary Nameserver (NS1) *"
            required
            value={ns1}
            onChange={(e) => setNs1(e.target.value)}
            placeholder="ns1.nexoradns.com"
          />
          <Input
            label="Secondary Nameserver (NS2) *"
            required
            value={ns2}
            onChange={(e) => setNs2(e.target.value)}
            placeholder="ns2.nexoradns.com"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setNsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={updatingNs}>
              Save Nameservers
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add DNS Record Modal */}
      <Modal
        isOpen={dnsModalOpen}
        onClose={() => setDnsModalOpen(false)}
        title="Add DNS Zone Record"
        description={`Add a host record to ${domain.domain_name}`}
      >
        <form onSubmit={handleAddDnsRecord} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Record Type
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
            >
              <option value="A">A (IPv4 Address)</option>
              <option value="CNAME">CNAME (Alias)</option>
              <option value="MX">MX (Mail Exchange)</option>
              <option value="TXT">TXT (Verification / SPF)</option>
            </select>
          </div>

          <Input
            label="Host Name *"
            required
            value={recordName}
            onChange={(e) => setRecordName(e.target.value)}
            placeholder="@ or subdomain (e.g. app)"
          />

          <Input
            label="Target / Value *"
            required
            value={recordValue}
            onChange={(e) => setRecordValue(e.target.value)}
            placeholder="IP address or host target"
          />

          <Input
            label="TTL (Seconds)"
            type="number"
            value={recordTtl}
            onChange={(e) => setRecordTtl(e.target.value)}
            placeholder="3600"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setDnsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Add Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

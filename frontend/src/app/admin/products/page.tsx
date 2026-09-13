"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Plus, Edit2, Layers, Globe, Server } from "lucide-react";

export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState<"hosting" | "tlds">("hosting");
  const [plans, setPlans] = useState<any[]>([]);
  const [tlds, setTlds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [tldModalOpen, setTldModalOpen] = useState(false);

  // New/Edit Plan state
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: 999,
    renewal_price: 999,
    storage: "10 GB NVMe",
    website_limit: 1,
    email_limit: 5,
    active: true,
  });

  // New/Edit TLD state
  const [editingTldId, setEditingTldId] = useState<string | null>(null);
  const [tldForm, setTldForm] = useState({
    tld: ".com",
    registration_price: 899,
    renewal_price: 999,
    transfer_price: 899,
    is_popular: false,
    active: true,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, tldsData] = await Promise.all([
        adminApi.getHostingPlans(),
        adminApi.getTlds(),
      ]);
      setPlans(plansData);
      setTlds(tldsData);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlanId) {
        await adminApi.updateHostingPlan(editingPlanId, planForm);
      } else {
        await adminApi.createHostingPlan({
          ...planForm,
          billing_period: "YEARLY",
          features: [
            `${planForm.website_limit} Website(s)`,
            planForm.storage,
            "Free SSL",
            "cPanel Control Panel",
          ],
        });
      }
      setPlanModalOpen(false);
      setEditingPlanId(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save hosting plan.");
    }
  };

  const handleSaveTld = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTldId) {
        await adminApi.updateTld(editingTldId, tldForm);
      } else {
        await adminApi.createTld(tldForm);
      }
      setTldModalOpen(false);
      setEditingTldId(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save TLD.");
    }
  };

  const togglePlanActive = async (plan: any) => {
    try {
      await adminApi.updateHostingPlan(plan.id, { active: !plan.active });
      await loadData();
    } catch {
      alert("Failed to update status.");
    }
  };

  const toggleTldActive = async (tld: any) => {
    try {
      await adminApi.updateTld(tld.id, { active: !tld.active });
      await loadData();
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Product Catalogue & Pricing Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Authoritative registry pricing and hosting package quotas. Changes apply immediately.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "hosting" ? (
            <Button
              size="sm"
              onClick={() => {
                setEditingPlanId(null);
                setPlanForm({
                  name: "",
                  slug: "",
                  description: "",
                  price: 999,
                  renewal_price: 999,
                  storage: "20 GB NVMe",
                  website_limit: 2,
                  email_limit: 10,
                  active: true,
                });
                setPlanModalOpen(true);
              }}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Hosting Plan
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                setEditingTldId(null);
                setTldForm({
                  tld: "",
                  registration_price: 899,
                  renewal_price: 999,
                  transfer_price: 899,
                  is_popular: false,
                  active: true,
                });
                setTldModalOpen(true);
              }}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Domain TLD
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("hosting")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "hosting"
              ? "border-red-600 text-red-600 dark:text-red-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Hosting Packages ({plans.length})
        </button>
        <button
          onClick={() => setActiveTab("tlds")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "tlds"
              ? "border-red-600 text-red-600 dark:text-red-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Domain TLDs ({tlds.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : activeTab === "hosting" ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Registration Price</TableHead>
              <TableHead>Renewal Price</TableHead>
              <TableHead>Storage</TableHead>
              <TableHead>Websites</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {p.name}
                  {p.is_popular && <Badge variant="brand" className="ml-2">Popular</Badge>}
                </TableCell>
                <TableCell className="text-xs font-mono text-slate-500">{p.slug}</TableCell>
                <TableCell className="font-bold text-xs">{formatCurrency(p.price)}/yr</TableCell>
                <TableCell className="text-xs text-slate-500">{formatCurrency(p.renewal_price)}/yr</TableCell>
                <TableCell className="text-xs">{p.storage}</TableCell>
                <TableCell className="text-xs">{p.website_limit}</TableCell>
                <TableCell>
                  <Badge variant={p.active ? "success" : "default"}>
                    {p.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <button
                    onClick={() => togglePlanActive(p)}
                    className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    {p.active ? "Deactivate" : "Activate"}
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingPlanId(p.id);
                      setPlanForm({
                        name: p.name,
                        slug: p.slug,
                        description: p.description,
                        price: p.price,
                        renewal_price: p.renewal_price,
                        storage: p.storage,
                        website_limit: p.website_limit,
                        email_limit: p.email_limit,
                        active: p.active,
                      });
                      setPlanModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TLD</TableHead>
              <TableHead>Registration Rate</TableHead>
              <TableHead>Renewal Rate</TableHead>
              <TableHead>Transfer Rate</TableHead>
              <TableHead>Popular</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tlds.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-bold text-slate-900 dark:text-white text-base">
                  {t.tld}
                </TableCell>
                <TableCell className="font-semibold text-xs">{formatCurrency(t.registration_price)}</TableCell>
                <TableCell className="text-xs text-slate-500">{formatCurrency(t.renewal_price)}</TableCell>
                <TableCell className="text-xs text-slate-500">{formatCurrency(t.transfer_price)}</TableCell>
                <TableCell>
                  <Badge variant={t.is_popular ? "brand" : "default"}>
                    {t.is_popular ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={t.active ? "success" : "default"}>
                    {t.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <button
                    onClick={() => toggleTldActive(t)}
                    className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    {t.active ? "Deactivate" : "Activate"}
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingTldId(t.id);
                      setTldForm({
                        tld: t.tld,
                        registration_price: t.registration_price,
                        renewal_price: t.renewal_price,
                        transfer_price: t.transfer_price,
                        is_popular: t.is_popular,
                        active: t.active,
                      });
                      setTldModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Plan Modal */}
      <Modal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        title={editingPlanId ? "Edit Hosting Plan" : "Create Hosting Plan"}
        description="Configure package rates and server compute quotas"
      >
        <form onSubmit={handleSavePlan} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Plan Name *"
              required
              value={planForm.name}
              onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
              placeholder="e.g. Developer Cloud"
            />
            <Input
              label="Slug *"
              required
              disabled={!!editingPlanId}
              value={planForm.slug}
              onChange={(e) => setPlanForm({ ...planForm, slug: e.target.value })}
              placeholder="e.g. developer-cloud"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              required
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-slate-100"
              value={planForm.description}
              onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Annual Registration Price (₹) *"
              type="number"
              required
              value={planForm.price}
              onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Annual Renewal Price (₹) *"
              type="number"
              required
              value={planForm.renewal_price}
              onChange={(e) => setPlanForm({ ...planForm, renewal_price: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Storage"
              value={planForm.storage}
              onChange={(e) => setPlanForm({ ...planForm, storage: e.target.value })}
            />
            <Input
              label="Websites"
              type="number"
              value={planForm.website_limit}
              onChange={(e) => setPlanForm({ ...planForm, website_limit: parseInt(e.target.value) || 1 })}
            />
            <Input
              label="Emails"
              type="number"
              value={planForm.email_limit}
              onChange={(e) => setPlanForm({ ...planForm, email_limit: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPlanModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Plan
            </Button>
          </div>
        </form>
      </Modal>

      {/* TLD Modal */}
      <Modal
        isOpen={tldModalOpen}
        onClose={() => setTldModalOpen(false)}
        title={editingTldId ? "Edit TLD Rate" : "Add New TLD"}
        description="Configure authoritative registrar rate for domain extension"
      >
        <form onSubmit={handleSaveTld} className="space-y-4 pt-2">
          <Input
            label="TLD Extension (e.g. .com, .cloud) *"
            required
            disabled={!!editingTldId}
            value={tldForm.tld}
            onChange={(e) => setTldForm({ ...tldForm, tld: e.target.value })}
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Registration Rate (₹) *"
              type="number"
              required
              value={tldForm.registration_price}
              onChange={(e) => setTldForm({ ...tldForm, registration_price: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Renewal Rate (₹) *"
              type="number"
              required
              value={tldForm.renewal_price}
              onChange={(e) => setTldForm({ ...tldForm, renewal_price: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Transfer Rate (₹) *"
              type="number"
              required
              value={tldForm.transfer_price}
              onChange={(e) => setTldForm({ ...tldForm, transfer_price: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={tldForm.is_popular}
              onChange={(e) => setTldForm({ ...tldForm, is_popular: e.target.checked })}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span>Mark as Popular Extension (Highlights on Homepage & Search)</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setTldModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save TLD
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

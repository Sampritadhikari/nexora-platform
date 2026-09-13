"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supportApi } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { LifeBuoy, Plus, MessageSquare } from "lucide-react";

export default function CustomerSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // New Ticket Form State
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("TECHNICAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadTickets = async () => {
    try {
      const data = await supportApi.getUserTickets();
      setTickets(data);
    } catch (err) {
      console.error("Failed to load tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    try {
      setSubmitting(true);
      await supportApi.createTicket({
        subject: subject.trim(),
        category,
        priority,
        message: message.trim(),
      });
      setSubject("");
      setMessage("");
      setModalOpen(false);
      await loadTickets();
    } catch (err: any) {
      alert(err.message || "Failed to submit support ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Support Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Submit inquiries directly to our systems infrastructure and network engineering team.
          </p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Create Support Ticket
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="No support tickets opened"
          description="If you experience any DNS routing, SSL, or server issues, submit a ticket for rapid response."
          actionText="Open Ticket"
          onAction={() => setModalOpen(true)}
        />
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
                  <Badge variant={t.status === "RESOLVED" || t.status === "CLOSED" ? "success" : "brand"}>
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {formatDate(t.updated_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/support/${t.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <MessageSquare className="h-3 w-3" />
                      View Conversation
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create Ticket Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Open Support Ticket"
        description="Describe your technical or billing inquiry"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4 pt-2">
          <Input
            label="Ticket Subject *"
            required
            placeholder="e.g., DNS A-record propagation or SSL renewal"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Category
              </label>
              <select
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="TECHNICAL">Technical Infrastructure</option>
                <option value="DOMAIN">Domain Registry & DNS</option>
                <option value="HOSTING">Web Hosting & Server</option>
                <option value="BILLING">Invoices & Payments</option>
                <option value="SALES">Enterprise Sales</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Priority
              </label>
              <select
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">Low (General question)</option>
                <option value="MEDIUM">Medium (Standard request)</option>
                <option value="HIGH">High (Production degraded)</option>
                <option value="CRITICAL">Critical (Service down)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Message Details *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe the issue, include domain names, error codes, or IP addresses..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={submitting}>
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

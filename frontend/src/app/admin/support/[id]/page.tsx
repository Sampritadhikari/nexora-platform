"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowLeft, Send, Shield, User, CheckCircle2 } from "lucide-react";

export default function AdminTicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const loadTicket = async () => {
    try {
      const data = await adminApi.getTicketDetails(id);
      setTicket(data);
      setNewStatus(data.status);
    } catch (err) {
      console.error("Failed to load ticket details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      setSubmitting(true);
      await adminApi.replyTicket(id, replyMessage.trim());
      setReplyMessage("");
      await loadTicket();
    } catch (err: any) {
      alert(err.message || "Failed to post staff response.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await adminApi.updateTicketStatus(id, status);
      await loadTicket();
    } catch {
      alert("Failed to update ticket status.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Ticket not found.</p>
        <Link href="/admin/support">
          <Button variant="outline" size="sm" className="mt-4">
            Back to Queue
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/admin/support">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400 font-bold">{ticket.ticket_number}</span>
              <h1 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {ticket.subject}
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Category: {ticket.category} • Priority: {ticket.priority} • Tenant: {ticket.user_id}
            </p>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-semibold"
            value={ticket.status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="WAITING_FOR_CUSTOMER">WAITING_FOR_CUSTOMER</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {ticket.messages?.map((msg: any) => {
          const isStaff = msg.sender_role === "ADMIN";
          return (
            <div
              key={msg.id}
              className={`rounded-2xl border p-5 transition-all ${
                isStaff
                  ? "border-red-300 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/20 ml-4 sm:ml-8"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mr-4 sm:mr-8"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isStaff
                        ? "bg-red-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {isStaff ? <Shield className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {msg.sender_name}
                  </span>
                  {isStaff && (
                    <Badge variant="danger" className="text-[10px] px-1.5 py-0">
                      Staff Engineer
                    </Badge>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  {formatDateTime(msg.created_at)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </p>
            </div>
          );
        })}
      </div>

      {/* Staff Reply Form */}
      <Card className="p-5">
        <form onSubmit={handleSendReply} className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Reply as Staff Engineer
          </label>
          <textarea
            rows={4}
            required
            placeholder="Write official response to customer..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button type="submit" size="sm" loading={submitting} className="gap-1.5 bg-red-600 hover:bg-red-700 text-white">
              <Send className="h-3.5 w-3.5" />
              Dispatch Staff Reply
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supportApi } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowLeft, Send, CheckCircle, Shield, User } from "lucide-react";

export default function TicketConversationPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  const loadTicket = async () => {
    try {
      const data = await supportApi.getTicketDetails(id);
      setTicket(data);
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
      await supportApi.addMessage(id, replyMessage.trim());
      setReplyMessage("");
      await loadTicket();
    } catch (err: any) {
      alert(err.message || "Failed to post reply.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseTicket = async () => {
    try {
      setClosing(true);
      await supportApi.closeTicket(id);
      await loadTicket();
    } catch {
      alert("Failed to close ticket.");
    } finally {
      setClosing(false);
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
        <Link href="/dashboard/support">
          <Button variant="outline" size="sm" className="mt-4">
            Back to Support
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
          <Link href="/dashboard/support">
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
              <Badge variant={ticket.status === "CLOSED" ? "default" : "brand"}>
                {ticket.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Category: {ticket.category} • Priority: {ticket.priority}
            </p>
          </div>
        </div>

        {ticket.status !== "CLOSED" && (
          <Button variant="outline" size="sm" onClick={handleCloseTicket} loading={closing}>
            Close Ticket
          </Button>
        )}
      </div>

      {/* Messages Thread */}
      <div className="space-y-4">
        {ticket.messages?.map((msg: any) => {
          const isStaff = msg.sender_role === "ADMIN";
          return (
            <div
              key={msg.id}
              className={`rounded-2xl border p-5 transition-all ${
                isStaff
                  ? "border-brand-300 dark:border-brand-900/60 bg-brand-50/30 dark:bg-brand-950/20 ml-4 sm:ml-8"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mr-4 sm:mr-8"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isStaff
                        ? "bg-brand-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {isStaff ? <Shield className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {msg.sender_name}
                  </span>
                  {isStaff && (
                    <Badge variant="brand" className="text-[10px] px-1.5 py-0">
                      Nexora Staff
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

      {/* Reply Form */}
      {ticket.status !== "CLOSED" ? (
        <Card className="p-5">
          <form onSubmit={handleSendReply} className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Reply to Ticket
            </label>
            <textarea
              rows={4}
              required
              placeholder="Add your response or supplementary diagnostic info..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" loading={submitting} className="gap-1.5">
                <Send className="h-3.5 w-3.5" />
                Send Message
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-500">
          This ticket has been marked as resolved and closed. If you require further assistance, please open a new ticket.
        </div>
      )}
    </div>
  );
}

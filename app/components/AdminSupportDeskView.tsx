"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, Search, Clock, CheckCircle2, AlertCircle, 
  ChevronRight, X, Loader2, ShieldCheck, Send, User, 
  Building2, Filter, RefreshCw, MessageSquare, AlertTriangle, Check
} from "lucide-react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

export default function AdminSupportDeskView() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "candidate" | "company">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all");

  // Selected ticket for resolution modal
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [targetStatus, setTargetStatus] = useState<"open" | "in_progress" | "resolved" | "closed">("resolved");
  const [saving, setSaving] = useState(false);

  const fetchTickets = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Tickets fetch error:", error.message);
      } else if (data) {
        setTickets(data);
      }
    } catch (err) {
      console.error("Error loading tickets:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    const channel = supabase
      .channel("admin_support_tickets_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_tickets" },
        () => { fetchTickets(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const openTicketModal = (t: any) => {
    setSelectedTicket(t);
    setAdminReplyText(t.admin_reply || "");
    setTargetStatus(t.status || "open");
  };

  const handleSaveResolution = async (statusOverride?: "resolved" | "closed") => {
    if (!selectedTicket) return;
    setSaving(true);

    const finalStatus = statusOverride || targetStatus;
    const isNowResolved = finalStatus === "resolved" || finalStatus === "closed";
    const resolvedAtTimestamp = isNowResolved ? new Date().toISOString() : selectedTicket.resolved_at || null;

    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({
          status: finalStatus,
          admin_reply: adminReplyText.trim() || null,
          resolved_at: resolvedAtTimestamp,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedTicket.id);

      if (error) throw error;

      // Update local state
      setTickets(prev =>
        prev.map(t =>
          t.id === selectedTicket.id
            ? { ...t, status: finalStatus, admin_reply: adminReplyText.trim(), resolved_at: resolvedAtTimestamp }
            : t
        )
      );

      setSelectedTicket(null);
      alert(`Ticket #${selectedTicket.ticket_id} updated to [${finalStatus.toUpperCase()}] successfully!`);
    } catch (err: any) {
      console.error("Failed to update ticket:", err);
      alert(`Error updating ticket: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Metrics
  const totalCount = tickets.length;
  const pendingCount = tickets.filter(t => t.status === "open").length;
  const inProgressCount = tickets.filter(t => t.status === "in_progress").length;
  const resolvedCount = tickets.filter(t => t.status === "resolved" || t.status === "closed").length;

  const filteredTickets = tickets.filter(ticket => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      ticket.ticket_id?.toLowerCase().includes(q) ||
      ticket.user_name?.toLowerCase().includes(q) ||
      ticket.user_email?.toLowerCase().includes(q) ||
      ticket.subject?.toLowerCase().includes(q) ||
      ticket.category?.toLowerCase().includes(q) ||
      ticket.description?.toLowerCase().includes(q);

    const matchesRole = roleFilter === "all" || ticket.user_type === roleFilter;

    let matchesStatus = true;
    if (statusFilter === "open") matchesStatus = ticket.status === "open";
    else if (statusFilter === "in_progress") matchesStatus = ticket.status === "in_progress";
    else if (statusFilter === "resolved") matchesStatus = ticket.status === "resolved" || ticket.status === "closed";

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Support Desk & Tickets
            {pendingCount > 0 && (
              <span className="text-xs font-black bg-rose-500 text-white px-2.5 py-1 rounded-full animate-pulse">
                {pendingCount} New Action Required
              </span>
            )}
          </h2>
          <p className="text-slate-500 font-medium mt-1 text-sm">
            Manage, investigate, and resolve support requests raised by candidates and corporate companies.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          disabled={refreshing}
          className="p-2.5 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 text-sm font-bold shrink-0 self-start sm:self-auto"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin text-[var(--primary)]" : ""} />
          <span>Sync Tickets</span>
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Inquiries</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalCount}</p>
        </Card>
        <Card className="bg-rose-50/60 border border-rose-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Open / Pending</p>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">{pendingCount}</p>
        </Card>
        <Card className="bg-blue-50/60 border border-blue-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">In Progress</p>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">{inProgressCount}</p>
        </Card>
        <Card className="bg-emerald-50/60 border border-emerald-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Resolved / Closed</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{resolvedCount}</p>
        </Card>
      </div>

      {/* SEARCH AND FILTERS */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative md:col-span-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, email, name, keywords..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[var(--primary)] outline-none transition-all"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setRoleFilter("all")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${roleFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              All Roles
            </button>
            <button
              onClick={() => setRoleFilter("candidate")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${roleFilter === "candidate" ? "bg-white text-[var(--primary)] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              <User size={13} /> Candidates
            </button>
            <button
              onClick={() => setRoleFilter("company")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${roleFilter === "company" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              <Building2 size={13} /> Companies
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setStatusFilter("all")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter("open")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === "open" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Open
            </button>
            <button
              onClick={() => setStatusFilter("in_progress")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === "in_progress" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("resolved")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === "resolved" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
            <p className="font-semibold text-sm">Loading tickets database...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50">
            <MessageSquare className="mx-auto text-slate-300 mb-2" size={44} />
            <p className="font-bold text-slate-700">No support tickets found matching criteria.</p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {filteredTickets.map((t) => {
              const isOpen = t.status === "open";
              const isInProgress = t.status === "in_progress";
              const isResolved = t.status === "resolved";
              const isCandidate = t.user_type === "candidate";

              return (
                <div
                  key={t.id}
                  onClick={() => openTicketModal(t)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isOpen 
                      ? "bg-rose-50/20 border-rose-200 hover:border-rose-300" 
                      : isInProgress 
                        ? "bg-blue-50/20 border-blue-200 hover:border-blue-300" 
                        : "bg-white border-slate-200 hover:border-[var(--primary)]/40"
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-900 border border-slate-200">
                        #{t.ticket_id}
                      </span>
                      
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isCandidate 
                          ? "bg-purple-50 text-purple-700 border border-purple-200" 
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      }`}>
                        {isCandidate ? <User size={12} /> : <Building2 size={12} />}
                        {isCandidate ? "Candidate" : "Corporate"}
                      </span>

                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20">
                        {t.category}
                      </span>

                      {t.priority === "Urgent" && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                          🔥 Urgent
                        </span>
                      )}
                      {t.priority === "High" && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                          ⚡ High Priority
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900">{t.subject}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 font-medium mt-0.5">{t.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 pt-1">
                      <span><strong>User:</strong> {t.user_name}</span>
                      <span><strong>Email:</strong> {t.user_email}</span>
                      {t.user_phone && <span><strong>Phone:</strong> {t.user_phone}</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      {isOpen && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                          <AlertTriangle size={13} className="animate-pulse" /> Action Required
                        </span>
                      )}
                      {isInProgress && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                          <Loader2 size={13} className="animate-spin" /> In Progress
                        </span>
                      )}
                      {isResolved && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 size={13} /> Resolved
                        </span>
                      )}
                      <p className="text-[10px] font-semibold text-slate-400 mt-1">
                        {t.created_at ? new Date(t.created_at).toLocaleString("en-IN") : ""}
                      </p>
                    </div>

                    <Button variant="secondary" className="text-xs px-3 py-2">
                      Review & Reply <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* RESOLUTION & REPLY MODAL */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 my-8 space-y-6"
            >
              <button
                onClick={() => setSelectedTicket(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-3 rounded-2xl bg-[var(--primary)] text-white shadow-primary">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">Support Ticket Resolution</h3>
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                      #{selectedTicket.ticket_id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Respond to user and change ticket resolution status.</p>
                </div>
              </div>

              {/* User & Issue Details Box */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-3 border-b border-slate-200 text-xs font-medium">
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Raised By</span>
                    <span className="font-extrabold text-slate-800">{selectedTicket.user_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Role</span>
                    <span className="capitalize font-bold text-slate-800">{selectedTicket.user_type}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Email</span>
                    <span className="font-bold text-slate-800">{selectedTicket.user_email}</span>
                  </div>
                  {selectedTicket.user_phone && (
                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Phone</span>
                      <span className="font-bold text-slate-800">{selectedTicket.user_phone}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Category</span>
                    <span className="font-bold text-[var(--primary)]">{selectedTicket.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Priority</span>
                    <span className={`font-bold ${selectedTicket.priority === 'Urgent' ? 'text-rose-600' : selectedTicket.priority === 'High' ? 'text-amber-600' : 'text-slate-700'}`}>{selectedTicket.priority}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-base mb-1">{selectedTicket.subject}</h4>
                  <p className="text-slate-700 font-medium whitespace-pre-wrap leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                    {selectedTicket.description}
                  </p>
                </div>
              </div>

              {/* Admin Resolution & Reply Form */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Admin Solution / Resolution Note (Visible to User)
                  </label>
                  <textarea
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    rows={4}
                    placeholder="Write the official response or action taken (e.g., 'Re-test access has been unlocked', 'Invoice updated', or 'Interview scheduled')..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-[var(--primary)] outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Update Ticket Status
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "open", label: "Open / Pending", color: "bg-rose-500" },
                      { id: "in_progress", label: "In Progress", color: "bg-blue-500" },
                      { id: "resolved", label: "Resolved", color: "bg-emerald-600" },
                      { id: "closed", label: "Closed", color: "bg-slate-700" }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setTargetStatus(st.id as any)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          targetStatus === st.id
                            ? `${st.color} text-white shadow-sm border-transparent`
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedTicket(null)}
                  className="w-full sm:w-auto px-6 py-3"
                >
                  Cancel
                </Button>

                <div className="flex-1 w-full flex flex-col sm:flex-row gap-2 justify-end">
                  <Button
                    variant="primary"
                    disabled={saving}
                    onClick={() => handleSaveResolution()}
                    className="w-full sm:w-auto py-3 px-6 shadow-sm"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="mr-1.5" />}
                    <span>Save & Update</span>
                  </Button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSaveResolution("resolved")}
                    className="w-full sm:w-auto py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Mark as Resolved & Solved
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

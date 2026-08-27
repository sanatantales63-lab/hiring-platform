"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, PlusCircle, Clock, CheckCircle2, AlertCircle, 
  Search, MessageSquare, ChevronRight, X, Loader2, ShieldCheck, 
  Send, Sparkles, AlertTriangle, FileQuestion, RefreshCw
} from "lucide-react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

interface SupportDeskViewProps {
  userType: "candidate" | "company";
  user: any;
  profileData?: any;
}

export default function SupportDeskView({ userType, user, profileData }: SupportDeskViewProps) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Form states
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<"Normal" | "High" | "Urgent">("Normal");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const candidateCategories = [
    "Online Assessment / Test Issue",
    "Profile Verification & KYC",
    "Company Interview / Shortlisting",
    "Earnings, TDS & Invoices",
    "Account / Login Issues",
    "Technical Bug / Glitch",
    "Other Help & Feedback"
  ];

  const companyCategories = [
    "Candidate Sourcing & Access",
    "Interview Scheduling / Google Meet",
    "Candidate Profile & Report Queries",
    "Billing, Invoices & Credits",
    "Account Access & Verification",
    "Technical Glitch / Bug",
    "General Support / Other"
  ];

  const categories = userType === "candidate" ? candidateCategories : companyCategories;

  const fetchTickets = async () => {
    if (!user?.id) return;
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        // Table might not be created yet in supabase or empty
        console.warn("Tickets fetch warning:", error.message);
      } else if (data) {
        setTickets(data);
      }
    } catch (err) {
      console.error("Error fetching support tickets:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Subscribe to live updates for this user's tickets
    if (user?.id) {
      const channel = supabase
        .channel(`support_tickets_user_${user.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "support_tickets", filter: `user_id=eq.${user.id}` },
          () => { fetchTickets(); }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !subject.trim() || !description.trim()) {
      alert("Please fill in all required fields (Category, Subject, Description).");
      return;
    }

    setSubmitting(true);
    const uniqueTicketId = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
    const userName = profileData?.fullName || profileData?.name || user?.email?.split("@")[0] || "User";
    const userEmail = user?.email || profileData?.email || "";
    const userPhone = profileData?.phone || "";

    try {
      const newTicketPayload = {
        ticket_id: uniqueTicketId,
        user_id: user.id,
        user_type: userType,
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        category: category,
        priority: priority,
        subject: subject.trim(),
        description: description.trim(),
        status: "open"
      };

      const { data, error } = await supabase
        .from("support_tickets")
        .insert([newTicketPayload])
        .select();

      if (error) {
        // In case table is not created yet or RLS error
        throw error;
      }

      setSubmitSuccess(uniqueTicketId);
      if (data && data.length > 0) {
        setTickets(prev => [data[0], ...prev]);
      } else {
        fetchTickets();
      }

      // Reset form
      setCategory("");
      setPriority("Normal");
      setSubject("");
      setDescription("");
    } catch (err: any) {
      console.error("Failed to create ticket:", err);
      alert(`Could not raise ticket: ${err.message || "Please make sure support_tickets table is created in Supabase."}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Stats calculation
  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status === "open" || t.status === "in_progress").length;
  const resolvedCount = tickets.filter(t => t.status === "resolved" || t.status === "closed").length;

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.ticket_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "open") return matchesSearch && (ticket.status === "open" || ticket.status === "in_progress");
    if (statusFilter === "resolved") return matchesSearch && (ticket.status === "resolved" || ticket.status === "closed");
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-[var(--primary)] text-white shadow-primary">
              <HelpCircle size={24} />
            </span>
            Help & Support Desk
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1 font-medium">
            Have a problem or inquiry? Raise a support ticket and track its live resolution here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTickets}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-[var(--border)] bg-white text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-all shadow-sm flex items-center gap-2 text-sm font-semibold"
            title="Refresh Tickets"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin text-[var(--primary)]" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <Button
            variant="primary"
            onClick={() => { setIsNewTicketOpen(true); setSubmitSuccess(null); }}
            className="flex items-center gap-2 shadow-primary"
          >
            <PlusCircle size={18} />
            <span>Raise New Ticket</span>
          </Button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4 bg-white border border-[var(--border)] shadow-soft">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Total Tickets</p>
            <p className="text-2xl font-black text-[var(--foreground)] mt-0.5">{totalCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-amber-50/40 border border-amber-200/60 shadow-soft">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Pending / Under Review</p>
            <p className="text-2xl font-black text-amber-700 mt-0.5">{openCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-emerald-50/40 border border-emerald-200/60 shadow-soft">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Resolved Tickets</p>
            <p className="text-2xl font-black text-emerald-700 mt-0.5">{resolvedCount}</p>
          </div>
        </Card>
      </div>

      {/* TICKET LISTING & FILTERS */}
      <Card className="p-6 bg-white border border-[var(--border)] shadow-soft">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Ticket ID, subject, or issue..."
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:border-[var(--primary)] focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
            <div className="flex bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)]">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === "all" ? "bg-white text-[var(--primary)] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                All ({totalCount})
              </button>
              <button
                onClick={() => setStatusFilter("open")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === "open" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                Pending ({openCount})
              </button>
              <button
                onClick={() => setStatusFilter("resolved")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === "resolved" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                Resolved ({resolvedCount})
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
            <p className="font-semibold text-sm">Loading your support tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl p-8 bg-[var(--surface)]">
            <FileQuestion className="mx-auto text-slate-300 mb-3" size={48} />
            <h4 className="text-base font-bold text-slate-700 mb-1">No Tickets Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 font-medium">
              {searchQuery || statusFilter !== "all" 
                ? "No support tickets match your current filters." 
                : "You haven't raised any support tickets yet. If you need any assistance, click below to open a ticket."}
            </p>
            <Button variant="primary" onClick={() => { setIsNewTicketOpen(true); setSubmitSuccess(null); }} className="text-xs px-5 py-2">
              <PlusCircle size={14} className="mr-1.5" /> Raise a Ticket
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((t) => {
              const isOpen = t.status === "open";
              const isInProgress = t.status === "in_progress";
              const isResolved = t.status === "resolved";
              const isClosed = t.status === "closed";

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isResolved 
                      ? "bg-emerald-50/20 border-emerald-200/70 hover:border-emerald-300" 
                      : isInProgress 
                        ? "bg-blue-50/20 border-blue-200/70 hover:border-blue-300" 
                        : "bg-white border-slate-200/90 hover:border-[var(--primary)]/40"
                  }`}
                >
                  <div className="space-y-1.5 flex-1 pr-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                        #{t.ticket_id}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/15">
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

                    <h4 className="text-base font-bold text-slate-900 line-clamp-1">{t.subject}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1 font-medium">{t.description}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      {isOpen && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                          <Clock size={13} className="animate-pulse" /> Under Review
                        </span>
                      )}
                      {isInProgress && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                          <Loader2 size={13} className="animate-spin" /> In Progress
                        </span>
                      )}
                      {isResolved && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 size={13} /> Resolved & Solved
                        </span>
                      )}
                      {isClosed && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                          Closed
                        </span>
                      )}
                      <p className="text-[10px] font-semibold text-slate-400 mt-1">
                        {t.created_at ? new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                      </p>
                    </div>

                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* MODAL 1: RAISE NEW TICKET */}
      <AnimatePresence>
        {isNewTicketOpen && (
          <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 my-8"
            >
              <button
                onClick={() => setIsNewTicketOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <X size={20} />
              </button>

              {submitSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Ticket Raised Successfully!</h3>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-md mx-auto">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Your Support Ticket ID</p>
                    <p className="text-2xl font-black font-mono text-emerald-900 mt-1">#{submitSuccess}</p>
                  </div>
                  <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
                    Our support admin team has been notified. You can track updates and solutions right from this Help & Support dashboard.
                  </p>
                  <div className="pt-4">
                    <Button variant="primary" onClick={() => setIsNewTicketOpen(false)} className="w-full sm:w-auto px-8">
                      Done & View Tickets
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateTicket} className="space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-[var(--primary)] text-white shadow-primary">
                      <PlusCircle size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">Raise a Support Ticket</h3>
                      <p className="text-xs text-slate-500 font-medium">Describe your issue in detail for quick resolution.</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Issue Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:border-[var(--primary)] focus:bg-white outline-none transition-all"
                    >
                      <option value="">-- Select Issue Category --</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Priority Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Normal", "High", "Urgent"] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setPriority(lvl)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            priority === lvl
                              ? lvl === "Urgent" 
                                ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                                : lvl === "High"
                                  ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                                  : "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {lvl === "Urgent" ? "🔥 Urgent" : lvl === "High" ? "⚡ High" : "Normal"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Subject / Problem Summary <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      placeholder="e.g. Assessment test link shows locked state"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:border-[var(--primary)] focus:bg-white outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Detailed Explanation <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows={4}
                      placeholder="Please explain what happened, candidate ID / details, or any error message you received..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-medium text-slate-800 focus:border-[var(--primary)] focus:bg-white outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsNewTicketOpen(false)}
                      className="flex-1 py-3"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submitting}
                      className="flex-1 py-3 flex items-center justify-center gap-2 shadow-primary"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      <span>{submitting ? "Submitting..." : "Submit Ticket"}</span>
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: VIEW TICKET DETAILS & ADMIN RESOLUTION */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 my-8"
            >
              <button
                onClick={() => setSelectedTicket(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                {/* Top Ticket Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black px-3 py-1 rounded-lg bg-slate-100 text-slate-900 border border-slate-200">
                        #{selectedTicket.ticket_id}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent)] text-[var(--primary)]">
                        {selectedTicket.category}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-400">
                      Created on: {new Date(selectedTicket.created_at).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    {selectedTicket.status === "open" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                        <Clock size={14} className="animate-pulse" /> Pending Review
                      </span>
                    )}
                    {selectedTicket.status === "in_progress" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                        <Loader2 size={14} className="animate-spin" /> In Progress
                      </span>
                    )}
                    {selectedTicket.status === "resolved" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                        <CheckCircle2 size={14} /> Solved & Resolved
                      </span>
                    )}
                    {selectedTicket.status === "closed" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                        Closed
                      </span>
                    )}
                  </div>
                </div>

                {/* Issue Details */}
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedTicket.subject}</h3>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 text-slate-800 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.description}
                  </div>
                </div>

                {/* ADMIN RESOLUTION BOX (If admin has replied/resolved) */}
                {selectedTicket.admin_reply ? (
                  <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-5 space-y-2 shadow-sm animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-emerald-900 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-emerald-600" />
                        Official Admin Resolution Note
                      </h4>
                      {selectedTicket.resolved_at && (
                        <span className="text-[10px] font-bold text-emerald-700">
                          {new Date(selectedTicket.resolved_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-emerald-950 whitespace-pre-wrap leading-relaxed">
                      {selectedTicket.admin_reply}
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                    <Clock size={20} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">Under Review by Support Team</p>
                      <p className="text-xs text-amber-700 mt-0.5 font-medium">
                        Our administrative engineers are currently reviewing your request. Once verified or resolved, the official resolution will appear here automatically.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button variant="secondary" onClick={() => setSelectedTicket(null)} className="px-6">
                    Close Window
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

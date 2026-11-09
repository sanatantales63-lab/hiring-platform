"use client";

import { useState, useEffect } from "react";
import { 
  Briefcase, CheckCircle2, Clock, AlertCircle, X, 
  Share2, Eye, Building2, MapPin, DollarSign, Calendar, Search, 
  ExternalLink, Copy, Check, Trash2, ArrowUpRight, MessageCircle, Filter
} from "lucide-react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

export default function AdminJobsView() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending_approval" | "active" | "closed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [shareModalJob, setShareModalJob] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs?status=all");
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Admin fetch jobs error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const handleUpdateStatus = async (job: any, newStatus: "active" | "closed" | "rejected") => {
    try {
      setActionLoading(job.id || job.job_id);
      const res = await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: job.id,
          job_id: job.job_id,
          status: newStatus,
        }),
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || "Failed to update status");

      setToastMessage(
        newStatus === "active" 
          ? `✅ Job [${job.job_id || job.title}] approved & published live! Recruiter notified via Brevo.`
          : `Job status updated to ${newStatus}.`
      );

      fetchAllJobs();
    } catch (err: any) {
      alert(err.message || "Could not update status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteJob = async (job: any) => {
    if (!confirm(`Are you sure you want to delete job "${job.title}" (${job.job_id})?`)) return;

    try {
      setActionLoading(job.id || job.job_id);
      const res = await fetch(`/api/jobs?job_id=${encodeURIComponent(job.job_id || "")}&id=${encodeURIComponent(job.id || "")}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || "Failed to delete");

      setToastMessage("Job removed successfully.");
      fetchAllJobs();
    } catch (err: any) {
      alert(err.message || "Failed to delete job.");
    } finally {
      setActionLoading(null);
    }
  };

  const getJobShareUrl = (job: any) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://resourcemania.in";
    return `${origin}/jobs?id=${encodeURIComponent(job.job_id || job.id)}`;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const pendingJobs = jobs.filter(j => j.status === "pending_approval" || !j.status);
  const activeJobs = jobs.filter(j => j.status === "active");
  const closedJobs = jobs.filter(j => j.status === "closed" || j.status === "rejected");

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = filterStatus === "all" 
      ? true 
      : filterStatus === "pending_approval"
        ? (job.status === "pending_approval" || !job.status)
        : job.status === filterStatus;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;

    return matchesStatus && (
      (job.title && job.title.toLowerCase().includes(q)) ||
      (job.company_name && job.company_name.toLowerCase().includes(q)) ||
      (job.job_id && job.job_id.toLowerCase().includes(q)) ||
      (Array.isArray(job.skills_required) && job.skills_required.some((s: string) => s.toLowerCase().includes(q))) ||
      (job.location && job.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-[var(--success-bg)] border border-[var(--success)]/20 text-[var(--success)] rounded-xl flex items-center justify-between text-xs font-semibold shadow-soft animate-in fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="cursor-pointer hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3 bg-white border border-[var(--border)] shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface)] text-[var(--primary)] flex items-center justify-center shrink-0 border border-[var(--border)]">
            <Briefcase size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Total Postings</span>
            <div className="text-xl font-black text-[var(--foreground)]">{jobs.length}</div>
          </div>
        </Card>

        <Card 
          onClick={() => setFilterStatus("pending_approval")} 
          className={`p-4 flex items-center gap-3 cursor-pointer transition-all border shadow-soft ${
            filterStatus === "pending_approval" ? "ring-2 ring-amber-500 bg-amber-50/40 border-amber-300" : "bg-white border-[var(--border)] hover:border-amber-300"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Pending Review</span>
            <div className="text-xl font-black text-amber-700 flex items-center gap-2">
              {pendingJobs.length}
              {pendingJobs.length > 0 && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold animate-pulse">
                  Action Req
                </span>
              )}
            </div>
          </div>
        </Card>

        <Card 
          onClick={() => setFilterStatus("active")} 
          className={`p-4 flex items-center gap-3 cursor-pointer transition-all border shadow-soft ${
            filterStatus === "active" ? "ring-2 ring-emerald-500 bg-emerald-50/40 border-emerald-300" : "bg-white border-[var(--border)] hover:border-emerald-300"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Live & Active</span>
            <div className="text-xl font-black text-emerald-700">{activeJobs.length}</div>
          </div>
        </Card>

        <Card 
          onClick={() => setFilterStatus("closed")} 
          className={`p-4 flex items-center gap-3 cursor-pointer transition-all border shadow-soft ${
            filterStatus === "closed" ? "ring-2 ring-slate-400 bg-[var(--surface)] border-slate-300" : "bg-white border-[var(--border)] hover:border-slate-300"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--surface)] text-[var(--muted-foreground)] flex items-center justify-center shrink-0 border border-[var(--border)]">
            <X size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Closed / Inactive</span>
            <div className="text-xl font-black text-[var(--foreground)]">{closedJobs.length}</div>
          </div>
        </Card>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[var(--border)] shadow-soft">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterStatus("all")}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filterStatus === "all" ? "bg-[var(--primary)] text-white shadow-soft" : "text-[var(--muted-foreground)] hover:bg-[var(--surface)]"
            }`}
          >
            All ({jobs.length})
          </button>
          <button
            onClick={() => setFilterStatus("pending_approval")}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filterStatus === "pending_approval" ? "bg-amber-600 text-white shadow-soft" : "text-[var(--muted-foreground)] hover:bg-[var(--surface)]"
            }`}
          >
            Pending Review ({pendingJobs.length})
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filterStatus === "active" ? "bg-emerald-600 text-white shadow-soft" : "text-[var(--muted-foreground)] hover:bg-[var(--surface)]"
            }`}
          >
            Live Active ({activeJobs.length})
          </button>
          <button
            onClick={() => setFilterStatus("closed")}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filterStatus === "closed" ? "bg-slate-700 text-white shadow-soft" : "text-[var(--muted-foreground)] hover:bg-[var(--surface)]"
            }`}
          >
            Closed ({closedJobs.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search Job ID, role, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
      </div>

      {/* Job Items List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-[var(--border)] shadow-soft">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--primary)] border-t-transparent mb-3" />
          <p className="text-xs font-semibold text-[var(--muted-foreground)]">Fetching all company job submissions...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-[var(--border)] shadow-soft">
          <Briefcase size={32} className="mx-auto text-[var(--muted-foreground)] mb-2" />
          <h4 className="text-sm font-bold text-[var(--foreground)]">No Job Postings Found</h4>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">No postings match the current filter or search criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => {
            const isPending = job.status === "pending_approval" || !job.status;
            const isActive = job.status === "active";
            const isClosed = job.status === "closed";
            const isProcessing = actionLoading === (job.id || job.job_id);

            return (
              <Card key={job.id || job.job_id} className="p-5 border-[var(--border)] bg-white hover:shadow-card transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Job Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold uppercase px-2 py-0.5 rounded-md bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20">
                        {job.job_id || "RM-JOB-PENDING"}
                      </span>
                      
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/20">
                          <Clock size={11} /> Pending Review
                        </span>
                      )}
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20">
                          <CheckCircle2 size={11} /> Published & Live
                        </span>
                      )}
                      {isClosed && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted-foreground)] border border-[var(--border)]">
                          Closed
                        </span>
                      )}

                      <span className="text-[11px] text-[var(--muted-foreground)]">
                        Submitted: {job.created_at ? new Date(job.created_at).toLocaleDateString() : "Recent"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-[var(--foreground)]">{job.title}</h4>
                      <span className="text-xs text-[var(--muted-foreground)] font-semibold flex items-center gap-1">
                        at <strong className="text-[var(--foreground)]">{job.company_name || "Company"}</strong>
                        {job.company_email && <span className="text-[11px] text-[var(--muted-foreground)] font-normal">({job.company_email})</span>}
                      </span>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ink-soft)]">
                      <span className="bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)]">
                        📍 {job.location || "Remote"}
                      </span>
                      <span className="bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)]">
                        💼 {job.experience || "1-3 Yrs"}
                      </span>
                      <span className="bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)]">
                        💰 {job.salary_range || "Competitive"}
                      </span>
                      <span className="bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)] font-medium text-[var(--foreground)]">
                        ⏱ {job.job_type || "Full-time"}
                      </span>
                    </div>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Array.isArray(job.skills_required) && job.skills_required.map((sk: string, i: number) => (
                        <span key={i} className="text-[10px] bg-[var(--accent)] text-[var(--primary)] px-2 py-0.5 rounded font-medium border border-[var(--primary)]/20">
                          {sk}
                        </span>
                      ))}
                      {job.other_skills && (
                        <span className="text-[10px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded font-medium border border-purple-100">
                          Other: {job.other_skills}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap border-t lg:border-t-0 pt-3 lg:pt-0">
                    {/* View Details */}
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedJob(job)}
                      className="py-1.5 px-3 text-xs"
                    >
                      <Eye size={14} /> View JD
                    </Button>

                    {/* Share Button */}
                    <Button
                      variant="secondary"
                      onClick={() => setShareModalJob(job)}
                      className="py-1.5 px-3 text-xs text-[var(--primary)] border-[var(--primary)]/30 bg-[var(--accent)]"
                    >
                      <Share2 size={14} /> Share
                    </Button>

                    {/* Approve & Publish Button */}
                    {isPending && (
                      <Button
                        variant="primary"
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(job, "active")}
                        className="py-1.5 px-3.5 text-xs bg-emerald-600 hover:bg-emerald-500 shadow-soft"
                      >
                        <CheckCircle2 size={14} /> Approve & Publish
                      </Button>
                    )}

                    {/* Close Job Button */}
                    {isActive && (
                      <Button
                        variant="secondary"
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(job, "closed")}
                        className="py-1.5 px-3 text-xs"
                      >
                        Mark Closed
                      </Button>
                    )}

                    {/* Reactivate if closed */}
                    {isClosed && (
                      <Button
                        variant="secondary"
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(job, "active")}
                        className="py-1.5 px-3 text-xs text-emerald-700 bg-emerald-50 border-emerald-200"
                      >
                        Re-open Job
                      </Button>
                    )}

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteJob(job)}
                      className="cursor-pointer text-xs p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Job"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* SHARE MODAL */}
      {shareModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-modal border border-[var(--border)] overflow-hidden animate-in fade-in">
            <div className="px-6 py-5 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-[var(--accent)] text-[var(--primary)] px-2 py-0.5 rounded font-bold border border-[var(--primary)]/20">
                  {shareModalJob.job_id}
                </span>
                <h3 className="text-base font-bold mt-1 text-[var(--foreground)]">Share Job Opening</h3>
              </div>
              <button
                onClick={() => setShareModalJob(null)}
                className="w-8 h-8 rounded-lg border border-[var(--border)] bg-white hover:bg-[var(--surface)] flex items-center justify-center text-[var(--foreground)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1.5 font-medium">Direct Shareable Link:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getJobShareUrl(shareModalJob)}
                    className="flex-1 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs font-mono text-[var(--foreground)] select-all"
                  />
                  <Button
                    variant="primary"
                    onClick={() => copyToClipboard(getJobShareUrl(shareModalJob))}
                    className="py-2 px-3 text-xs shrink-0"
                  >
                    {copiedLink ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                    <span>{copiedLink ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-2">
                <p className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-2">Instant Share Channels</p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `🔥 Hiring Opportunity: ${shareModalJob.title} at ${shareModalJob.company_name || 'Resourcemania'}\nJob ID: ${shareModalJob.job_id}\nLocation: ${shareModalJob.location}\nApply now on Resourcemania: ${getJobShareUrl(shareModalJob)}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-soft transition-colors text-center"
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getJobShareUrl(shareModalJob))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0077b5] hover:bg-[#006399] text-white font-bold text-xs rounded-lg shadow-soft transition-colors text-center"
                  >
                    <ExternalLink size={15} /> LinkedIn
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                <span>Public candidates can view and apply</span>
                <a
                  href={`/jobs?id=${encodeURIComponent(shareModalJob.job_id)}`}
                  target="_blank"
                  className="font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  Open Preview <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW JD MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-modal border border-[var(--border)] overflow-hidden animate-in fade-in">
            <div className="px-6 py-5 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-[var(--accent)] text-[var(--primary)] px-2 py-0.5 rounded font-bold border border-[var(--primary)]/20">
                  {selectedJob.job_id}
                </span>
                <h3 className="text-base font-bold mt-1 text-[var(--foreground)]">{selectedJob.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)]">{selectedJob.company_name} ({selectedJob.company_email || "No email"})</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-8 h-8 rounded-lg border border-[var(--border)] bg-white hover:bg-[var(--surface)] flex items-center justify-center text-[var(--foreground)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="flex flex-wrap gap-2">
                <span className="bg-[var(--surface)] px-2.5 py-1 rounded-md font-semibold text-[var(--foreground)] border border-[var(--border)]">
                  📍 {selectedJob.location || "Remote"}
                </span>
                <span className="bg-[var(--surface)] px-2.5 py-1 rounded-md font-semibold text-[var(--foreground)] border border-[var(--border)]">
                  💼 {selectedJob.experience || "1-3 Yrs"}
                </span>
                <span className="bg-[var(--surface)] px-2.5 py-1 rounded-md font-semibold text-[var(--foreground)] border border-[var(--border)]">
                  💰 {selectedJob.salary_range || "Competitive"}
                </span>
                <span className="bg-[var(--surface)] px-2.5 py-1 rounded-md font-semibold text-[var(--foreground)] border border-[var(--border)]">
                  ⏱ {selectedJob.job_type || "Full-time"}
                </span>
              </div>

              <div>
                <h5 className="font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Required Skills</h5>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(selectedJob.skills_required) && selectedJob.skills_required.map((sk: string, i: number) => (
                    <span key={i} className="bg-[var(--accent)] text-[var(--primary)] px-2.5 py-1 rounded-md border border-[var(--primary)]/20 font-medium">
                      {sk}
                    </span>
                  ))}
                  {selectedJob.other_skills && (
                    <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-md border border-purple-100 font-medium">
                      Other: {selectedJob.other_skills}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Full Job Description</h5>
                <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] whitespace-pre-wrap leading-relaxed text-[var(--foreground)]">
                  {selectedJob.description}
                </div>
              </div>

              {/* Status and Action */}
              <div className="pt-2 flex items-center justify-between border-t border-[var(--border)]">
                <span className="text-[var(--muted-foreground)] font-medium">
                  Status: <strong className="uppercase text-[var(--foreground)]">{selectedJob.status || "pending"}</strong>
                </span>
                {selectedJob.status === "pending_approval" && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleUpdateStatus(selectedJob, "active");
                      setSelectedJob(null);
                    }}
                    className="py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 shadow-soft"
                  >
                    Approve & Publish Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

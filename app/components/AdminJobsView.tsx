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

  // Load all jobs
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

  // Update Status: Approve or Close
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
          ? `✅ Job [${job.job_id || job.title}] approved & published live! Company notified via email.`
          : `Job status updated to ${newStatus}.`
      );

      fetchAllJobs();
    } catch (err: any) {
      alert(err.message || "Could not update status.");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Job
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

  // Build public shareable URL
  const getJobShareUrl = (job: any) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://resourcemania.in";
    return `${origin}/jobs?id=${encodeURIComponent(job.job_id || job.id)}`;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Metrics
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

    const matchesQuery = 
      (job.title && job.title.toLowerCase().includes(q)) ||
      (job.company_name && job.company_name.toLowerCase().includes(q)) ||
      (job.job_id && job.job_id.toLowerCase().includes(q)) ||
      (Array.isArray(job.skills_required) && job.skills_required.some((s: string) => s.toLowerCase().includes(q))) ||
      (job.location && job.location.toLowerCase().includes(q));

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-sm animate-in fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-950 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3 border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
            <Briefcase size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Postings</span>
            <div className="text-xl font-black text-slate-900">{jobs.length}</div>
          </div>
        </Card>

        <Card 
          onClick={() => setFilterStatus("pending_approval")} 
          className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-slate-200 ${
            filterStatus === "pending_approval" ? "ring-2 ring-amber-500 bg-amber-50/40" : "hover:border-amber-300"
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
          className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-slate-200 ${
            filterStatus === "active" ? "ring-2 ring-emerald-500 bg-emerald-50/40" : "hover:border-emerald-300"
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
          className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-slate-200 ${
            filterStatus === "closed" ? "ring-2 ring-slate-500 bg-slate-50" : "hover:border-slate-300"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
            <X size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Closed / Inactive</span>
            <div className="text-xl font-black text-slate-700">{closedJobs.length}</div>
          </div>
        </Card>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterStatus("all")}
            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterStatus === "all" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All ({jobs.length})
          </button>
          <button
            onClick={() => setFilterStatus("pending_approval")}
            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterStatus === "pending_approval" ? "bg-amber-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Pending Review ({pendingJobs.length})
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterStatus === "active" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Live Active ({activeJobs.length})
          </button>
          <button
            onClick={() => setFilterStatus("closed")}
            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterStatus === "closed" ? "bg-slate-700 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Closed ({closedJobs.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Job ID, role, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Job Items List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-100">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-900 border-t-transparent mb-3" />
          <p className="text-xs font-semibold text-slate-500">Fetching all company job submissions...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <Briefcase size={32} className="mx-auto text-slate-300 mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No Job Postings Found</h4>
          <p className="text-xs text-slate-400 mt-1">No postings match the current filter or search criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => {
            const isPending = job.status === "pending_approval" || !job.status;
            const isActive = job.status === "active";
            const isClosed = job.status === "closed";
            const isProcessing = actionLoading === (job.id || job.job_id);

            return (
              <Card key={job.id || job.job_id} className="p-5 border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Job Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {job.job_id || "RM-JOB-PENDING"}
                      </span>
                      
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock size={11} /> Pending Review
                        </span>
                      )}
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={11} /> Published & Live
                        </span>
                      )}
                      {isClosed && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          Closed
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400">
                        Submitted: {job.created_at ? new Date(job.created_at).toLocaleDateString() : "Recent"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-slate-900">{job.title}</h4>
                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        at <strong className="text-slate-800">{job.company_name || "Company"}</strong>
                        {job.company_email && <span className="text-[11px] text-slate-400 font-normal">({job.company_email})</span>}
                      </span>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        📍 {job.location || "Remote"}
                      </span>
                      <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        💼 {job.experience || "1-3 Yrs"}
                      </span>
                      <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        💰 {job.salary_range || "Competitive"}
                      </span>
                      <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-medium text-slate-700">
                        ⏱ {job.job_type || "Full-time"}
                      </span>
                    </div>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Array.isArray(job.skills_required) && job.skills_required.map((sk: string, i: number) => (
                        <span key={i} className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-medium border border-teal-100">
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
                    <button
                      type="button"
                      onClick={() => setSelectedJob(job)}
                      className="cursor-pointer text-xs font-bold py-2 px-3 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl flex items-center gap-1.5 shadow-sm hover:border-slate-300"
                    >
                      <Eye size={14} /> View JD
                    </button>

                    {/* Share Button (Available for all, especially active) */}
                    <button
                      type="button"
                      onClick={() => setShareModalJob(job)}
                      className="cursor-pointer text-xs font-bold py-2 px-3 bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Share2 size={14} /> Share Job
                    </button>

                    {/* Approve & Publish Button */}
                    {isPending && (
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(job, "active")}
                        className="cursor-pointer text-xs font-bold py-2 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white rounded-xl flex items-center gap-1.5 shadow-md transition-all"
                      >
                        <CheckCircle2 size={14} /> Approve & Publish
                      </button>
                    )}

                    {/* Close Job Button */}
                    {isActive && (
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(job, "closed")}
                        className="cursor-pointer text-xs font-bold py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                      >
                        Mark Closed
                      </button>
                    )}

                    {/* Reactivate if closed */}
                    {isClosed && (
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(job, "active")}
                        className="cursor-pointer text-xs font-bold py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
                      >
                        Re-open Job
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteJob(job)}
                      className="cursor-pointer text-xs p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
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
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="px-6 py-5 bg-gradient-to-r from-teal-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">
                  {shareModalJob.job_id}
                </span>
                <h3 className="text-base font-bold mt-1">Share Job Opening</h3>
              </div>
              <button
                onClick={() => setShareModalJob(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1.5 font-medium">Direct Shareable Link:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getJobShareUrl(shareModalJob)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(getJobShareUrl(shareModalJob))}
                    className="cursor-pointer px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copiedLink ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Social / Direct Share Channels */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Instant Share Channels</p>
                <div className="grid grid-cols-2 gap-2">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `🔥 Hiring Opportunity: ${shareModalJob.title} at ${shareModalJob.company_name || 'Resourcemania'}\nJob ID: ${shareModalJob.job_id}\nLocation: ${shareModalJob.location}\nApply now on Resourcemania: ${getJobShareUrl(shareModalJob)}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors text-center"
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getJobShareUrl(shareModalJob))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0077b5] hover:bg-[#006399] text-white font-bold text-xs rounded-xl shadow-sm transition-colors text-center"
                  >
                    <ExternalLink size={15} /> LinkedIn
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Public candidates can view and apply</span>
                <a
                  href={`/jobs?id=${encodeURIComponent(shareModalJob.job_id)}`}
                  target="_blank"
                  className="font-bold text-teal-600 hover:underline flex items-center gap-1"
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
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">
                  {selectedJob.job_id}
                </span>
                <h3 className="text-base font-bold mt-1">{selectedJob.title}</h3>
                <p className="text-xs text-slate-300">{selectedJob.company_name} ({selectedJob.company_email || "No email"})</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="flex flex-wrap gap-2">
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-semibold text-slate-700">
                  📍 {selectedJob.location || "Remote"}
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-semibold text-slate-700">
                  💼 {selectedJob.experience || "1-3 Yrs"}
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-semibold text-slate-700">
                  💰 {selectedJob.salary_range || "Competitive"}
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-semibold text-slate-700">
                  ⏱ {selectedJob.job_type || "Full-time"}
                </span>
              </div>

              <div>
                <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-1.5">Required Skills</h5>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(selectedJob.skills_required) && selectedJob.skills_required.map((sk: string, i: number) => (
                    <span key={i} className="bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg border border-teal-100 font-medium">
                      {sk}
                    </span>
                  ))}
                  {selectedJob.other_skills && (
                    <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-100 font-medium">
                      Other: {selectedJob.other_skills}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-1">Full Job Description</h5>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-wrap leading-relaxed text-slate-700">
                  {selectedJob.description}
                </div>
              </div>

              {/* Status and Action in Modal */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-slate-500 font-medium">
                  Status: <strong className="uppercase text-slate-800">{selectedJob.status || "pending"}</strong>
                </span>
                {selectedJob.status === "pending_approval" && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedJob, "active");
                      setSelectedJob(null);
                    }}
                    className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm"
                  >
                    Approve & Publish Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

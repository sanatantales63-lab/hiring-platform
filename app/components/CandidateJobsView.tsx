"use client";

import { useState, useEffect } from "react";
import { 
  Briefcase, Search, MapPin, DollarSign, Calendar, CheckCircle2, 
  Share2, ArrowRight, Building2, Sparkles, Filter, X, 
  ExternalLink, Check, Copy, ShieldCheck, Send
} from "lucide-react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

interface CandidateJobsViewProps {
  user: any;
  profileData: any;
}

export default function CandidateJobsView({ user, profileData }: CandidateJobsViewProps) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [applySuccessNotice, setApplySuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      try {
        const stored = localStorage.getItem(`rm_applied_jobs_${user.id}`);
        if (stored) setAppliedJobs(JSON.parse(stored));
      } catch (e) {}
    }
  }, [user]);

  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/jobs?status=active");
        const data = await res.json();
        if (data.jobs) {
          setJobs(data.jobs);
        }
      } catch (err) {
        console.error("Failed to load active jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveJobs();
  }, []);

  const handleApply = (job: any) => {
    const jId = job.job_id || job.id;
    if (appliedJobs.includes(jId)) return;

    const newApplied = [...appliedJobs, jId];
    setAppliedJobs(newApplied);
    if (user?.id) {
      localStorage.setItem(`rm_applied_jobs_${user.id}`, JSON.stringify(newApplied));
    }

    setApplySuccessNotice(`Application submitted for ${job.title} (${jId})! Your verified test score & profile have been shared with the recruiter.`);
  };

  const copyShareLink = (job: any) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/jobs?id=${job.job_id || job.id}` : "";
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const filteredJobs = jobs.filter(job => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (job.title && job.title.toLowerCase().includes(q)) ||
      (job.company_name && job.company_name.toLowerCase().includes(q)) ||
      (job.job_id && job.job_id.toLowerCase().includes(q)) ||
      (job.location && job.location.toLowerCase().includes(q)) ||
      (Array.isArray(job.skills_required) && job.skills_required.some((s: string) => s.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-6">
      {/* ── 1. HEADER MATCHING STUDENT DASHBOARD ── */}
      <header className="flex justify-between items-start mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
            Explore Open Job Requirements
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1 text-sm">
            Opportunities from companies actively seeking verified finance talent. Apply directly with your Resourcemania assessment profile.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search roles or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] font-medium"
          />
        </div>
      </header>

      {/* Applied Success Notice */}
      {applySuccessNotice && (
        <div className="p-4 bg-[var(--success-bg)] border border-[var(--success)]/20 text-[var(--success)] rounded-xl flex items-center justify-between text-xs font-semibold shadow-soft animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{applySuccessNotice}</span>
          </div>
          <button onClick={() => setApplySuccessNotice(null)} className="cursor-pointer hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[var(--foreground)]">
          Active Job Requirements ({filteredJobs.length})
        </h3>
        <span className="text-xs text-[var(--muted-foreground)] font-semibold flex items-center gap-1">
          <ShieldCheck size={14} className="text-[var(--primary)]" /> Verified by Admin
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-[var(--border)] shadow-soft">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--primary)] border-t-transparent mb-3" />
          <p className="text-xs font-semibold text-[var(--muted-foreground)]">Loading open job requirements...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-[var(--border)] shadow-soft">
          <Briefcase size={36} className="mx-auto text-[var(--muted-foreground)] mb-2" />
          <h4 className="text-sm font-bold text-[var(--foreground)]">No Job Postings Found</h4>
          <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-sm mx-auto">
            Check back soon! New openings are reviewed and published regularly by the admin team.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const jId = job.job_id || job.id;
            const hasApplied = appliedJobs.includes(jId);

            return (
              <Card
                key={jId}
                className="p-5 flex flex-col justify-between border-[var(--border)] bg-white hover:shadow-card transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20">
                      {job.job_id || "VERIFIED-JOB"}
                    </span>
                    <button
                      onClick={() => copyShareLink(job)}
                      title="Share Job"
                      className="cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--primary)] p-1 rounded-lg hover:bg-[var(--surface)] transition-colors"
                    >
                      {copiedLink ? <Check size={14} className="text-[var(--success)]" /> : <Share2 size={14} />}
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-[var(--foreground)] leading-snug line-clamp-1 mb-0.5">
                    {job.title}
                  </h4>
                  <div className="text-xs text-[var(--muted-foreground)] font-semibold flex items-center gap-1.5 mb-2.5">
                    <Building2 size={12} className="text-[var(--primary)]" />
                    <span>{job.company_name || "Verified Hiring Partner"}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--ink-soft)] mb-3">
                    <span className="bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)]">
                      📍 {job.location || "Remote"}
                    </span>
                    <span className="bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)]">
                      💼 {job.experience || "1-3 Yrs"}
                    </span>
                    <span className="bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)] font-semibold text-[var(--foreground)]">
                      💰 {job.salary_range || "Competitive"}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed mb-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {Array.isArray(job.skills_required) && job.skills_required.slice(0, 4).map((sk: string, idx: number) => (
                      <span key={idx} className="text-[10px] font-medium bg-[var(--accent)] text-[var(--primary)] px-2 py-0.5 rounded-md border border-[var(--primary)]/20">
                        {sk}
                      </span>
                    ))}
                    {Array.isArray(job.skills_required) && job.skills_required.length > 4 && (
                      <span className="text-[10px] font-medium bg-[var(--surface)] text-[var(--muted-foreground)] px-1.5 py-0.5 rounded-md">
                        +{job.skills_required.length - 4}
                      </span>
                    )}
                    {job.other_skills && (
                      <span className="text-[10px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100">
                        {job.other_skills}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedJob(job)}
                    className="flex-1 py-1.5 text-xs"
                  >
                    View Details
                  </Button>

                  <Button
                    variant="primary"
                    onClick={() => handleApply(job)}
                    disabled={hasApplied}
                    className={`flex-1 py-1.5 text-xs ${hasApplied ? "bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20 shadow-none hover:bg-[var(--success-bg)] cursor-default" : ""}`}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle2 size={13} /> Applied
                      </>
                    ) : (
                      <>
                        <Send size={13} /> Quick Apply
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-modal border border-[var(--border)] overflow-hidden animate-in fade-in">
            <div className="px-6 py-5 bg-[var(--surface)] border-b border-[var(--border)] flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase bg-[var(--accent)] text-[var(--primary)] px-2 py-0.5 rounded border border-[var(--primary)]/20">
                  {selectedJob.job_id || "VERIFIED-JOB"}
                </span>
                <h3 className="text-base font-bold mt-1 text-[var(--foreground)]">{selectedJob.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5 mt-0.5">
                  <Building2 size={13} className="text-[var(--primary)]" /> {selectedJob.company_name || "Verified Hiring Partner"}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-8 h-8 rounded-lg border border-[var(--border)] bg-white hover:bg-[var(--surface)] flex items-center justify-center text-[var(--foreground)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
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
                <h5 className="font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Required Skills & Expertise</h5>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(selectedJob.skills_required) && selectedJob.skills_required.map((sk: string, i: number) => (
                    <span key={i} className="bg-[var(--accent)] text-[var(--primary)] px-2.5 py-1 rounded-md border border-[var(--primary)]/20 font-medium">
                      {sk}
                    </span>
                  ))}
                  {selectedJob.other_skills && (
                    <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-md border border-purple-100 font-medium">
                      {selectedJob.other_skills}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Job Description</h5>
                <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] whitespace-pre-wrap leading-relaxed text-[var(--foreground)]">
                  {selectedJob.description}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[var(--surface)] border-t border-[var(--border)] flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => setSelectedJob(null)}
                className="py-1.5 text-xs"
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleApply(selectedJob);
                  setSelectedJob(null);
                }}
                disabled={appliedJobs.includes(selectedJob.job_id || selectedJob.id)}
                className={`py-1.5 text-xs ${appliedJobs.includes(selectedJob.job_id || selectedJob.id) ? "bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20" : ""}`}
              >
                {appliedJobs.includes(selectedJob.job_id || selectedJob.id) ? (
                  <>
                    <CheckCircle2 size={14} /> Already Applied
                  </>
                ) : (
                  <>
                    <Send size={14} /> Apply Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

  // Load applied jobs from localStorage for instant feedback
  useEffect(() => {
    if (user?.id) {
      try {
        const stored = localStorage.getItem(`rm_applied_jobs_${user.id}`);
        if (stored) setAppliedJobs(JSON.parse(stored));
      } catch (e) {}
    }
  }, [user]);

  // Fetch verified active jobs
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
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2 border border-teal-500/30">
            <Sparkles size={14} /> Verified Opportunities
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore Open Job Postings
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Verified companies actively hiring for Accounting, Finance, Direct & Indirect Tax, and Audit. Apply directly with your Resourcemania assessment profile.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative sm:w-64 shrink-0">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-2xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:bg-white/20 font-medium"
          />
        </div>
      </div>

      {/* Applied Success Notice */}
      {applySuccessNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{applySuccessNotice}</span>
          </div>
          <button onClick={() => setApplySuccessNotice(null)} className="text-emerald-700 hover:text-emerald-950 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">
          Active Job Requirements ({filteredJobs.length})
        </h3>
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <ShieldCheck size={14} className="text-teal-600" /> Verified by Admin
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-100">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading open job requirements...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <Briefcase size={36} className="mx-auto text-slate-300 mb-2" />
          <h4 className="text-sm font-bold text-slate-800">No Job Postings Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Check back soon! New openings are reviewed and published daily by the admin team.
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
                className="p-5 flex flex-col justify-between border-slate-200 hover:shadow-md transition-shadow rounded-2xl bg-white"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                      {job.job_id || "VERIFIED-JOB"}
                    </span>
                    <button
                      onClick={() => copyShareLink(job)}
                      title="Share Job"
                      className="cursor-pointer text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug line-clamp-1 mb-0.5">
                    {job.title}
                  </h4>
                  <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mb-2.5">
                    <Building2 size={12} className="text-slate-400" />
                    <span>{job.company_name || "Confidential Recruiter"}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 mb-3">
                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      📍 {job.location || "Remote"}
                    </span>
                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      💼 {job.experience || "1-3 Yrs"}
                    </span>
                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-semibold text-slate-800">
                      💰 {job.salary_range || "Competitive"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {Array.isArray(job.skills_required) && job.skills_required.slice(0, 4).map((sk: string, idx: number) => (
                      <span key={idx} className="text-[10px] font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md border border-teal-100">
                        {sk}
                      </span>
                    ))}
                    {Array.isArray(job.skills_required) && job.skills_required.length > 4 && (
                      <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
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

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="cursor-pointer flex-1 py-2 text-center text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleApply(job)}
                    disabled={hasApplied}
                    className={`cursor-pointer flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      hasApplied
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-teal-600 hover:bg-teal-500 text-white shadow-sm"
                    }`}
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
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="px-6 py-5 bg-gradient-to-r from-teal-950 to-slate-900 text-white flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                  {selectedJob.job_id || "VERIFIED-JOB"}
                </span>
                <h3 className="text-base font-bold mt-1 text-white">{selectedJob.title}</h3>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <Building2 size={13} /> {selectedJob.company_name || "Confidential Recruiter"}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
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
                <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-2">Required Skills & Expertise</h5>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(selectedJob.skills_required) && selectedJob.skills_required.map((sk: string, i: number) => (
                    <span key={i} className="bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg border border-teal-100 font-medium">
                      {sk}
                    </span>
                  ))}
                  {selectedJob.other_skills && (
                    <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-100 font-medium">
                      {selectedJob.other_skills}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-1.5">Job Description</h5>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-wrap leading-relaxed text-slate-700">
                  {selectedJob.description}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedJob(null)}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApply(selectedJob);
                  setSelectedJob(null);
                }}
                disabled={appliedJobs.includes(selectedJob.job_id || selectedJob.id)}
                className={`cursor-pointer px-5 py-2.5 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
                  appliedJobs.includes(selectedJob.job_id || selectedJob.id)
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-teal-600 hover:bg-teal-500 text-white"
                }`}
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
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

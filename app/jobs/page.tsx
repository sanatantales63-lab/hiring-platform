"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Briefcase, Search, MapPin, DollarSign, Calendar, CheckCircle2, 
  Share2, ArrowRight, ArrowLeft, Building2, Sparkles, Filter, X, 
  ExternalLink, Check, Copy, ShieldCheck
} from "lucide-react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const highlightedJobId = searchParams.get("id");

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>("all");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Load only approved active jobs
  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/jobs?status=active");
        const data = await res.json();
        if (data.jobs) {
          setJobs(data.jobs);

          // If a specific job_id was in the query params, auto-open it
          if (highlightedJobId) {
            const found = data.jobs.find((j: any) => j.job_id === highlightedJobId || j.id === highlightedJobId);
            if (found) {
              setSelectedJob(found);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load active jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveJobs();
  }, [highlightedJobId]);

  // Extract all unique skills across active jobs
  const allSkills = Array.from(
    new Set(
      jobs.flatMap(j => Array.isArray(j.skills_required) ? j.skills_required : [])
    )
  ).slice(0, 15);

  const filteredJobs = jobs.filter(job => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (job.title && job.title.toLowerCase().includes(q)) ||
      (job.company_name && job.company_name.toLowerCase().includes(q)) ||
      (job.job_id && job.job_id.toLowerCase().includes(q)) ||
      (job.location && job.location.toLowerCase().includes(q)) ||
      (Array.isArray(job.skills_required) && job.skills_required.some((s: string) => s.toLowerCase().includes(q)));

    const matchesSkill = selectedSkillFilter === "all" ||
      (Array.isArray(job.skills_required) && job.skills_required.includes(selectedSkillFilter));

    return matchesSearch && matchesSkill;
  });

  const copyShareLink = (job: any) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/jobs?id=${job.job_id || job.id}` : "";
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleApplyClick = (job: any) => {
    // Redirect to candidate login / profile with target job
    setAppliedNotice(`Application interest registered for ${job.title}! Please log in or sign up to finalize your verified profile submission.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pb-16">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              R
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              Resource<span className="text-teal-600">mania</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/student/login"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-2"
            >
              Candidate Login
            </Link>
            <Link
              href="/company/login"
              className="text-xs font-bold px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-teal-950 via-slate-900 to-slate-900 text-white py-14 sm:py-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-4 border border-teal-500/30">
            <Sparkles size={14} /> Verified Finance & Accounting Opportunities
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Explore Verified Careers & Hiring Openings
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            All job positions are vetted and verified directly by the Resourcemania Admin team to match skilled CA, ACCA, CMA, MBA, and Finance specialists.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="flex items-center bg-white rounded-2xl shadow-2xl p-1.5 border border-slate-200">
              <Search size={18} className="text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search job title, skills (e.g. GST, Audit, MIS), location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 mr-2">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {/* Applied Notice Banner */}
        {appliedNotice && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs font-semibold text-emerald-800 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{appliedNotice}</span>
            </div>
            <Link
              href="/student/login"
              className="ml-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shrink-0"
            >
              Go to Candidate Portal
            </Link>
          </div>
        )}

        {/* Skill Filter Tags */}
        {allSkills.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Filter size={12} /> Skill Filter:
            </span>
            <button
              onClick={() => setSelectedSkillFilter("all")}
              className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedSkillFilter === "all"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              All Skills
            </button>
            {allSkills.map((sk) => (
              <button
                key={sk}
                onClick={() => setSelectedSkillFilter(sk)}
                className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedSkillFilter === sk
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {sk}
              </button>
            ))}
          </div>
        )}

        {/* Job Listings Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Available Positions ({filteredJobs.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <ShieldCheck size={14} className="text-teal-600" /> Admin Verified
          </span>
        </div>

        {/* Grid of Jobs */}
        {loading ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading verified openings...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Briefcase size={36} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Open Positions Matching Filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try clearing your search query or skill filter to view all active openings.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedSkillFilter("all"); }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <Card
                key={job.id || job.job_id}
                className="p-5 flex flex-col justify-between border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all rounded-3xl bg-white"
              >
                <div>
                  {/* Top Bar: Job ID & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                      {job.job_id || "VERIFIED-JOB"}
                    </span>
                    <button
                      onClick={() => copyShareLink(job)}
                      title="Share Job"
                      className="cursor-pointer text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                    </button>
                  </div>

                  {/* Title & Company */}
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-1 mb-1">
                    {job.title}
                  </h3>
                  <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 mb-3">
                    <Building2 size={13} className="text-slate-400" />
                    <span>{job.company_name || "Confidential Recruiter"}</span>
                  </div>

                  {/* Metadata Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 mb-3">
                    <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      📍 {job.location || "Remote"}
                    </span>
                    <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      💼 {job.experience || "1-3 Yrs"}
                    </span>
                    <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 font-semibold text-slate-800">
                      💰 {job.salary_range || "Competitive"}
                    </span>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {Array.isArray(job.skills_required) && job.skills_required.slice(0, 3).map((sk: string, idx: number) => (
                      <span key={idx} className="text-[10px] font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md border border-teal-100">
                        {sk}
                      </span>
                    ))}
                    {Array.isArray(job.skills_required) && job.skills_required.length > 3 && (
                      <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                        +{job.skills_required.length - 3}
                      </span>
                    )}
                    {job.other_skills && (
                      <span className="text-[10px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100">
                        {job.other_skills}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="cursor-pointer flex-1 py-2 text-center text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleApplyClick(job)}
                    className="cursor-pointer flex-1 py-2 text-center text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1"
                  >
                    Apply Now <ArrowRight size={13} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* FULL JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-teal-950 to-slate-900 text-white flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                  {selectedJob.job_id || "VERIFIED-JOB"}
                </span>
                <h3 className="text-lg font-bold mt-1 text-white">{selectedJob.title}</h3>
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

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Mode</span>
                  <span className="font-bold text-slate-800 text-xs">{selectedJob.location || "Remote"}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Experience</span>
                  <span className="font-bold text-slate-800 text-xs">{selectedJob.experience || "1-3 Yrs"}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Type</span>
                  <span className="font-bold text-slate-800 text-xs">{selectedJob.job_type || "Full-time"}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Package</span>
                  <span className="font-bold text-slate-800 text-xs">{selectedJob.salary_range || "Competitive"}</span>
                </div>
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

              {/* Share Box inside Modal */}
              <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl flex items-center justify-between">
                <span className="text-[11px] text-teal-900 font-medium">Share this opening with colleagues:</span>
                <button
                  onClick={() => copyShareLink(selectedJob)}
                  className="cursor-pointer text-[11px] font-bold px-3 py-1 bg-white border border-teal-200 text-teal-700 rounded-lg shadow-2xl flex items-center gap-1 hover:bg-teal-50"
                >
                  {copiedLink ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  {copiedLink ? "Link Copied" : "Copy Link"}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedJob(null)}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                <Link
                  href="/student/login"
                  className="cursor-pointer px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  Apply with Resourcemania Profile <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent" />
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}

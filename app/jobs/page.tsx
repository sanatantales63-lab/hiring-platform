"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Briefcase, Search, MapPin, DollarSign, Calendar, CheckCircle2, 
  Share2, ArrowRight, ArrowLeft, Building2, Sparkles, Filter, X, 
  ExternalLink, Check, Copy, ShieldCheck, Menu, UserCheck
} from "lucide-react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const highlightedJobId = searchParams.get("id");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>("all");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/jobs?status=active");
        const data = await res.json();
        if (data.jobs) {
          setJobs(data.jobs);

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
    setAppliedNotice(`Application interest registered for ${job.title}! Please sign in or register to finalize your verified profile submission.`);
  };

  return (
    <div className="flex min-h-screen flex-col font-sans bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)]/10 selection:text-[var(--primary)]">
      
      {/* ── 1. EXACT ORIGINAL NAVBAR & LOGO ── */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[var(--border)] shadow-soft">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary)] text-white shadow-primary group-hover:scale-105 transition-transform">
              <Briefcase className="h-4.5 w-4.5 stroke-[2.2]" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-lg font-black tracking-tight text-[var(--foreground)] leading-none">
                Resource<span className="text-[var(--primary)]">mania</span>
              </span>
              <span className="text-[9px] font-extrabold tracking-widest uppercase text-[var(--primary)] mt-0.5">
                Verified Talent Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/" className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
              Home
            </Link>
            <Link href="/candidates" className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
              For Candidates
            </Link>
            <Link href="/companies" className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
              For Companies
            </Link>
            <Link href="/how-it-works" className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
              How it Works
            </Link>
            <Link href="/jobs" className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[var(--surface)] text-[var(--primary)]">
              Explore Jobs
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden items-center gap-2.5 md:flex">
            <button
              onClick={() => router.push('/student/login')}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/40 transition-all shadow-soft"
            >
              <span>Candidate Login</span>
            </button>
            <button
              onClick={() => router.push('/company/login')}
              className="inline-flex items-center gap-2 h-9 px-4.5 rounded-lg text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-glow)] shadow-primary transition-all"
            >
              <span>Post a Job</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => router.push('/company/login')}
              className="flex items-center gap-1 h-8 px-3 rounded-lg text-xs font-bold bg-[var(--primary)] text-white shadow-soft"
            >
              Post a Job
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--surface)]"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--border)] bg-white p-4 flex flex-col gap-1.5 z-50 animate-in fade-in">
            <Link href="/" className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">
              Home
            </Link>
            <Link href="/candidates" className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">
              For Candidates
            </Link>
            <Link href="/companies" className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">
              For Companies
            </Link>
            <Link href="/how-it-works" className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">
              How it Works
            </Link>
            <Link href="/jobs" className="px-4 py-2 rounded-lg text-xs font-bold bg-[var(--accent)] text-[var(--primary)]">
              Explore Jobs
            </Link>
            <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
              <button
                onClick={() => router.push('/student/login')}
                className="w-full flex items-center justify-center gap-2 h-9 rounded-lg text-xs font-semibold border border-[var(--border)] bg-white shadow-soft"
              >
                Candidate Login
              </button>
              <button
                onClick={() => router.push('/company/login')}
                className="w-full flex items-center justify-center gap-2 h-9 rounded-lg text-xs font-bold bg-[var(--primary)] text-white shadow-primary"
              >
                Post a Job <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── 2. HERO SECTION MATCHING CANDIDATES / COMPANIES THEME ── */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[var(--primary)]/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-5">
            <UserCheck className="h-3.5 w-3.5 text-amber-400" />
            <span>Verified Career Opportunities</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight max-w-3xl mx-auto">
            Explore Verified Finance & Accounting Openings
          </h1>

          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            All positions are reviewed and verified by Resourcemania Admin to connect verified CA, ACCA, CMA, MBA, and Finance specialists directly with employers.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-xl shadow-elevated p-1.5 border border-[var(--border)]">
              <Search size={18} className="text-[var(--muted-foreground)] ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search job title, skills (e.g. GST, Audit, MIS), location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none bg-transparent font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 mr-2 cursor-pointer">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MAIN JOB LISTING AREA ── */}
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {appliedNotice && (
          <div className="mb-6 p-4 bg-[var(--success-bg)] border border-[var(--success)]/20 rounded-xl flex items-center justify-between text-xs font-semibold text-[var(--success)] shadow-soft">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{appliedNotice}</span>
            </div>
            <Link
              href="/student/login"
              className="ml-3 px-3 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary-glow)] text-white rounded-lg font-bold shrink-0 shadow-soft"
            >
              Sign In to Apply
            </Link>
          </div>
        )}

        {/* Skill Filter Badges */}
        {allSkills.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
            <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Filter size={12} /> Filter:
            </span>
            <button
              onClick={() => setSelectedSkillFilter("all")}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedSkillFilter === "all"
                  ? "bg-[var(--primary)] text-white shadow-soft"
                  : "bg-white text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
              }`}
            >
              All Skills
            </button>
            {allSkills.map((sk) => (
              <button
                key={sk}
                onClick={() => setSelectedSkillFilter(sk)}
                className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  selectedSkillFilter === sk
                    ? "bg-[var(--primary)] text-white shadow-soft"
                    : "bg-white text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                }`}
              >
                {sk}
              </button>
            ))}
          </div>
        )}

        {/* Listing Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--foreground)]">
            Open Job Requirements ({filteredJobs.length})
          </h2>
          <span className="text-xs text-[var(--muted-foreground)] font-semibold flex items-center gap-1">
            <ShieldCheck size={14} className="text-[var(--primary)]" /> Resourcemania Verified
          </span>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="p-16 text-center bg-white rounded-xl border border-[var(--border)] shadow-soft">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--primary)] border-t-transparent mb-3" />
            <p className="text-xs font-semibold text-[var(--muted-foreground)]">Loading verified openings...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-xl border border-dashed border-[var(--border)]">
            <Briefcase size={36} className="mx-auto text-[var(--muted-foreground)] mb-3" />
            <h3 className="text-base font-bold text-[var(--foreground)]">No Matching Jobs Found</h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords or skill filters to explore all current positions.
            </p>
            <Button
              variant="secondary"
              onClick={() => { setSearchQuery(""); setSelectedSkillFilter("all"); }}
              className="mt-4 text-xs mx-auto"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <Card
                key={job.id || job.job_id}
                className="flex flex-col justify-between p-5 bg-white border border-[var(--border)] shadow-soft hover:shadow-card transition-all"
              >
                <div>
                  {/* Top Bar: Job ID & Share */}
                  <div className="flex items-center justify-between gap-2 mb-3">
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

                  <h3 className="font-display text-base font-bold text-[var(--foreground)] leading-snug line-clamp-1 mb-1">
                    {job.title}
                  </h3>
                  <div className="text-xs text-[var(--muted-foreground)] font-semibold flex items-center gap-1.5 mb-3">
                    <Building2 size={13} className="text-[var(--primary)]" />
                    <span>{job.company_name || "Verified Hiring Partner"}</span>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--ink-soft)] mb-3">
                    <span className="bg-[var(--surface)] px-2 py-0.5 rounded-md border border-[var(--border)]">
                      📍 {job.location || "Remote"}
                    </span>
                    <span className="bg-[var(--surface)] px-2 py-0.5 rounded-md border border-[var(--border)]">
                      💼 {job.experience || "1-3 Yrs"}
                    </span>
                    <span className="bg-[var(--surface)] px-2 py-0.5 rounded-md border border-[var(--border)] font-semibold text-[var(--foreground)]">
                      💰 {job.salary_range || "Competitive"}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed mb-4">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {Array.isArray(job.skills_required) && job.skills_required.slice(0, 3).map((sk: string, idx: number) => (
                      <span key={idx} className="text-[10px] font-medium bg-[var(--accent)] text-[var(--primary)] px-2 py-0.5 rounded-md border border-[var(--primary)]/20">
                        {sk}
                      </span>
                    ))}
                    {Array.isArray(job.skills_required) && job.skills_required.length > 3 && (
                      <span className="text-[10px] font-medium bg-[var(--surface)] text-[var(--muted-foreground)] px-1.5 py-0.5 rounded-md">
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
                    onClick={() => handleApplyClick(job)}
                    className="flex-1 py-1.5 text-xs"
                  >
                    Apply Now <ArrowRight size={13} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* ── 4. DETAILS MODAL ── */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-modal border border-[var(--border)] overflow-hidden animate-in fade-in">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[var(--surface)] border-b border-[var(--border)] flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase bg-[var(--accent)] text-[var(--primary)] px-2 py-0.5 rounded border border-[var(--primary)]/20">
                  {selectedJob.job_id || "VERIFIED-JOB"}
                </span>
                <h3 className="font-display text-lg font-bold mt-1 text-[var(--foreground)]">{selectedJob.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5 mt-0.5 font-medium">
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

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--muted-foreground)] block font-bold uppercase">Mode</span>
                  <span className="font-bold text-[var(--foreground)] text-xs">{selectedJob.location || "Remote"}</span>
                </div>
                <div className="p-2.5 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--muted-foreground)] block font-bold uppercase">Experience</span>
                  <span className="font-bold text-[var(--foreground)] text-xs">{selectedJob.experience || "1-3 Yrs"}</span>
                </div>
                <div className="p-2.5 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--muted-foreground)] block font-bold uppercase">Type</span>
                  <span className="font-bold text-[var(--foreground)] text-xs">{selectedJob.job_type || "Full-time"}</span>
                </div>
                <div className="p-2.5 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--muted-foreground)] block font-bold uppercase">Package</span>
                  <span className="font-bold text-[var(--foreground)] text-xs">{selectedJob.salary_range || "Competitive"}</span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Required Skills</h5>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(selectedJob.skills_required) && selectedJob.skills_required.map((sk: string, i: number) => (
                    <span key={i} className="bg-[var(--accent)] text-[var(--primary)] px-2.5 py-1 rounded-md border border-[var(--primary)]/20 font-medium text-xs">
                      {sk}
                    </span>
                  ))}
                  {selectedJob.other_skills && (
                    <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-md border border-purple-100 font-medium text-xs">
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

              {/* Share Box */}
              <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl flex items-center justify-between">
                <span className="text-[11px] text-[var(--muted-foreground)] font-medium">Share this opening:</span>
                <button
                  onClick={() => copyShareLink(selectedJob)}
                  className="cursor-pointer text-[11px] font-bold px-3 py-1 bg-white border border-[var(--border)] text-[var(--primary)] rounded-lg shadow-soft flex items-center gap-1 hover:bg-[var(--surface)]"
                >
                  {copiedLink ? <Check size={12} className="text-[var(--success)]" /> : <Copy size={12} />}
                  {copiedLink ? "Link Copied" : "Copy Link"}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
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
                  handleApplyClick(selectedJob);
                  setSelectedJob(null);
                }}
                className="py-1.5 text-xs"
              >
                Apply for Position <ArrowRight size={14} />
              </Button>
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}

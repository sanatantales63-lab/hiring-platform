"use client";

import { useState, useEffect } from "react";
import { 
  Briefcase, Plus, Search, CheckCircle2, Clock, AlertCircle, X, 
  Share2, Eye, Building2, MapPin, DollarSign, Calendar, Sparkles, Filter
} from "lucide-react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import { EXCEL_SKILLS_DATA } from "@/lib/constants";

interface CompanyJobsViewProps {
  companyId: string;
  companyName: string;
  companyEmail?: string;
}

export default function CompanyJobsView({ companyId, companyName, companyEmail }: CompanyJobsViewProps) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [otherSkills, setOtherSkills] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [experience, setExperience] = useState("1-3 Years");
  const [jobType, setJobType] = useState("Full-time");
  const [locationType, setLocationType] = useState("Remote");
  const [city, setCity] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [skillSearchQuery, setSkillSearchQuery] = useState("");

  const allAvailableSkills = Object.values(EXCEL_SKILLS_DATA).flat();

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/jobs?company_id=${encodeURIComponent(companyId)}`);
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Failed to fetch company jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      loadJobs();
    }
  }, [companyId]);

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please fill in the Job Title and Job Description.");
      return;
    }

    if (selectedSkills.length === 0 && (!showOtherInput || !otherSkills.trim())) {
      setErrorMessage("Please select at least one skill or specify a custom skill under 'Others'.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const fullLocation = locationType === "On-site" || locationType === "Hybrid" 
      ? (city ? `${city} (${locationType})` : locationType)
      : locationType;

    const payload = {
      company_id: companyId,
      company_name: companyName,
      company_email: companyEmail || "",
      title: title.trim(),
      description: description.trim(),
      skills_required: selectedSkills,
      other_skills: showOtherInput ? otherSkills.trim() : "",
      experience,
      location: fullLocation,
      job_type: jobType,
      salary_range: salaryRange.trim() || "Competitive",
    };

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        throw new Error(result.error || "Failed to post job");
      }

      setSuccessNotice(`Job successfully submitted! Your Unique Job ID is: ${result.job_id}. It is currently under admin review.`);
      setShowPostModal(false);
      resetForm();
      loadJobs();
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while publishing the job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedSkills([]);
    setOtherSkills("");
    setShowOtherInput(false);
    setExperience("1-3 Years");
    setJobType("Full-time");
    setLocationType("Remote");
    setCity("");
    setSalaryRange("");
    setSkillSearchQuery("");
  };

  const filteredSkills = allAvailableSkills.filter(s => 
    s.toLowerCase().includes(skillSearchQuery.toLowerCase())
  );

  const pendingCount = jobs.filter(j => j.status === "pending_approval" || !j.status).length;
  const activeCount = jobs.filter(j => j.status === "active").length;

  return (
    <div className="space-y-6">
      {/* ── 1. CLEAN STANDARD DASHBOARD HEADER ── */}
      <header className="flex justify-between items-start mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
            Job Postings & Requirements
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1 text-sm">
            Publish requirements to recruit verified finance talent. Every job receives a Unique Job ID and is verified by Resourcemania Admin.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setErrorMessage(null);
            setShowPostModal(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Post New Job</span>
        </Button>
      </header>

      {/* ── 2. METRIC STAT CARDS MATCHING DASHBOARD THEME ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4 bg-white border border-[var(--border)] shadow-soft">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Briefcase size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Total Postings</p>
            <p className="text-2xl font-black text-[var(--foreground)] mt-0.5">{jobs.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-amber-50/40 border border-amber-200/60 shadow-soft">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Under Admin Review</p>
            <p className="text-2xl font-black text-amber-700 mt-0.5">{pendingCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-emerald-50/40 border border-emerald-200/60 shadow-soft">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Active & Live</p>
            <p className="text-2xl font-black text-emerald-700 mt-0.5">{activeCount}</p>
          </div>
        </Card>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div className="p-4 bg-[var(--success-bg)] border border-[var(--success)]/20 rounded-xl flex items-start justify-between gap-3 text-[var(--success)] text-sm animate-in fade-in shadow-soft">
          <div className="flex items-center gap-2.5 font-medium">
            <CheckCircle2 size={20} className="shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="hover:opacity-75 cursor-pointer">
            <X size={18} />
          </button>
        </div>
      )}

      {/* ── 3. JOBS LISTING ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--foreground)]">Your Posted Requirements ({jobs.length})</h3>
          <span className="text-xs text-[var(--muted-foreground)] font-medium">Updates in real-time</span>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[var(--border)] shadow-soft">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--primary)] border-t-transparent mb-3" />
            <p className="text-xs font-medium text-[var(--muted-foreground)]">Loading your job postings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-dashed border-[var(--border)] shadow-soft">
            <div className="w-12 h-12 bg-[var(--surface)] text-[var(--primary)] rounded-xl flex items-center justify-center mx-auto mb-3 border border-[var(--border)]">
              <Briefcase size={24} />
            </div>
            <h4 className="text-sm font-bold text-[var(--foreground)] mb-1">No Jobs Posted Yet</h4>
            <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto mb-4">
              Click the "Post New Job" button to publish your requirements, specify skills from the platform list, and get matched talent.
            </p>
            <Button variant="primary" onClick={() => setShowPostModal(true)} className="text-xs mx-auto">
              <Plus size={16} /> Post Your First Job
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => {
              const isPending = job.status === "pending_approval" || !job.status;
              const isActive = job.status === "active";
              const isClosed = job.status === "closed";
              const isRejected = job.status === "rejected";

              return (
                <Card key={job.id || job.job_id} className="p-5 flex flex-col justify-between hover:shadow-card transition-all border-[var(--border)] bg-white">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20 inline-block mb-1.5">
                          {job.job_id || "JOB-PENDING"}
                        </span>
                        <h4 className="text-base font-bold text-[var(--foreground)] leading-snug line-clamp-1">{job.title}</h4>
                      </div>

                      {/* Status Badges */}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/20 shrink-0">
                          <Clock size={12} /> Under Review
                        </span>
                      )}
                      {isActive && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20 shrink-0">
                          <CheckCircle2 size={12} /> Live & Active
                        </span>
                      )}
                      {isClosed && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--surface)] text-[var(--muted-foreground)] border border-[var(--border)] shrink-0">
                          Closed
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                          <AlertCircle size={12} /> Needs Revisions
                        </span>
                      )}
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ink-soft)] mb-3">
                      <span className="inline-flex items-center gap-1 bg-[var(--surface)] px-2 py-1 rounded-lg border border-[var(--border)]">
                        <MapPin size={12} className="text-[var(--primary)]" /> {job.location || "Remote"}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-[var(--surface)] px-2 py-1 rounded-lg border border-[var(--border)]">
                        <Briefcase size={12} className="text-[var(--primary)]" /> {job.experience || "1-3 Yrs"}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-[var(--surface)] px-2 py-1 rounded-lg border border-[var(--border)] font-semibold text-[var(--foreground)]">
                        <DollarSign size={12} className="text-[var(--primary)]" /> {job.salary_range || "Competitive"}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-3 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {Array.isArray(job.skills_required) && job.skills_required.slice(0, 4).map((sk: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-medium bg-[var(--accent)] text-[var(--primary)] px-2 py-0.5 rounded-md border border-[var(--primary)]/20">
                          {sk}
                        </span>
                      ))}
                      {Array.isArray(job.skills_required) && job.skills_required.length > 4 && (
                        <span className="text-[10px] font-medium bg-[var(--surface)] text-[var(--muted-foreground)] px-1.5 py-0.5 rounded-md">
                          +{job.skills_required.length - 4} more
                        </span>
                      )}
                      {job.other_skills && (
                        <span className="text-[10px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100">
                          {job.other_skills}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[var(--muted-foreground)]">
                      Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : "Recently"}
                    </span>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="cursor-pointer inline-flex items-center gap-1 font-bold text-[var(--primary)] hover:underline"
                    >
                      <Eye size={14} /> View Details
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 4. MODAL: POST NEW JOB ── */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-modal border border-[var(--border)] overflow-hidden my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Publish New Job Requirement</h3>
                <p className="text-xs text-[var(--muted-foreground)]">Verified by Resourcemania Admin and assigned a Unique Job ID</p>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="w-8 h-8 rounded-lg border border-[var(--border)] bg-white hover:bg-[var(--surface)] flex items-center justify-center text-[var(--foreground)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-1.5">
                  Job Title / Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Financial Analyst, Statutory Audit Lead, GST Associate"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] font-medium"
                />
              </div>

              {/* Work Mode & City & Job Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-1.5">
                    Work Mode
                  </label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium bg-white"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-1.5">
                    Location / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Delhi NCR, Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract / Project Based</option>
                  </select>
                </div>
              </div>

              {/* Experience & Salary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium bg-white"
                  >
                    <option value="Fresher / Entry Level">Fresher / Entry Level (0-1 Yrs)</option>
                    <option value="1-3 Years">Junior Associate (1-3 Years)</option>
                    <option value="3-5 Years">Mid-Senior (3-5 Years)</option>
                    <option value="5-8 Years">Lead / Manager (5-8 Years)</option>
                    <option value="8+ Years">Director / VP (8+ Years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-1.5">
                    Salary / Compensation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5,00,000 - ₹8,00,000 PA or Stipend"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium"
                  />
                </div>
              </div>

              {/* Skills Dropdown & Others */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                    Required Skills (Select from platform list) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-[var(--primary)] font-bold">{selectedSkills.length} selected</span>
                </div>

                {/* Search skill bar */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    placeholder="Search finance, taxation, audit or accounting skills..."
                    value={skillSearchQuery}
                    onChange={(e) => setSkillSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                {/* Selected Skills Chips */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                    {selectedSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center gap-1 bg-[var(--primary)] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-soft"
                      >
                        {sk}
                        <button
                          type="button"
                          onClick={() => handleToggleSkill(sk)}
                          className="hover:opacity-80 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Available Skills List (Scrollable) */}
                <div className="max-h-36 overflow-y-auto border border-[var(--border)] rounded-lg p-2.5 bg-white space-y-1 scrollbar-thin">
                  <div className="flex flex-wrap gap-1.5">
                    {filteredSkills.slice(0, 30).map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleSkill(skill)}
                          className={`cursor-pointer text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                            isSelected
                              ? "bg-[var(--primary)] text-white border-[var(--primary)] font-bold shadow-soft"
                              : "bg-[var(--surface)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--accent)] font-medium"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}{skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 'Others' Custom Skill Option */}
                <div className="pt-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-[var(--foreground)] select-none">
                    <input
                      type="checkbox"
                      checked={showOtherInput}
                      onChange={(e) => setShowOtherInput(e.target.checked)}
                      className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <span>Other Skills (Not listed in dropdown)</span>
                  </label>

                  {showOtherInput && (
                    <div className="mt-2 animate-in fade-in">
                      <input
                        type="text"
                        placeholder="Type custom skills separated by commas (e.g. QuickBooks, Zoho Books, Transfer Pricing Audit)"
                        value={otherSkills}
                        onChange={(e) => setOtherSkills(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[var(--primary)]/40 bg-[var(--surface)] text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none font-medium"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-1.5">
                  Job Description & Key Responsibilities <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detail daily responsibilities, tools required, educational expectations, and deliverables..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] font-medium leading-relaxed"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPostModal(false)}
                  className="py-1.5 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="py-1.5 text-xs"
                >
                  {isSubmitting ? "Submitting for Review..." : "Submit for Admin Review"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 5. MODAL: VIEW DETAILS ── */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-modal border border-[var(--border)] overflow-hidden animate-in fade-in">
            <div className="px-6 py-5 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-[var(--accent)] text-[var(--primary)] px-2 py-0.5 rounded font-bold border border-[var(--primary)]/20">
                  {selectedJob.job_id || "JOB-PENDING"}
                </span>
                <h3 className="text-base font-bold mt-1 text-[var(--foreground)]">{selectedJob.title}</h3>
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
                      {selectedJob.other_skills}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Description</h5>
                <div className="whitespace-pre-wrap leading-relaxed bg-[var(--surface)] p-3.5 rounded-xl border border-[var(--border)] text-[var(--foreground)]">
                  {selectedJob.description}
                </div>
              </div>

              <div className="p-3 bg-[var(--surface)] rounded-xl border border-[var(--border)] flex items-center justify-between text-xs">
                <span className="text-[var(--muted-foreground)]">Status:</span>
                <span className="font-bold uppercase tracking-wider text-[var(--foreground)]">
                  {selectedJob.status === "active" ? "🟢 Live & Active" : "🟡 Under Admin Review"}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 bg-[var(--surface)] border-t border-[var(--border)] flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setSelectedJob(null)}
                className="py-1.5 text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

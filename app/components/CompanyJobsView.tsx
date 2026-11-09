"use client";

import { useState, useEffect } from "react";
import { 
  Briefcase, Plus, Search, CheckCircle2, Clock, AlertCircle, X, 
  Share2, ChevronRight, Eye, Building2, MapPin, DollarSign, Calendar, Sparkles
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

  // Flatten all skills for quick search
  const allAvailableSkills = Object.values(EXCEL_SKILLS_DATA).flat();

  // Fetch jobs for this company
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
            <Sparkles size={14} /> Recruitment Pipeline
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Job Postings & Requirements</h2>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Publish job openings directly from your verified dashboard. Every submission receives a Unique Job ID and is verified by Resourcemania for optimal candidate matching.
          </p>
        </div>
        <button
          onClick={() => {
            setErrorMessage(null);
            setShowPostModal(true);
          }}
          className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-2xl shadow-lg hover:shadow-teal-500/25 transition-all text-sm shrink-0"
        >
          <Plus size={18} strokeWidth={2.5} /> Post New Job
        </button>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start justify-between gap-3 text-emerald-800 text-sm animate-in fade-in">
          <div className="flex items-center gap-2.5 font-medium">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Jobs Listing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Your Posted Requirements ({jobs.length})</h3>
          <span className="text-xs text-slate-500 font-medium">Updates in real-time</span>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent mb-3"></div>
            <p className="text-xs font-medium text-slate-500">Loading your job postings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase size={28} />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">No Jobs Posted Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
              Click the "Post New Job" button above to publish your requirements, specify required finance and accounting skills, and get matched talent.
            </p>
            <Button variant="primary" onClick={() => setShowPostModal(true)} className="text-xs">
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
                <Card key={job.id || job.job_id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow border-slate-200/80">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 inline-block mb-1.5 font-mono">
                          {job.job_id || "JOB-PENDING"}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">{job.title}</h4>
                      </div>

                      {/* Status Badge */}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                          <Clock size={12} /> Under Review
                        </span>
                      )}
                      {isActive && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          <CheckCircle2 size={12} /> Live & Active
                        </span>
                      )}
                      {isClosed && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
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
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                      <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <MapPin size={12} className="text-slate-400" /> {job.location || "Remote"}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <Briefcase size={12} className="text-slate-400" /> {job.experience || "1-3 Yrs"}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 font-semibold text-slate-700">
                        <DollarSign size={12} className="text-slate-400" /> {job.salary_range || "Competitive"}
                      </span>
                    </div>

                    {/* Description preview */}
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {Array.isArray(job.skills_required) && job.skills_required.slice(0, 4).map((sk: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md border border-teal-100">
                          {sk}
                        </span>
                      ))}
                      {Array.isArray(job.skills_required) && job.skills_required.length > 4 && (
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
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
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : "Recently"}
                    </span>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="cursor-pointer inline-flex items-center gap-1 font-bold text-teal-600 hover:text-teal-700 hover:underline"
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

      {/* MODAL: Post New Job */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-teal-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Publish New Job Requirement</h3>
                <p className="text-xs text-slate-300">Will be verified by Admin and made live with a Unique Job ID</p>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Job Title / Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Financial Analyst, Statutory Audit Lead, GST Associate"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
                />
              </div>

              {/* Work Mode & City & Job Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Work Mode
                  </label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-medium bg-white"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Location / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Delhi NCR, Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-medium bg-white"
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-medium bg-white"
                  >
                    <option value="Fresher / Entry Level">Fresher / Entry Level (0-1 Yrs)</option>
                    <option value="1-3 Years">Junior Associate (1-3 Years)</option>
                    <option value="3-5 Years">Mid-Senior (3-5 Years)</option>
                    <option value="5-8 Years">Lead / Manager (5-8 Years)</option>
                    <option value="8+ Years">Director / VP (8+ Years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Salary / Compensation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5,00,000 - ₹8,00,000 PA or Stipend"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>
              </div>

              {/* Skills Dropdown & Others */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Required Skills (Select from platform list) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-teal-600 font-bold">{selectedSkills.length} selected</span>
                </div>

                {/* Search skill bar */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search finance, taxation, audit or accounting skills..."
                    value={skillSearchQuery}
                    onChange={(e) => setSkillSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Selected Skills Chips */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                    {selectedSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center gap-1 bg-teal-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-sm"
                      >
                        {sk}
                        <button
                          type="button"
                          onClick={() => handleToggleSkill(sk)}
                          className="hover:text-teal-200 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Available Skills List (Scrollable) */}
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2.5 bg-white space-y-1 scrollbar-thin">
                  <div className="flex flex-wrap gap-1.5">
                    {filteredSkills.slice(0, 30).map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleSkill(skill)}
                          className={`cursor-pointer text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                            isSelected
                              ? "bg-teal-500 text-white border-teal-500 font-bold shadow-sm"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium"
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
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={showOtherInput}
                      onChange={(e) => setShowOtherInput(e.target.checked)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
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
                        className="w-full px-3 py-2 rounded-xl border border-purple-300 bg-purple-50/30 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 font-medium"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Job Description & Key Responsibilities <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detail the daily responsibilities, tools required, educational background expectations, and deliverables..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md text-xs transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                      Submitting for Review...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} /> Submit for Admin Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: View Job Details */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">
                  {selectedJob.job_id || "JOB-PENDING"}
                </span>
                <h3 className="text-base font-bold mt-1">{selectedJob.title}</h3>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-semibold text-slate-700">
                  📍 {selectedJob.location || "Remote"}
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-semibold text-slate-700">
                  💼 {selectedJob.experience || "1-3 Yrs"}
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-semibold text-slate-700">
                  💰 {selectedJob.salary_range || "Competitive"}
                </span>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Skills</h5>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(selectedJob.skills_required) && selectedJob.skills_required.map((sk: string, i: number) => (
                    <span key={i} className="text-xs bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg border border-teal-100 font-medium">
                      {sk}
                    </span>
                  ))}
                  {selectedJob.other_skills && (
                    <span className="text-xs bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-100 font-medium">
                      {selectedJob.other_skills}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</h5>
                <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {selectedJob.description}
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                <span>Status:</span>
                <span className="font-bold uppercase tracking-wider">
                  {selectedJob.status === "active" ? "🟢 Live & Active" : "🟡 Under Admin Review"}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

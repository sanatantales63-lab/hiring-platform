"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Award, BadgeCheck, BarChart3, Briefcase, CheckCircle2,
  Compass, FileBadge, GraduationCap, Rocket, Sparkles, Building2,
  Twitter, Linkedin, Github, ShieldCheck, Menu, X, Check, Star, ChevronRight,
  UserCheck, FileText, Layers, Clock, Calculator, ChevronDown, ChevronUp,
  Percent, Shield, BookOpen, TrendingUp, HelpCircle
} from "lucide-react";

const TARGET_PROFILES = [
  {
    role: "Semi-Qualified CAs",
    badge: "CA Inter / Finalists",
    desc: "Candidates with cleared CA Inter or completed articleship. Excel at statutory audits, tax audits, ledger finalization, and corporate accounting.",
    skills: ["Tax Audit", "Statutory Compliance", "Balance Sheet Finalization", "TDS / GST"]
  },
  {
    role: "Company Secretaries (CS)",
    badge: "Executive / Professional",
    desc: "Specialists in corporate governance, ROC compliance, MCA filings, drafting board resolutions, secretarial audits, and statutory documentation.",
    skills: ["ROC Filings", "MCA-21", "Secretarial Audit", "Corporate Governance"]
  },
  {
    role: "CMA Professionals",
    badge: "Inter / Finalist",
    desc: "Cost & Management Accountants equipped for cost audit, operational budgeting, variance analysis, plant accounting, and profitability modeling.",
    skills: ["Cost Auditing", "Variance Analysis", "ERP Costing", "Budget Forecasting"]
  },
  {
    role: "Taxation & GST Specialists",
    badge: "Direct & Indirect Tax",
    desc: "Hands-on practitioners managing monthly GSTR-1, 3B, 9/9C reconciliation, 26AS/AIS matching, advance tax computations, and scrutiny representations.",
    skills: ["GSTR 1/3B/9", "26AS Reconciliation", "Advance Tax", "Income Tax Filing"]
  },
  {
    role: "ACCA & Global Finance",
    badge: "Global Standards",
    desc: "Professionals trained in IFRS accounting, global financial consolidation, multi-currency reporting, and international statutory disclosures.",
    skills: ["IFRS Accounting", "Financial Modeling", "Consolidated Reports", "Global Audit"]
  },
  {
    role: "Accounts & MIS Executives",
    badge: "Commerce Graduates",
    desc: "B.Com, M.Com, and MBA Finance graduates with high proficiency in Tally Prime, Zoho Books, SAP, Advanced Excel, and financial management dashboards.",
    skills: ["Tally Prime", "Zoho Books", "Advanced Excel", "MIS Reporting"]
  }
];

const PERKS = [
  { icon: BadgeCheck, t: "Verified Skill Badges", d: "Earn signed digital credentials backed by practical AI evaluations that top audit firms and companies trust instantly." },
  { icon: Compass, t: "Smart Match Engine", d: "We surface high-paying seasonal contract gigs and permanent roles matching your verified accounting competencies." },
  { icon: BarChart3, t: "Transparent Rubrics", d: "View detailed score breakdowns in GST, TDS, Tally, and Audit to pinpoint your exact strengths and career growth areas." },
  { icon: Rocket, t: "Direct Employer Intros", d: "Bypass resume black holes — get matched directly for project peaks, tax seasons, or core permanent finance positions." },
  { icon: Award, t: "Portable Proof Profile", d: "Your achievements belong to you forever. Share your cryptographically signed badges on LinkedIn, your CV, or portfolio." },
  { icon: GraduationCap, t: "Personalized Upskilling", d: "Receive targeted learning recommendations and practice rubrics calibrated to real industry standards." },
];

const STEPS = [
  {
    num: "01",
    title: "Upload Resume & Auto-Fill",
    desc: "Drop your PDF or DOCX resume. Our smart parser auto-extracts your education (CA Inter, CS, CMA, B.Com), articleship experience, and practical software tools."
  },
  {
    num: "02",
    title: "1 Practical Skill Assessment",
    desc: "Take a 20-minute proctored assessment testing practical scenarios: GST reconciliations, TDS calculations, Tally workflow, and balance sheet checks. No theoretical rote learning."
  },
  {
    num: "03",
    title: "Receive Signed Scorecard",
    desc: "Get an instant verified badge and a detailed competency breakdown. Employers view verified proof rather than an unverified resume claim."
  },
  {
    num: "04",
    title: "Get Hired on Contract or Full-Time",
    desc: "Companies and audit firms reach out directly with verified offers for high-demand tax seasons, project peaks, or permanent finance positions."
  }
];

const FAQS = [
  {
    q: "I have cleared CA Inter / I am a Semi-Qualified CA. What roles can I apply for?",
    a: "Top audit firms, corporate finance divisions, and advisory companies actively hire Semi-Qualified CAs (CA Inter cleared / completed articleship) for 3-6 month tax season contracts, statutory audit assignments, and permanent finance executive positions."
  },
  {
    q: "Is there any charge or fee for candidates on Resourcemania?",
    a: "Absolutely not! Resourcemania is 100% free for all candidates. Registration, skill assessments, scorecard verification, and job applications are completely free. We never take any cut from your salary."
  },
  {
    q: "How do short-term contract projects work?",
    a: "During tax filing seasons (July-October), audit peaks, or year-end financial closings (March-April), companies need immediate finance talent. You work on dedicated, high-paying contract projects with structured monthly payouts and flexible options to convert to permanent roles."
  },
  {
    q: "What if I want a permanent full-time job?",
    a: "You can choose both! Our platform connects you with leading enterprises and mid-market firms hiring for full-time payroll positions as well as flexible contract assignments."
  },
  {
    q: "How is my assessment score verified?",
    a: "Assessments are proctored and evaluated against practical industry rubrics. Once completed, your profile receives a tamper-proof, cryptographically signed score badge that employers can verify in 1 click."
  }
];

export default function CandidatesPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex min-h-screen flex-col font-sans bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)]/10 selection:text-[var(--primary)]">
      
      {/* ── HEADER / NAVBAR ── */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[var(--border)] shadow-soft">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
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

          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/" className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
              Home
            </Link>
            <Link href="/candidates" className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[var(--surface)] text-[var(--primary)]">
              For Candidates
            </Link>
            <Link href="/companies" className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
              For Companies
            </Link>
            <Link href="/jobs" className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
              Explore Jobs
            </Link>
            <Link href="/how-it-works" className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
              How it Works
            </Link>
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            <button
              onClick={() => router.push('/student/login')}
              className="inline-flex items-center gap-2 h-9 px-4.5 rounded-lg text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-glow)] shadow-primary transition-all"
            >
              <span>Candidate Sign In</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => router.push('/student/login')}
              className="flex items-center gap-1 h-8 px-3 rounded-lg text-xs font-bold bg-[var(--primary)] text-white shadow-soft"
            >
              Sign In
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--surface)]"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--border)] bg-white p-4 flex flex-col gap-1.5 z-50">
            <Link href="/" className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">
              Home
            </Link>
            <Link href="/candidates" className="px-4 py-2 rounded-lg text-xs font-bold bg-[var(--accent)] text-[var(--primary)]">
              For Candidates
            </Link>
            <Link href="/companies" className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">
              For Companies
            </Link>
            <Link href="/jobs" className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">
              Explore Jobs
            </Link>
            <Link href="/how-it-works" className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">
              How it Works
            </Link>
            <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
              <button
                onClick={() => router.push('/student/login')}
                className="w-full flex items-center justify-center gap-2 h-9 rounded-lg text-xs font-bold bg-[var(--primary)] text-white shadow-primary"
              >
                Candidate Sign In <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">

        {/* ── HERO SECTION ── */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white">
          <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[var(--primary)]/20 blur-[130px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              
              <div className="lg:col-span-7 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-6">
                  <UserCheck className="h-3.5 w-3.5 text-amber-400" />
                  <span>Exclusively For Finance &amp; Accounting Professionals</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                  Get high-paying contract projects<br />
                  <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    &amp; permanent roles.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base sm:text-lg text-indigo-100/80 leading-relaxed font-normal">
                  Built for Semi-Qualified CAs (CA Inter / Finalists), CS, CMAs, and Tax Specialists. Complete our practical assessment once and unlock access to high-paying short-term tax season projects, audit peaks, and permanent roles.
                </p>

                <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-3.5">
                  <button
                    onClick={() => router.push('/student/login')}
                    className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black h-12 rounded-xl px-8 text-sm hover:brightness-110 shadow-lg transition-all duration-200"
                  >
                    <span>Start Free Assessment</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <Link
                    href="/jobs"
                    className="inline-flex items-center justify-center gap-2.5 border border-white/30 bg-white/10 backdrop-blur-md text-white font-bold h-12 rounded-xl px-7 text-sm hover:bg-white/20 transition-all duration-200"
                  >
                    <span>View Open Positions</span>
                  </Link>
                </div>

                {/* Candidate Trust Guarantee */}
                <div className="mt-6 flex items-center justify-center lg:justify-start gap-4 text-xs text-indigo-200/90 font-medium">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 size={14} /> 100% Free Forever
                  </span>
                  <span>•</span>
                  <span>Zero Exam Fees</span>
                  <span>•</span>
                  <span>Zero Placement Cut</span>
                </div>
              </div>

              {/* Visual Card */}
              <div className="lg:col-span-5 hidden lg:block">
                <div className="rounded-3xl p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-indigo-600 text-white font-black font-display text-xl shadow-primary">
                      A
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">Aarav Sharma</h3>
                      <p className="text-xs text-amber-300 font-semibold">Chartered Accountant (CA Inter / Finalist)</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { name: "Practical Taxation & GST Filing", score: "98/100" },
                      { name: "Tally ERP & Audit Compliance", score: "96/100" },
                      { name: "Financial Analysis & Excel Modeling", score: "94/100" },
                    ].map((s) => (
                      <div key={s.name} className="p-3.5 rounded-xl bg-white/10 border border-white/10 flex justify-between items-center text-xs">
                        <span className="font-semibold text-indigo-100">{s.name}</span>
                        <span className="font-black text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-md border border-amber-400/30">{s.score}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-indigo-200 font-medium">
                    <span>Verified Badge Status</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Check className="h-4 w-4 stroke-[3]" /> Cryptographically Signed
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 1. TARGET PROFILES SECTION: WHO THIS IS BUILT FOR ── */}
        <section className="py-20 bg-white border-b border-[var(--border)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label mb-3">Finance Specialization</span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                Built For Qualified &amp; Semi-Qualified Finance Talent
              </h2>
              <p className="mt-4 text-base text-[var(--muted-foreground)] leading-relaxed">
                Whether you cleared CA Inter, are pursuing CS/CMA, or hold expertise in tax filing and audit compliance, Resourcemania gives you direct corporate access based on proven practical ability.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TARGET_PROFILES.map((tp) => (
                <div key={tp.role} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 hover-glow-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="font-display text-base font-bold text-[var(--foreground)]">{tp.role}</h3>
                      <span className="text-[11px] font-bold text-[var(--primary)] bg-[var(--accent)] px-2.5 py-0.5 rounded-full shrink-0">
                        {tp.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
                      {tp.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--border)]">
                    <span className="text-[11px] font-bold text-[var(--foreground)] block mb-2">Evaluated Competencies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tp.skills.map((sk) => (
                        <span key={sk} className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-[var(--border)] text-[var(--foreground)] font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. STEP-BY-STEP PATHWAY (FROM RESUME TO PLACEMENT) ── */}
        <section className="py-20 lg:py-24" style={{ background: "var(--surface)" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label mb-3">How It Works</span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                From Skill Verification to Contract or Core Job
              </h2>
              <p className="mt-4 text-base text-[var(--muted-foreground)] leading-relaxed">
                Say goodbye to sending 100s of cold resumes. Complete 1 verified assessment and let employers come to you with proof-backed offers.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <div key={step.num} className="rounded-2xl bg-white border border-[var(--border)] p-6 shadow-soft flex flex-col justify-between hover-glow-card">
                  <div>
                    <span className="font-display text-3xl font-black text-gradient block mb-4">{step.num}</span>
                    <h3 className="font-display text-base font-bold text-[var(--foreground)] mb-2">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. FLEXIBLE WORK MODELS: CONTRACT PEAKS VS PERMANENT ROLES ── */}
        <section className="py-20 bg-white border-y border-[var(--border)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label mb-3">Dual Career Opportunities</span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                Flexible Seasonal Projects or Permanent Corporate Careers
              </h2>
              <p className="mt-4 text-base text-[var(--muted-foreground)] leading-relaxed">
                Choose the model that fits your availability, CA final exam schedule, or long-term career ambition.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
              
              {/* Option A: Contract & Peak Season */}
              <div className="rounded-3xl p-8 bg-[var(--surface)] border border-[var(--border)] shadow-soft flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 uppercase tracking-wider mb-4">
                    <Clock size={13} className="text-amber-700" />
                    <span>Seasonal &amp; Contract Gigs</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[var(--foreground)] mb-2">
                    High-Yield Project Assignments
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed">
                    Ideal for CA finalists preparing for exams, semi-qualified CAs, or independent tax practitioners wanting dedicated project exposure with lucrative monthly compensation.
                  </p>

                  <ul className="space-y-3 text-xs sm:text-sm text-[var(--foreground)]">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Tax Season Rush:</strong> July to October high-demand assignments for Income Tax, TDS, and Tax Audits.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Year-End Closing:</strong> March to May financial finalization, ledger scrutiny, and stock audits.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Contract-to-Hire:</strong> Work on a 3-month project with the option to convert to full-time payroll.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--border)]">
                  <button
                    onClick={() => router.push('/jobs')}
                    className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl text-xs font-bold bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface)] shadow-soft"
                  >
                    <span>Browse Seasonal Projects</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Option B: Core Full-Time Roles */}
              <div className="rounded-3xl p-8 bg-[var(--surface)] border border-[var(--border)] shadow-soft flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 uppercase tracking-wider mb-4">
                    <Building2 size={13} className="text-emerald-700" />
                    <span>Permanent Payroll</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[var(--foreground)] mb-2">
                    Core Corporate Positions
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed">
                    Designed for finance candidates seeking long-term stability, career ladders, corporate health benefits, and leadership growth inside leading organizations.
                  </p>

                  <ul className="space-y-3 text-xs sm:text-sm text-[var(--foreground)]">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Verified Shortlisting:</strong> Skip round 1 screening calls — hiring managers view your verified scorecard first.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Top Corporate &amp; CA Firms:</strong> Match with verified companies paying benchmarked market salaries.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Direct Decision Makers:</strong> Meet Finance Directors, Partners, and CFOs directly.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--border)]">
                  <button
                    onClick={() => router.push('/student/login')}
                    className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-glow)] shadow-primary"
                  >
                    <span>Apply for Core Roles</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 4. PERKS SECTION (ORIGINAL 6 PILLARS) ── */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label mb-3">Platform Advantages</span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                Why Job Seekers Choose Resourcemania
              </h2>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PERKS.map((p) => (
                <div key={p.t} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 hover-glow-card flex flex-col justify-between">
                  <div>
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[var(--primary)] shadow-soft">
                      <p.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-base font-bold text-[var(--foreground)]">{p.t}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. CANDIDATE ZERO-FEE TRANSPARENCY SHIELD ── */}
        <section className="bg-[var(--surface)] border-y border-[var(--border)] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 sm:p-8 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 shadow-soft">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 uppercase tracking-wider mb-1">
                    Candidate Protection Guarantee
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--foreground)]">
                    100% Free for All Students &amp; Finance Job Seekers
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5 max-w-xl">
                    Resourcemania will <strong>never charge candidates</strong> any registration fee, exam fee, or cut from your salary. The hiring companies fund our platform.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 text-center">
                <div className="px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="block text-xs font-bold text-[var(--foreground)]">₹0</span>
                  <span className="text-[10px] text-[var(--muted-foreground)]">Registration</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="block text-xs font-bold text-[var(--foreground)]">₹0</span>
                  <span className="text-[10px] text-[var(--muted-foreground)]">Assessment</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="block text-xs font-bold text-[var(--foreground)]">100%</span>
                  <span className="text-[10px] text-[var(--muted-foreground)]">Salary to You</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. FREQUENTLY ASKED QUESTIONS ── */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="section-label mb-3">Got Questions?</span>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
                Frequently Asked Questions for Candidates
              </h2>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-sm sm:text-base text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp size={18} className="shrink-0 text-[var(--primary)]" />
                    ) : (
                      <ChevronDown size={18} className="shrink-0 text-[var(--muted-foreground)]" />
                    )}
                  </button>

                  {openFaq === i && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed border-t border-[var(--border)]/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. FINAL HIGH-CONVERTING BOTTOM CTA ── */}
        <section className="py-16 bg-gradient-to-br from-[var(--primary)] via-indigo-900 to-slate-950 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-amber-300 mb-4 border border-white/20">
              Get Discovered on Merit
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready to Showcase Your Verified Finance Skills?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-indigo-100/90 max-w-xl mx-auto leading-relaxed">
              Join semi-qualified CAs, CS, CMAs, and taxation professionals building lucrative careers on Resourcemania.
            </p>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <button
                onClick={() => router.push('/student/login')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black h-12 rounded-xl px-8 text-sm hover:brightness-110 shadow-lg transition-all"
              >
                <span>Start Free Assessment</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-md text-white font-bold h-12 rounded-xl px-7 text-sm hover:bg-white/20 transition-all"
              >
                <span>Explore Verified Openings</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-[var(--border)] py-10 text-xs text-[var(--muted-foreground)]">
        <div className="mx-auto max-w-7xl px-4 text-center sm:flex sm:justify-between sm:items-center">
          <p>© {new Date().getFullYear()} Resourcemania. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4 sm:mt-0">
            <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
            <Link href="/candidates" className="hover:text-[var(--primary)]">For Candidates</Link>
            <Link href="/companies" className="hover:text-[var(--primary)]">For Companies</Link>
            <Link href="/jobs" className="hover:text-[var(--primary)]">Jobs</Link>
            <Link href="/privacy-policy" className="hover:text-[var(--primary)]">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-[var(--primary)]">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

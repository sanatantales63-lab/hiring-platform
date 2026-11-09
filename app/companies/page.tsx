"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Building2, CheckCircle2, Filter, Gauge, LineChart,
  Lock, ShieldCheck, Sparkles, Users, Workflow, Briefcase,
  Twitter, Linkedin, Github, Menu, X, Check, ChevronRight,
  Clock, Calendar, Award, Zap, ChevronDown, ChevronUp, FileSpreadsheet,
  AlertCircle, HelpCircle
} from "lucide-react";

const TALENT_SPECIALIZATIONS = [
  {
    role: "Semi-Qualified CAs",
    badge: "CA Inter / Articleship Cleared",
    desc: "Trained in audit field execution, ledger scrutiny, voucher verification, balance sheet finalization, and statutory tax audit schedules.",
    bestFor: "Statutory audits, internal audit cycles, corporate tax filing"
  },
  {
    role: "Company Secretaries (CS)",
    badge: "ROC & MCA Compliance",
    desc: "Experts in ROC filings, maintenance of secretarial records, board resolution drafting, MCA-21 portal submissions, and annual return certifications.",
    bestFor: "Corporate governance, secretarial audits, MCA compliance"
  },
  {
    role: "CMA Professionals",
    badge: "Cost & Management",
    desc: "Equipped for plant cost sheets, manufacturing inventory valuation, product pricing analysis, variance reporting, and operational budgeting.",
    bestFor: "Cost audits, plant accounting, inventory valuation"
  },
  {
    role: "Taxation & GST Specialists",
    badge: "Direct & Indirect Tax",
    desc: "Hands-on practitioners managing monthly GSTR-1, 3B, 9/9C reconciliation, 26AS/AIS matching, advance tax computations, and scrutiny representations.",
    bestFor: "Monthly GST cycles, tax season crunch, TDS returns"
  },
  {
    role: "ACCA & Global Reporting",
    badge: "IFRS Standards",
    desc: "Skilled in global consolidation, IFRS financial statements, multi-currency accounting, and US GAAP / Ind AS compliance reporting.",
    bestFor: "MNCs, global audit delivery centers, cross-border accounts"
  },
  {
    role: "ERP & Accounting Operators",
    badge: "Tally / Zoho / SAP",
    desc: "Proficient accountants ready for day-to-day transaction booking, bank reconciliations, vendor payables, receivable aging, and MIS dashboards.",
    bestFor: "Day-to-day accounts, billing, bank reconciliations"
  }
];

const COMPARISON = [
  {
    metric: "Time to Shortlist",
    traditional: "4 to 6 Weeks of screening",
    resourcemania: "24 to 48 Hours with verified scores",
    highlight: true
  },
  {
    metric: "Skill Verification",
    traditional: "Unverified resume claims & buzzwords",
    resourcemania: "Proctored practical tests on GST, Tally & Audit",
    highlight: true
  },
  {
    metric: "Interview Dropout Rate",
    traditional: "40% - 50% candidate ghosting & no-shows",
    resourcemania: "94% verified show-up rate",
    highlight: false
  },
  {
    metric: "Engagement Flexibility",
    traditional: "Rigid permanent payroll only (high bad-hire risk)",
    resourcemania: "On-demand contract peaks or direct permanent payroll",
    highlight: false
  },
  {
    metric: "Replacement Policy",
    traditional: "Standard 30-day notice or restart process",
    resourcemania: "Fast 3-day replacement guarantee",
    highlight: true
  }
];

const ENGAGEMENT_MODELS = [
  {
    title: "Seasonal Project Peaks",
    badge: "High Flexibility",
    icon: Clock,
    desc: "Deploy semi-qualified CAs and tax accountants for 1 to 6 months to handle high-volume audit spikes, July-October tax rush, or March financial closing.",
    bullets: [
      "Zero permanent headcount overhead",
      "Immediate onboarding within 48 hours",
      "Scale team up or down based on workload"
    ]
  },
  {
    title: "Contract-to-Hire",
    badge: "Zero-Risk Evaluation",
    icon: Zap,
    desc: "Evaluate candidates on real deliverables for 3 months. If they exceed expectations, transition them seamlessly into full-time permanent team members.",
    bullets: [
      "Assess real work ethic and cultural fit first",
      "Smooth transition to company payroll",
      "Eliminates bad-hire recruitment costs"
    ]
  },
  {
    title: "Direct Permanent Payroll",
    badge: "Core Team Expansion",
    icon: Building2,
    desc: "Source vetted, top-tier finance professionals directly for your permanent in-house finance team with comprehensive proctored scorecards.",
    bullets: [
      "Access pre-vetted top 10% scorers",
      "Verified background & academic records",
      "Reduced time-to-productivity from Day 1"
    ]
  }
];

const PILLARS = [
  { icon: Filter, t: "Pre-Vetted Finance Pool", d: "Every candidate is evaluated on practical GST, TDS, Tally Prime, and audit rubrics — not memorized trivia." },
  { icon: Workflow, t: "Collaborative Pipelines", d: "Manage seasonal contract professionals and permanent team hires in one unified dashboard." },
  { icon: Gauge, t: "Time-to-Hire Dashboards", d: "Real-time analytics tracking shortlist velocity, practical assessment scores, and candidate engagement." },
  { icon: ShieldCheck, t: "Proctoring & Audit Trails", d: "Proctored assessment environment with identity verification and anti-plagiarism checks." },
  { icon: Lock, t: "Bias-Aware Tooling", d: "Blind reviews, calibrated rubrics, and fairness reports baked directly into the platform." },
  { icon: LineChart, t: "Fast ATS Integration", d: "Export verified candidate scorecards directly into your existing recruitment workflow." },
];

const FAQS = [
  {
    q: "How fast can we deploy semi-qualified CAs or tax accountants?",
    a: "Candidates on Resourcemania already have pre-evaluated scorecards. Once you post a requirement or search profiles, shortlists are delivered within 24 to 48 hours, and candidates can onboard immediately."
  },
  {
    q: "Can we hire candidates for short-term tax seasons and audits?",
    a: "Yes! Short-term contract hiring is one of our primary solutions. You can engage semi-qualified CAs (CA Inter cleared), CS, CMAs, and tax executives for 1 to 6 months during high-crunch periods without permanent employee liabilities."
  },
  {
    q: "What if a deployed contract professional does not meet our expectations?",
    a: "We provide a 3-business-day replacement guarantee. If a candidate is not matching your workflow or rubric, our talent team immediately deploys an alternative verified professional."
  },
  {
    q: "How are candidate accounting skills tested?",
    a: "Our practical assessment engine tests real-world scenarios: GST return reconciliation, TDS deduction rules, Tally Prime accounting entries, journal adjustments, and financial statement scrutiny."
  },
  {
    q: "Can we transition a contract candidate to our permanent payroll?",
    a: "Yes! Our Contract-to-Hire model is specifically designed so companies can evaluate talent on projects and transition high performers to permanent rolls with minimal friction."
  }
];

export default function CompaniesPage() {
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
            <Link href="/candidates" className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
              For Candidates
            </Link>
            <Link href="/companies" className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[var(--surface)] text-[var(--primary)]">
              For Companies
            </Link>
            <Link href="/jobs" className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
              Jobs Board
            </Link>
            <Link href="/how-it-works" className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
              How it Works
            </Link>
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            <button
              onClick={() => router.push('/company/login')}
              className="inline-flex items-center gap-2 h-9 px-4.5 rounded-lg text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-glow)] shadow-primary transition-all"
            >
              <span>Employer Sign In</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => router.push('/company/login')}
              className="flex items-center gap-1 h-8 px-3 rounded-lg text-xs font-bold bg-[var(--primary)] text-white shadow-soft"
            >
              Employer Login
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
            <Link href="/candidates" className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">
              For Candidates
            </Link>
            <Link href="/companies" className="px-4 py-2 rounded-lg text-xs font-bold bg-[var(--accent)] text-[var(--primary)]">
              For Companies
            </Link>
            <Link href="/jobs" className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">
              Jobs Board
            </Link>
            <Link href="/how-it-works" className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">
              How it Works
            </Link>
            <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
              <button
                onClick={() => router.push('/company/login')}
                className="w-full flex items-center justify-center gap-2 h-9 rounded-lg text-xs font-bold bg-[var(--primary)] text-white shadow-primary"
              >
                Employer Portal <Building2 size={14} />
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
                  <Building2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>For Companies, CA Firms &amp; Hiring Teams</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                  Deploy verified finance talent<br />
                  <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    for project peaks, tax seasons, or permanent roles.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base sm:text-lg text-indigo-100/80 leading-relaxed font-normal">
                  Access pre-vetted Semi-Qualified CAs (CA Inter), CS, CMAs, and Taxation Specialists. Address seasonal workload peaks (GST/tax filing, statutory audits, year-end closing) or build high-caliber permanent finance teams with cryptographic proof.
                </p>

                <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-3.5">
                  <button
                    onClick={() => router.push('/company/login')}
                    className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black h-12 rounded-xl px-8 text-sm hover:brightness-110 shadow-lg transition-all duration-200"
                  >
                    <span>Start Hiring Now</span>
                    <Building2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => router.push('/company/dashboard')}
                    className="inline-flex items-center justify-center gap-2.5 border border-white/30 bg-white/10 backdrop-blur-md text-white font-bold h-12 rounded-xl px-7 text-sm hover:bg-white/20 transition-all duration-200"
                  >
                    <span>Post a Job Opening</span>
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 flex items-center justify-center lg:justify-start gap-4 text-xs text-indigo-200/90 font-medium">
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Zap size={14} /> 24-48 Hr Deployment
                  </span>
                  <span>•</span>
                  <span>Proctored GST &amp; Audit Scores</span>
                  <span>•</span>
                  <span>3-Day Replacement Guarantee</span>
                </div>
              </div>

              {/* Visual Demo Card */}
              <div className="lg:col-span-5 hidden lg:block">
                <div className="rounded-3xl p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-base font-bold text-white">Pre-Evaluated Candidate Pipeline</h3>
                    <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-md border border-amber-400/30">
                      Top Scorers Ready
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { candidate: "Aarav S.", role: "Semi-Qualified CA (CA Inter Cleared)", status: "Verified (98%)" },
                      { candidate: "Maria V.", role: "Direct & Indirect Tax Specialist", status: "Verified (95%)" },
                      { candidate: "Rohan M.", role: "CMA (Cost & Budgeting Specialist)", status: "Verified (94%)" },
                      { candidate: "Sneha K.", role: "CS (ROC & Secretarial Compliance)", status: "Verified (92%)" },
                    ].map((row) => (
                      <div key={row.candidate} className="p-3.5 rounded-xl bg-white/10 border border-white/10 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-white">{row.candidate}</p>
                          <p className="text-[11px] text-indigo-200">{row.role}</p>
                        </div>
                        <span className="font-bold text-xs text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30">
                          {row.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-indigo-200 font-medium">
                    <span>Audit &amp; Identity Verification</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Check className="h-4 w-4 stroke-[3]" /> Cryptographically Signed
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 1. SPECIALIZED TALENT POOLS ── */}
        <section className="py-20 bg-white border-b border-[var(--border)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label mb-3">Finance Talent Pool</span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                Deploy Specialized Finance &amp; Accounting Talent
              </h2>
              <p className="mt-4 text-base text-[var(--muted-foreground)] leading-relaxed">
                Source pre-evaluated candidates tested on practical Indian tax regulations, Tally Prime workflows, and statutory accounting standards.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TALENT_SPECIALIZATIONS.map((item) => (
                <div key={item.role} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 hover-glow-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="font-display text-base font-bold text-[var(--foreground)]">{item.role}</h3>
                      <span className="text-[11px] font-bold text-[var(--primary)] bg-[var(--accent)] px-2.5 py-0.5 rounded-full shrink-0">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--border)]">
                    <span className="text-[11px] font-bold text-[var(--foreground)] block mb-1">Best suited for:</span>
                    <span className="text-xs text-[var(--primary)] font-semibold">{item.bestFor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. TRADITIONAL VS RESOURCEMANIA COMPARISON ── */}
        <section className="py-20 lg:py-24" style={{ background: "var(--surface)" }}>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="section-label mb-3">The Resourcemania Advantage</span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                Traditional Staffing vs. Verified Deployment
              </h2>
              <p className="mt-4 text-base text-[var(--muted-foreground)] leading-relaxed">
                Why forward-thinking CA firms and corporate finance directors choose Resourcemania over legacy agencies.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-[var(--border)] shadow-soft overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-900 text-white p-4 sm:p-5 text-xs sm:text-sm font-bold uppercase tracking-wider">
                <div className="col-span-4 sm:col-span-4">Metric</div>
                <div className="col-span-4 sm:col-span-4 text-slate-400">Traditional Agency</div>
                <div className="col-span-4 sm:col-span-4 text-amber-300">Resourcemania</div>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {COMPARISON.map((row) => (
                  <div
                    key={row.metric}
                    className={`grid grid-cols-12 p-4 sm:p-5 items-center text-xs sm:text-sm ${
                      row.highlight ? "bg-[var(--accent)]/30" : ""
                    }`}
                  >
                    <div className="col-span-4 font-bold text-[var(--foreground)]">{row.metric}</div>
                    <div className="col-span-4 text-[var(--muted-foreground)] pr-2">{row.traditional}</div>
                    <div className="col-span-4 font-bold text-[var(--primary)] flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 hidden sm:inline" />
                      <span>{row.resourcemania}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. THREE ENGAGEMENT MODELS ── */}
        <section className="py-20 bg-white border-b border-[var(--border)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label mb-3">Engagement Flexibility</span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                Three Ways to Power Your Finance Team
              </h2>
              <p className="mt-4 text-base text-[var(--muted-foreground)] leading-relaxed">
                Adapt to seasonal crunch periods or build long-term capacity without contractual friction.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {ENGAGEMENT_MODELS.map((model) => (
                <div key={model.title} className="rounded-3xl p-8 bg-[var(--surface)] border border-[var(--border)] shadow-soft flex flex-col justify-between hover-glow-card">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white text-[var(--primary)] border border-[var(--border)] flex items-center justify-center shadow-soft">
                        <model.icon size={22} />
                      </div>
                      <span className="text-[11px] font-bold text-[var(--primary)] bg-[var(--accent)] px-3 py-1 rounded-full">
                        {model.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-[var(--foreground)] mb-2">
                      {model.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed">
                      {model.desc}
                    </p>

                    <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--foreground)]">
                      {model.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[var(--border)]">
                    <button
                      onClick={() => router.push('/company/login')}
                      className="w-full inline-flex items-center justify-center gap-2 h-10.5 rounded-xl text-xs font-bold bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface)] shadow-soft"
                    >
                      <span>Get Started</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. ENTERPRISE PILLARS (ORIGINAL 6 PILLARS) ── */}
        <section className="py-20 lg:py-24" style={{ background: "var(--surface)" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label mb-3">Enterprise Recruitment</span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                Built for Hiring Managers Who Value Speed &amp; Precision
              </h2>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PILLARS.map((p) => (
                <div key={p.t} className="rounded-2xl bg-white border border-[var(--border)] p-6 shadow-soft flex flex-col justify-between hover-glow-card">
                  <div>
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--surface)] text-[var(--primary)] border border-[var(--border)] shadow-soft">
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

        {/* ── 5. FREQUENTLY ASKED QUESTIONS FOR EMPLOYERS ── */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="section-label mb-3">Employer FAQs</span>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
                Frequently Asked Questions for Hiring Teams
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

        {/* ── 6. FINAL BOTTOM CTA ── */}
        <section className="py-16 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-amber-300 mb-4 border border-white/20">
              Solve Your Finance Hiring Crunch
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready to Deploy Verified Finance Talent in 48 Hours?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-indigo-100/90 max-w-xl mx-auto leading-relaxed">
              Join leading enterprises, audit firms, and fast-growing organizations hiring verified semi-qualified CAs, CS, CMAs, and tax professionals.
            </p>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <button
                onClick={() => router.push('/company/login')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black h-12 rounded-xl px-8 text-sm hover:brightness-110 shadow-lg transition-all"
              >
                <span>Start Hiring Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => router.push('/company/dashboard')}
                className="inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-md text-white font-bold h-12 rounded-xl px-7 text-sm hover:bg-white/20 transition-all"
              >
                <span>Post a Job Opening</span>
              </button>
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
            <Link href="/jobs" className="hover:text-[var(--primary)]">Jobs Board</Link>
            <Link href="/privacy-policy" className="hover:text-[var(--primary)]">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-[var(--primary)]">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

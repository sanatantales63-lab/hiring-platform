"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, BadgeCheck, Brain, Building2, CheckCircle2, ShieldCheck,
  Sparkles, Target, Users, Zap, Briefcase, Twitter, Linkedin, Github,
  Menu, X, Check, Award, Star
} from "lucide-react";

const COMPANIES = [
  "Stripe", "Notion", "Linear", "Vercel", "Figma", "Airbnb", "Shopify", "Discord"
];

export default function Home() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col font-sans bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)]/10 selection:text-[var(--primary)]">

      {/* ── 1. HEADER / NAVBAR ── */}
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
            <Link href="/" className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[var(--surface)] text-[var(--primary)]">
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
          </nav>

          {/* Actions */}
          <div className="hidden items-center gap-2.5 md:flex">
            <button
              onClick={() => router.push('/admin/login')}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/40 transition-all shadow-soft"
            >
              <ShieldCheck size={14} className="text-[var(--primary)]" />
              <span>Admin</span>
            </button>

          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-2">
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
          <div className="md:hidden border-b border-[var(--border)] bg-white p-4 flex flex-col gap-1.5 z-50">
            <Link href="/" className="px-4 py-2 rounded-lg text-xs font-bold bg-[var(--accent)] text-[var(--primary)]">
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
            <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
              <button
                onClick={() => router.push('/admin/login')}
                className="w-full flex items-center justify-center gap-2 h-9 rounded-lg text-xs font-semibold border border-[var(--border)] bg-white shadow-soft"
              >
                <ShieldCheck size={14} className="text-[var(--primary)]" /> Admin Portal
              </button>
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

        {/* ── 2. HERO SECTION: CHOOSE YOUR PATH (PATH2HIRE STYLE) ── */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white">
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
          
          {/* Ambient Glows */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[var(--primary)]/20 blur-[130px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 text-center">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>The future of hiring</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] max-w-5xl mx-auto">
              Hiring built on <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">proofs</span>, not promises.<br />
              Hire for short-term projects &amp; permanent job on companies payroll.
            </h1>

            <p className="mt-5 max-w-3xl mx-auto text-base sm:text-lg text-indigo-100/80 leading-relaxed font-normal">
              Resourcemania connects verified finance &amp; professionals (CAs, Tax Experts, Developers) with companies to handle tax seasons, audits, project peaks, or permanent hiring needs.
            </p>

            {/* 🚀 DUAL PATH HERO CARDS */}
            <div className="mt-14 grid gap-8 md:grid-cols-2 max-w-5xl mx-auto text-left">
              
              {/* Card 1: Job Seeker */}
              <div 
                onClick={() => router.push('/candidates')}
                className="group relative rounded-3xl p-8 sm:p-10 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:border-amber-400/40 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-indigo-600 flex items-center justify-center mb-6 shadow-primary group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-white stroke-[2.2]" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 font-display">
                    For Candidates
                  </h3>
                  
                  <p className="text-base font-bold text-amber-300 mb-4">
                    Get high-paying contract projects &amp; permanent roles.
                  </p>

                  <ul className="mt-4 space-y-2 mb-6 text-indigo-100/90 text-sm">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /> Choose flexible contract projects or full-time roles</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /> Earn verified, portable CA/finance/tech skill badges</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /> Get matched directly with premium hiring companies</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /> Skip repeat interview loops with verified scores</li>
                  </ul>
                </div>

                <div className="inline-flex items-center gap-2 text-sm font-extrabold text-amber-300 group-hover:text-amber-200 transition-colors">
                  <span>Build my profile</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>

              {/* Card 2: Employer */}
              <div 
                onClick={() => router.push('/companies')}
                className="group relative rounded-3xl p-8 sm:p-10 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:border-amber-400/40 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-6 shadow-soft group-hover:scale-110 transition-transform">
                    <Building2 className="h-8 w-8 text-white stroke-[2.2]" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 font-display">
                    For Companies
                  </h3>
                  
                  <p className="text-base font-bold text-amber-300 mb-4">
                    Deploy verified talent for project peaks, contracts, or permanent roles.
                  </p>

                  <ul className="mt-4 space-y-2 mb-6 text-indigo-100/90 text-sm">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /> Onboard resources instantly for tax season, closing, or audits</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /> Contract-to-Hire: Try talent on short-term tasks first</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /> Skip resume screening with verified practical rubrics</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /> Source top-tier permanent hires with full audit logs</li>
                  </ul>
                </div>

                <div className="inline-flex items-center gap-2 text-sm font-extrabold text-amber-300 group-hover:text-amber-200 transition-colors">
                  <span>Start hiring</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>

            </div>

            {/* Trust Metrics Strip */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { k: "50+", label: "Verified candidates" },
                { k: "5+", label: "Premium companies" },
                { k: "5 days", label: "Average shortlist" },
                { k: "94%", label: "Hiring satisfaction" },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-center">
                  <div className="font-display text-2xl font-black text-amber-300">{m.k}</div>
                  <div className="text-xs text-indigo-200/80 font-medium mt-1">{m.label}</div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 4. JOB SEEKER DEEP DIVE (CANDIDATE FEATURES IN MODERN LAYOUT) ── */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* Left Content */}
              <div>
                <span className="section-label mb-4">For Candidates</span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] leading-tight">
                  Flexible Projects or Stable Careers.
                </h2>
                <p className="mt-4 text-base text-[var(--muted-foreground)] leading-relaxed">
                  Complete our unified skill assessment once and unlock access to high-paying short-term contract projects, seasonal gigs, and permanent job opportunities from verified employers.
                </p>

                <div className="mt-8 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[var(--primary)] shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-[var(--foreground)]">
                      <span className="font-bold text-[var(--primary)]">AI Skill Verification:</span> Adaptive assessments that test real-world ability — not memorized trivia. Every score is signed and shareable.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[var(--primary)] shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-[var(--foreground)]">
                      <span className="font-bold text-[var(--primary)]">Portable Credentials:</span> Candidates own their results. Share a public Resourcemania profile or embed badges anywhere.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[var(--primary)] shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-[var(--foreground)]">
                      <span className="font-bold text-[var(--primary)]">Identity & Trust:</span> ID checks, proctoring, and code-attribution prevent fakes. Every profile carries a verifiable trust badge.
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => router.push('/student/login')}
                    className="inline-flex items-center gap-2 bg-[var(--primary)] text-white font-bold h-11.5 rounded-xl px-7 text-sm shadow-primary hover:bg-[var(--primary-glow)] transition-all"
                  >
                    <span>Build Verified Profile</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Right Mockup Card */}
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--primary)] text-white font-black font-display text-lg">
                      A
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[var(--foreground)]">Aarav Sharma</h4>
                      <p className="text-xs text-[var(--primary)] font-semibold">Chartered Accountant (CA)</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Top 1% Verified
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="bg-white p-3.5 rounded-xl border border-[var(--border)] flex justify-between items-center text-xs">
                    <span className="font-semibold text-[var(--foreground)]">Practical Taxation & GST Filing</span>
                    <span className="font-extrabold text-[var(--primary)] bg-[var(--accent)] px-2.5 py-1 rounded-md">98 / 100</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-[var(--border)] flex justify-between items-center text-xs">
                    <span className="font-semibold text-[var(--foreground)]">Tally ERP & Audit Compliance</span>
                    <span className="font-extrabold text-[var(--primary)] bg-[var(--accent)] px-2.5 py-1 rounded-md">96 / 100</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)] font-semibold">
                  <span>Signed Badge Status</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 stroke-[3]" /> Cryptographically Signed
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ── 5. EMPLOYER DEEP DIVE (COMPANY FEATURES IN MODERN LAYOUT) ── */}
        <section className="py-20 lg:py-28" style={{ background: "var(--surface)" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* Left Visual Mockup */}
              <div className="rounded-3xl border border-[var(--border)] bg-white p-8 shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <h4 className="font-bold text-sm text-[var(--foreground)]">Pre-Evaluated Candidate Pipeline</h4>
                  <span className="text-xs font-bold text-[var(--primary)] bg-[var(--accent)] px-2.5 py-1 rounded-lg">
                    5-Day Shortlist
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "Aarav S.", role: "Chartered Accountant", score: "98% Score", action: "Schedule Int." },
                    { name: "Maria V.", role: "Finance Specialist", score: "95% Score", action: "Review Proof" },
                    { name: "Jamal O.", role: "B.Com Accountant", score: "91% Score", action: "Review Proof" },
                  ].map((row) => (
                    <div key={row.name} className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-[var(--foreground)]">{row.name}</p>
                        <p className="text-[11px] text-[var(--muted-foreground)]">{row.role}</p>
                      </div>
                      <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {row.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content */}
              <div>
                <span className="section-label mb-4">For Companies</span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] leading-tight">
                  Scale Your Workforce Dynamically.
                </h2>
                <p className="mt-4 text-base text-[var(--muted-foreground)] leading-relaxed">
                  Whether you need support for tax filing seasons, audit spikes, high-priority projects, or permanent team expansion, access pre-vetted, proctored talent instantly.
                </p>

                <div className="mt-8 p-5 rounded-2xl bg-white border border-[var(--border)] space-y-4 shadow-soft">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-[var(--foreground)]">
                      <span className="font-bold text-[var(--foreground)]">Precision Matching:</span> Match by proven skill, role fit, salary band, and culture signals — not keyword bingo.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-[var(--foreground)]">
                      <span className="font-bold text-[var(--foreground)]">Hire in Days:</span> Average time-to-shortlist drops from 6 weeks to 5 days. Companies see candidates with proof attached.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-[var(--foreground)]">
                      <span className="font-bold text-[var(--foreground)]">Bias-Aware Scoring:</span> Blind evaluation, calibrated rubrics, and audit logs give every applicant a fair, transparent shot.
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => router.push('/company/login')}
                    className="inline-flex items-center gap-2 border border-slate-900 bg-slate-900 text-white font-bold h-11.5 rounded-xl px-7 text-sm shadow-soft hover:bg-slate-800 transition-all"
                  >
                    <span>Explore Employer Solutions</span>
                    <Building2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ── 6. 3-STEP ECOSYSTEM LOOP (ORIGINAL STEPS IN NEW LAYOUT) ── */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label">How it works</span>
              <h2 className="mt-5 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                From signup to signed offer
              </h2>
              <p className="mt-4 text-base text-[var(--muted-foreground)] leading-relaxed">Three steps. One trusted system. Built for both sides of the table.</p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Create your profile",
                  desc: "Candidates take AI assessments. Companies define roles & rubrics — in minutes.",
                  badge: "Step One"
                },
                {
                  n: "02",
                  title: "Get verified",
                  desc: "Skills, identity, and experience are validated and signed. No résumé inflation.",
                  badge: "Step Two"
                },
                {
                  n: "03",
                  title: "Match & meet",
                  desc: "Our engine surfaces best-fit matches. Schedule, interview, and offer — all in one place.",
                  badge: "Step Three"
                },
              ].map((s) => (
                <div key={s.n} className="rounded-3xl border border-[var(--border)] bg-white p-8 shadow-card flex flex-col justify-between hover-glow-card">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-display text-4xl font-black text-gradient">{s.n}</span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--primary)] bg-[var(--accent)] px-3 py-1 rounded-full">
                        {s.badge}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[var(--foreground)]">{s.title}</h3>
                    <p className="mt-3 text-sm text-[var(--muted-foreground)] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* ── 7. TESTIMONIALS SECTION (Voices from original page) ── */}
        <section className="py-20 lg:py-28 bg-slate-50 border-t border-[var(--border)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <span className="section-label">Voices</span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl text-[var(--foreground)]">People hire — and get hired — differently here</h2>
            </div>
            
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {[
                { q: "We cut our screening time by 70%. Every Chartered Accountant and Tax Associate that lands on our desk is already verified and tested on practical rubrics.", n: "Priya Sharma", r: "HR Director, Tax & Advisory Corp" },
                { q: "I went from sending endless resumes to getting 4 interviews with top audit firms in two weeks. The verified accounting badges speak for themselves.", n: "Devendra Kumar", r: "Senior Tax Consultant & CA Candidate" },
                { q: "Finally a recruitment platform that understands CA and accounts hiring. Transparent, fast, and pre-screened with genuine practical scores.", n: "Sanjay Mehta", r: "Managing Partner, Mehta & Associates Auditing" },
              ].map((t, i) => (
                <figure key={i} className="bg-white rounded-3xl border border-[var(--border)] p-8 shadow-card flex flex-col justify-between hover-glow-card">
                  <blockquote className="text-base leading-relaxed text-[var(--foreground)] mb-6 font-medium">&ldquo;{t.q}&rdquo;</blockquote>
                  <figcaption className="flex items-center gap-3 pt-5 border-t border-[var(--border)]">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent)] font-display font-black text-[var(--primary)] text-sm">{t.n.charAt(0)}</div>
                    <div>
                      <div className="text-sm font-bold text-[var(--foreground)]">{t.n}</div>
                      <div className="text-xs text-[var(--muted-foreground)] font-semibold">{t.r}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>


        {/* ── 8. HIGH-CONVERTING CTA BANNER ── */}
        <section className="py-20 lg:py-28" style={{ background: "var(--surface)" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary)] via-indigo-900 to-slate-950 p-10 sm:p-16 text-white shadow-primary">
              
              <div className="relative grid items-center gap-8 lg:grid-cols-12 z-10">
                <div className="lg:col-span-8">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-amber-300 mb-4 border border-white/20">
                    Get Started Today
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                    Ready to hire — or get hired — on proof?
                  </h2>
                  <p className="mt-4 text-base sm:text-lg text-indigo-100/90 max-w-2xl leading-relaxed">
                    Join thousands building real careers and real teams on Resourcemania.
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 justify-center lg:items-end">
                  <button
                    onClick={() => router.push('/student/login')}
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-white text-[var(--primary)] font-black h-12 rounded-xl px-7 text-sm hover:bg-slate-100 shadow-elevated transition-all"
                  >
                    <span>For Candidates</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => router.push('/company/login')}
                    className="w-full inline-flex items-center justify-center gap-2.5 border border-white/30 bg-white/10 backdrop-blur-md text-white font-black h-12 rounded-xl px-7 text-sm hover:bg-white/20 transition-all"
                  >
                    <span>For Companies</span>
                    <Building2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>


      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-[var(--border)] text-[var(--foreground)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary)] text-white shadow-soft">
                  <Briefcase className="h-4.5 w-4.5 stroke-[2.4]" />
                </span>
                <span className="font-display text-xl font-black tracking-tight text-[var(--foreground)]">
                  Resource<span className="text-[var(--primary)]">mania</span>
                </span>
              </Link>

              <p className="max-w-xs text-sm text-[var(--muted-foreground)] leading-relaxed">
                The future of hiring. AI-verified skills, transparent matching, and zero resume black holes.
              </p>

              <div className="flex items-center gap-2 pt-2">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="h-9 w-9 flex items-center justify-center rounded-xl border border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 hover:bg-[var(--accent)] transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {[
              {
                heading: "Platform",
                links: [
                  ["For Candidates", "/candidates"],
                  ["For Companies", "/companies"],
                  ["How it Works", "/how-it-works"],
                ]
              },
              {
                heading: "Company",
                links: [
                  ["About Us", "/"],
                  ["Support & Help", "/support"],
                  ["Admin Portal", "/admin/login"],
                ]
              },
              {
                heading: "Legal & Security",
                links: [
                  ["Privacy Policy", "/privacy-policy"],
                  ["Terms of Service", "/terms-of-service"],
                ]
              },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <h4 className="font-display text-sm font-bold text-[var(--foreground)] mb-4">{heading}</h4>
                <ul className="space-y-3">
                  {links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
            <p className="text-xs text-[var(--muted-foreground)] font-medium">
              © {new Date().getFullYear()} Resourcemania. All rights reserved.
            </p>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-[var(--muted-foreground)]">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
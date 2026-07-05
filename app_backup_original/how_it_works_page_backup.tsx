"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Brain, Building2, Handshake, IdCard, Search, UserPlus,
  Briefcase, Twitter, Linkedin, Github, ShieldCheck, Menu, X, Check, ChevronRight, Sparkles
} from "lucide-react";

const CAND = [
  { icon: UserPlus, t: "Create Profile", d: "Set role goals, skill domains, salary band, and work availability." },
  { icon: Brain, t: "Take AI Assessment", d: "Complete role-focused, adaptive proctored practical skill tests." },
  { icon: IdCard, t: "Verify Identity & Earn Badges", d: "Receive cryptographically signed credentials and portable trust badges." },
  { icon: Handshake, t: "Direct Employer Match", d: "Connect directly with hiring managers actively looking for your verified score." },
];

const COMP = [
  { icon: Building2, t: "Define Position Criteria", d: "Select pre-built evaluation rubrics or customize position requirements in minutes." },
  { icon: Search, t: "Access Verified Talent Pool", d: "Filter candidates by verified score reports, proctor status, and skill depth." },
  { icon: Brain, t: "Review Proctored Audits", d: "Inspect candidate test analytics, proctor logs, and rubric performance." },
  { icon: Handshake, t: "Schedule & Hire", d: "Interview top pre-vetted candidates and close roles 80% faster." },
];

export default function HowPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <Link href="/companies" className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
              For Employers
            </Link>
            <Link href="/how-it-works" className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[var(--surface)] text-[var(--primary)]">
              How it Works
            </Link>
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            <button
              onClick={() => router.push('/admin/login')}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/40 transition-all shadow-soft"
            >
              <ShieldCheck size={14} className="text-[var(--primary)]" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => router.push('/student/login')}
              className="inline-flex items-center gap-2 h-9 px-4.5 rounded-lg text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-glow)] shadow-primary transition-all"
            >
              <span>Get Started</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => router.push('/student/login')}
              className="flex items-center gap-1 h-8 px-3 rounded-lg text-xs font-bold bg-[var(--primary)] text-white shadow-soft"
            >
              Get Started
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
            <Link href="/companies" className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">
              For Employers
            </Link>
            <Link href="/how-it-works" className="px-4 py-2 rounded-lg text-xs font-bold bg-[var(--accent)] text-[var(--primary)]">
              How it Works
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">

        {/* ── HERO SECTION: PATH2HIRE MATCHING THEME ── */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white">
          <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[var(--primary)]/20 blur-[130px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Transparent Hiring Ecosystem</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              One platform.<br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                Two seamless journeys. Zero guesswork.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-indigo-100/80 leading-relaxed font-normal">
              Explore step-by-step how candidates prove practical abilities and how hiring teams identify ideal matches in days.
            </p>
          </div>
        </section>

        {/* ── DUAL STEPS ── */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
            
            {/* Candidate Journey */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--primary)] text-white font-bold">1</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">The Candidate Journey</h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {CAND.map((step, idx) => (
                  <div key={step.t} className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-7 relative">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-3">Step 0{idx + 1}</div>
                    <h3 className="font-display text-base font-bold text-[var(--foreground)]">{step.t}</h3>
                    <p className="mt-2 text-xs text-[var(--muted-foreground)] leading-relaxed">{step.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Employer Journey */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white font-bold">2</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">The Employer Journey</h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {COMP.map((step, idx) => (
                  <div key={step.t} className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-7 relative">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3">Step 0{idx + 1}</div>
                    <h3 className="font-display text-base font-bold text-[var(--foreground)]">{step.t}</h3>
                    <p className="mt-2 text-xs text-[var(--muted-foreground)] leading-relaxed">{step.d}</p>
                  </div>
                ))}
              </div>
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
            <Link href="/privacy-policy" className="hover:text-[var(--primary)]">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-[var(--primary)]">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Building2, CheckCircle2, Filter, Gauge, LineChart,
  Lock, ShieldCheck, Sparkles, Users, Workflow, Briefcase,
  Twitter, Linkedin, Github, Menu, X, Check, ChevronRight
} from "lucide-react";

const PILLARS = [
  { icon: Filter, t: "Pre-Vetted Talent Pool", d: "Every candidate is pre-evaluated and ready to support seasonal audits, tax seasons, or direct full-time roles." },
  { icon: Workflow, t: "Collaborative Pipelines", d: "Manage short-term contractor contracts and permanent team placements in unified hiring dashboards." },
  { icon: Gauge, t: "Time-to-Hire Dashboards", d: "Real-time analytics tracking shortlist velocity, assessment pass rates, and candidate engagement." },
  { icon: ShieldCheck, t: "Proctoring & Audit Trails", d: "Proctored assessment environment with identity verification and anti-plagiarism checks." },
  { icon: Lock, t: "Bias-Aware Tooling", d: "Blind reviews, calibrated rubrics, and fairness reports baked directly into the platform." },
  { icon: LineChart, t: "Seamless ATS Sync", d: "Export verified candidate rubrics directly into your existing ATS recruitment workflow." },
];

export default function CompaniesPage() {
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
            <Link href="/companies" className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[var(--surface)] text-[var(--primary)]">
              For Companies
            </Link>
            <Link href="/how-it-works" className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
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

        {/* ── HERO SECTION: PATH2HIRE MATCHING THEME ── */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white">
          <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[var(--primary)]/20 blur-[130px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              
              <div className="lg:col-span-7 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-6">
                  <Building2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>For Companies &amp; Hiring Teams</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                  Deploy verified talent<br />
                  <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    for project peaks, contracts, short-term assignments, or permanent roles.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base sm:text-lg text-indigo-100/80 leading-relaxed font-normal">
                  Access pre-vetted finance and tech talent ready to onboard. Address seasonal workload peaks (like GST/tax filing seasons, audits) or hire top-tier permanent teams with verified proof.
                </p>

                <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-3.5">
                  <button
                    onClick={() => router.push('/company/login')}
                    className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black h-12 rounded-xl px-8 text-sm hover:brightness-110 shadow-lg transition-all duration-200"
                  >
                    <span>Start Hiring Now</span>
                    <Building2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Visual Demo Card */}
              <div className="lg:col-span-5 hidden lg:block">
                <div className="rounded-3xl p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
                  <h3 className="font-display text-base font-bold text-white mb-2">Recruitment Pipeline Preview</h3>
                  <div className="space-y-3">
                    {[
                      { candidate: "Aarav S.", role: "Chartered Accountant", status: "Verified (98%)" },
                      { candidate: "Maria V.", role: "Taxation Specialist", status: "Verified (95%)" },
                      { candidate: "Jamal O.", role: "B.Com Accountant", status: "Verified (91%)" },
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
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── PILLARS SECTION ── */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label mb-4">Enterprise Recruitment</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
                Built for Hiring Managers Who Value Speed & Precision
              </h2>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PILLARS.map((p) => (
                <div key={p.t} className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-8 hover-glow-card flex flex-col justify-between">
                  <div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[var(--primary)] shadow-soft">
                      <p.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 font-display text-lg font-bold text-[var(--foreground)]">{p.t}</h3>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{p.d}</p>
                  </div>
                </div>
              ))}
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
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Target,
  Sparkles,
  Users,
  Building2,
  FileCheck,
  Scale,
  Calculator,
  FileSpreadsheet,
  Award,
  TrendingUp,
  Menu,
  X,
  Twitter,
  Linkedin,
  Github,
  ChevronRight
} from "lucide-react";

export default function AboutUsPage() {
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
            <Link
              href="/"
              className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors"
            >
              Home
            </Link>
            <Link
              href="/candidates"
              className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors"
            >
              For Candidates
            </Link>
            <Link
              href="/companies"
              className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors"
            >
              For Companies
            </Link>
            <Link
              href="/how-it-works"
              className="px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors"
            >
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
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]"
            >
              Home
            </Link>
            <Link
              href="/candidates"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]"
            >
              For Candidates
            </Link>
            <Link
              href="/companies"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]"
            >
              For Companies
            </Link>
            <Link
              href="/how-it-works"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]"
            >
              How it Works
            </Link>
            <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
              <button
                onClick={() => router.push('/admin/login')}
                className="w-full flex items-center justify-center gap-2 h-9 rounded-lg text-xs font-semibold border border-[var(--border)] bg-white shadow-soft"
              >
                <ShieldCheck size={14} className="text-[var(--primary)]" /> Admin Portal
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── 2. HERO SECTION ── */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[var(--border)]">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface)]/60 via-transparent to-[var(--background)] pointer-events-none" />
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[var(--primary)]/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 h-80 w-80 rounded-full bg-[var(--primary-glow)]/5 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Breadcrumb / Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20 shadow-sm mb-6">
            <Sparkles size={14} className="text-[var(--primary)]" />
            <span>About Resourcemania</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--foreground)] leading-[1.15] mb-6">
            Hiring Built on <span className="text-gradient">Proof</span>,<br className="hidden sm:inline" />
            {" "}Not Promises.
          </h1>

          {/* Subheading / Platform description */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl font-medium text-[var(--ink-soft)] leading-relaxed mb-8">
            Resourcemania is a technology-driven talent platform built to transform the way companies hire skilled professionals.
          </p>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
            We connect businesses with verified finance, accounting, taxation, audit, and other professional talent for both project-based and permanent roles.
          </p>

          {/* Domain Tags Bar */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { label: "Finance", icon: Calculator },
              { label: "Accounting", icon: FileSpreadsheet },
              { label: "Taxation", icon: FileCheck },
              { label: "Audit", icon: Scale },
              { label: "Project-Based & Permanent", icon: Briefcase },
            ].map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] shadow-soft"
              >
                <item.icon size={14} className="text-[var(--primary)]" />
                {item.label}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ── 3. OUR APPROACH ── */}
      <section className="py-20 md:py-28 bg-[var(--surface)]/50 border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--primary)]">
              Our Core Philosophy
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[var(--foreground)] mt-3 mb-4 tracking-tight">
              Our Approach is Simple
            </h2>
            <p className="text-lg sm:text-xl font-semibold text-[var(--primary)] leading-snug">
              “Hiring should be based on proven capability, not just resumes.”
            </p>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-4 leading-relaxed">
              Through domain-specific skill assessments, identity and experience verification, and data-driven talent matching, Resourcemania helps companies access professionals who have been evaluated for the skills they actually bring to the role.
            </p>
          </div>

          {/* Three Pillars Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Pillar 1 */}
            <div className="rounded-3xl bg-white border border-[var(--border)] p-8 shadow-card hover:shadow-elevated hover:border-[var(--primary)]/30 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-[var(--accent)] border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] mb-6 group-hover:scale-105 transition-transform">
                <Target size={24} />
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--foreground)] mb-3">
                Domain-Specific Skill Assessments
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Objective, practical evaluations built specifically for finance, accounting, tax, and audit domains to test hands-on competence rather than generic theory.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-3xl bg-white border border-[var(--border)] p-8 shadow-card hover:shadow-elevated hover:border-[var(--primary)]/30 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-[var(--accent)] border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] mb-6 group-hover:scale-105 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--foreground)] mb-3">
                Identity & Experience Verification
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Thorough background verification, authenticated credentials, and anti-cheat proctored environments that guarantee genuine candidate authenticity.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-3xl bg-white border border-[var(--border)] p-8 shadow-card hover:shadow-elevated hover:border-[var(--primary)]/30 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-[var(--accent)] border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] mb-6 group-hover:scale-105 transition-transform">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--foreground)] mb-3">
                Data-Driven Talent Matching
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Intelligent matching algorithms that pair verified skill metrics and candidate availability with exact job specifications and organizational needs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 4. TWO COLUMNS: FOR PROFESSIONALS & FOR BUSINESSES ── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--primary)]">
              Transforming Both Sides of the Market
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[var(--foreground)] mt-3 tracking-tight">
              Value Built for Candidates & Employers
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* For Professionals Card */}
            <div className="rounded-3xl bg-white border border-[var(--border)] p-8 sm:p-10 shadow-card flex flex-col justify-between hover:shadow-elevated transition-all">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[var(--primary)]">
                    <Users size={24} />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20">
                    For Professionals
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4">
                  Unlock High-Quality Career Opportunities
                </h3>

                <p className="text-sm sm:text-base text-[var(--ink-soft)] font-medium leading-relaxed mb-6">
                  For professionals, Resourcemania creates access to high-quality contract projects, flexible opportunities and permanent career opportunities, while enabling them to build a credible, portable record of their skills and experience.
                </p>

                <ul className="space-y-3.5 mb-8">
                  {[
                    "Access to premium contract projects & flexible roles",
                    "Full-time permanent career opportunities with top employers",
                    "Build a credible, portable record of verified skills and track record",
                    "Transparent evaluation without resume black holes or bias",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full p-0.5 bg-emerald-100 text-emerald-600 shrink-0">
                        <CheckCircle2 size={15} />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-[var(--foreground)]">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => router.push('/candidates')}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-11 px-6 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-glow)] shadow-primary transition-all self-start"
              >
                <span>Explore Candidate Platform</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* For Businesses Card */}
            <div className="rounded-3xl bg-white border border-[var(--border)] p-8 sm:p-10 shadow-card flex flex-col justify-between hover:shadow-elevated transition-all">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Building2 size={24} />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    For Businesses
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4">
                  Scale Your Teams with Confidence & Speed
                </h3>

                <p className="text-sm sm:text-base text-[var(--ink-soft)] font-medium leading-relaxed mb-6">
                  For businesses, we provide a faster and more reliable way to scale teams — whether the requirement is for tax season, audit support, finance operations, project-based expertise, or permanent hiring.
                </p>

                <ul className="space-y-3.5 mb-8">
                  {[
                    "Reliable staffing for tax season surges and critical deadlines",
                    "Specialized audit support (statutory, internal, and concurrent)",
                    "Finance operations and project-based domain expertise",
                    "Permanent hiring based on pre-evaluated, proven capability",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full p-0.5 bg-amber-100 text-amber-700 shrink-0">
                        <CheckCircle2 size={15} />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-[var(--foreground)]">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => router.push('/companies')}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-11 px-6 rounded-xl text-xs font-bold border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/40 shadow-soft transition-all self-start"
              >
                <span>Hire for Your Company</span>
                <ChevronRight size={14} />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. OUR MISSION BANNER ── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-950 via-[#1E1B4B] to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_50%)] pointer-events-none" />
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/15 backdrop-blur-md mb-6">
            <Award size={14} className="text-indigo-300" />
            <span>OUR MISSION</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white mb-6">
            “Our mission is to build a talent ecosystem where skills are verified, opportunities are transparent, and hiring decisions are driven by evidence.”
          </h2>

          <div className="inline-block mt-4 pt-6 border-t border-white/15">
            <p className="font-display text-lg sm:text-xl font-extrabold text-indigo-300 tracking-wide">
              Resourcemania — Hiring built on proof, not promises.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => router.push('/student/login')}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-xl transition-all"
            >
              <span>Get Started as a Candidate</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => router.push('/company/login')}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-xs font-bold border border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              <span>Employer Sign In</span>
              <Building2 size={14} />
            </button>
          </div>

        </div>
      </section>

      {/* ── 6. FOOTER ── */}
      <footer className="border-t border-[var(--border)] bg-white pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            
            {/* Brand column */}
            <div className="col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary)] text-white shadow-primary">
                  <Briefcase className="h-4.5 w-4.5 stroke-[2.2]" />
                </span>
                <span className="font-display text-lg font-black tracking-tight text-[var(--foreground)]">
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
                  ["About Us", "/about-us"],
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

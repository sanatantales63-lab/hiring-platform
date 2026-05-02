"use client";
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Brain, Building2, Handshake, IdCard, Search, UserPlus,
  Briefcase, Twitter, Linkedin, Github, Mail, ShieldCheck, Menu, X
} from "lucide-react";

const CAND = [
  { icon: UserPlus, t: "Create profile", d: "Set role goals, salary band, and availability." },
  { icon: Brain, t: "Take assessments", d: "Adaptive, role-specific, and untimed." },
  { icon: IdCard, t: "Verify identity", d: "Quick ID + work-history validation." },
  { icon: Handshake, t: "Match & interview", d: "Meet hiring managers — directly." },
];

const COMP = [
  { icon: Building2, t: "Define the role", d: "Pick a template or build a custom rubric." },
  { icon: Search, t: "Discover talent", d: "Filter by verified skill, salary, and timezone." },
  { icon: Brain, t: "Calibrate & review", d: "Score with structured rubrics, no bias." },
  { icon: Handshake, t: "Offer & onboard", d: "Sync to your ATS and close the loop." },
];

export default function HowPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] font-sans">
      
     {/* 🚀 HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)]/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-[var(--primary-foreground)] shadow-glow transition-transform group-hover:scale-105">
              <Briefcase className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-[var(--foreground)]">Resource<span className="text-[var(--primary)]">mania</span></span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/60">Home</Link>
            <Link href="/candidates" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/60">For Candidates</Link>
            <Link href="/companies" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/60">For Companies</Link>
            <Link href="/how-it-works" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--primary)]">How it Works<span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-primary"></span></Link>
            <Link href="#" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/60">Pricing</Link>
          </nav>

          {/* Desktop Admin Login Button */}
          <div className="hidden items-center gap-2 md:flex">
            <button onClick={() => router.push('/admin/login')} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] h-9 rounded-lg px-4 text-sm font-semibold transition-all shadow-sm focus-visible:outline-none">
              <ShieldCheck size={16} className="text-[var(--primary)]" /> Admin Login
            </button>
          </div>

          {/* Mobile Menu & Buttons */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={() => router.push('/admin/login')} className="flex items-center justify-center gap-1.5 whitespace-nowrap bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] h-8 rounded-md px-2.5 text-xs font-bold shadow-sm">
              <ShieldCheck size={14} className="text-[var(--primary)]" /> Admin
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1.5 text-[var(--foreground)] bg-[var(--surface)] hover:bg-[var(--accent)] rounded-md border border-[var(--border)] transition-colors">
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown List */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)] shadow-xl animate-in slide-in-from-top-2 p-4 flex flex-col gap-2 z-50">
            <Link href="/" className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors">Home</Link>
            <Link href="/candidates" className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors">For Candidates</Link>
            <Link href="/companies" className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors">For Companies</Link>
            <Link href="/how-it-works" className="px-4 py-3 rounded-xl text-sm font-semibold bg-[var(--accent)]/60 text-[var(--primary)] border border-[var(--primary)]/10">How it Works</Link>
            <Link href="#" className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors">Pricing</Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* 🚀 1. HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 grid-pattern mask-fade-b opacity-50 pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32 z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--accent)]/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>
              How it works
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-extrabold tracking-tight sm:text-6xl text-[var(--foreground)] leading-[1.1]">
              One platform. <span className="text-gradient">Two journeys.</span> Zero guesswork.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted-foreground)] font-medium">
              See exactly how candidates prove their skills and how companies find the right person — all in days, not months.
            </p>
          </div>
        </section>

        {/* 🚀 2. DUAL TRACKS */}
        <section className="py-20 sm:py-28 relative z-10 bg-[var(--background)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <Track tone="candidate" title="If you're a candidate" steps={CAND} ctaTo="/student/login" router={router} />
              <Track tone="company" title="If you're a company" steps={COMP} ctaTo="/company/login" router={router} />
            </div>
          </div>
        </section>

        {/* 🚀 3. INSIDE THE ENGINE */}
        <section className="py-20 sm:py-28 bg-[var(--surface)]/60 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--accent)]/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>Inside the engine
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[var(--foreground)]">What makes Resourcemania different</h2>
            </div>
            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {[
                { t: "Adaptive AI assessments", d: "Question difficulty adjusts to ability. The result: a precise picture of skill — not luck." },
                { t: "Cryptographic verification", d: "Each badge is signed and tamper-evident. Hiring teams can verify in one click." },
                { t: "Two-sided transparency", d: "Candidates see why they matched. Companies see exactly how a candidate scored." },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 shadow-soft">
                  <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">{c.t}</h3>
                  <p className="mt-3 text-sm text-[var(--muted-foreground)] font-medium">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 🚀 FOOTER */}
      <footer className="relative border-t border-[var(--border)] bg-[var(--surface)] pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5 mb-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-[var(--primary-foreground)] shadow-glow"><Briefcase className="h-5 w-5" strokeWidth={2.4}/></span>
                <span className="font-display text-lg font-bold tracking-tight text-[var(--foreground)]">Resource<span className="text-[var(--primary)]">mania</span></span>
              </Link>
              <p className="mt-4 max-w-sm text-sm text-[var(--muted-foreground)] font-medium leading-relaxed">The future of hiring. AI-verified skills, transparent matching, and zero resume black holes — for candidates and companies alike.</p>
              <div className="mt-6 flex items-center gap-3">
                <a href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--ink-soft)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"><Twitter className="h-4 w-4" /></a>
                <a href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--ink-soft)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"><Linkedin className="h-4 w-4" /></a>
                <a href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--ink-soft)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"><Github className="h-4 w-4" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-[var(--foreground)]">Product</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="/candidates" className="text-sm text-[var(--muted-foreground)] font-medium transition-colors hover:text-[var(--primary)]">For Candidates</Link></li>
                <li><Link href="/companies" className="text-sm text-[var(--muted-foreground)] font-medium transition-colors hover:text-[var(--primary)]">For Companies</Link></li>
                <li><Link href="/how-it-works" className="text-sm text-[var(--muted-foreground)] font-medium transition-colors hover:text-[var(--primary)]">How it Works</Link></li>
                <li><Link href="#" className="text-sm text-[var(--muted-foreground)] font-medium transition-colors hover:text-[var(--primary)]">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-[var(--foreground)]">Company</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="/" className="text-sm text-[var(--muted-foreground)] font-medium transition-colors hover:text-[var(--primary)]">About</Link></li>
                <li><Link href="/" className="text-sm text-[var(--muted-foreground)] font-medium transition-colors hover:text-[var(--primary)]">Careers</Link></li>
                <li><Link href="/contact" className="text-sm text-[var(--muted-foreground)] font-medium transition-colors hover:text-[var(--primary)]">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-[var(--foreground)]">Resources</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="/" className="text-sm text-[var(--muted-foreground)] font-medium transition-colors hover:text-[var(--primary)]">Blog</Link></li>
                <li><Link href="/support" className="text-sm text-[var(--muted-foreground)] font-medium transition-colors hover:text-[var(--primary)]">Help Center</Link></li>
                <li><Link href="/privacy-policy" className="text-sm text-[var(--muted-foreground)] font-medium transition-colors hover:text-[var(--primary)]">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-sm text-[var(--muted-foreground)] font-medium transition-colors hover:text-[var(--primary)]">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[var(--border)] pt-8">
            <p className="text-sm font-medium text-[var(--muted-foreground)]">© {new Date().getFullYear()} Resourcemania Technologies Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Internal Track Component mapped for Next.js
function Track({ tone, title, steps, ctaTo, router }: any) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border p-8 sm:p-10 ${tone === "candidate" ? "border-[var(--primary)]/20 bg-gradient-to-br from-[var(--accent)]/60 via-[var(--card)] to-[var(--card)]" : "border-[var(--border)] bg-[var(--card)]"}`}>
      <h3 className="font-display text-2xl font-bold sm:text-3xl text-[var(--foreground)]">{title}</h3>
      <ol className="mt-8 space-y-4">
        {steps.map((s: any, i: number) => (
          <li key={s.t} className="flex gap-4">
            <div className="relative">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-[var(--primary-foreground)] shadow-glow">
                <s.icon className="h-5 w-5" />
              </div>
              {i < steps.length - 1 && (
                <span className="absolute left-1/2 top-12 h-10 w-px -translate-x-1/2 bg-[var(--border)]" />
              )}
            </div>
            <div className="pb-4">
              <div className="font-display text-base font-semibold text-[var(--foreground)]">Step {i + 1} — {s.t}</div>
              <div className="mt-1 text-sm text-[var(--muted-foreground)] font-medium">{s.d}</div>
            </div>
          </li>
        ))}
      </ol>
      <button onClick={() => router.push(ctaTo)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-primary text-[var(--primary-foreground)] shadow-glow hover:shadow-ring hover:-translate-y-0.5 transition-all duration-300 font-semibold h-12 rounded-lg px-8 text-base mt-6">
        Get started <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
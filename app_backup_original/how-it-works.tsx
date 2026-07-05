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
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[var(--border)] shadow-soft">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] text-white transition-transform group-hover:scale-105">
              <Briefcase className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-[var(--foreground)]">Resource<span className="text-[var(--primary)]">mania</span></span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/" className="relative rounded-md px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]">Home</Link>
            <Link href="/candidates" className="relative rounded-md px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]">For Candidates</Link>
            <Link href="/companies" className="relative rounded-md px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]">For Companies</Link>
            <Link href="/how-it-works" className="relative rounded-md px-3 py-2 text-sm font-medium transition-colors text-[var(--primary)]">How it Works<span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[var(--primary)]"></span></Link>
            <Link href="#" className="relative rounded-md px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]">Pricing</Link>
          </nav>

          {/* Desktop Admin Login Button */}
          <div className="hidden items-center gap-2 md:flex">
            <button onClick={() => router.push('/admin/login')} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/40 h-9 rounded-lg px-4 text-sm font-semibold transition-all shadow-soft focus-visible:outline-none">
              <ShieldCheck size={15} className="text-[var(--primary)]" /> Admin
            </button>
          </div>

          {/* Mobile Menu & Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => router.push('/admin/login')} className="flex items-center justify-center gap-1.5 whitespace-nowrap bg-white border border-[var(--border)] text-[var(--foreground)] h-8 rounded-md px-2.5 text-xs font-semibold shadow-soft">
              <ShieldCheck size={13} className="text-[var(--primary)]" /> Admin
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1.5 text-[var(--foreground)] bg-white hover:bg-[var(--surface)] rounded-md border border-[var(--border)] transition-colors">
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown List */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-[var(--border)] shadow-elevated p-4 flex flex-col gap-1 z-50">
            <Link href="/" className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors">Home</Link>
            <Link href="/candidates" className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors">For Candidates</Link>
            <Link href="/companies" className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors">For Companies</Link>
            <Link href="/how-it-works" className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/15">How it Works</Link>
            <Link href="#" className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors">Pricing</Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* 🚀 1. HERO SECTION */}
        <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
          <div className="absolute inset-0 grid-pattern mask-fade-b opacity-40 pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28 z-10">
            <span className="section-label">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>
              How it works
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-[var(--foreground)] leading-[1.15]">
              One platform. <span className="text-gradient">Two journeys.</span> Zero guesswork.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
              See exactly how candidates prove their skills and how companies find the right person — all in days, not months.
            </p>
          </div>
        </section>

        {/* 🚀 2. DUAL TRACKS */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <Track tone="candidate" title="If you're a candidate" steps={CAND} ctaTo="/student/login" router={router} />
              <Track tone="company" title="If you're a company" steps={COMP} ctaTo="/company/login" router={router} />
            </div>
          </div>
        </section>

        {/* 3. INSIDE THE ENGINE */}
        <section className="py-20 sm:py-28" style={{ background: 'var(--surface)' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <span className="section-label">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>Inside the engine
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl text-[var(--foreground)]">What makes Resourcemania different</h2>
            </div>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {[
                { t: "Adaptive AI assessments", d: "Question difficulty adjusts to ability. The result: a precise picture of skill — not luck." },
                { t: "Cryptographic verification", d: "Each badge is signed and tamper-evident. Hiring teams can verify in one click." },
                { t: "Two-sided transparency", d: "Candidates see why they matched. Companies see exactly how a candidate scored." },
              ].map((c) => (
                <div key={c.t} className="bg-white rounded-xl border border-[var(--border)] p-6 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200">
                  <h3 className="font-display text-base font-semibold text-[var(--foreground)]">{c.t}</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 🚀 FOOTER */}
      <footer className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5 mb-10">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] text-white"><Briefcase className="h-4 w-4" strokeWidth={2.4}/></span>
                <span className="font-display text-[1.05rem] font-bold tracking-tight text-[var(--foreground)]">Resource<span className="text-[var(--primary)]">mania</span></span>
              </Link>
              <p className="mt-4 max-w-xs text-sm text-[var(--muted-foreground)] leading-relaxed">The future of hiring. AI-verified skills, transparent matching, and zero resume black holes — for candidates and companies alike.</p>
              <div className="mt-5 flex items-center gap-2">
                <a href="#" className="h-8 w-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-colors"><Twitter className="h-3.5 w-3.5" /></a>
                <a href="#" className="h-8 w-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-colors"><Linkedin className="h-3.5 w-3.5" /></a>
                <a href="#" className="h-8 w-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-colors"><Github className="h-3.5 w-3.5" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-[var(--foreground)] mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><Link href="/candidates" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">For Candidates</Link></li>
                <li><Link href="/companies" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">For Companies</Link></li>
                <li><Link href="/how-it-works" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">How it Works</Link></li>
                <li><Link href="#" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-[var(--foreground)] mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><Link href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">About</Link></li>
                <li><Link href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-[var(--foreground)] mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><Link href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Blog</Link></li>
                <li><Link href="/support" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Help Center</Link></li>
                <li><Link href="/privacy-policy" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-[var(--border)] pt-6">
            <p className="text-xs text-[var(--muted-foreground)]">© {new Date().getFullYear()} Resourcemania Technologies Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Internal Track Component mapped for Next.js
function Track({ tone, title, steps, ctaTo, router }: any) {
  return (
    <div className={`relative overflow-hidden rounded-xl border p-7 sm:p-9 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated ${
      tone === "candidate" 
        ? "border-[var(--primary)]/20 bg-[var(--accent)]" 
        : "border-[var(--border)] bg-white"
    }`}>
      <h3 className="font-display text-xl font-bold sm:text-2xl text-[var(--foreground)]">{title}</h3>
      <ol className="mt-7 space-y-5">
        {steps.map((s: any, i: number) => (
          <li key={s.t} className="flex gap-3.5">
            <div className="relative">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--primary)] text-white shadow-[var(--shadow-primary)]">
                <s.icon className="h-4.5 w-4.5" />
              </div>
              {i < steps.length - 1 && (
                <span className="absolute left-1/2 top-11 h-10 w-px -translate-x-1/2 bg-[var(--border)]" />
              )}
            </div>
            <div className="pb-4">
              <div className="font-display text-sm font-semibold text-[var(--foreground)]">Step {i + 1} — {s.t}</div>
              <div className="mt-1 text-sm text-[var(--muted-foreground)] leading-relaxed">{s.d}</div>
            </div>
          </li>
        ))}
      </ol>
      <button onClick={() => router.push(ctaTo)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[var(--primary)] text-white shadow-[var(--shadow-primary)] hover:bg-[var(--primary-glow)] hover:-translate-y-px transition-all duration-200 font-semibold h-10 rounded-lg px-6 text-sm mt-5">
        Get started <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
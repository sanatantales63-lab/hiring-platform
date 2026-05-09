"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, BadgeCheck, Brain, Building2, CheckCircle2, ShieldCheck,
  Sparkles, Target, Users, Zap, Briefcase, Twitter, Linkedin, Github, Mail,
  Menu, X
} from "lucide-react";
import Link from "next/link";

const COMPANIES = ["Stripe", "Notion", "Linear", "Vercel", "Figma", "Airbnb", "Shopify", "Discord"];

const FEATURES = [
  { icon: Brain, title: "AI Skill Verification", desc: "Adaptive assessments that test real-world ability — not memorized trivia. Every score is signed and shareable." },
  { icon: ShieldCheck, title: "Identity & Trust", desc: "ID checks, proctoring, and code-attribution prevent fakes. Every profile carries a verifiable trust badge." },
  { icon: Target, title: "Precision Matching", desc: "Match by proven skill, role fit, salary band, and culture signals — not keyword bingo." },
  { icon: Zap, title: "Hire in Days", desc: "Average time-to-shortlist drops from 6 weeks to 5 days. Companies see candidates with proof attached." },
  { icon: BadgeCheck, title: "Portable Credentials", desc: "Candidates own their results. Share a public Resourcemania profile or embed badges anywhere." },
  { icon: Sparkles, title: "Bias-Aware Scoring", desc: "Blind evaluation, calibrated rubrics, and audit logs give every applicant a fair, transparent shot." },
];

const STEPS = [
  { n: "01", t: "Create your profile", d: "Candidates take AI assessments. Companies define roles & rubrics — in minutes." },
  { n: "02", t: "Get verified", d: "Skills, identity, and experience are validated and signed. No résumé inflation." },
  { n: "03", t: "Match & meet", d: "Our engine surfaces best-fit matches. Schedule, interview, and offer — all in one place." },
];

export default function Home() {
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
            <Link href="/" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--primary)]">Home<span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-primary"></span></Link>
            <Link href="/candidates" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/60">For Candidates</Link>
            <Link href="/companies" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/60">For Companies</Link>
            <Link href="/how-it-works" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/60">How it Works</Link>
            <Link href="#" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/60">Pricing</Link>
          </nav>

          {/* Desktop Admin Login Button */}
          <div className="hidden items-center gap-2 md:flex">
            <button onClick={() => router.push('/admin/login')} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] h-9 rounded-lg px-4 text-sm font-semibold transition-all shadow-sm focus-visible:outline-none">
              <ShieldCheck size={16} className="text-[var(--primary)]" /> Admin Login
            </button>
          </div>

          {/* Mobile Menu & Buttons */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={() => router.push('/admin/login')} className="flex items-center justify-center gap-1.5 whitespace-nowrap bg-white border border-[var(--border)] text-[var(--foreground)] h-8 rounded-md px-2.5 text-xs font-bold shadow-sm">
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
            <Link href="/" className="px-4 py-3 rounded-xl text-sm font-semibold bg-[var(--accent)]/60 text-[var(--primary)] border border-[var(--primary)]/10">Home</Link>
            <Link href="/candidates" className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors">For Candidates</Link>
            <Link href="/companies" className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors">For Companies</Link>
            <Link href="/how-it-works" className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors">How it Works</Link>
            <Link href="#" className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors">Pricing</Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* 🚀 1. HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 grid-pattern mask-fade-b opacity-60 pointer-events-none" />
          <div className="relative mx-auto grid max-w-7xl gap-16 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pb-32 lg:pt-24 lg:px-8 z-10">
            <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--accent)]/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] w-fit mx-auto lg:mx-0">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>
                The future of hiring
              </span>
              <h1 className="mt-6 font-display text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-[var(--foreground)] leading-[1.1]">
                Hiring built on <span className="text-gradient">proof</span>,<br className="hidden sm:block" /> not promises.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-[var(--muted-foreground)] sm:text-xl mx-auto lg:mx-0 font-medium">
                Resourcemania connects verified talent with premium companies through AI skill assessments. No resume black holes. No guesswork. Just outcomes.
              </p>
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-3">
                <Link href="/candidates" className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-primary text-[var(--primary-foreground)] shadow-glow hover:shadow-ring hover:-translate-y-0.5 h-12 rounded-lg px-8 text-base font-semibold transition-all duration-300">
                  I'm a Candidate <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/companies" className="inline-flex items-center justify-center gap-2 whitespace-nowrap border border-[var(--border)] bg-white/50 backdrop-blur-sm text-[var(--foreground)] hover:bg-[var(--accent)] h-12 rounded-lg px-8 text-base font-semibold transition-colors shadow-sm">
                  I'm Hiring <Building2 className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm font-medium text-[var(--muted-foreground)]">
                {["10,000+ verified candidates", "500+ premium companies", "Avg. 5-day shortlist"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" />{t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="relative lg:col-span-5 hidden lg:block">
              <div className="relative mx-auto h-[480px] w-full max-w-md">
                <div className="absolute -right-6 -top-6 h-72 w-72 rounded-full bg-[var(--primary)]/15 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-[var(--primary-glow)]/20 blur-3xl" />

                <CandidateCard className="absolute left-0 top-4 w-[300px] animate-float" name="Aarav Sharma" role="Chartered Accountant" tags={["Accountant", "Taxation", "Tally"]} score={94} />
                <CandidateCard className="absolute right-0 top-44 w-[320px] animate-float-slow" name="Maria Velasquez" role="BBA Graduate" tags={["Accounts", "Tally", "Taxation"]} score={97} />
                <CandidateCard className="absolute bottom-0 left-6 w-[300px] animate-float" name="Jamal Okafor" role="Bcom Graduate" tags={["Accounts", "Tally", "Taxation"]} score={91} />

                <div className="absolute -right-2 top-24 grid h-12 w-12 place-items-center rounded-full bg-gradient-primary text-[var(--primary-foreground)] shadow-glow animate-pulse-ring z-20">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Trust Marquee */}
          <div className="relative border-y border-[var(--border)]/60 bg-[var(--background)]/60 py-6 backdrop-blur z-10">
            <div className="mx-auto max-w-7xl px-4">
              <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">Trusted by hiring teams at</p>
              <div className="overflow-hidden">
                <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
                  {[...COMPANIES, ...COMPANIES].map((c, i) => (
                    <span key={i} className="font-display text-xl font-bold tracking-tight text-[var(--ink-soft)]/70">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🚀 2. DUAL PATH SECTION */}
        <section className="py-20 sm:py-28 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--accent)]/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>Two sides. One platform.
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[var(--foreground)]">
                Built for the people who <span className="text-gradient">build careers</span> & companies.
              </h2>
              <p className="mt-4 text-lg text-[var(--muted-foreground)]">Whether you're proving your skills or finding world-class talent, Resourcemania removes the friction.</p>
            </div>
            
            <div className="mt-16 grid gap-6 lg:grid-cols-2">
              <DualCard tone="candidate" icon={Users} title="For Candidates" pitch="Get hired on what you can actually do." bullets={["Take AI assessments tailored to your role", "Earn verifiable, portable skill badges", "Get matched with companies that fit you", "Track every interview in one dashboard"]} ctaTo="/candidates" ctaLabel="Build my profile" router={router} />
              <DualCard tone="company" icon={Building2} title="For Companies" pitch="Hire verified talent in days, not months." bullets={["Define rubrics, source pre-vetted talent", "Skip 80% of unqualified resumes", "Collaborate with your team in shared pipelines", "ATS-friendly with full audit trails"]} ctaTo="/companies" ctaLabel="Start hiring" router={router} />
            </div>
          </div>
        </section>

        {/* 🚀 3. FEATURES SECTION */}
        <section className="py-20 sm:py-28 bg-[var(--surface)]/60 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--accent)]/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>The platform
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[var(--foreground)]">Everything you need to hire on proof</h2>
              <p className="mt-4 text-lg text-[var(--muted-foreground)]">A complete toolkit that brings rigor, speed, and fairness to every hire.</p>
            </div>
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-elevated">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--primary)]/0 transition-colors group-hover:bg-[var(--primary)]/10 blur-2xl" />
                  <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-[var(--accent)] text-[var(--primary)]"><f.icon className="h-5 w-5" /></div>
                  <h3 className="relative mt-5 font-display text-lg font-semibold text-[var(--foreground)]">{f.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 4. HOW IT WORKS SECTION */}
        <section className="py-20 sm:py-28 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--accent)]/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>How it works
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[var(--foreground)]">From signup to signed offer</h2>
              <p className="mt-4 text-lg text-[var(--muted-foreground)]">Three steps. One trusted system. Built for both sides of the table.</p>
            </div>
            <div className="relative mt-16 grid gap-6 lg:grid-cols-3">
              <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent lg:block" />
              {STEPS.map((s) => (
                <div key={s.n} className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated">
                  <span className="font-display text-5xl font-extrabold text-gradient">{s.n}</span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-[var(--foreground)]">{s.t}</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 5. STATS SECTION */}
        <section className="py-20 sm:py-28 bg-[var(--surface)]/60 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[{ k: "10,000+", v: "Verified candidates" }, { k: "500+", v: "Premium companies" }, { k: "5 days", v: "Average shortlist" }, { k: "94%", v: "Hiring satisfaction" }].map((s) => (
                <div key={s.v} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-soft">
                  <div className="font-display text-4xl font-extrabold text-gradient sm:text-5xl">{s.k}</div>
                  <div className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 6. TESTIMONIALS */}
        <section className="py-20 sm:py-28 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--accent)]/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>Voices
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[var(--foreground)]">People hire — and get hired — differently here</h2>
            </div>
            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {[
                { q: "We cut our screening time by 70%. Every candidate that lands on our desk is already proven.", n: "Priya R.", r: "Head of Talent, FinEdge" },
                { q: "I went from 200 silent applications to 4 interviews in two weeks. The badges actually mean something.", n: "Daniel K.", r: "Backend Engineer" },
                { q: "Finally a hiring platform that respects both sides. Transparent, fast, and refreshingly honest.", n: "Sana M.", r: "VP Engineering, Northwind" },
              ].map((t, i) => (
                <figure key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 shadow-soft flex flex-col justify-between">
                  <blockquote className="font-display text-lg leading-snug text-[var(--foreground)] mb-6">"{t.q}"</blockquote>
                  <figcaption className="mt-auto flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary font-display font-bold text-[var(--primary-foreground)]">{t.n.charAt(0)}</div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--foreground)]">{t.n}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{t.r}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 7. CTA SECTION */}
        <section className="py-20 sm:py-28 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--primary)]/20 bg-gradient-primary p-10 text-[var(--primary-foreground)] shadow-glow sm:p-16">
              <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
              <div className="relative grid items-center gap-8 lg:grid-cols-2 z-10">
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">Ready to hire — or get hired — on proof?</h2>
                  <p className="mt-4 max-w-lg text-[var(--primary-foreground)]/85 text-lg">Join thousands building real careers and real teams on Resourcemania.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <Link href="/candidates" className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 h-14 rounded-lg px-8 text-lg font-semibold transition-colors">
                    For Candidates
                  </Link>
                  <Link href="/companies" className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground)]/90 h-14 rounded-lg px-8 text-lg font-semibold transition-colors">
                    For Companies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 🚀 FOOTER */}
      <footer className="relative mt-24 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-[var(--primary-foreground)] shadow-glow"><Briefcase className="h-5 w-5" strokeWidth={2.4}/></span>
                <span className="font-display text-lg font-bold tracking-tight">Resource<span className="text-[var(--primary)]">mania</span></span>
              </Link>
              <p className="mt-4 max-w-sm text-sm text-[var(--muted-foreground)]">The future of hiring. AI-verified skills, transparent matching, and zero resume black holes — for candidates and companies alike.</p>
              <div className="mt-6 flex items-center gap-3">
                <a href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--ink-soft)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"><Twitter className="h-4 w-4" /></a>
                <a href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--ink-soft)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"><Linkedin className="h-4 w-4" /></a>
                <a href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--ink-soft)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"><Github className="h-4 w-4" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-[var(--foreground)]">Product</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="/candidates" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">For Candidates</Link></li>
                <li><Link href="/companies" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">For Companies</Link></li>
                <li><Link href="/how-it-works" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">How it Works</Link></li>
                <li><Link href="/pricing" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-[var(--foreground)]">Company</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="/" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">About</Link></li>
                <li><Link href="/" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">Careers</Link></li>
                <li><Link href="/" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">Press</Link></li>
                <li><Link href="/contact" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-[var(--foreground)]">Resources</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="/" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">Blog</Link></li>
                <li><Link href="/support" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">Help Center</Link></li>
                <li><Link href="/" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">Trust & Security</Link></li>
                <li><Link href="/" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">API Docs</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center">
            <p className="text-xs text-[var(--muted-foreground)]">© {new Date().getFullYear()} Resourcemania. All rights reserved.</p>
            <div className="flex items-center gap-5 text-xs text-[var(--muted-foreground)]">
              <Link href="/privacy-policy" className="hover:text-[var(--foreground)]">Privacy</Link>
              <Link href="/terms-of-service" className="hover:text-[var(--foreground)]">Terms</Link>
              <Link href="#" className="hover:text-[var(--foreground)]">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

// -------------------------------------------------------------
// INTERNAL COMPONENTS FOR THIS PAGE (Mapped from Lovable format)
// -------------------------------------------------------------

function CandidateCard({ name, role, tags, score, className }: { name: string; role: string; tags: string[]; score: number; className?: string; }) {
  return (
    <div className={`rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/95 p-4 shadow-elevated backdrop-blur ${className ?? ""}`}>
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent)] font-display font-bold text-[var(--primary)]">{name.charAt(0)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-display text-sm font-semibold text-[var(--foreground)]">{name}</p>
            <BadgeCheck className="h-4 w-4 text-[var(--primary)]" />
          </div>
          <p className="text-xs text-[var(--primary)]">{role}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((t) => (
              <span key={t} className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--ink-soft)]">{t}</span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-lg font-extrabold text-[var(--primary)]">{score}%</div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">match</div>
        </div>
      </div>
    </div>
  );
}

function DualCard({ tone, icon: Icon, title, pitch, bullets, ctaTo, ctaLabel, router }: any) {
  return (
    <div className={`group relative overflow-hidden rounded-3xl border p-8 transition-all hover:-translate-y-1 hover:shadow-elevated sm:p-10 ${tone === "candidate" ? "border-[var(--primary)]/20 bg-gradient-to-br from-[var(--accent)]/60 via-[var(--card)] to-[var(--card)]" : "border-[var(--border)] bg-[var(--card)]"}`}>
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--primary)]/10 blur-3xl transition-all group-hover:bg-[var(--primary)]/20" />
      <div className="relative">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-[var(--primary-foreground)] shadow-glow">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold sm:text-3xl text-[var(--foreground)]">{title}</h3>
        <p className="mt-2 text-base text-[var(--muted-foreground)]">{pitch}</p>
        <ul className="mt-6 space-y-3 mb-8">
          {bullets.map((b: string) => (
            <li key={b} className="flex items-start gap-3 text-sm text-[var(--foreground)]">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <button onClick={() => router.push(ctaTo)} className="bg-gradient-primary text-[var(--primary-foreground)] shadow-glow hover:shadow-ring hover:-translate-y-0.5 transition-all duration-300 font-semibold h-12 rounded-lg px-8 text-base inline-flex items-center justify-center gap-2">
          {ctaLabel} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
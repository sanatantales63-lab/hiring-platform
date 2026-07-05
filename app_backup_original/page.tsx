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
    <div className="flex min-h-screen flex-col font-sans" style={{ background: "var(--background)", color: "var(--foreground)" }}>

      {/* ── HEADER / NAVBAR ── */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[var(--border)] shadow-soft">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] text-white shadow-[var(--shadow-primary)]">
              <Briefcase className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <span className="font-display text-[1.05rem] font-bold tracking-tight text-[var(--foreground)]">
              Resource<span className="text-[var(--primary)]">mania</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            <Link href="/" className="relative px-3 py-2 text-sm font-semibold text-[var(--primary)] rounded-md">
              Home
              <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[var(--primary)]" />
            </Link>
            <Link href="/candidates" className="px-3 py-2 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-md transition-colors">For Candidates</Link>
            <Link href="/companies" className="px-3 py-2 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-md transition-colors">For Companies</Link>
            <Link href="/how-it-works" className="px-3 py-2 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-md transition-colors">How it Works</Link>
            <Link href="#" className="px-3 py-2 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-md transition-colors">Pricing</Link>
          </nav>

          {/* Desktop — Admin Login */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => router.push('/admin/login')}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/40 transition-all shadow-soft"
            >
              <ShieldCheck size={15} className="text-[var(--primary)]" /> Admin
            </button>
          </div>

          {/* Mobile — Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => router.push('/admin/login')}
              className="flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-bold border border-[var(--border)] bg-white text-[var(--foreground)] shadow-soft"
            >
              <ShieldCheck size={13} className="text-[var(--primary)]" /> Admin
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-md border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-[var(--border)] shadow-elevated p-4 flex flex-col gap-1 z-50">
            <Link href="/" className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-[var(--accent)] text-[var(--primary)]">Home</Link>
            <Link href="/candidates" className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors">For Candidates</Link>
            <Link href="/companies" className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors">For Companies</Link>
            <Link href="/how-it-works" className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors">How it Works</Link>
            <Link href="#" className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors">Pricing</Link>
          </div>
        )}
      </header>

      <main className="flex-1">

        {/* ── 1. HERO SECTION ── */}
        <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
          {/* Subtle dot grid */}
          <div className="absolute inset-0 grid-pattern mask-fade-b opacity-40 pointer-events-none" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pb-32 lg:pt-24 lg:px-8 z-10">
            <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
              <span className="section-label w-fit mx-auto lg:mx-0">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring" />
                The future of hiring
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-[var(--foreground)] leading-[1.15]">
                Hiring built on <span className="text-gradient">proof</span>,<br className="hidden sm:block" /> not promises.
              </h1>
              <p className="mt-5 max-w-xl text-base text-[var(--muted-foreground)] sm:text-lg mx-auto lg:mx-0 leading-relaxed">
                Resourcemania connects verified talent with premium companies through AI skill assessments. No resume black holes. No guesswork. Just outcomes.
              </p>
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-3">
                <Link href="/candidates" className="inline-flex items-center gap-2 bg-[var(--primary)] text-white font-semibold h-11 rounded-lg px-7 text-sm hover:bg-[var(--primary-glow)] shadow-[var(--shadow-primary)] hover:-translate-y-px transition-all duration-200">
                  I&apos;m a Candidate <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/companies" className="inline-flex items-center gap-2 border border-[var(--border)] bg-white text-[var(--foreground)] font-semibold h-11 rounded-lg px-7 text-sm hover:bg-[var(--surface)] hover:border-[var(--primary)]/40 shadow-soft transition-all duration-200">
                  I&apos;m Hiring <Building2 className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-5 text-sm font-medium text-[var(--muted-foreground)]">
                {["10,000+ verified candidates", "500+ premium companies", "Avg. 5-day shortlist"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" />{t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="relative lg:col-span-5 hidden lg:block">
              <div className="relative mx-auto h-[460px] w-full max-w-md">
                {/* Soft ambient */}
                <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-3xl" />
                <div className="absolute -bottom-8 -left-8 h-64 w-64 rounded-full bg-[var(--primary-glow)]/10 blur-3xl" />

                <CandidateCard className="absolute left-0 top-4 w-[290px] animate-float"       name="Aarav Sharma"    role="Chartered Accountant" tags={["Accountant","Taxation","Tally"]} score={94} />
                <CandidateCard className="absolute right-0 top-44 w-[310px] animate-float-slow" name="Maria Velasquez" role="BBA Graduate"           tags={["Accounts","Tally","Taxation"]}  score={97} />
                <CandidateCard className="absolute bottom-0 left-4 w-[290px] animate-float"    name="Jamal Okafor"   role="Bcom Graduate"         tags={["Accounts","Tally","Taxation"]}  score={91} />

                <div className="absolute -right-2 top-24 grid h-10 w-10 place-items-center rounded-full bg-[var(--primary)] text-white shadow-[var(--shadow-primary)] z-20">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Trust Marquee */}
          <div className="relative border-t border-[var(--border)] bg-white/60 backdrop-blur py-5 z-10">
            <div className="mx-auto max-w-7xl px-4">
              <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Trusted by hiring teams at</p>
              <div className="overflow-hidden">
                <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
                  {[...COMPANIES, ...COMPANIES].map((c, i) => (
                    <span key={i} className="font-display text-lg font-bold tracking-tight text-[var(--ink-soft)]/60">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. DUAL PATH SECTION ── */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <span className="section-label">Two sides. One platform.</span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl text-[var(--foreground)]">
                Built for the people who <span className="text-gradient">build careers</span> & companies.
              </h2>
              <p className="mt-4 text-base text-[var(--muted-foreground)] leading-relaxed">Whether you&apos;re proving your skills or finding world-class talent, Resourcemania removes the friction.</p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              <DualCard tone="candidate" icon={Users} title="For Candidates" pitch="Get hired on what you can actually do." bullets={["Take AI assessments tailored to your role","Earn verifiable, portable skill badges","Get matched with companies that fit you","Track every interview in one dashboard"]} ctaTo="/candidates" ctaLabel="Build my profile" router={router} />
              <DualCard tone="company" icon={Building2} title="For Companies" pitch="Hire verified talent in days, not months." bullets={["Define rubrics, source pre-vetted talent","Skip 80% of unqualified resumes","Collaborate with your team in shared pipelines","ATS-friendly with full audit trails"]} ctaTo="/companies" ctaLabel="Start hiring" router={router} />
            </div>
          </div>
        </section>

        {/* ── 3. FEATURES SECTION ── */}
        <section className="py-20 sm:py-28" style={{ background: "var(--surface)" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <span className="section-label">The platform</span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl text-[var(--foreground)]">Everything you need to hire on proof</h2>
              <p className="mt-4 text-base text-[var(--muted-foreground)] leading-relaxed">A complete toolkit that brings rigor, speed, and fairness to every hire.</p>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="group bg-white rounded-xl border border-[var(--border)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:shadow-elevated">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--primary)]">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-[var(--foreground)]">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. HOW IT WORKS ── */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <span className="section-label">How it works</span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl text-[var(--foreground)]">From signup to signed offer</h2>
              <p className="mt-4 text-base text-[var(--muted-foreground)] leading-relaxed">Three steps. One trusted system. Built for both sides of the table.</p>
            </div>
            <div className="relative mt-14 grid gap-6 lg:grid-cols-3">
              {/* Connector line */}
              <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-[var(--primary)]/20 to-transparent lg:block" />
              {STEPS.map((s) => (
                <div key={s.n} className="relative bg-white rounded-xl border border-[var(--border)] p-7 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200">
                  <span className="font-display text-4xl font-bold text-gradient">{s.n}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-[var(--foreground)]">{s.t}</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. STATS ── */}
        <section className="py-20 sm:py-24" style={{ background: "var(--surface)" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { k: "10,000+", v: "Verified candidates" },
                { k: "500+",    v: "Premium companies" },
                { k: "5 days",  v: "Average shortlist" },
                { k: "94%",     v: "Hiring satisfaction" },
              ].map((s) => (
                <div key={s.v} className="bg-white rounded-xl border border-[var(--border)] p-8 text-center shadow-soft">
                  <div className="font-display text-3xl font-bold text-gradient sm:text-4xl">{s.k}</div>
                  <div className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. TESTIMONIALS ── */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <span className="section-label">Voices</span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl text-[var(--foreground)]">People hire — and get hired — differently here</h2>
            </div>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {[
                { q: "We cut our screening time by 70%. Every candidate that lands on our desk is already proven.", n: "Priya R.", r: "Head of Talent, FinEdge" },
                { q: "I went from 200 silent applications to 4 interviews in two weeks. The badges actually mean something.", n: "Daniel K.", r: "Backend Engineer" },
                { q: "Finally a hiring platform that respects both sides. Transparent, fast, and refreshingly honest.", n: "Sana M.", r: "VP Engineering, Northwind" },
              ].map((t, i) => (
                <figure key={i} className="bg-white rounded-xl border border-[var(--border)] p-6 shadow-soft flex flex-col justify-between">
                  <blockquote className="text-base leading-relaxed text-[var(--foreground)] mb-6 font-medium">&ldquo;{t.q}&rdquo;</blockquote>
                  <figcaption className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--accent)] font-display font-bold text-[var(--primary)] text-sm">{t.n.charAt(0)}</div>
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

        {/* ── 7. CTA SECTION ── */}
        <section className="py-20 sm:py-28" style={{ background: "var(--surface)" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-[var(--primary)] p-10 sm:p-16">
              {/* Subtle inner pattern */}
              <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
              <div className="relative grid items-center gap-8 lg:grid-cols-2 z-10">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl text-white">Ready to hire — or get hired — on proof?</h2>
                  <p className="mt-3 max-w-lg text-white/80 text-base leading-relaxed">Join thousands building real careers and real teams on Resourcemania.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <Link href="/candidates" className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold h-11 rounded-lg px-7 text-sm hover:bg-white/25 transition-colors">
                    For Candidates
                  </Link>
                  <Link href="/companies" className="inline-flex items-center gap-2 bg-white text-[var(--primary)] font-bold h-11 rounded-lg px-7 text-sm hover:bg-white/90 transition-colors shadow-[var(--shadow-card)]">
                    For Companies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] text-white">
                  <Briefcase className="h-4 w-4" strokeWidth={2.4} />
                </span>
                <span className="font-display text-[1.05rem] font-bold tracking-tight text-[var(--foreground)]">
                  Resource<span className="text-[var(--primary)]">mania</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm text-[var(--muted-foreground)] leading-relaxed">The future of hiring. AI-verified skills, transparent matching, and zero resume black holes.</p>
              <div className="mt-5 flex items-center gap-2">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a key={i} href="#" className="h-8 w-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-colors">
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
            {[
              { heading: "Product",   links: [["For Candidates","/candidates"],["For Companies","/companies"],["How it Works","/how-it-works"],["Pricing","/"]] },
              { heading: "Company",   links: [["About","/"],["Careers","/"],["Press","/"],["Contact","/"]] },
              { heading: "Resources", links: [["Blog","/"],["Help Center","/support"],["Trust & Security","/"],["API Docs","/"]] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <h4 className="font-display text-sm font-semibold text-[var(--foreground)] mb-4">{heading}</h4>
                <ul className="space-y-2.5">
                  {links.map(([label, href]) => (
                    <li key={label}><Link href={href} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center">
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

// ─────────────────────────────────────────────────
// INTERNAL COMPONENTS
// ─────────────────────────────────────────────────

function CandidateCard({ name, role, tags, score, className }: { name: string; role: string; tags: string[]; score: number; className?: string; }) {
  return (
    <div className={`rounded-xl border border-[var(--border)] bg-white p-4 shadow-card ${className ?? ""}`}>
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--accent)] font-display font-bold text-[var(--primary)] text-sm">
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold text-sm text-[var(--foreground)]">{name}</p>
            <BadgeCheck className="h-4 w-4 text-[var(--primary)] shrink-0" />
          </div>
          <p className="text-xs text-[var(--primary)] font-medium mt-0.5">{role}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((t) => (
              <span key={t} className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--ink-soft)]">{t}</span>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-display text-base font-bold text-[var(--primary)]">{score}%</div>
          <div className="text-[9px] uppercase tracking-wider text-[var(--muted-foreground)]">match</div>
        </div>
      </div>
    </div>
  );
}

function DualCard({ tone, icon: Icon, title, pitch, bullets, ctaTo, ctaLabel, router }: any) {
  const isCandidate = tone === "candidate";
  return (
    <div className={`relative overflow-hidden rounded-xl border p-8 sm:p-10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated ${isCandidate ? "border-[var(--primary)]/25 bg-[var(--accent)]" : "border-[var(--border)] bg-white"}`}>
      <div className="h-11 w-11 flex items-center justify-center rounded-lg bg-[var(--primary)] text-white shadow-[var(--shadow-primary)]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-2xl font-bold sm:text-3xl text-[var(--foreground)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{pitch}</p>
      <ul className="mt-6 space-y-2.5 mb-8">
        {bullets.map((b: string) => (
          <li key={b} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => router.push(ctaTo)}
        className="inline-flex items-center gap-2 bg-[var(--primary)] text-white font-semibold h-10 rounded-lg px-6 text-sm hover:bg-[var(--primary-glow)] shadow-[var(--shadow-primary)] hover:-translate-y-px transition-all duration-200"
      >
        {ctaLabel} <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
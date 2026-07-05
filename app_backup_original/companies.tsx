"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Building2, CheckCircle2, Filter, Gauge, LineChart,
  Lock, ShieldCheck, Sparkles, Users, Workflow, Briefcase,
  Twitter, Linkedin, Github, Mail, Menu, X
} from "lucide-react";

const PILLARS = [
  { icon: Filter, t: "Pre-vetted talent pool", d: "Every candidate carries a signed skill profile. No more 200-resume slogs." },
  { icon: Workflow, t: "Collaborative pipelines", d: "Shared shortlists, in-app comments, and structured interview kits." },
  { icon: Gauge, t: "Time-to-hire dashboards", d: "Real-time analytics on funnel velocity, drop-off, and offer rates." },
  { icon: ShieldCheck, t: "Compliance & audit trails", d: "GDPR & SOC2-ready. Every decision traceable for legal peace of mind." },
  { icon: Lock, t: "Bias-aware tooling", d: "Blind reviews, calibrated rubrics, and fairness reports baked in." },
  { icon: LineChart, t: "ATS-friendly", d: "Two-way sync with Greenhouse, Lever, Ashby, and your favorite stack." },
];

export default function CompaniesPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] font-sans">
      
      {/* 🚀 HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[var(--border)] shadow-soft">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] text-white shadow-[var(--shadow-primary)]">
              <Briefcase className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <span className="font-display text-[1.05rem] font-bold tracking-tight text-[var(--foreground)]">Resource<span className="text-[var(--primary)]">mania</span></span>
          </Link>
          
          <nav className="hidden items-center gap-0.5 md:flex">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-md transition-colors">Home</Link>
            <Link href="/candidates" className="px-3 py-2 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-md transition-colors">For Candidates</Link>
            <Link href="/companies" className="relative px-3 py-2 text-sm font-semibold text-[var(--primary)] rounded-md">For Companies<span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[var(--primary)]"></span></Link>
            <Link href="/how-it-works" className="px-3 py-2 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-md transition-colors">How it Works</Link>
            <Link href="#" className="px-3 py-2 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-md transition-colors">Pricing</Link>
          </nav>

          {/* Desktop Admin Login Button */}
          <div className="hidden items-center gap-2 md:flex">
            <button onClick={() => router.push('/admin/login')} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/40 h-9 rounded-lg px-4 text-sm font-semibold transition-all shadow-sm focus-visible:outline-none">
              <ShieldCheck size={16} className="text-[var(--primary)]" /> Admin Login
            </button>
          </div>

          {/* Mobile Menu & Buttons */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={() => router.push('/admin/login')} className="flex items-center justify-center gap-1.5 whitespace-nowrap bg-white border border-[var(--border)] text-[var(--foreground)] h-8 rounded-md px-2.5 text-xs font-bold shadow-sm">
              <ShieldCheck size={14} className="text-[var(--primary)]" /> Admin
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
            <Link href="/companies" className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-[var(--accent)] text-[var(--primary)]">For Companies</Link>
            <Link href="/how-it-works" className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors">How it Works</Link>
            <Link href="#" className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors">Pricing</Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* 🚀 1. HERO SECTION */}
        <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
          <div className="absolute inset-0 grid-pattern mask-fade-b opacity-40 pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:pb-28 lg:pt-24 lg:px-8 z-10">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
                <span className="section-label w-fit mx-auto lg:mx-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>For Companies
                </span>
                <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-[var(--foreground)] leading-[1.15]">
                  Hire verified talent in <span className="text-gradient">days, not months</span>.
                </h1>
                <p className="mt-5 max-w-xl text-base text-[var(--muted-foreground)] sm:text-lg mx-auto lg:mx-0 leading-relaxed">
                  Source candidates whose skills are already proven. Skip 80% of unqualified applications. Build pipelines your whole team can trust.
                </p>
                <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-3">
                  <button onClick={() => router.push('/company/login')} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[var(--primary)] text-white hover:bg-[var(--primary-glow)] hover:-translate-y-px h-11 rounded-lg px-7 text-sm font-semibold transition-all duration-200 shadow-[var(--shadow-primary)]">
                    Start hiring <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link href="#" className="inline-flex items-center justify-center gap-2 whitespace-nowrap border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/40 h-11 rounded-lg px-7 text-sm font-semibold transition-all duration-200 shadow-soft">
                    See pricing
                  </Link>
                </div>
                <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-8 max-w-md mx-auto lg:mx-0">
                  {[{ k: "70%", v: "Less screening time" }, { k: "5d", v: "Avg. shortlist" }, { k: "94%", v: "Manager NPS" }].map((s) => (
                    <div key={s.v} className="text-left">
                      <div className="font-display text-2xl font-bold text-[var(--foreground)]">{s.k}</div>
                      <div className="text-xs text-[var(--muted-foreground)] font-medium mt-1">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pipeline Mockup */}
              <div className="lg:col-span-5 hidden lg:block relative z-10">
                <div className="relative mx-auto max-w-md">
                  <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-8 -left-8 h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none" />
                  <div className="relative rounded-xl border border-[var(--border)] bg-white p-5 shadow-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-bold">Open role</div>
                        <div className="font-display text-base font-bold text-[var(--foreground)]">Senior Finance Manager</div>
                      </div>
                      <span className="rounded-full bg-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold text-[var(--primary)]">24 matches</span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      <div>Sourced</div>
                      <div>Interview</div>
                      <div>Offer</div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {[{ n: 12, bg: "bg-[var(--accent)]", text: "text-[var(--foreground)]" }, { n: 6, bg: "bg-[var(--primary)]/20", text: "text-[var(--foreground)]" }, { n: 2, bg: "bg-[var(--primary)]", text: "text-white" }].map((c, i) => (
                        <div key={i} className={`grid h-20 place-items-center rounded-xl ${c.bg} font-display text-2xl font-extrabold ${c.text}`}>
                          {c.n}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 space-y-2">
                      {[{ n: "Maria V.", r: "98% match", tag: "Top 1%" }, { n: "Daniel K.", r: "94% match", tag: "Verified" }, { n: "Sana M.", r: "91% match", tag: "Verified" }].map((c) => (
                        <div key={c.n} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent)] font-display text-xs font-bold text-[var(--primary)]">{c.n.charAt(0)}</div>
                            <div>
                              <div className="text-xs font-semibold text-[var(--foreground)]">{c.n}</div>
                              <div className="text-[10px] text-[var(--primary)] font-medium">{c.r}</div>
                            </div>
                          </div>
                          <span className="rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">{c.tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="absolute -bottom-6 -right-4 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white px-4 py-3 shadow-card animate-float">
                    <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                    <div>
                      <div className="text-xs font-bold text-[var(--foreground)]">AI insight</div>
                      <div className="text-[10px] font-medium text-[var(--muted-foreground)]">+18% offer rate this week</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🚀 2. FEATURES PILLARS */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
              <span className="section-label">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>Built for hiring teams
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[var(--foreground)]">Less noise. More signal. Better hires.</h2>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PILLARS.map((p) => (
                <div key={p.t} className="group bg-white rounded-xl border border-[var(--border)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:shadow-elevated">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--primary)]"><p.icon className="h-5 w-5" /></div>
                  <h3 className="mt-4 font-display text-base font-semibold text-[var(--foreground)]">{p.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 3. OUTCOMES */}
        <section className="py-20 sm:py-28" style={{ background: "var(--surface)" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="section-label">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>Outcomes
                </span>
                <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl text-[var(--foreground)]">
                  Hire on <span className="text-gradient">proof</span>. Cut wasted cycles.
                </h2>
                <p className="mt-4 text-base text-[var(--muted-foreground)] leading-relaxed">
                  Hiring teams using Resourcemania interview fewer candidates, make stronger offers, and close roles in a fraction of the time.
                </p>
                <ul className="mt-6 space-y-3 mb-8">
                  {["Reduce time-to-shortlist by 70%", "Cut bad-hire rate by 3×", "Onboard new sourcers in a single day", "Defensible decisions, end to end"].map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm text-[var(--foreground)] font-medium">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--primary)]" /> {b}
                    </li>
                  ))}
                </ul>
                <button onClick={() => router.push('/company/login')} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[var(--primary)] text-white hover:bg-[var(--primary-glow)] hover:-translate-y-px transition-all duration-200 font-semibold h-11 rounded-lg px-7 text-sm shadow-[var(--shadow-primary)]">
                  Book a demo <Building2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[{ k: "70%", v: "Faster screening", icon: Gauge }, { k: "3×", v: "Fewer bad hires", icon: ShieldCheck }, { k: "94%", v: "Manager NPS", icon: Sparkles }, { k: "500+", v: "Premium teams", icon: Users }].map((c) => (
                  <div key={c.v} className="bg-white rounded-xl border border-[var(--border)] p-6 shadow-soft">
                    <c.icon className="h-6 w-6 text-[var(--primary)]" />
                    <div className="mt-4 font-display text-3xl font-bold text-gradient">{c.k}</div>
                    <div className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">{c.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 🚀 4. CTA SECTION */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-[var(--primary)] p-10 sm:p-16">
              <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
              <div className="relative grid items-center gap-8 lg:grid-cols-2 z-10">
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-white">Build a hiring engine your team will love.</h2>
                  <p className="mt-3 max-w-lg text-white/80 text-base leading-relaxed">Join hundreds of premium teams who replaced resume roulette with proof-based hiring.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <Link href="#" className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white/15 border border-white/30 text-white hover:bg-white/25 h-11 rounded-lg px-7 text-sm font-semibold transition-colors">
                    Pricing
                  </Link>
                  <button onClick={() => router.push('/company/login')} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white text-[var(--primary)] font-bold hover:bg-white/90 h-11 rounded-lg px-7 text-sm transition-colors shadow-[var(--shadow-card)]">
                    Start hiring <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 🚀 FOOTER */}
      <footer className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] text-white"><Briefcase className="h-4 w-4" strokeWidth={2.4}/></span>
                <span className="font-display text-[1.05rem] font-bold tracking-tight text-[var(--foreground)]">Resource<span className="text-[var(--primary)]">mania</span></span>
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
              { heading: "Product",   links: [["For Candidates", "/candidates"], ["For Companies", "/companies"], ["How it Works", "/how-it-works"], ["Pricing", "/"]] },
              { heading: "Company",   links: [["About", "/"], ["Careers", "/"], ["Press", "/"], ["Contact", "/"]] },
              { heading: "Resources", links: [["Blog", "/"], ["Help Center", "/support"], ["Privacy Policy", "/privacy-policy"], ["Terms of Service", "/terms-of-service"]] },
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
            <p className="text-xs text-[var(--muted-foreground)]">© {new Date().getFullYear()} Resourcemania Technologies Pvt. Ltd. All rights reserved.</p>
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
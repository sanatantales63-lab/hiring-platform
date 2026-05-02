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
      <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-[var(--background)]/80 backdrop-blur-md border-b border-transparent">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-[var(--primary-foreground)] shadow-glow transition-transform group-hover:scale-105">
              <Briefcase className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-[var(--foreground)]">Resource<span className="text-[var(--primary)]">mania</span></span>
          </Link>
          
          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/60">Home</Link>
            <Link href="/candidates" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/60">For Candidates</Link>
            <Link href="/companies" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--primary)]">For Companies<span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-primary"></span></Link>
            <Link href="/how-it-works" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--ink-soft)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/60">How it Works</Link>
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
            <Link href="/companies" className="px-4 py-3 rounded-xl text-sm font-semibold bg-[var(--accent)]/60 text-[var(--primary)] border border-[var(--primary)]/10">For Companies</Link>
            <Link href="/how-it-works" className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors">How it Works</Link>
            <Link href="#" className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors">Pricing</Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* 🚀 1. HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 grid-pattern mask-fade-b opacity-50 pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:pb-28 lg:pt-24 lg:px-8 z-10">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--accent)]/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] w-fit mx-auto lg:mx-0 mb-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>For Companies
                </span>
                <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl text-[var(--foreground)] leading-[1.1]">
                  Hire verified talent in <span className="text-gradient">days, not months</span>.
                </h1>
                <p className="mt-6 max-w-xl text-lg text-[var(--muted-foreground)] mx-auto lg:mx-0 font-medium">
                  Source candidates whose skills are already proven. Skip 80% of unqualified applications. Build pipelines your whole team can trust.
                </p>
                <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-3">
                  <button onClick={() => router.push('/company/login')} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-primary text-[var(--primary-foreground)] shadow-glow hover:shadow-ring hover:-translate-y-0.5 h-12 rounded-lg px-8 text-base font-semibold transition-all duration-300">
                    Start hiring <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link href="#" className="inline-flex items-center justify-center gap-2 whitespace-nowrap border border-[var(--border)] bg-white/50 backdrop-blur-sm text-[var(--foreground)] hover:bg-[var(--accent)] h-12 rounded-lg px-8 text-base font-semibold transition-colors shadow-sm">
                    See pricing
                  </Link>
                </div>
                <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 max-w-md mx-auto lg:mx-0">
                  {[{ k: "70%", v: "Less screening time" }, { k: "5d", v: "Avg. shortlist" }, { k: "94%", v: "Manager NPS" }].map((s) => (
                    <div key={s.v} className="text-left">
                      <div className="font-display text-2xl font-extrabold text-[var(--foreground)]">{s.k}</div>
                      <div className="text-xs text-[var(--muted-foreground)] font-medium mt-1">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pipeline Mockup */}
              <div className="lg:col-span-5 hidden lg:block relative z-10">
                <div className="relative mx-auto max-w-md">
                  <div className="absolute -inset-6 rounded-3xl bg-[var(--primary)] opacity-20 blur-3xl pointer-events-none" />
                  <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-elevated">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-bold">Open role</div>
                        <div className="font-display text-base font-bold text-[var(--foreground)]">Senior Backend Engineer</div>
                      </div>
                      <span className="rounded-full bg-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold text-[var(--primary)]">24 matches</span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      <div>Sourced</div>
                      <div>Interview</div>
                      <div>Offer</div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {[{ n: 12, color: "from-[var(--primary)]/30 to-[var(--primary)]/10" }, { n: 6, color: "from-[var(--primary)]/60 to-[var(--primary)]/20" }, { n: 2, color: "from-[var(--primary)] to-[var(--primary-glow)]" }].map((c, i) => (
                        <div key={i} className={`grid h-20 place-items-center rounded-xl bg-gradient-to-b ${c.color} font-display text-2xl font-extrabold ${i === 2 ? 'text-[var(--primary-foreground)]' : 'text-[var(--foreground)]'}`}>
                          {c.n}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 space-y-2">
                      {[{ n: "Maria V.", r: "98% match", tag: "Top 1%" }, { n: "Daniel K.", r: "94% match", tag: "Verified" }, { n: "Sana M.", r: "91% match", tag: "Verified" }].map((c) => (
                        <div key={c.n} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-[var(--primary-foreground)]">{c.n.charAt(0)}</div>
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

                  <div className="absolute -bottom-6 -right-4 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 shadow-elevated animate-float">
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
        <section className="py-20 sm:py-28 relative z-10 bg-[var(--background)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-center md:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--accent)]/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>Built for hiring teams
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[var(--foreground)]">Less noise. More signal. Better hires.</h2>
            </div>
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PILLARS.map((p) => (
                <div key={p.t} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-elevated">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--accent)] text-[var(--primary)]"><p.icon className="h-5 w-5" /></div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-[var(--foreground)]">{p.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 3. OUTCOMES */}
        <section className="py-20 sm:py-28 bg-[var(--surface)]/60 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--accent)]/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>Outcomes
                </span>
                <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl text-[var(--foreground)]">
                  Hire on <span className="text-gradient">proof</span>. Cut wasted cycles.
                </h2>
                <p className="mt-4 text-lg text-[var(--muted-foreground)] font-medium">
                  Hiring teams using Resourcemania interview fewer candidates, make stronger offers, and close roles in a fraction of the time.
                </p>
                <ul className="mt-6 space-y-3 mb-8">
                  {["Reduce time-to-shortlist by 70%", "Cut bad-hire rate by 3×", "Onboard new sourcers in a single day", "Defensible decisions, end to end"].map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm text-[var(--foreground)] font-medium">
                      <CheckCircle2 className="h-5 w-5 text-[var(--primary)]" /> {b}
                    </li>
                  ))}
                </ul>
                <button onClick={() => router.push('/company/login')} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-primary text-[var(--primary-foreground)] shadow-glow hover:shadow-ring hover:-translate-y-0.5 transition-all duration-300 font-semibold h-12 rounded-lg px-8 text-base">
                  Book a demo <Building2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[{ k: "70%", v: "Faster screening", icon: Gauge }, { k: "3×", v: "Fewer bad hires", icon: ShieldCheck }, { k: "94%", v: "Manager NPS", icon: Sparkles }, { k: "500+", v: "Premium teams", icon: Users }].map((c) => (
                  <div key={c.v} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-soft">
                    <c.icon className="h-6 w-6 text-[var(--primary)]" />
                    <div className="mt-4 font-display text-3xl font-extrabold text-gradient">{c.k}</div>
                    <div className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">{c.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 🚀 4. CTA SECTION */}
        <section className="py-20 sm:py-28 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--primary)]/20 bg-gradient-primary p-10 text-[var(--primary-foreground)] shadow-glow sm:p-16">
              <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
              <div className="relative grid items-center gap-8 lg:grid-cols-2 z-10">
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-[var(--primary-foreground)]">Build a hiring engine your team will love.</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <Link href="#" className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 h-14 rounded-lg px-8 text-lg font-semibold transition-colors">
                    Pricing
                  </Link>
                  <button onClick={() => router.push('/company/login')} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground)]/90 h-14 rounded-lg px-8 text-lg font-semibold transition-colors shadow-sm">
                    Start hiring <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
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
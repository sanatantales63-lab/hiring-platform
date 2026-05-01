"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Award, BadgeCheck, BarChart3, Briefcase, CheckCircle2,
  Compass, FileBadge, GraduationCap, Rocket, Sparkles, Building2,
  Twitter, Linkedin, Github, Mail, ShieldCheck, Menu, X
} from "lucide-react";

const PERKS = [
  { icon: BadgeCheck, t: "Verified skill badges", d: "Earn signed credentials that companies trust at first glance." },
  { icon: Compass, t: "Smart role matching", d: "We surface roles that fit your skills, salary, and ambition." },
  { icon: BarChart3, t: "Transparent scoring", d: "See exactly how you stack up — and where to grow next." },
  { icon: Rocket, t: "Direct intros", d: "Skip the gatekeepers — meet hiring managers directly." },
  { icon: Award, t: "Portable profile", d: "Your achievements travel with you. Share anywhere, anytime." },
  { icon: GraduationCap, t: "Built-in growth", d: "Personalized learning paths based on your assessment results." },
];

export default function CandidatesPage() {
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
            <Link href="/candidates" className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--primary)]">For Candidates<span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-primary"></span></Link>
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
            <Link href="/" className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors">Home</Link>
            <Link href="/candidates" className="px-4 py-3 rounded-xl text-sm font-semibold bg-[var(--accent)]/60 text-[var(--primary)] border border-[var(--primary)]/10">For Candidates</Link>
            <Link href="/companies" className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors">For Companies</Link>
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
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>For Candidates
                </span>
                <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl text-[var(--foreground)] leading-[1.1]">
                  Get hired on what you <span className="text-gradient">actually do</span>.
                </h1>
                <p className="mt-6 max-w-xl text-lg text-[var(--muted-foreground)] mx-auto lg:mx-0 font-medium">
                  Build a verified profile in 20 minutes. Earn skill badges that mean something. Get matched with companies that respect your time.
                </p>
                <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-3">
                  {/* YAHAN SE STUDENT LOGIN PAR JAYEGA */}
                  <button onClick={() => router.push('/student/login')} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-primary text-[var(--primary-foreground)] shadow-glow hover:shadow-ring hover:-translate-y-0.5 h-12 rounded-lg px-8 text-base font-semibold transition-all duration-300">
                    Build my profile <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link href="/how-it-works" className="inline-flex items-center justify-center gap-2 whitespace-nowrap border border-[var(--border)] bg-white/50 backdrop-blur-sm text-[var(--foreground)] hover:bg-[var(--accent)] h-12 rounded-lg px-8 text-base font-semibold transition-colors shadow-sm">
                    See how it works
                  </Link>
                </div>
                <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 max-w-md mx-auto lg:mx-0">
                  {[{ k: "4×", v: "Faster offers" }, { k: "94%", v: "Match accuracy" }, { k: "$0", v: "To get started" }].map((s) => (
                    <div key={s.v} className="text-left">
                      <div className="font-display text-2xl font-extrabold text-[var(--foreground)]">{s.k}</div>
                      <div className="text-xs text-[var(--muted-foreground)] font-medium mt-1">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile Mockup */}
              <div className="lg:col-span-5 hidden lg:block relative z-10">
                <div className="relative mx-auto max-w-sm">
                  <div className="absolute -inset-6 rounded-3xl bg-[var(--primary)] opacity-20 blur-3xl pointer-events-none" />
                  <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-elevated">
                    <div className="flex items-center gap-4">
                      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary font-display text-xl font-bold text-[var(--primary-foreground)] shadow-glow">A</div>
                      <div>
                        <div className="flex items-center gap-1 font-display text-lg font-bold text-[var(--foreground)]">Aarav Sharma <BadgeCheck className="h-4 w-4 text-[var(--primary)]" /></div>
                        <div className="text-sm font-medium text-[var(--primary)]">Senior Full-Stack Engineer</div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {[{ l: "React & TypeScript", v: 96 }, { l: "System Design", v: 91 }, { l: "AWS & DevOps", v: 88 }].map((s) => (
                        <div key={s.l}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-[var(--foreground)]">{s.l}</span>
                            <span className="font-bold text-[var(--primary)]">{s.v}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                            <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${s.v}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {["React", "TypeScript", "Node.js", "AWS", "PostgreSQL"].map((t) => (
                        <span key={t} className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-2 py-1 text-xs font-medium text-[var(--ink-soft)]">{t}</span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between rounded-xl bg-[var(--accent)] p-3 cursor-pointer hover:bg-[var(--accent)]/80 transition-colors">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                        <Sparkles className="h-4 w-4" /> 12 active matches
                      </div>
                      <ArrowRight className="h-4 w-4 text-[var(--primary)]" />
                    </div>
                  </div>

                  <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 shadow-elevated animate-float">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center"><FileBadge className="h-5 w-5 text-[var(--primary)]" /></div>
                    <div>
                      <div className="text-xs font-bold text-[var(--foreground)]">New badge</div>
                      <div className="text-[10px] font-medium text-[var(--muted-foreground)]">System Design · Expert</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🚀 2. WHY CHOOSE US */}
        <section className="py-20 sm:py-28 relative z-10 bg-[var(--background)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-center md:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--accent)]/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>Why candidates choose us
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[var(--foreground)]">Tools that put your career on autopilot</h2>
            </div>
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PERKS.map((p) => (
                <div key={p.t} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-elevated">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--accent)] text-[var(--primary)]"><p.icon className="h-5 w-5" /></div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-[var(--foreground)]">{p.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 3. YOUR JOURNEY */}
        <section className="py-20 sm:py-28 bg-[var(--surface)]/60 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--accent)]/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse-ring"></span>Your journey
                </span>
                <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl text-[var(--foreground)]">
                  From profile to offer in <span className="text-gradient">weeks, not months</span>.
                </h2>
                <p className="mt-4 text-lg text-[var(--muted-foreground)] font-medium">
                  No more shouting into the void. Build proof, earn trust, and meet hiring teams who already know you can do the job.
                </p>
                <button onClick={() => router.push('/student/login')} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-primary text-[var(--primary-foreground)] shadow-glow hover:shadow-ring hover:-translate-y-0.5 transition-all duration-300 font-semibold h-12 rounded-lg px-8 text-base mt-8">
                  Get started — it's free <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <ol className="space-y-4">
                {[
                  { t: "Sign up & set goals", d: "Tell us what role and salary you're after." },
                  { t: "Take 2-3 short assessments", d: "Adaptive, untimed, and built for real work." },
                  { t: "Earn badges & verify identity", d: "Add a trust layer to your profile." },
                  { t: "Get matched & meet teams", d: "Companies reach out — you stay in control." },
                ].map((s, i) => (
                  <li key={s.t} className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-soft transition-all hover:shadow-md hover:border-[var(--primary)]/30">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary font-display font-bold text-[var(--primary-foreground)] shadow-sm">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-display text-base font-semibold text-[var(--foreground)]">{s.t}</div>
                      <div className="text-sm text-[var(--muted-foreground)] mt-1">{s.d}</div>
                    </div>
                  </li>
                ))}
              </ol>
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
                  <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-[var(--primary-foreground)]">Your skills deserve to be seen.</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <Link href="/how-it-works" className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 h-14 rounded-lg px-8 text-lg font-semibold transition-colors">
                    How it works
                  </Link>
                  <button onClick={() => router.push('/student/login')} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground)]/90 h-14 rounded-lg px-8 text-lg font-semibold transition-colors shadow-sm">
                    Build my profile <Briefcase className="h-4 w-4" />
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
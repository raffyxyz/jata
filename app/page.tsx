import Link from "next/link";
import {
  LayoutDashboard,
  Target,
  FileText,
  ArrowRight,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Accordion } from "@/components/ui/Accordion";

function HeroPreview() {
  return (
    <div className="rounded-2xl border border-border bg-bg-surface p-6 shadow-[var(--shadow-md)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#E5E5E2]" />
          <span className="size-2.5 rounded-full bg-[#E5E5E2]" />
          <span className="size-2.5 rounded-full bg-[#E5E5E2]" />
        </div>
        <div className="h-5 flex-1 rounded-full bg-bg-muted" />
      </div>

      <div className="rounded-xl border border-border bg-bg-base p-5 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-display font-semibold text-text-primary text-sm">
              Senior Engineer
            </p>
            <p className="text-xs text-text-secondary mt-0.5">Stripe</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xl font-semibold text-accent">87%</p>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wide">
              Match
            </p>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["TypeScript", "React", "APIs", "System Design"].map((kw) => (
            <span
              key={kw}
              className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-accent-subtle text-accent"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Applied", value: "24" },
          { label: "Interviews", value: "8" },
          { label: "Offers", value: "2" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-bg-muted p-3 text-center"
          >
            <p className="font-mono text-lg font-semibold text-text-primary">
              {stat.value}
            </p>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-bg-base">
      <header className="sticky top-0 z-50 bg-bg-base/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-accent flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="9" y1="15" x2="15" y2="15" />
                <polyline points="12,12 9,15 12,18" />
              </svg>
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">
              JATA
            </span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-md bg-accent text-white hover:brightness-[0.95] active:brightness-[0.90] transition-all duration-120"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-20 pb-20 md:pt-28 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
            <div>
              <h1 className="hero-animate font-display text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-text-primary leading-[1.1]">
                Your job search,{" "}
                <span className="text-accent">organized.</span>
              </h1>
              <p className="hero-animate-delay mt-5 text-lg md:text-xl text-text-secondary max-w-lg leading-relaxed">
                Track every application, score your resume against job
                descriptions with AI, and generate tailored documents.
              </p>
              <div className="hero-animate-delay-2 mt-8 flex items-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm font-medium rounded-lg bg-accent text-white hover:brightness-[0.95] active:brightness-[0.90] transition-all duration-120"
                >
                  Get Started
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center h-11 px-5 text-sm font-medium rounded-lg border border-border text-text-primary hover:bg-bg-muted transition-all duration-120"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <HeroPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="px-6">
        <div className="mx-auto max-w-6xl h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
      </div>

      {/* Features */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-3">
              Built for your job search
            </h2>
            <p className="text-text-secondary mb-12 max-w-lg">
              Three core features, no bloat.
            </p>
          </ScrollReveal>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Main feature - Track Applications */}
            <ScrollReveal>
              <div className="feature-track rounded-2xl border border-border bg-bg-surface p-7 md:p-9 h-full relative overflow-hidden group hover:shadow-[var(--shadow-md)] hover:border-border-strong transition-all duration-300">
                {/* Dot grid pattern */}
                <div className="absolute inset-0 feature-dots opacity-[0.35] pointer-events-none" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="size-11 rounded-xl bg-accent flex items-center justify-center">
                      <LayoutDashboard className="size-5 text-white" />
                    </div>
                    <span className="text-[11px] font-mono text-text-tertiary uppercase tracking-widest">
                      Core
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-xl mb-2.5">
                    Track Applications
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-md mb-8">
                    Every application in one place. Status, deadlines, notes,
                    documents. No more scattered spreadsheets.
                  </p>

                  {/* Mini preview */}
                  <div className="rounded-xl bg-bg-muted border border-border p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      <div className="h-2.5 flex-1 rounded-full bg-border" />
                      <span className="text-[10px] font-mono text-text-tertiary">
                        In Review
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      <div className="h-2.5 flex-1 rounded-full bg-border" />
                      <span className="text-[10px] font-mono text-text-tertiary">
                        Interview
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-warning" />
                      <div className="h-2.5 flex-1 rounded-full bg-border" />
                      <span className="text-[10px] font-mono text-text-tertiary">
                        Applied
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right column - two stacked cards */}
            <div className="grid gap-5">
              {/* AI ATS Scoring */}
              <ScrollReveal delay={80}>
                <div className="rounded-2xl p-7 md:p-8 relative overflow-hidden group hover:shadow-[var(--shadow-md)] transition-all duration-300 border border-accent/15 bg-gradient-to-br from-accent-subtle via-accent-subtle to-[#dbeafe]">
                  <div className="flex items-start justify-between mb-6">
                    <div className="size-11 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center">
                      <Target className="size-5 text-accent" />
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-3xl font-bold text-accent leading-none">
                        87%
                      </p>
                      <p className="text-[10px] text-text-tertiary uppercase tracking-widest mt-1">
                        Match
                      </p>
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    AI ATS Scoring
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Paste any job description. Get your match score, missing
                    keywords, and weak sections instantly.
                  </p>

                  {/* Subscore bars */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      { label: "Keywords", value: 92 },
                      { label: "Skills", value: 78 },
                      { label: "Experience", value: 85 },
                      { label: "Format", value: 95 },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-text-secondary">
                            {item.label}
                          </span>
                          <span className="text-[11px] font-mono text-text-tertiary">
                            {item.value}%
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-white/80">
                          <div
                            className="h-full rounded-full bg-accent/60"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Generate Documents */}
              <ScrollReveal delay={160}>
                <div className="rounded-2xl border border-border bg-bg-surface p-7 md:p-8 relative overflow-hidden group hover:shadow-[var(--shadow-md)] hover:border-border-strong transition-all duration-300">
                  {/* Subtle corner gradient */}
                  <div className="absolute -top-12 -right-12 size-32 rounded-full bg-accent/[0.04] pointer-events-none" />

                  <div className="relative flex items-start justify-between mb-6">
                    <div className="size-11 rounded-xl bg-bg-muted border border-border flex items-center justify-center">
                      <FileText className="size-5 text-accent" />
                    </div>
                    <Sparkles className="size-4 text-accent/40" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 relative">
                    Generate Documents
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed relative">
                    Tailored cover letters, cold emails, and LinkedIn DMs
                    optimized for each role.
                  </p>

                  {/* Doc type pills */}
                  <div className="mt-5 flex flex-wrap gap-1.5 relative">
                    {["Cover Letter", "Cold Email", "LinkedIn DM", "Proposal"].map(
                      (type) => (
                        <span
                          key={type}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-bg-muted text-text-secondary border border-border"
                        >
                          {type}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="px-6">
        <div className="mx-auto max-w-6xl h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
      </div>

      {/* How it works */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-14">
              How it works
            </h2>
          </ScrollReveal>

          <div className="space-y-0">
            {[
              {
                num: "01",
                title: "Paste & Parse",
                desc: "Drop any job description. AI extracts key requirements and skills.",
              },
              {
                num: "02",
                title: "Score & Improve",
                desc: "Get an ATS match score with keyword analysis and weak-section breakdown.",
              },
              {
                num: "03",
                title: "Generate & Apply",
                desc: "Create tailored documents and track your application through every stage.",
              },
            ].map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 100}>
                <div
                  className={`grid grid-cols-[auto_1fr] gap-5 md:gap-8 items-start py-8 ${
                    i > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <span className="font-mono text-5xl md:text-7xl font-bold text-accent/15 leading-none select-none">
                    {step.num}
                  </span>
                  <div className="pt-1 md:pt-3">
                    <h3 className="font-display font-semibold text-lg mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-md">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-4">
              Frequently asked questions
            </h2>
            <p className="text-text-secondary mb-10 max-w-lg">
              Everything you need to know about JATA.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <Accordion
              items={[
                {
                  question: "What is JATA?",
                  answer:
                    "JATA is an open-source job application tracker with AI-powered features. It helps you organize every application in one place, score your resume against job descriptions, and generate tailored documents like cover letters and cold emails.",
                },
                {
                  question: "Is JATA free?",
                  answer:
                    "JATA is free and open-source. You deploy it on your own infrastructure using Supabase for the database and Cloudflare Workers for hosting. There are no subscription fees or usage limits beyond what your cloud providers charge.",
                },
                {
                  question: "What AI features does JATA include?",
                  answer:
                    "JATA uses Cloudflare Workers AI to parse job descriptions, score your resume against those descriptions with detailed ATS analysis, and generate tailored documents including cover letters, cold emails, LinkedIn DMs, and freelance proposals.",
                },
                {
                  question: "What data does JATA collect?",
                  answer:
                    "JATA collects your account information (email, name), job application details (company, role, job description), uploaded resume files, and generated documents. Since JATA is self-hosted, all data stays in your own Supabase instance.",
                },
                {
                  question: "Is my resume data sent to third parties?",
                  answer:
                    "Your resume text is sent to Cloudflare Workers AI for ATS scoring and document generation. The data is processed by Cloudflare and is not shared with any other third parties. Since you control the deployment, your Supabase credentials and database remain under your ownership.",
                },
                {
                  question: "Can I delete my data?",
                  answer:
                    "Yes. You can delete individual applications, resumes, and generated documents from the dashboard. Since JATA is self-hosted, you also have full access to your Supabase database and can manage or purge data directly.",
                },
                {
                  question: "How does authentication work?",
                  answer:
                    "JATA supports email/password login and Google OAuth, both managed through Supabase Auth. Sessions are handled via HTTP-only cookies. No passwords are stored by the application itself.",
                },
              ]}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 md:pb-32">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl rounded-2xl bg-zinc-900 px-8 py-14 md:px-16 md:py-20 text-center relative overflow-hidden">
            {/* Subtle radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,126,247,0.12),transparent_70%)] pointer-events-none" />

            <div className="relative">
              <BarChart3 className="size-7 text-white/30 mx-auto mb-5" />
              <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-white mb-3">
                Ready to land your next role?
              </h2>
              <p className="text-white/50 max-w-md mx-auto mb-8">
                Take control of your job search with AI-powered insights.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-medium rounded-lg bg-white text-zinc-900 hover:bg-white/90 active:bg-white/80 transition-all duration-120"
              >
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-text-tertiary">
            <div className="size-6 rounded-md bg-accent flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="9" y1="15" x2="15" y2="15" />
                <polyline points="12,12 9,15 12,18" />
              </svg>
            </div>
            JATA
          </div>
          <div className="flex items-center gap-4 text-sm text-text-tertiary">
            <Link
              href="/privacy"
              className="hover:text-text-secondary transition-colors duration-150"
            >
              Privacy
            </Link>
            <span>&copy; {new Date().getFullYear()} JATA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

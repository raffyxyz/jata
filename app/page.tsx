import Link from "next/link";
import {
  LayoutDashboard,
  Target,
  FileText,
  ArrowRight,
  Sparkles,
  BarChart3,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-bg-base">
      <div className="bg-accent px-6 py-3 text-center">
        <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
          This web application is for personal use only. To try the app, deploy it yourself — follow the guide on the{" "}
          <a href="https://github.com/raffyxyz/jata" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:opacity-80 transition-opacity">
            GitHub repo
          </a>.
        </p>
      </div>
      <header className="sticky top-0 z-50 bg-bg-base/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-accent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      <section className="px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-surface px-4 py-1.5 text-sm text-text-secondary mb-8">
            <Sparkles className="size-3.5 text-accent" />
            AI-Powered Job Application Tracker
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-text-primary leading-[1.1]">
            Track. Optimize.{" "}
            <span className="text-accent">Land.</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Your job search, supercharged. JATA helps you organize applications,
            score your resume against job descriptions with AI, and generate
            tailored documents — all in one place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm font-medium rounded-lg bg-accent text-white hover:brightness-[0.95] active:brightness-[0.90] transition-all duration-120"
            >
              Get Started
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-12 px-6 text-sm font-medium rounded-lg border border-border text-text-primary hover:bg-bg-muted transition-all duration-120"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              Everything you need to land the role
            </h2>
            <p className="mt-3 text-text-secondary">
              Stop juggling spreadsheets. Start landing interviews.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-bg-surface border border-border p-6 md:p-8">
              <div className="size-10 rounded-lg bg-accent-subtle flex items-center justify-center mb-4">
                <LayoutDashboard className="size-5 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                Track Applications
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Organize every application in one place. Track status, deadlines,
                and notes. Never lose sight of where you stand.
              </p>
            </div>
            <div className="rounded-xl bg-bg-surface border border-border p-6 md:p-8">
              <div className="size-10 rounded-lg bg-accent-subtle flex items-center justify-center mb-4">
                <Target className="size-5 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                AI ATS Scoring
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Paste any job description and get instant ATS analysis. See your
                match score, missing keywords, and weak sections.
              </p>
            </div>
            <div className="rounded-xl bg-bg-surface border border-border p-6 md:p-8">
              <div className="size-10 rounded-lg bg-accent-subtle flex items-center justify-center mb-4">
                <FileText className="size-5 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                Generate Documents
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Create tailored cover letters, cold emails, and LinkedIn DMs
                with AI — optimized for each specific role.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              Three steps to a better application
            </h2>
            <p className="mt-3 text-text-secondary">
              From job description to optimized application in minutes.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Paste & Parse",
                desc: "Drop any job description. Our AI extracts key requirements, skills, and qualifications instantly.",
              },
              {
                step: "02",
                title: "Score & Improve",
                desc: "Get a detailed ATS score with keyword analysis. See exactly what is missing and fix it.",
              },
              {
                step: "03",
                title: "Generate & Apply",
                desc: "Create tailored documents and track your application through every stage.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="size-12 rounded-full bg-accent-subtle flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-semibold text-accent text-sm">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-2xl text-center rounded-2xl bg-accent p-10 md:p-14">
          <BarChart3 className="size-8 text-white/60 mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-white">
            Ready to land your next role?
          </h2>
          <p className="mt-3 text-white/70 max-w-md mx-auto">
            Join JATA and take control of your job search with AI-powered
            insights.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-medium rounded-lg bg-white text-accent hover:brightness-[0.95] active:brightness-[0.90] transition-all duration-120"
          >
            Get Started Free
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2 text-sm text-text-tertiary">
              <div className="size-6 rounded-md bg-accent flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                  <polyline points="12,12 9,15 12,18" />
                </svg>
              </div>
              JATA — Job Application Tracker & Assistant
            </div>
            <p className="text-sm text-text-tertiary">
              &copy; {new Date().getFullYear()} JATA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

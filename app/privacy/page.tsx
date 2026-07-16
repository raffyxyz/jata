import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - JATA",
  description: "Privacy policy for JATA - Job Application Tracker & Assistant.",
};

export default function PrivacyPage() {
  const lastUpdated = "July 16, 2026";

  return (
    <div className="min-h-dvh bg-bg-base">
      <header className="sticky top-0 z-50 bg-bg-base/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 h-16">
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
            href="/"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-text-tertiary mb-12">
            Last updated {lastUpdated}
          </p>

          <div className="space-y-10 text-[15px] text-text-secondary leading-relaxed">
            <section>
              <h2 className="font-display font-semibold text-text-primary text-lg mb-3">
                Overview
              </h2>
              <p className="max-w-2xl">
                JATA is an open-source job application tracker. Because JATA is
                self-hosted, the data you enter is stored in your own Supabase
                project and processed by your own Cloudflare Workers deployment.
                This policy describes what data the application handles, how it
                is processed, and your rights over that data.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-text-primary text-lg mb-3">
                Data We Collect
              </h2>
              <p className="max-w-2xl mb-4">
                JATA collects the following categories of information when you
                use the application:
              </p>
              <ul className="space-y-3 max-w-2xl">
                <li className="flex gap-3">
                  <span className="text-accent mt-1.5 shrink-0">
                    <span className="block size-1.5 rounded-full bg-accent" />
                  </span>
                  <span>
                    <strong className="text-text-primary">Account information.</strong>{" "}
                    Email address, display name, and profile image (when signing
                    in with Google). Managed by Supabase Auth.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent mt-1.5 shrink-0">
                    <span className="block size-1.5 rounded-full bg-accent" />
                  </span>
                  <span>
                    <strong className="text-text-primary">Application data.</strong>{" "}
                    Company name, job title, job description text, application
                    URL, and application status for each position you track.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent mt-1.5 shrink-0">
                    <span className="block size-1.5 rounded-full bg-accent" />
                  </span>
                  <span>
                    <strong className="text-text-primary">Resume files.</strong>{" "}
                    PDF resumes you upload for ATS scoring. The file is stored in
                    Supabase Storage and its text content is extracted for
                    processing.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent mt-1.5 shrink-0">
                    <span className="block size-1.5 rounded-full bg-accent" />
                  </span>
                  <span>
                    <strong className="text-text-primary">Generated content.</strong>{" "}
                    Cover letters, cold emails, LinkedIn messages, and other
                    documents created by JATA&apos;s AI features.
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-text-primary text-lg mb-3">
                How Your Data Is Used
              </h2>
              <div className="max-w-2xl space-y-4">
                <p>
                  Your data is used solely to power JATA&apos;s features. It is
                  not sold, traded, or used for advertising or profiling
                  purposes.
                </p>
                <p>
                  Specifically, the following data is sent to Cloudflare Workers
                  AI for processing:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Job description text is parsed to extract requirements,
                    skills, and qualifications.
                  </li>
                  <li>
                    Resume text and parsed job descriptions are compared to
                    produce ATS scores, keyword analysis, and improvement
                    suggestions.
                  </li>
                  <li>
                    Your name, job details, and resume summary are used to
                    generate tailored application documents.
                  </li>
                </ul>
                <p>
                  Cloudflare processes this data in accordance with their{" "}
                  <a
                    href="https://www.cloudflare.com/privacypolicy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    privacy policy
                  </a>
                  . JATA does not retain AI inference logs beyond what is stored
                  in your own database.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display font-semibold text-text-primary text-lg mb-3">
                Data Storage and Security
              </h2>
              <div className="max-w-2xl space-y-4">
                <p>
                  All application data, including your account details,
                  application records, resume files, and generated documents, is
                  stored in the Supabase project you configure during deployment.
                  Supabase provides encryption at rest and in transit.
                </p>
                <p>
                  Supabase Row-Level Security policies ensure that each user can
                  only access their own data. Application-level ownership checks
                  provide an additional layer of access control.
                </p>
                <p>
                  Because JATA is self-hosted, you are responsible for the
                  security of your Supabase project, Cloudflare account, and
                  deployment environment. We recommend enabling two-factor
                  authentication on both accounts and restricting API key access.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display font-semibold text-text-primary text-lg mb-3">
                Third-Party Services
              </h2>
              <p className="max-w-2xl mb-4">
                JATA integrates with the following third-party services:
              </p>
              <div className="max-w-2xl space-y-4">
                <div className="rounded-xl border border-border bg-bg-surface p-5">
                  <p className="font-medium text-text-primary mb-1">Supabase</p>
                  <p className="text-sm">
                    Authentication, database, and file storage. Data is stored in
                    your Supabase project. Supabase&apos;s privacy policy
                    applies to data stored on their platform.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-bg-surface p-5">
                  <p className="font-medium text-text-primary mb-1">
                    Cloudflare Workers AI
                  </p>
                  <p className="text-sm">
                    AI inference for resume scoring, job description parsing, and
                    document generation. Resume text and job descriptions are
                    sent to Cloudflare for processing. Data is not retained by
                    Cloudflare beyond the inference request.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-bg-surface p-5">
                  <p className="font-medium text-text-primary mb-1">
                    Google (optional)
                  </p>
                  <p className="text-sm">
                    Used for OAuth sign-in. When you choose to sign in with
                    Google, your email, name, and profile image are shared with
                    Supabase Auth to create your session.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display font-semibold text-text-primary text-lg mb-3">
                Data Retention
              </h2>
              <div className="max-w-2xl space-y-4">
                <p>
                  Your data is retained for as long as your JATA instance is
                  active. There is no automatic expiration or deletion of data.
                </p>
                <p>
                  You can delete individual applications, resumes, and generated
                  documents at any time from the application dashboard. Deleting
                  a resume removes both the file from Supabase Storage and its
                  associated record.
                </p>
                <p>
                  AI inference requests sent to Cloudflare are not stored
                  persistently by JATA. Cloudflare&apos;s own data retention
                  policies apply to processing logs on their infrastructure.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display font-semibold text-text-primary text-lg mb-3">
                Your Rights
              </h2>
              <div className="max-w-2xl space-y-4">
                <p>
                  Since JATA is self-hosted, you have direct control over your
                  data. You can:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Access all your data through the JATA dashboard or directly
                    via your Supabase project.
                  </li>
                  <li>
                    Export your application data and resume files at any time.
                  </li>
                  <li>
                    Delete any or all of your data from the dashboard or your
                    Supabase database.
                  </li>
                  <li>
                    Revoke OAuth tokens and sign-in methods through your
                    Supabase project settings.
                  </li>
                </ul>
                <p>
                  If you are subject to GDPR, CCPA, or other data protection
                  regulations, your rights under those frameworks are preserved.
                  Because you control the deployment, exercising these rights
                  does not require contacting JATA&apos;s developers.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display font-semibold text-text-primary text-lg mb-3">
                Children&apos;s Privacy
              </h2>
              <p className="max-w-2xl">
                JATA is not intended for use by individuals under the age of 16.
                We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-text-primary text-lg mb-3">
                Changes to This Policy
              </h2>
              <p className="max-w-2xl">
                We may update this privacy policy from time to time. Changes
                will be reflected on this page with an updated revision date.
                Continued use of JATA after changes constitutes acceptance of
                the revised policy.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-text-primary text-lg mb-3">
                Contact
              </h2>
              <p className="max-w-2xl">
                For questions about this privacy policy or JATA&apos;s data
                practices, open an issue on the{" "}
                <a
                  href="https://github.com/raffyxyz/jata"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  GitHub repository
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

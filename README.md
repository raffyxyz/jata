# <img src="app/icon.svg" width="28" height="28" alt="" style="vertical-align: -4px"> JATA — Job Application Tracker & Assistant

JATA is a full-stack web application that helps job seekers organize, analyze, and optimize their job applications. It combines a clean application tracker with AI-powered ATS scoring and document generation.

## Features

- **Dashboard** — Overview of total applications, average ATS score, in-progress count, weekly activity, and score distribution.
- **Applications** — Full CRUD with search, status filtering, sorting, and pagination. Each application stores the job description, URL, and linked resume.
- **ATS Scoring** — Paste a job description and get an AI-powered compatibility score with keyword/skills matching, weak section analysis, and improvement suggestions.
- **Resume Management** — Upload PDF resumes (up to 5MB), auto-extract text via `pdf-parse`, preview, and delete. Files stored in Supabase Storage.
- **Document Generation** — Generate tailored cover letters, cold emails, LinkedIn DMs, and freelance proposals using Cloudflare Workers AI, based on your resume and the target job description.
- **Optimization** — Side-by-side editor to rewrite your resume using ATS insights, with a real-time score recheck.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) 16 (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 + CSS custom properties |
| Fonts | Inter, Plus Jakarta Sans, JetBrains Mono via `next/font` |
| Auth | [Supabase](https://supabase.com) Auth (SSR with cookie-based sessions) |
| Database | [Supabase](https://supabase.com) PostgreSQL |
| Storage | [Supabase](https://supabase.com) Storage (resume PDFs) |
| LLM / AI | [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) |
| Data Fetching | [TanStack React Query](https://tanstack.com/query) |
| PDF Parsing | [pdf-parse](https://www.npmjs.com/package/pdf-parse) v2 |
| Icons | [Lucide](https://lucide.dev) |
| Package Manager | [pnpm](https://pnpm.io) |
| Deployment | [Vercel](https://vercel.com) |

## Architecture

The project follows a clean architecture approach with domain-driven design:

```
lib/
├── core/domain/          # Entities & repository ports (interfaces)
│   ├── entities/         # Resume, Application, AtsScore, etc.
│   └── ports/            # Repository interfaces
├── application/use-cases/  # Business logic (ResumeUseCases, etc.)
└── infrastructure/       # Adapters & implementations
    ├── api/              # Client-side API fetch functions
    ├── repositories/     # Supabase repository implementations
    ├── supabase/         # Supabase client factories (browser/server/middleware)
    └── ...
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Supabase project (with Auth, PostgreSQL, and Storage)
- Cloudflare account (for Workers AI)

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Cloudflare Workers AI
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
```

### Install & Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build
pnpm start
```

## Deployment

Deploy to Vercel with the environment variables above configured in your project settings. The `next.config.ts` marks `pdf-parse` as a server-external package to avoid bundling issues on serverless runtimes.

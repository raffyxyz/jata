"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScorePill } from "@/components/ui/ScorePill";
import { Card } from "@/components/ui/Card";

const mockApp = {
  id: "1",
  company: "Stripe",
  role: "Senior Frontend Engineer",
  score: 82,
  status: "interview" as const,
  dateAdded: new Date(Date.now() - 86400000 * 2),
  url: "https://stripe.com/jobs/123",
  description: "We're looking for a Senior Frontend Engineer to join our UI Platform team. You'll work on building and improving the developer experience for Stripe's web applications. This role involves collaborating with designers, backend engineers, and product managers to create intuitive, performant interfaces.",
};

export default function ApplicationDetailPage() {
  return (
    <div>
      {/* Back link */}
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 mb-6 transition-colors hover:text-accent"
        style={{ fontSize: 13, color: "var(--text-secondary)" }}
      >
        <ArrowLeft size={14} />
        Back to applications
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="font-display font-semibold"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.2, color: "var(--text-primary)" }}
          >
            {mockApp.company}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
            {mockApp.role}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<FileText size={14} />}>
            View Resume
          </Button>
          <Button size="sm" icon={<Sparkles size={14} />}>
            Optimize
          </Button>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>ATS Score</p>
          <ScorePill score={mockApp.score} />
        </Card>
        <Card>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Status</p>
          <Badge variant={mockApp.status}>{mockApp.status}</Badge>
        </Card>
        <Card>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Applied</p>
          <p style={{ fontSize: 13, color: "var(--text-primary)" }}>
            {mockApp.dateAdded.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </Card>
        <Card>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Job URL</p>
          <a href={mockApp.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium transition-colors" style={{ color: "var(--accent)" }}>
            Open <ExternalLink size={12} />
          </a>
        </Card>
      </div>

      {/* Job description */}
      <Card className="mb-8">
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
          Job Description
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          {mockApp.description}
        </p>
      </Card>
    </div>
  );
}

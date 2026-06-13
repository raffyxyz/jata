"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import type { ApplicationData } from "@/components/applications/ApplicationRow";
import { getScoreColor } from "@/lib/utils/score";

const now = Date.now();
const mockApplications: ApplicationData[] = [
  { id: "1", company: "Stripe", role: "Senior Frontend Engineer", score: 82, status: "interview", dateAdded: new Date(now - 86400000 * 2) },
  { id: "2", company: "Vercel", role: "Product Engineer", score: 65, status: "applied", dateAdded: new Date(now - 86400000 * 5) },
  { id: "3", company: "Linear", role: "Design Engineer", score: 91, status: "offer", dateAdded: new Date(now - 86400000 * 10) },
  { id: "4", company: "Railway", role: "Full Stack Developer", score: 45, status: "rejected", dateAdded: new Date(now - 86400000 * 14) },
];

const distribution = [
  { label: "Low", count: 1, total: 4 },
  { label: "Fair", count: 1, total: 4 },
  { label: "Good", count: 1, total: 4 },
  { label: "Strong", count: 1, total: 4 },
];

const distributionColors: Record<string, string> = {
  Low: "var(--danger)",
  Fair: "var(--warning)",
  Good: "var(--success)",
  Strong: "var(--accent)",
};

export default function DashboardPage() {
  const avgScore = Math.round(
    mockApplications.reduce((sum, a) => sum + a.score, 0) / mockApplications.length
  );
  const inProgress = mockApplications.filter(
    (a) => a.status === "applied" || a.status === "interview"
  ).length;
  const thisWeek = mockApplications.filter(
    (a) => a.dateAdded.getTime() > now - 86400000 * 7
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="font-display font-semibold"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.2, color: "var(--text-primary)" }}
        >
          Dashboard
        </h1>
        <Button icon={<Plus size={16} />}>
          New Application
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card hover>
          <p className="font-mono font-semibold" style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 28, color: "var(--text-primary)" }}>
            {mockApplications.length}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            Total applications
          </p>
        </Card>
        <Card hover>
          <p className="font-mono font-semibold" style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 28, color: getScoreColor(avgScore) }}>
            {avgScore}%
          </p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            Avg ATS Score
          </p>
        </Card>
        <Card hover>
          <p className="font-mono font-semibold" style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 28, color: "var(--text-primary)" }}>
            {inProgress}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            In progress
          </p>
        </Card>
        <Card hover>
          <p className="font-mono font-semibold" style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 28, color: "var(--text-primary)" }}>
            {thisWeek}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            This week
          </p>
        </Card>
      </div>

      {/* Recent Applications */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-display font-semibold"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}
          >
            Recent Applications
          </h2>
          <Link
            href="/applications"
            style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500 }}
          >
            View all &rarr;
          </Link>
        </div>
        <ApplicationTable applications={mockApplications} />
      </div>

      {/* ATS Score Distribution */}
      <div>
        <h2
          className="font-display font-semibold mb-4"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}
        >
          ATS Score Distribution
        </h2>
        <Card className="space-y-3">
          {distribution.map((d) => {
            const pct = (d.count / d.total) * 100;
            return (
              <div key={d.label} className="flex items-center gap-3">
                <span style={{ width: 56, fontSize: 12, color: "var(--text-secondary)", flexShrink: 0 }}>
                  {d.label}
                </span>
                <div
                  className="flex-1"
                  style={{
                    height: 8,
                    backgroundColor: "var(--bg-muted)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      backgroundColor: distributionColors[d.label],
                      borderRadius: 4,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <span
                  className="font-mono font-medium"
                  style={{ width: 24, textAlign: "right", fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}
                >
                  {d.count}
                </span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

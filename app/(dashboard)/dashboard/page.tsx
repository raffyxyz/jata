"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { getScoreColor, getScoreLevel } from "@/lib/utils/score";
import { useApplications } from "@/lib/presentation/hooks/useApplications";

const scoreLevels = ["Low", "Fair", "Good", "Strong"] as const;

const distributionColors: Record<string, string> = {
  Low: "var(--danger)",
  Fair: "var(--warning)",
  Good: "var(--success)",
  Strong: "var(--accent)",
};

export default function DashboardPage() {
  const { data: applications = [], isLoading } = useApplications();

  const now = Date.now();
  const total = applications.length;
  const avgScore = total > 0
    ? Math.round(applications.reduce((sum, a) => sum + a.score, 0) / total)
    : 0;
  const inProgress = applications.filter(
    (a) => a.status === "applied" || a.status === "interview",
  ).length;
  const thisWeek = applications.filter(
    (a) => a.dateAdded.getTime() > now - 86400000 * 7,
  ).length;

  const distribution = scoreLevels.map((label) => {
    const count = applications.filter(
      (a) => getScoreLevel(a.score) === label.toLowerCase(),
    ).length;
    return { label, count, total };
  });

  const recent = applications
    .sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="font-display font-semibold"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.2, color: "var(--text-primary)" }}
        >
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card hover>
          {isLoading ? (
            <div className="h-7 w-12 bg-bg-muted rounded animate-pulse" />
          ) : (
            <p className="font-mono font-semibold" style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 28, color: "var(--text-primary)" }}>
              {total}
            </p>
          )}
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            Total applications
          </p>
        </Card>
        <Card hover>
          {isLoading ? (
            <div className="h-7 w-16 bg-bg-muted rounded animate-pulse" />
          ) : (
            <p className="font-mono font-semibold" style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 28, color: getScoreColor(avgScore) }}>
              {avgScore}%
            </p>
          )}
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            Avg ATS Score
          </p>
        </Card>
        <Card hover>
          {isLoading ? (
            <div className="h-7 w-8 bg-bg-muted rounded animate-pulse" />
          ) : (
            <p className="font-mono font-semibold" style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 28, color: "var(--text-primary)" }}>
              {inProgress}
            </p>
          )}
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            In progress
          </p>
        </Card>
        <Card hover>
          {isLoading ? (
            <div className="h-7 w-8 bg-bg-muted rounded animate-pulse" />
          ) : (
            <p className="font-mono font-semibold" style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 28, color: "var(--text-primary)" }}>
              {thisWeek}
            </p>
          )}
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            This week
          </p>
        </Card>
      </div>

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
        {isLoading ? (
          <div className="bg-bg-surface rounded-lg" style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center px-1"
                style={{ height: 52, borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}
              >
                <div className="flex-1 space-y-2" style={{ flex: "0 0 35%" }}>
                  <div className="h-3 w-24 bg-bg-muted rounded animate-skeleton" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} />
                  <div className="h-2.5 w-36 bg-bg-muted rounded animate-skeleton" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} />
                </div>
                <div style={{ width: 100 }}><div className="h-5 w-16 bg-bg-muted rounded animate-skeleton" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} /></div>
                <div style={{ width: 120 }}><div className="h-5 w-20 bg-bg-muted rounded animate-skeleton" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} /></div>
                <div style={{ width: 100 }}><div className="h-3 w-14 bg-bg-muted rounded animate-skeleton" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} /></div>
              </div>
            ))}
          </div>
        ) : (
          <ApplicationTable applications={recent} />
        )}
      </div>

      <div>
        <h2
          className="font-display font-semibold mb-4"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}
        >
          ATS Score Distribution
        </h2>
        <Card className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 w-12 bg-bg-muted rounded animate-skeleton" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} />
                  <div className="flex-1 h-2 bg-bg-muted rounded animate-skeleton" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} />
                  <div className="h-3 w-6 bg-bg-muted rounded animate-skeleton" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} />
                </div>
              ))}
            </div>
          ) : (
            distribution.map((d) => {
              const pct = total > 0 ? (d.count / total) * 100 : 0;
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
            })
          )}
        </Card>
      </div>
    </div>
  );
}

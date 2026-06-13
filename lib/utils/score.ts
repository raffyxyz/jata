export type ScoreLevel = "low" | "fair" | "good" | "strong";

export function getScoreLevel(score: number): ScoreLevel {
  if (score < 50) return "low";
  if (score < 70) return "fair";
  if (score < 85) return "good";
  return "strong";
}

export function getScoreColor(score: number): string {
  const level = getScoreLevel(score);
  const map: Record<ScoreLevel, string> = {
    low: "var(--danger)",
    fair: "var(--warning)",
    good: "var(--success)",
    strong: "var(--accent)",
  };
  return map[level];
}

export function getScoreBgClass(score: number): string {
  const level = getScoreLevel(score);
  const map: Record<ScoreLevel, string> = {
    low: "bg-danger-subtle text-danger",
    fair: "bg-warning-subtle text-warning",
    good: "bg-success-subtle text-success",
    strong: "bg-accent-subtle text-accent",
  };
  return map[level];
}

export function getScoreLabel(score: number): string {
  const level = getScoreLevel(score);
  const map: Record<ScoreLevel, string> = {
    low: "Low match",
    fair: "Fair match",
    good: "Good match",
    strong: "Strong match",
  };
  return map[level];
}

export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

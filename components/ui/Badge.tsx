import { cn } from "@/lib/utils/cn";

type BadgeVariant = "applied" | "interview" | "offer" | "rejected" | "draft";
type ScoreLevel = "low" | "fair" | "good" | "strong";

interface BadgeProps {
  variant?: BadgeVariant;
  scoreLevel?: ScoreLevel;
  score?: number;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  applied: "bg-accent-subtle text-accent",
  interview: "bg-warning-subtle text-warning",
  offer: "bg-success-subtle text-success",
  rejected: "bg-danger-subtle text-danger",
  draft: "bg-bg-muted text-text-secondary",
};

const scoreStyles: Record<ScoreLevel, string> = {
  low: "bg-danger-subtle text-danger",
  fair: "bg-warning-subtle text-warning",
  good: "bg-success-subtle text-success",
  strong: "bg-accent-subtle text-accent",
};

function Badge({ variant, scoreLevel, score, children, className }: BadgeProps) {
  let style: string;
  if (scoreLevel) {
    style = scoreStyles[scoreLevel];
  } else if (score !== undefined) {
    const level: ScoreLevel = score < 50 ? "low" : score < 70 ? "fair" : score < 85 ? "good" : "strong";
    style = scoreStyles[level];
  } else {
    style = variant ? variantStyles[variant] : "bg-bg-muted text-text-secondary";
  }

  return (
    <span
      className={cn("inline-flex items-center font-medium leading-none", style, className)}
      style={{ fontSize: "12px", fontWeight: 500, padding: "4px 10px", borderRadius: "var(--radius-sm)", textTransform: "uppercase", letterSpacing: "0.02em" }}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant, ScoreLevel };

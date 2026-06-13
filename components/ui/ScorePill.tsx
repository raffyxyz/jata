import { getScoreLevel } from "@/lib/utils/score";

interface ScorePillProps {
  score: number;
  size?: "sm" | "md";
}

function ScorePill({ score, size = "md" }: ScorePillProps) {
  const level = getScoreLevel(score);
  const colorMap: Record<string, { bg: string; text: string }> = {
    low: { bg: "var(--danger-subtle)", text: "var(--danger)" },
    fair: { bg: "var(--warning-subtle)", text: "var(--warning)" },
    good: { bg: "var(--success-subtle)", text: "var(--success)" },
    strong: { bg: "var(--accent-subtle)", text: "var(--accent)" },
  };
  const c = colorMap[level];

  return (
    <span
      className="inline-flex items-center font-mono font-semibold leading-none rounded-sm"
      style={{
        fontSize: size === "sm" ? 11 : 13,
        fontWeight: 600,
        padding: size === "sm" ? "2px 6px" : "3px 8px",
        borderRadius: "var(--radius-sm)",
        backgroundColor: c.bg,
        color: c.text,
        fontFamily: "var(--font-mono)",
      }}
    >
      {score}%
    </span>
  );
}

export { ScorePill };
export type { ScorePillProps };

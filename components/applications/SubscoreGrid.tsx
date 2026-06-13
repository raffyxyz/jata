"use client";

import { getScoreColor } from "@/lib/utils/score";

interface Subscore {
  label: string;
  score: number;
}

interface SubscoreGridProps {
  subscores: Subscore[];
}

function SubscoreGrid({ subscores }: SubscoreGridProps) {
  return (
    <div
      className="grid gap-3 mb-6"
      style={{ gridTemplateColumns: "1fr 1fr" }}
    >
      {subscores.map((s) => {
        const color = getScoreColor(s.score);
        return (
          <div
            key={s.label}
            className="bg-bg-surface rounded-lg p-4 flex flex-col gap-2"
            style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-baseline justify-between">
              <span
                className="font-mono font-medium"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 18, color }}
              >
                {s.score}
              </span>
            </div>
            <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              {s.label}
            </span>
            {/* Thin progress bar */}
            <div
              style={{
                height: 3,
                backgroundColor: "var(--bg-muted)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${s.score}%`,
                  height: "100%",
                  backgroundColor: color,
                  borderRadius: 2,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { SubscoreGrid };
export type { SubscoreGridProps };

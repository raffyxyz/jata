"use client";

import { getScoreColor, getScoreLabel } from "@/lib/utils/score";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

function ScoreRing({ score, size = 120, strokeWidth = 6 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <div
      className="flex flex-col items-center gap-2 bg-bg-surface rounded-lg"
      style={{
        width: size + 24,
        height: size + 24,
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        padding: 12,
      }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--bg-muted)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="leading-none"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 36, color }}
          >
            {score}
          </span>
          <span
            className="leading-none mt-0.5"
            style={{ fontSize: 11, color: "var(--text-secondary)" }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

export { ScoreRing };
export type { ScoreRingProps };

"use client";

interface KeywordCloudProps {
  keywords: string[];
  matched: boolean;
}

function KeywordCloud({ keywords, matched }: KeywordCloudProps) {
  return (
    <div
      className="bg-bg-surface rounded-lg p-4"
      style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
    >
      <h4
        className="mb-3"
        style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}
      >
        {matched ? "Matched Keywords" : "Missing Keywords"}
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {keywords.map((kw) => (
          <span
            key={kw}
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: "3px 10px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: matched ? "var(--success-subtle)" : "var(--danger-subtle)",
              color: matched ? "var(--success)" : "var(--danger)",
            }}
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}

export { KeywordCloud };
export type { KeywordCloudProps };

"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface WeakSection {
  severity: "low" | "medium" | "high";
  section: string;
  description: string;
}

interface ATSResultCardProps {
  score: number;
  summary: string;
  weakSections?: WeakSection[];
}

const severityColor = {
  low: "var(--warning)",
  medium: "var(--warning)",
  high: "var(--danger)",
};

function ATSResultCard({ weakSections = [] }: ATSResultCardProps) {
  return (
    <div
      className="bg-bg-surface rounded-lg p-5"
      style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
    >
      <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>
        Weak Sections
      </h4>
      <div className="flex flex-col gap-1">
        {weakSections.map((ws, i) => (
          <WeakSectionItem key={i} ws={ws} />
        ))}
        {weakSections.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
            No weak sections identified.
          </p>
        )}
      </div>
    </div>
  );
}

function WeakSectionItem({ ws }: { ws: WeakSection }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="transition-all"
      style={{
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-bg-muted transition-colors"
        style={{ fontSize: 13 }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: severityColor[ws.severity],
            flexShrink: 0,
          }}
        />
        <span className="flex-1 font-medium text-text-primary">{ws.section}</span>
        {open ? <ChevronDown size={14} className="text-text-tertiary" /> : <ChevronRight size={14} className="text-text-tertiary" />}
      </button>
      {open && (
        <div style={{ padding: "0 12px 10px 12px" }}>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {ws.description}
          </p>
        </div>
      )}
    </div>
  );
}

export { ATSResultCard };
export type { ATSResultCardProps, WeakSection };

"use client";

import { useState } from "react";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ScorePill } from "@/components/ui/ScorePill";
import { formatRelativeDate } from "@/lib/utils/score";

export interface ApplicationData {
  id: string;
  company: string;
  role: string;
  score: number;
  status: "applied" | "interview" | "offer" | "rejected" | "draft";
  dateAdded: Date;
}

interface ApplicationRowProps {
  application: ApplicationData;
  isLast?: boolean;
}

function ApplicationRow({ application, isLast }: ApplicationRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="flex items-center transition-all duration-120 hover:bg-bg-muted relative"
      style={{
        height: 52,
        borderBottom: isLast ? "none" : "1px solid var(--border)",
        padding: "0 4px",
      }}
    >
      {/* Company + Role */}
      <div className="flex-1 min-w-0" style={{ flex: "0 0 35%" }}>
        <p
          className="truncate"
          style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}
        >
          {application.company}
        </p>
        <p
          className="truncate"
          style={{ fontSize: 12, color: "var(--text-secondary)" }}
        >
          {application.role}
        </p>
      </div>

      {/* ATS Score */}
      <div style={{ width: 100 }}>
        <ScorePill score={application.score} />
      </div>

      {/* Status */}
      <div style={{ width: 120 }}>
        <Badge variant={application.status}>{application.status}</Badge>
      </div>

      {/* Date */}
      <div style={{ width: 100 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {formatRelativeDate(application.dateAdded)}
        </span>
      </div>

      {/* Actions */}
      <div style={{ width: 80 }} className="flex justify-center">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center text-text-tertiary hover:text-text-secondary transition-colors"
            style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)" }}
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-full mt-1 z-20 bg-bg-surface shadow-[var(--shadow-md)] rounded-md py-1 min-w-[120px]"
                style={{ borderRadius: "var(--radius-md)" }}
              >
                {[
                  { icon: Eye, label: "View" },
                  { icon: Pencil, label: "Edit" },
                  { icon: Trash2, label: "Delete" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-text-primary hover:bg-bg-muted transition-colors"
                    style={{ fontSize: 13 }}
                  >
                    <item.icon size={14} className="text-text-secondary" />
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { ApplicationRow };
export type { ApplicationRowProps };

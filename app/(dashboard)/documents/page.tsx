"use client";

import { FileText, Trash2, Download } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils/score";
import { useGeneratedDocuments } from "@/lib/presentation/hooks/useGeneratedDocuments";

const docLabels: Record<string, string> = {
  cover_letter: "Cover Letter",
  cold_email: "Cold Email",
  linkedin_dm: "LinkedIn DM",
  freelance_proposal: "Freelance Proposal",
};

export default function DocumentsPage() {
  const { data: documents = [], isLoading } = useGeneratedDocuments();

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <h1
          className="font-display font-semibold"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.2, color: "var(--text-primary)" }}
        >
          Documents
        </h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-bg-surface rounded-lg px-5 py-4"
              style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
            >
              <div
                className="shrink-0"
                style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-muted)" }}
              />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-48 bg-bg-muted rounded" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} />
                <div className="h-2.5 w-32 bg-bg-muted rounded" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : documents.length > 0 ? (
        <div className="flex flex-col gap-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-4 bg-bg-surface rounded-lg px-5 py-4 transition-all hover:shadow-[var(--shadow-md)]"
              style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--accent-subtle)",
                }}
              >
                <FileText size={18} style={{ color: "var(--accent)" }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>
                  {docLabels[doc.type] ?? doc.type} &mdash; {doc.company}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 1 }}>
                  {doc.role} &middot; {formatRelativeDate(new Date(doc.createdAt))}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  className="flex items-center justify-center text-text-tertiary hover:text-text-secondary active:bg-bg-muted transition-all"
                  style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)" }}
                  title="Download"
                >
                  <Download size={14} />
                </button>
                <button
                  className="flex items-center justify-center text-text-tertiary hover:text-danger active:bg-danger-subtle transition-all"
                  style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)" }}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="12" y="12" width="56" height="56" rx="8" stroke="var(--border)" strokeWidth="2" fill="none" />
            <line x1="24" y1="24" x2="56" y2="24" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="32" x2="48" y2="32" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="40" x2="44" y2="40" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="56" cy="56" r="10" fill="var(--accent-subtle)" stroke="var(--accent)" strokeWidth="1.5" />
            <line x1="56" y1="52" x2="56" y2="60" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
            <line x1="52" y1="56" x2="60" y2="56" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3
            className="mt-4 font-display font-semibold"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}
          >
            No documents yet
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            Generate documents from your applications to get started
          </p>
        </div>
      )}
    </div>
  );
}

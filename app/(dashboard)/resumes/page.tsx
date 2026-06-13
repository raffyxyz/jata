"use client";

import { FileText, Plus, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";

const mockResumes = [
  { id: "1", name: "general-2024.pdf", date: "Dec 12, 2024", size: "245 KB", linked: 3 },
  { id: "2", name: "frontend-2025.pdf", date: "Mar 1, 2025", size: "210 KB", linked: 1 },
  { id: "3", name: "backend-2024.pdf", date: "Nov 5, 2024", size: "198 KB", linked: 0 },
];

export default function ResumesPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="font-display font-semibold"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.2, color: "var(--text-primary)" }}
        >
          Resumes
        </h1>
        <Button icon={<Plus size={16} />}>
          Upload Resume
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockResumes.map((r) => (
          <div
            key={r.id}
            className="bg-bg-surface rounded-lg p-5 relative group"
            style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
          >
            {/* Actions overlay */}
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="flex items-center justify-center text-text-tertiary hover:text-text-secondary hover:bg-bg-muted transition-all"
                style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)" }}
                title="Preview"
              >
                <Eye size={14} />
              </button>
              <button
                className="flex items-center justify-center text-text-tertiary hover:text-danger hover:bg-danger-subtle transition-all"
                style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)" }}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Icon */}
            <div
              className="flex items-center justify-center mb-4"
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--accent-subtle)",
              }}
            >
              <FileText size={20} style={{ color: "var(--accent)" }} />
            </div>

            {/* Name */}
            <p
              style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", cursor: "pointer" }}
              title="Click to rename"
            >
              {r.name}
            </p>

            {/* Meta */}
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                Uploaded {r.date} &middot; {r.size}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                {r.linked} application{r.linked !== 1 ? "s" : ""} linked
              </p>
            </div>
          </div>
        ))}

        {/* Upload new card */}
        <button
          className="flex flex-col items-center justify-center gap-3 bg-bg-surface rounded-lg p-5 border-2 border-dashed transition-all hover:bg-bg-muted"
          style={{
            borderRadius: "var(--radius-lg)",
            borderColor: "var(--border-strong)",
            minHeight: 160,
          }}
        >
          <Plus size={24} style={{ color: "var(--text-tertiary)" }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>
              Upload new resume
            </p>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>
              PDF or DOCX up to 5MB
            </p>
          </div>
        </button>
      </div>

      {/* Empty state */}
      {mockResumes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="14" y="10" width="52" height="60" rx="6" stroke="var(--border)" strokeWidth="2" fill="none" />
            <line x1="24" y1="24" x2="56" y2="24" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="32" x2="44" y2="32" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="40" x2="50" y2="40" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="58" cy="54" r="10" fill="var(--accent-subtle)" stroke="var(--accent)" strokeWidth="1.5" />
            <line x1="58" y1="50" x2="58" y2="58" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
            <line x1="54" y1="54" x2="62" y2="54" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3
            className="mt-4 font-display font-semibold"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}
          >
            No resumes yet
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, marginBottom: 16 }}>
            Upload your first resume to start tracking applications
          </p>
          <Button icon={<Plus size={16} />}>Upload Resume</Button>
        </div>
      )}
    </div>
  );
}

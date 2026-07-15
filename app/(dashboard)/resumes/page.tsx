"use client";

import { useRef } from "react";
import { FileText, Plus, Trash2, Eye, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useResumes, useUploadResume, useDeleteResume } from "@/lib/presentation/hooks/useResumes";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ResumesPage() {
  const { data: resumes = [], isLoading } = useResumes();
  const uploadMutation = useUploadResume();
  const deleteMutation = useDeleteResume();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast("error", "Only PDF files are accepted");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast("error", "File exceeds 5MB limit");
      return;
    }

    uploadMutation.mutate(file, {
      onSuccess: () => {
        toast("success", "Resume uploaded successfully");
      },
      onError: (err) => {
        toast("error", err.message);
      },
      onSettled: () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast("success", "Resume deleted");
      },
      onError: (err) => {
        toast("error", err.message);
      },
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <h1
          className="font-display font-semibold"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.2, color: "var(--text-primary)" }}
        >
          Resumes
        </h1>
        <Button
          icon={uploadMutation.isPending ? undefined : <Upload size={16} />}
          loading={uploadMutation.isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload Resume"}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-bg-surface rounded-lg p-5 animate-pulse"
              style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="w-10 h-10 bg-bg-muted rounded-md mb-4" />
              <div className="h-4 bg-bg-muted rounded w-3/4 mb-3" />
              <div className="h-3 bg-bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((r) => (
            <div
              key={r.id}
              className="bg-bg-surface rounded-lg p-5 relative group"
              style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
            >
              {/* Actions overlay */}
              <div className="absolute top-3 right-3 flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <a
                  href={r.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-text-tertiary hover:text-text-secondary hover:bg-bg-muted transition-all"
                  style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)" }}
                  title="Preview"
                >
                  <Eye size={14} />
                </a>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deleteMutation.isPending}
                  className="flex items-center justify-center text-text-tertiary hover:text-danger hover:bg-danger-subtle transition-all disabled:opacity-40"
                  style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)" }}
                  title="Delete"
                >
                  {deleteMutation.isPending ? (
                    <svg className="animate-spin size-3.5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <Trash2 size={14} />
                  )}
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
                style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}
              >
                {r.name ?? "Untitled"}
              </p>

              {/* Meta */}
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  Uploaded {formatDate(r.createdAt)}
                </p>
                {r.parsedText && (
                  <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                    {r.parsedText.length.toLocaleString()} characters extracted
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Upload new card */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="flex flex-col items-center justify-center gap-3 bg-bg-surface rounded-lg p-5 border-2 border-dashed transition-all hover:bg-bg-muted disabled:opacity-40"
            style={{
              borderRadius: "var(--radius-lg)",
              borderColor: "var(--border-strong)",
              minHeight: 160,
            }}
          >
            {uploadMutation.isPending ? (
              <svg className="animate-spin size-6" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-tertiary)" }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <Plus size={24} style={{ color: "var(--text-tertiary)" }} />
            )}
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>
                {uploadMutation.isPending ? "Uploading..." : "Upload new resume"}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>
                PDF up to 5MB
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && resumes.length === 0 && (
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
          <Button
            icon={<Upload size={16} />}
            loading={uploadMutation.isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Resume
          </Button>
        </div>
      )}
    </div>
  );
}

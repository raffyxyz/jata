"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Sparkles, FileText, Pencil, Mail, MessageCircle, Presentation, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScorePill } from "@/components/ui/ScorePill";
import { Card } from "@/components/ui/Card";
import { useApplication } from "@/lib/presentation/hooks/useApplications";

const docLabels: Record<string, { label: string; icon: React.ElementType }> = {
  cover_letter: { label: "Cover Letter", icon: FileText },
  cold_email: { label: "Cold Email", icon: Mail },
  linkedin_dm: { label: "LinkedIn DM", icon: MessageCircle },
  freelance_proposal: { label: "Freelance Proposal", icon: Presentation },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: application, isLoading, isError } = useApplication(id);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div>
        <div className="mb-6 h-4 w-32 bg-bg-muted rounded animate-skeleton" />
        <div className="space-y-4">
          <div className="h-8 w-48 bg-bg-muted rounded animate-skeleton" />
          <div className="h-4 w-64 bg-bg-muted rounded animate-skeleton" />
          <div className="grid grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-bg-muted rounded-lg animate-skeleton" />
            ))}
          </div>
          <div className="h-48 bg-bg-muted rounded-lg animate-skeleton" />
        </div>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 mb-6 transition-colors hover:text-accent"
          style={{ fontSize: 13, color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={14} />
          Back to applications
        </Link>
        <div className="flex flex-col items-center justify-center py-20">
          <h3
            className="font-display font-semibold"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}
          >
            Application not found
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            This application may have been deleted
          </p>
        </div>
      </div>
    );
  }

  const date = new Date(application.dateAdded);

  return (
    <div>
      {/* Back link */}
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 mb-6 transition-colors hover:text-accent"
        style={{ fontSize: 13, color: "var(--text-secondary)" }}
      >
        <ArrowLeft size={14} />
        Back to applications
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-8 flex-wrap">
        <div>
          <h1
            className="font-display font-semibold"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.2, color: "var(--text-primary)" }}
          >
            {application.company}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
            {application.role}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={<Pencil size={14} />}
            onClick={() => router.push(`/applications/${application.id}/edit`)}
          >
            Edit
          </Button>
          <Button size="sm" icon={<Sparkles size={14} />}>
            Optimize
          </Button>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8">
        <Card>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>ATS Score</p>
          <ScorePill score={application.score} />
        </Card>
        <Card>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Status</p>
          <Badge variant={application.status as never}>{application.status}</Badge>
        </Card>
        <Card>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Applied</p>
          <p style={{ fontSize: 13, color: "var(--text-primary)" }}>
            {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </Card>
        <Card>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Job URL</p>
          {application.jobUrl ? (
            <a href={application.jobUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium transition-colors" style={{ color: "var(--accent)" }}>
              Open <ExternalLink size={12} />
            </a>
          ) : (
            <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>N/A</span>
          )}
        </Card>
      </div>

      {/* Job description */}
      <Card className="mb-8">
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
          Job Description
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          {application.jobDescription}
        </p>
      </Card>

      {/* Generated Documents */}
      {application.documents.length > 0 && (
        <div className="mb-8">
          <h2
            className="font-display font-semibold mb-4"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, lineHeight: 1.2, color: "var(--text-primary)" }}
          >
            Generated Documents
          </h2>
          <div className="space-y-3">
            {application.documents.map((doc) => {
              const meta = docLabels[doc.type] ?? { label: doc.type, icon: FileText };
              const Icon = meta.icon;
              const isExpanded = expandedDoc === doc.id;

              return (
                <Card key={doc.id} className="overflow-hidden">
                  <button
                    onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                    className="flex items-center justify-between w-full p-4 transition-colors hover:bg-bg-muted"
                    style={{ textAlign: "left" }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} style={{ color: "var(--accent)" }} />
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>
                          {meta.label}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                          {formatDate(doc.createdAt)}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={16} style={{ color: "var(--text-tertiary)" }} />
                    ) : (
                      <ChevronDown size={16} style={{ color: "var(--text-tertiary)" }} />
                    )}
                  </button>
                  {isExpanded && (
                    <div
                      className="p-4 pt-0 animate-fade-in"
                      style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}
                    >
                      {doc.content}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Generate documents link */}
      {application.documents.length === 0 && (
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                  No generated documents yet
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Generate a cover letter, cold email, or other document for this application
                </p>
              </div>
              <Link href={`/applications/${application.id}/generate`}>
                <Button size="sm" icon={<Sparkles size={14} />}>
                  Generate
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

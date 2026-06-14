"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowLeft,
  Upload,
  Sparkles,
  FileText,
  Mail,
  MessageCircle,
  Presentation,
  Save,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { SubscoreGrid } from "@/components/applications/SubscoreGrid";
import { KeywordCloud } from "@/components/applications/KeywordCloud";
import { ATSResultCard } from "@/components/applications/ATSResultCard";
import { DocumentOutput } from "@/components/documents/DocumentOutput";
import type { WeakSection } from "@/components/applications/ATSResultCard";
import { toast } from "@/components/ui/Toast";
import type { AtsScoreResult } from "@/lib/core/domain/entities/ats-score";
import type { DocType } from "@/lib/llm/generateDocument";
import {
  fetchResumes,
  parseJob,
  getAtsScore,
  generateDocument,
  saveGeneratedDocument,
  saveApplication,
} from "@/lib/infrastructure/api";
import type { ResumeItem, ParsedJobData } from "@/lib/infrastructure/api";

const docTypes: { value: DocType; label: string; icon: React.ElementType }[] = [
  { value: "cover_letter", label: "Cover Letter", icon: FileText },
  { value: "cold_email", label: "Cold Email", icon: Mail },
  { value: "linkedin_dm", label: "LinkedIn DM", icon: MessageCircle },
  {
    value: "freelance_proposal",
    label: "Freelance Proposal",
    icon: Presentation,
  },
];

const tones = ["Formal", "Balanced", "Conversational"];

const PASSING_SCORE = 60;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewApplicationPage() {
  const [step, setStep] = useState(0);

  const [company, setCompany] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [resumesLoading, setResumesLoading] = useState(true);

  const [analyzing, setAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsScoreResult | null>(null);
  const [parsedJob, setParsedJob] = useState<ParsedJobData | null>(null);

  const [docType, setDocType] = useState<DocType>("cover_letter");
  const [tone, setTone] = useState("balanced");
  const [generating, setGenerating] = useState(false);
  const [docContent, setDocContent] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadResumes = useCallback(async () => {
    try {
      const data = await fetchResumes();
      setResumes(data);
    } catch {
      toast("error", "Failed to load resumes");
    } finally {
      setResumesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleUploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload failed");
      }

      toast("success", "Resume uploaded successfully");
      await loadResumes();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRunAts = async () => {
    setAnalyzing(true);
    setAtsResult(null);
    setParsedJob(null);

    try {
      const result = await parseJob(jobDesc);
      setParsedJob(result.parsed);

      const resume = resumes.find((r) => r.id === selectedResume);
      if (!resume?.parsedText) {
        toast("error", "Selected resume has no extracted text.");
        setAnalyzing(false);
        return;
      }

      setStep(1);

      const parsed = await getAtsScore(result.raw, resume.parsedText);
      setAtsResult(parsed);
    } catch {
      toast("error", "Failed to analyze resume. Please try again.");
      setStep(0);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateDocument = async () => {
    const resume = resumes.find((r) => r.id === selectedResume);
    if (!resume?.parsedText || !parsedJob || !atsResult) return;

    setGenerating(true);
    setStreaming(true);
    setDocContent("");

    try {
      const text = await generateDocument({
        docType,
        name: resume.name ?? "Applicant",
        jobTitle: parsedJob.job_title,
        company: company ?? "the company",
        keyResponsibilities: parsedJob.key_responsibilities,
        matchedKeywords: atsResult.matched_keywords,
        resumeSummary: resume.parsedText.slice(0, 1500),
        userTone: tone,
      });

      let displayed = "";
      let i = 0;
      intervalRef.current = setInterval(() => {
        if (i < text.length) {
          displayed += text[i];
          setDocContent(displayed);
          i++;
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setGenerating(false);
          setStreaming(false);
        }
      }, 12);
    } catch {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      toast("error", "Failed to generate document.");
      setGenerating(false);
      setStreaming(false);
    }
  };

  const handleSaveApplication = async () => {
    if (!parsedJob || !atsResult || !selectedResume) return;
    setShowReview(true);
  };

  const handleConfirmSave = async () => {
    if (!parsedJob || !atsResult || !selectedResume) return;

    setSaving(true);
    try {
      const application = await saveApplication({
        company,
        jobTitle: parsedJob.job_title,
        jobUrl: jobUrl || null,
        jobDescription: jobDesc,
        resumeId: selectedResume,
        atsResult,
        parsedJd: parsedJob,
      });

      if (docContent) {
        await saveGeneratedDocument({
          applicationId: application.id,
          type: docType,
          content: docContent,
        });
      }

      toast("success", "Application saved!");
      window.location.href = "/applications";
    } catch {
      toast("error", "Failed to save application.");
    } finally {
      setSaving(false);
      setShowReview(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerateDocument();
  };

  const score = atsResult?.overall_score ?? 0;
  const hasPassed = score >= PASSING_SCORE;

  const subscores = atsResult
    ? [
        { label: "Keyword Match", score: atsResult.subscores.keyword_match },
        {
          label: "Skills Alignment",
          score: atsResult.subscores.skills_alignment,
        },
        {
          label: "Experience",
          score: atsResult.subscores.experience_relevance,
        },
        {
          label: "Formatting",
          score: atsResult.subscores.formatting_ats_safety,
        },
      ]
    : [];

  const weakSections: WeakSection[] = atsResult
    ? atsResult.weak_sections.map((ws) => ({
        severity: ws.severity,
        section: ws.section,
        description: ws.issue,
      }))
    : [];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 mb-6 transition-colors"
        style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500 }}
      >
        <ArrowLeft size={14} />
        Back to Applications
      </Link>

      <h1
        className="font-display font-semibold mb-6"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 24,
          lineHeight: 1.2,
          color: "var(--text-primary)",
        }}
      >
        New Application
      </h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        {["Analysis", "Results", "Generate"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor:
                  i === step
                    ? "var(--accent)"
                    : i < step
                      ? "var(--success-subtle)"
                      : "var(--bg-muted)",
                color:
                  i === step
                    ? "white"
                    : i < step
                      ? "var(--success)"
                      : "var(--text-tertiary)",
              }}
            >
              <span
                className="flex items-center justify-center rounded-full text-xs font-bold"
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor:
                    i === step
                      ? "rgba(255,255,255,0.2)"
                      : i < step
                        ? "var(--success)"
                        : "var(--bg-surface)",
                  color:
                    i === step
                      ? "white"
                      : i < step
                        ? "white"
                        : "var(--text-tertiary)",
                }}
              >
                {i < step ? "✓" : i + 1}
              </span>
              {label}
            </div>
            {i < 2 && (
              <div
                style={{
                  width: 24,
                  height: 1,
                  backgroundColor: "var(--border)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Input + ATS Check */}
      {step === 0 && (
        <div className="flex flex-col gap-5">
          {/* Resume Selection */}
          <div>
            <label
              className="block mb-3"
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-secondary)",
              }}
            >
              Select resume
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resumesLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse p-4"
                      style={{
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--bg-surface)",
                        minHeight: 100,
                      }}
                    >
                      <div className="w-5 h-5 bg-bg-muted rounded mb-3" />
                      <div className="h-4 bg-bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-bg-muted rounded w-1/2" />
                    </div>
                  ))
                : resumes.map((r) => {
                    const isSelected = selectedResume === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedResume(r.id)}
                        className="flex items-start gap-3 p-4 text-left transition-all"
                        style={{
                          borderRadius: "var(--radius-lg)",
                          border: isSelected
                            ? "2px solid var(--accent)"
                            : "1px solid var(--border)",
                          backgroundColor: isSelected
                            ? "var(--accent-subtle)"
                            : "var(--bg-surface)",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--text-secondary)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0 mt-0.5"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                          <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        <div className="min-w-0">
                          <p
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "var(--text-primary)",
                            }}
                          >
                            {r.name ?? "Untitled"}
                          </p>
                          <p
                            style={{
                              fontSize: 12,
                              color: "var(--text-secondary)",
                              marginTop: 2,
                            }}
                          >
                            Uploaded {formatDate(r.createdAt)}
                          </p>
                          {r.parsedText && (
                            <p
                              style={{
                                fontSize: 11,
                                color: "var(--text-tertiary)",
                                marginTop: 1,
                              }}
                            >
                              {r.parsedText.length.toLocaleString()} chars
                              extracted
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleUploadResume}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex flex-col items-center justify-center gap-2 p-4 transition-all"
                style={{
                  borderRadius: "var(--radius-lg)",
                  border: "2px dashed var(--border-strong)",
                  backgroundColor: "var(--bg-muted)",
                  minHeight: 100,
                }}
              >
                <Upload size={20} style={{ color: "var(--text-tertiary)" }} />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                  }}
                >
                  Upload new resume
                </span>
                <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                  PDF up to 5MB
                </span>
              </button>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label
              className="block mb-1.5"
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-secondary)",
              }}
            >
              Company name
            </label>
            <input
              type="text"
              placeholder="e.g. Stripe"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{
                width: "100%",
                height: 40,
                padding: "0 12px",
                backgroundColor: "var(--bg-muted)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontSize: 13,
                color: "var(--text-primary)",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--accent)";
                e.target.style.boxShadow = "0 0 0 3px rgba(79,126,247,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Job Description */}
          <div>
            <label
              className="block mb-1.5"
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-secondary)",
              }}
            >
              Job description
            </label>
            <div className="relative">
              <textarea
                placeholder="Paste the job description here..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: 200,
                  padding: 12,
                  backgroundColor: "var(--bg-muted)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-primary)",
                  resize: "vertical",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(79,126,247,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 10,
                  fontSize: 11,
                  color: "var(--text-tertiary)",
                }}
              >
                {jobDesc.length} chars
              </span>
            </div>
          </div>

          {/* Job URL */}
          <div>
            <label
              className="block mb-1.5"
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-secondary)",
              }}
            >
              Job URL{" "}
              <span style={{ color: "var(--text-tertiary)" }}>(optional)</span>
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              style={{
                width: "100%",
                height: 40,
                padding: "0 12px",
                backgroundColor: "var(--bg-muted)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontSize: 13,
                color: "var(--text-primary)",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--accent)";
                e.target.style.boxShadow = "0 0 0 3px rgba(79,126,247,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Run ATS Check */}
          <Button
            icon={<Sparkles size={16} />}
            size="lg"
            className="w-full"
            onClick={handleRunAts}
            disabled={!jobDesc || !selectedResume}
            loading={analyzing}
          >
            {analyzing ? "Analyzing resume..." : "Run ATS Check"}
          </Button>
        </div>
      )}

      {/* Step 2: ATS Results */}
      {step === 1 && atsResult && (
        <div className="flex flex-col items-center space-y-5">
          <ScoreRing score={score} />

          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              textAlign: "center",
              marginTop: -8,
            }}
          >
            {atsResult.summary}
          </p>

          <SubscoreGrid subscores={subscores} />

          <div className="grid grid-cols-2 gap-4 w-full">
            <KeywordCloud keywords={atsResult.matched_keywords} matched />
            <KeywordCloud
              keywords={atsResult.missing_keywords}
              matched={false}
            />
          </div>

          {score < 80 && weakSections.length > 0 && (
            <ATSResultCard
              score={score}
              summary=""
              weakSections={weakSections}
            />
          )}

          {/* Score gate */}
          <div
            className="flex flex-col gap-3 w-full pt-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {hasPassed ? (
              <>
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-lg"
                  style={{ backgroundColor: "var(--success-subtle)" }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--success)",
                      lineHeight: 1.5,
                    }}
                  >
                    Your resume scored {score}% — you can proceed to generate
                    tailored documents.
                  </p>
                </div>
                <Button className="w-full" size="lg" onClick={() => setStep(2)}>
                  Continue to Document Generation
                </Button>
              </>
            ) : (
              <>
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-lg"
                  style={{ backgroundColor: "var(--danger-subtle)" }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--danger)",
                      lineHeight: 1.5,
                    }}
                  >
                    Your resume scored {score}%. A score of at least{" "}
                    {PASSING_SCORE}% is needed to generate tailored documents.
                    Try improving your resume first.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setStep(0);
                      setAtsResult(null);
                    }}
                  >
                    Try Again
                  </Button>
                  <Button className="flex-1" size="lg" disabled>
                    Score Too Low
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {step === 1 && analyzing && (
        <div className="flex flex-col items-center py-16">
          <svg
            className="animate-spin"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="var(--accent)"
              strokeWidth="3"
              opacity="0.25"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <h3
            className="mt-5 font-display font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 16,
              color: "var(--text-primary)",
            }}
          >
            Analyzing your resume...
          </h3>
        </div>
      )}

      {/* Step 3: Document Generation */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <h3
            className="font-display font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 16,
              color: "var(--text-primary)",
            }}
          >
            Generate Documents
          </h3>

          <div className="flex gap-1 flex-wrap">
            {docTypes.map((dt) => {
              const active = docType === dt.value;
              const Icon = dt.icon;
              return (
                <button
                  key={dt.value}
                  onClick={() => setDocType(dt.value)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all"
                  style={{
                    borderRadius: "var(--radius-md)",
                    backgroundColor: active
                      ? "var(--accent-subtle)"
                      : "transparent",
                    color: active ? "var(--accent)" : "var(--text-secondary)",
                    borderBottom: active
                      ? "2px solid var(--accent)"
                      : "2px solid transparent",
                  }}
                >
                  <Icon size={14} />
                  {dt.label}
                </button>
              );
            })}
          </div>

          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: 4,
              }}
            >
              Tone
            </label>
            <div className="flex gap-1">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t.toLowerCase())}
                  className="px-3 py-1.5 text-sm font-medium transition-all"
                  style={{
                    borderRadius: "var(--radius-sm)",
                    backgroundColor:
                      tone === t.toLowerCase()
                        ? "var(--accent)"
                        : "var(--bg-muted)",
                    color:
                      tone === t.toLowerCase()
                        ? "white"
                        : "var(--text-secondary)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            icon={<Sparkles size={16} />}
            onClick={handleGenerateDocument}
            loading={generating}
          >
            {generating
              ? "Generating..."
              : `Generate ${docType === "cover_letter" ? "Cover Letter" : docType === "cold_email" ? "Cold Email" : docType === "linkedin_dm" ? "LinkedIn DM" : "Proposal"}`}
          </Button>

          {(docContent || generating) && (
            <>
              <DocumentOutput
                content={docContent}
                streaming={streaming}
                onCopy={() => {
                  navigator.clipboard.writeText(docContent);
                  toast("success", "Copied to clipboard");
                }}
                onRegenerate={handleRegenerate}
                onSave={() => toast("success", "Document saved")}
              />

              <Button
                className="w-full"
                size="lg"
                icon={<Save size={16} />}
                onClick={handleSaveApplication}
                loading={saving}
              >
                {saving ? "Saving..." : "Save Application"}
              </Button>
            </>
          )}
        </div>
      )}
      {/* Review Modal */}
      {showReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowReview(false)}
        >
          <div
            className="bg-bg-surface rounded-xl shadow-lg w-full animate-fade-in"
            style={{ maxWidth: 480, margin: 24, padding: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="font-display font-semibold mb-5"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--text-primary)" }}
            >
              Review Application
            </h3>

            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label style={{ fontSize: 11, fontWeight: 500, color: "var(--text-tertiary)", display: "block", marginBottom: 4 }}>Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  style={{
                    width: "100%",
                    height: 38,
                    padding: "0 10px",
                    backgroundColor: "var(--bg-muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 13,
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 500, color: "var(--text-tertiary)", display: "block", marginBottom: 4 }}>Job Title</label>
                <input
                  type="text"
                  value={parsedJob?.job_title ?? ""}
                  onChange={(e) => {
                    if (!parsedJob) return;
                    setParsedJob({ ...parsedJob, job_title: e.target.value });
                  }}
                  style={{
                    width: "100%",
                    height: 38,
                    padding: "0 10px",
                    backgroundColor: "var(--bg-muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 13,
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-tertiary)", marginBottom: 4 }}>ATS Score</p>
                <span className="font-mono font-semibold" style={{ fontSize: 24, color: score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--danger)" }}>
                  {score}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3" style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <Button
                className="flex-1"
                variant="outline"
                size="lg"
                onClick={() => setShowReview(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                size="lg"
                icon={<Save size={16} />}
                onClick={handleConfirmSave}
                loading={saving}
              >
                {saving ? "Saving..." : "Confirm & Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

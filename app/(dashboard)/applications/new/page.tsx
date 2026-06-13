"use client";

import { useState } from "react";
import { Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StepIndicator } from "@/components/applications/StepIndicator";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { SubscoreGrid } from "@/components/applications/SubscoreGrid";
import { KeywordCloud } from "@/components/applications/KeywordCloud";
import { ATSResultCard } from "@/components/applications/ATSResultCard";
import type { WeakSection } from "@/components/applications/ATSResultCard";

const steps = ["Job Details", "Resume", "Review"];

export default function NewApplicationPage() {
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Mock ATS results
  const mockScore = 74;
  const mockSubscores = [
    { label: "Keyword Match", score: 68 },
    { label: "Skills Alignment", score: 82 },
    { label: "Experience", score: 70 },
    { label: "Formatting", score: 92 },
  ];
  const mockMatched = ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "CI/CD"];
  const mockMissing = ["Figma", "Python", "Docker", "Kubernetes"];
  const mockWeakSections: WeakSection[] = [
    { severity: "high", section: "Work Experience", description: "Missing quantified achievements. Add metrics like 'improved performance by 30%'." },
    { severity: "medium", section: "Skills Section", description: "Key skills like Docker and Kubernetes are not listed. Consider adding a dedicated technical skills section." },
    { severity: "low", section: "Summary", description: "Your professional summary is generic. Tailor it to the specific role you're applying for." },
  ];

  const mockResumes = [
    { id: "r1", name: "general-2024.pdf", date: "Dec 12, 2024", linked: 3 },
    { id: "r2", name: "frontend-2025.pdf", date: "Mar 1, 2025", linked: 1 },
  ];

  const handleContinue = () => {
    if (step === 0) setStep(1);
    else if (step === 1) {
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setStep(2);
      }, 2500);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1
        className="font-display font-semibold mb-6"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.2, color: "var(--text-primary)" }}
      >
        New Application
      </h1>

      <StepIndicator steps={steps} currentStep={step} />

      {/* Step 1: Job Details */}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          <Input
            label="Company name"
            placeholder="e.g. Stripe"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Input
            label="Job title"
            placeholder="e.g. Senior Frontend Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <div>
            <Input
              label="Job URL (optional)"
              placeholder="https://..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
            />
            {jobUrl && (
              <button
                className="mt-1 text-xs font-medium transition-colors"
                style={{ color: "var(--accent)" }}
                onClick={() => {}}
              >
                Auto-fill description
              </button>
            )}
          </div>
          <div>
            <label
              className="block mb-1.5"
              style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}
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
                  minHeight: 240,
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
          <div className="flex justify-end mt-2">
            <Button onClick={handleContinue} disabled={!company || !jobTitle}>
              Continue &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Resume */}
      {step === 1 && (
        <div>
          <h3
            className="font-display font-semibold mb-4"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}
          >
            Select a resume
          </h3>

          {/* Resume cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {mockResumes.map((r) => {
              const isSelected = selectedResume === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedResume(r.id)}
                  className="flex items-start gap-3 p-4 text-left transition-all"
                  style={{
                    borderRadius: "var(--radius-lg)",
                    border: isSelected ? "2px solid var(--accent)" : "1px solid var(--border)",
                    backgroundColor: isSelected ? "var(--accent-subtle)" : "var(--bg-surface)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                  <div className="min-w-0">
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{r.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>Uploaded {r.date}</p>
                    <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>{r.linked} application{r.linked > 1 ? "s" : ""}</p>
                  </div>
                </button>
              );
            })}

            {/* Upload new */}
            <button
              className="flex flex-col items-center justify-center gap-2 p-4 transition-all"
              style={{
                borderRadius: "var(--radius-lg)",
                border: "2px dashed var(--border-strong)",
                backgroundColor: "var(--bg-muted)",
                minHeight: 100,
              }}
            >
              <Upload size={20} style={{ color: "var(--text-tertiary)" }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>Upload new resume</span>
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>PDF or DOCX up to 5MB</span>
            </button>
          </div>

          <Button
            className="w-full"
            size="lg"
            icon={<Sparkles size={16} />}
            onClick={handleContinue}
            disabled={!selectedResume}
            loading={analyzing}
          >
            {analyzing ? "Running ATS Check..." : "Run ATS Check"}
          </Button>
        </div>
      )}

      {/* Step 3: ATS Results */}
      {step === 2 && (
        <div>
          {/* Loading state */}
          {analyzing && (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="animate-spin" width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="3" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <h3
                className="mt-5 font-display font-semibold"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}
              >
                Analyzing your resume...
              </h3>
              <div className="flex flex-col gap-2 mt-6" style={{ width: 280 }}>
                <div className="animate-skeleton h-3 rounded" style={{ width: "80%" }} />
                <div className="animate-skeleton h-3 rounded" style={{ width: "60%" }} />
                <div className="animate-skeleton h-3 rounded" style={{ width: "70%" }} />
              </div>
            </div>
          )}

          {/* Results */}
          {!analyzing && (
            <div className="space-y-6">
              {/* Score hero */}
              <div className="flex justify-center mb-6">
                <ScoreRing score={mockScore} />
              </div>

              {/* Summary line */}
              <p style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "center", marginTop: -12, marginBottom: 16 }}>
                Your resume is a good match. Consider improving keyword coverage and experience metrics.
              </p>

              {/* Subscores */}
              <SubscoreGrid subscores={mockSubscores} />

              {/* Keywords */}
              <div className="grid grid-cols-2 gap-4">
                <KeywordCloud keywords={mockMatched} matched />
                <KeywordCloud keywords={mockMissing} matched={false} />
              </div>

              {/* Weak sections (score < 80) */}
              {mockScore < 80 && (
                <ATSResultCard
                  score={mockScore}
                  summary=""
                  weakSections={mockWeakSections}
                />
              )}

              {/* CTA */}
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                {mockScore < 60 ? (
                  <>
                    <Button className="flex-1" size="lg">Improve Your Resume</Button>
                    <Button variant="ghost" size="lg">Save &amp; come back later</Button>
                  </>
                ) : mockScore < 80 ? (
                  <>
                    <Button className="flex-1" size="lg">Improve Resume</Button>
                    <Button className="flex-1" variant="outline" size="lg">Generate Documents</Button>
                  </>
                ) : (
                  <>
                    <Button className="flex-1" size="lg">Generate Documents</Button>
                    <Button className="flex-1" variant="outline" size="lg">Save Application</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

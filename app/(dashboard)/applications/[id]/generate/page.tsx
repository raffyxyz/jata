"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DocumentTypePicker, type DocType as PickerDocType } from "@/components/documents/DocumentTypePicker";
import { DocumentOutput } from "@/components/documents/DocumentOutput";
import { toast } from "@/components/ui/Toast";

const docTypeMap: Record<PickerDocType, string> = {
  "cover-letter": "cover_letter",
  "cold-email": "cold_email",
  "linkedin-dm": "linkedin_dm",
  proposal: "freelance_proposal",
};

export default function GeneratePage() {
  const params = useParams();
  const [docType, setDocType] = useState<PickerDocType>("cover-letter");
  const [tone, setTone] = useState("balanced");
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState("");
  const [streaming, setStreaming] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setStreaming(true);
    setContent("");

    try {
      const res = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: docTypeMap[docType],
          name: "Applicant",
          jobTitle: "Senior Frontend Engineer",
          company: "the company",
          keyResponsibilities: [
            "Build and maintain UI components",
            "Collaborate with design team",
            "Optimize application performance",
          ],
          matchedKeywords: [
            "React",
            "TypeScript",
            "Next.js",
            "Tailwind CSS",
            "REST APIs",
          ],
          resumeSummary: "",
          userTone: tone,
        }),
      });

      const data = await res.json();
      const raw = data.result.choices[0].message.content;
      const text = raw.replace(/^\n+/, "");

      let displayed = "";
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          displayed += text[i];
          setContent(displayed);
          i++;
        } else {
          clearInterval(interval);
          setGenerating(false);
          setStreaming(false);
        }
      }, 12);
    } catch {
      toast("error", "Failed to generate document.");
      setGenerating(false);
      setStreaming(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <Link
        href={`/applications/${params.id}`}
        className="inline-flex items-center gap-1.5 mb-6 transition-colors hover:text-accent"
        style={{ fontSize: 13, color: "var(--text-secondary)" }}
      >
        <ArrowLeft size={14} />
        Back to application
      </Link>

      <h1
        className="font-display font-semibold"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.2, color: "var(--text-primary)" }}
      >
        Generate Documents
      </h1>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, marginBottom: 24 }}>
        Application &middot; {docType === "cover-letter" ? "Cover Letter" : docType === "cold-email" ? "Cold Email" : docType === "linkedin-dm" ? "LinkedIn DM" : "Proposal"}
      </p>

      <DocumentTypePicker selected={docType} onSelect={setDocType} />

      {/* Tone selector */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div>
          <label style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>Tone</label>
          <div className="flex gap-1">
            {["Formal", "Balanced", "Conversational"].map((t) => (
              <button
                key={t}
                onClick={() => setTone(t.toLowerCase())}
                className="px-3 py-1.5 text-sm font-medium transition-all"
                style={{
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: tone === t.toLowerCase() ? "var(--accent)" : "var(--bg-muted)",
                  color: tone === t.toLowerCase() ? "white" : "var(--text-secondary)",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        icon={<Sparkles size={16} />}
        onClick={handleGenerate}
        loading={generating}
      >
        {generating ? "Generating..." : `Generate ${docType === "cover-letter" ? "Cover Letter" : docType === "cold-email" ? "Cold Email" : docType === "linkedin-dm" ? "LinkedIn DM" : "Proposal"}`}
      </Button>

      <DocumentOutput
        content={content}
        streaming={streaming}
        onCopy={() => {
          navigator.clipboard.writeText(content);
          toast("success", "Copied to clipboard");
        }}
        onRegenerate={handleGenerate}
        onSave={() => toast("success", "Document saved")}
      />
    </div>
  );
}

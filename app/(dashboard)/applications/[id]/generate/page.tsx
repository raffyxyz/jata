"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DocumentTypePicker, type DocType } from "@/components/documents/DocumentTypePicker";
import { DocumentOutput } from "@/components/documents/DocumentOutput";

const mockContent = `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Engineer position at Stripe. With over 4 years of experience building performant, accessible web applications using React, TypeScript, and modern frontend tooling, I am confident that my technical skills and product mindset align well with what your team is looking for.

At my current role, I led the development of a component library that reduced UI development time by 30% and improved cross-team consistency. I'm particularly drawn to Stripe's commitment to developer experience and elegant API design.

I would welcome the opportunity to discuss how my background and skills could contribute to your team.

Best regards,
Jane Doe`;

export default function GeneratePage() {
  const params = useParams();
  const [docType, setDocType] = useState<DocType>("cover-letter");
  const [tone, setTone] = useState("balanced");
  const [length, setLength] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState("");
  const [streaming, setStreaming] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setStreaming(true);
    // Simulate streaming generation
    let i = 0;
    const chars = mockContent.split("");
    setContent("");
    const interval = setInterval(() => {
      if (i < chars.length) {
        setContent((prev) => prev + chars[i]);
        i++;
      } else {
        clearInterval(interval);
        setGenerating(false);
        setStreaming(false);
      }
    }, 15);
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
        Stripe &middot; Senior Frontend Engineer
      </p>

      {/* Document type picker */}
      <DocumentTypePicker selected={docType} onSelect={setDocType} />

      {/* Options panel */}
      {docType === "cover-letter" && (
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
          <div>
            <label style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>Length</label>
            <div className="flex gap-1">
              {[
                { label: "Short", value: "short" },
                { label: "Medium", value: "medium" },
                { label: "Long", value: "long" },
              ].map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLength(l.value)}
                  className="px-3 py-1.5 text-sm font-medium transition-all"
                  style={{
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: length === l.value ? "var(--accent)" : "var(--bg-muted)",
                    color: length === l.value ? "white" : "var(--text-secondary)",
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generate button */}
      <Button
        className="w-full"
        size="lg"
        icon={<Sparkles size={16} />}
        onClick={handleGenerate}
        loading={generating}
      >
        {generating ? "Generating..." : `Generate ${docType === "cover-letter" ? "Cover Letter" : docType === "cold-email" ? "Cold Email" : docType === "linkedin-dm" ? "LinkedIn DM" : "Proposal"}`}
      </Button>

      {/* Output */}
      <DocumentOutput
        content={content}
        streaming={streaming}
        onCopy={() => {}}
        onRegenerate={handleGenerate}
        onSave={() => {}}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ScorePill } from "@/components/ui/ScorePill";

const resumeText = `Jane Doe
jane.doe@email.com | (555) 123-4567

EXPERIENCE

Frontend Developer
Tech Corp — Jan 2022 - Present
- Worked on web applications using React
- Fixed bugs and added features
- Collaborated with team members

Junior Developer
Startup Inc — Jun 2020 - Dec 2021
- Built UI components
- Wrote tests
- Attended daily standups

EDUCATION
B.S. Computer Science
University of Technology — 2020`;

const suggestions = [
  {
    section: "Work Experience",
    issue: "Lacks quantified achievements. Add metrics to demonstrate impact.",
    before: "- Worked on web applications using React\n- Fixed bugs and added features\n- Collaborated with team members",
    after: "- Built 3 customer-facing React modules used by 50K+ users\n- Reduced bug resolution time by 40% through improved QA processes\n- Led a cross-functional team of 5 engineers to deliver 2 major releases",
    applied: false,
  },
  {
    section: "Work Experience",
    issue: "Missing action verbs that convey leadership and ownership.",
    before: "- Built UI components\n- Wrote tests\n- Attended daily standups",
    after: "- Architected a reusable component library adopted by 3 product teams\n- Implemented comprehensive test coverage achieving 90%+ code coverage\n- Drove agile ceremonies as team lead for a 6-person engineering squad",
    applied: false,
  },
];

export default function OptimizePage() {
  const params = useParams();
  const [suggestionState, setSuggestionState] = useState(suggestions);

  const toggleApplied = (index: number) => {
    setSuggestionState((prev) =>
      prev.map((s, i) => (i === index ? { ...s, applied: !s.applied } : s))
    );
  };

  return (
    <div>
      <Link
        href={`/applications/${params.id}`}
        className="inline-flex items-center gap-1.5 mb-6 transition-colors hover:text-accent"
        style={{ fontSize: 13, color: "var(--text-secondary)" }}
      >
        <ArrowLeft size={14} />
        Back to application
      </Link>

      <h1
        className="font-display font-semibold mb-6"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.2, color: "var(--text-primary)" }}
      >
        Resume Optimizer
      </h1>

      {/* Two columns */}
      <div className="flex gap-5" style={{ minHeight: "calc(100vh - 200px)" }}>
        {/* Left: Current resume */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
              Current Resume
            </h3>
            <ScorePill score={62} size="sm" />
          </div>
          <div
            className="flex-1 overflow-y-auto"
            style={{
              backgroundColor: "var(--bg-muted)",
              borderRadius: "var(--radius-md)",
              padding: 16,
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              color: "var(--text-primary)",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {resumeText}
          </div>
        </div>

        {/* Right: Suggestions */}
        <div className="flex-1 flex flex-col">
          <h3 className="mb-3" style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
            Suggested Improvements
          </h3>
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
            {suggestionState.map((s, i) => (
              <div
                key={i}
                className="bg-bg-surface rounded-lg p-4"
                style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
              >
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", marginBottom: 2 }}>
                  {s.section}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10 }}>
                  {s.issue}
                </p>

                {/* Before */}
                <div
                  className="mb-2 rounded-md p-3"
                  style={{ backgroundColor: "var(--danger-subtle)" }}
                >
                  <p style={{ fontSize: 10, fontWeight: 600, color: "var(--danger)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Before
                  </p>
                  <pre style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--danger)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                    {s.before}
                  </pre>
                </div>

                {/* After */}
                <div
                  className="mb-3 rounded-md p-3"
                  style={{ backgroundColor: "var(--success-subtle)" }}
                >
                  <p style={{ fontSize: 10, fontWeight: 600, color: "var(--success)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    After
                  </p>
                  <pre style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--success)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                    {s.after}
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleApplied(i)}
                    className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
                    style={{ color: s.applied ? "var(--success)" : "var(--accent)" }}
                  >
                    {s.applied ? <Check size={14} /> : null}
                    {s.applied ? "Applied" : "Apply suggestion"}
                  </button>
                  <button
                    onClick={() => toggleApplied(i)}
                    className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom actions */}
          <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <Button size="md">Apply all suggestions</Button>
            <Button variant="ghost" size="md" icon={<Check size={14} />}>
              Re-check score
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { FileText, Mail, MessageCircle, Presentation } from "lucide-react";

type DocType = "cover-letter" | "cold-email" | "linkedin-dm" | "proposal";

interface DocumentTypePickerProps {
  selected: DocType;
  onSelect: (type: DocType) => void;
}

const types: { value: DocType; label: string; icon: React.ElementType }[] = [
  { value: "cover-letter", label: "Cover Letter", icon: FileText },
  { value: "cold-email", label: "Cold Email", icon: Mail },
  { value: "linkedin-dm", label: "LinkedIn DM", icon: MessageCircle },
  { value: "proposal", label: "Freelance Proposal", icon: Presentation },
];

function DocumentTypePicker({ selected, onSelect }: DocumentTypePickerProps) {
  return (
    <div className="flex gap-1 mb-6 flex-wrap">
      {types.map((t) => {
        const active = t.value === selected;
        const Icon = t.icon;
        return (
          <button
            key={t.value}
            onClick={() => onSelect(t.value)}
            className="flex items-center gap-2 px-4 py-2.5 transition-all text-sm font-medium"
            style={{
              borderRadius: "var(--radius-md)",
              backgroundColor: active ? "var(--accent-subtle)" : "transparent",
              color: active ? "var(--accent)" : "var(--text-secondary)",
              borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
            }}
          >
            <Icon size={16} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export { DocumentTypePicker };
export type { DocType, DocumentTypePickerProps };

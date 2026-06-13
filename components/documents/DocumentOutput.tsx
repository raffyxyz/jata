"use client";

import { Copy, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DocumentOutputProps {
  content: string;
  streaming: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
  onSave: () => void;
}

function DocumentOutput({ content, streaming, onCopy, onRegenerate, onSave }: DocumentOutputProps) {
  return (
    <div className="mt-6">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-1 mb-2">
        <Button variant="ghost" size="sm" icon={<Copy size={14} />} onClick={onCopy}>
          Copy
        </Button>
        <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} onClick={onRegenerate}>
          Regenerate
        </Button>
        <Button variant="ghost" size="sm" icon={<Save size={14} />} onClick={onSave}>
          Save
        </Button>
      </div>

      {/* Output card */}
      <div
        className="bg-bg-surface animate-fade-in"
        style={{
          borderRadius: "var(--radius-lg)",
          padding: 24,
          lineHeight: 1.7,
          fontSize: 15,
          fontFamily: "var(--font-inter)",
          color: "var(--text-primary)",
        }}
      >
        {content ? (
          <p style={{ whiteSpace: "pre-wrap" }}>{content}</p>
        ) : streaming ? (
          <div className="flex items-center gap-1">
            <span className="animate-cursor-blink text-accent" style={{ fontSize: 20 }}>|</span>
          </div>
        ) : (
          <p style={{ color: "var(--text-tertiary)" }}>
            Generated content will appear here...
          </p>
        )}
      </div>
    </div>
  );
}

export { DocumentOutput };
export type { DocumentOutputProps };

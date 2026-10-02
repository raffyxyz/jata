"use client";

import { useEffect, useRef } from "react";
import { Copy, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DocumentOutputProps {
  content: string;
  streaming: boolean;
  onChange: (content: string) => void;
  onCopy: () => void;
  onRegenerate: () => void;
  onSave: () => void;
}

function DocumentOutput({ content, streaming, onChange, onCopy, onRegenerate, onSave }: DocumentOutputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  // Grow to fit the content so it reads as a document rather than a scroll box.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el || !el.isConnected) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const scrollTop = el.scrollTop;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [content]);

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
        {streaming && !content ? (
          <div className="flex items-center gap-1">
            <span className="animate-cursor-blink text-accent" style={{ fontSize: 20 }}>|</span>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              const el = e.target;
              const start = el.selectionStart ?? 0;
              const end = el.selectionEnd ?? 0;
              const scrollTop = el.scrollTop;
              onChange(e.target.value);
              requestAnimationFrame(() => {
                el.setSelectionRange(start, end);
                el.scrollTop = scrollTop;
              });
            }}
            readOnly={streaming}
            rows={1}
            aria-label="Generated document"
            placeholder="Generated content will appear here..."
            className="block w-full resize-none overflow-hidden border-0 bg-transparent p-0 caret-accent placeholder:text-text-tertiary focus:outline-none focus-visible:outline-none"
            style={{
              lineHeight: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              color: "inherit",
              scrollPaddingTop: 0,
              scrollPaddingBottom: 0,
            }}
          />
        )}
      </div>
    </div>
  );
}

export { DocumentOutput };
export type { DocumentOutputProps };

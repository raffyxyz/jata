"use client";

import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;

        return (
          <div key={label} className="flex items-center">
            {/* Circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex items-center justify-center transition-all"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: isDone
                    ? "var(--success)"
                    : isActive
                    ? "var(--accent)"
                    : "transparent",
                  border: isDone || isActive ? "none" : "2px solid var(--border)",
                  color: isDone || isActive ? "white" : "var(--text-tertiary)",
                }}
              >
                {isDone ? <Check size={14} strokeWidth={3} /> : <span style={{ fontSize: 12, fontWeight: 600 }}>{i + 1}</span>}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--accent)" : "var(--text-tertiary)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                style={{
                  width: 80,
                  height: 2,
                  margin: "0 8px",
                  marginBottom: 24,
                  backgroundColor: isDone ? "var(--success)" : "var(--border)",
                  borderRadius: 1,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export { StepIndicator };
export type { StepIndicatorProps };

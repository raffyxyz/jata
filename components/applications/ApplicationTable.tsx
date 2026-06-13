"use client";

import { ApplicationRow, type ApplicationData } from "./ApplicationRow";

interface ApplicationTableProps {
  applications: ApplicationData[];
}

function ApplicationTable({ applications }: ApplicationTableProps) {
  if (applications.length === 0) return null;

  return (
    <div
      className="bg-bg-surface rounded-lg"
      style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
    >
      {/* Header */}
      <div
        className="flex items-center px-1"
        style={{ height: 40, borderBottom: "1px solid var(--border)" }}
      >
        <span className="text-xs font-medium text-text-tertiary" style={{ flex: "0 0 35%" }}>
          Company / Role
        </span>
        <span className="text-xs font-medium text-text-tertiary" style={{ width: 100 }}>
          ATS Score
        </span>
        <span className="text-xs font-medium text-text-tertiary" style={{ width: 120 }}>
          Status
        </span>
        <span className="text-xs font-medium text-text-tertiary" style={{ width: 100 }}>
          Date
        </span>
        <span className="text-xs font-medium text-text-tertiary" style={{ width: 80, textAlign: "center" }}>
          Actions
        </span>
      </div>
      {/* Rows */}
      {applications.map((app, i) => (
        <ApplicationRow
          key={app.id}
          application={app}
          isLast={i === applications.length - 1}
        />
      ))}
    </div>
  );
}

export { ApplicationTable };
export type { ApplicationTableProps };

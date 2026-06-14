"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ScorePill } from "@/components/ui/ScorePill";
import { toast } from "@/components/ui/Toast";
import { formatRelativeDate } from "@/lib/utils/score";
import { useDeleteApplication, useUpdateApplicationStatus } from "@/lib/presentation/hooks/useApplications";

export interface ApplicationData {
  id: string;
  company: string;
  role: string;
  score: number;
  status: "applied" | "interview" | "offer" | "rejected" | "draft";
  dateAdded: Date;
}

interface ApplicationRowProps {
  application: ApplicationData;
  isLast?: boolean;
}

const STATUS_OPTIONS = ["Applied", "Interview", "Offer", "Rejected", "Draft"] as const;

function ApplicationRow({ application, isLast }: ApplicationRowProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteMutation = useDeleteApplication();
  const updateStatusMutation = useUpdateApplicationStatus();

  const handleView = () => {
    setMenuOpen(false);
    router.push(`/applications/${application.id}`);
  };

  const handleEdit = () => {
    setMenuOpen(false);
    router.push(`/applications/${application.id}/edit`);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteMutation.mutate(application.id, {
      onSuccess: () => {
        setMenuOpen(false);
        setConfirmDelete(false);
        toast("success", "Application deleted");
      },
      onError: () => {
        toast("error", "Failed to delete application");
        setConfirmDelete(false);
      },
    });
  };

  const handleStatusChange = (status: string) => {
    setMenuOpen(false);
    updateStatusMutation.mutate(
      { id: application.id, status: status.toLowerCase() },
      {
        onSuccess: () => {
          toast("success", `Status updated to ${status}`);
        },
        onError: () => {
          toast("error", "Failed to update status");
        },
      },
    );
  };

  return (
    <div
      className="flex items-center transition-all duration-120 hover:bg-bg-muted relative"
      style={{
        height: 52,
        borderBottom: isLast ? "none" : "1px solid var(--border)",
        padding: "0 4px",
      }}
    >
      {/* Company + Role */}
      <div className="flex-1 min-w-0" style={{ flex: "0 0 35%" }}>
        <p
          className="truncate"
          style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}
        >
          {application.company}
        </p>
        <p
          className="truncate"
          style={{ fontSize: 12, color: "var(--text-secondary)" }}
        >
          {application.role}
        </p>
      </div>

      {/* ATS Score */}
      <div style={{ width: 100 }}>
        <ScorePill score={application.score} />
      </div>

      {/* Status */}
      <div style={{ width: 120 }}>
        <Badge variant={application.status}>{application.status}</Badge>
      </div>

      {/* Date */}
      <div style={{ width: 100 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {formatRelativeDate(application.dateAdded)}
        </span>
      </div>

      {/* Actions */}
      <div style={{ width: 80 }} className="flex justify-center">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center text-text-tertiary hover:text-text-secondary transition-colors"
            style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)" }}
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-full mt-1 z-20 bg-bg-surface shadow-[var(--shadow-md)] rounded-md py-1 min-w-[160px]"
                style={{ borderRadius: "var(--radius-md)" }}
              >
                {/* View */}
                <button
                  onClick={handleView}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-text-primary hover:bg-bg-muted transition-colors"
                  style={{ fontSize: 13 }}
                >
                  <Eye size={14} className="text-text-secondary" />
                  View
                </button>

                {/* Edit */}
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-text-primary hover:bg-bg-muted transition-colors"
                  style={{ fontSize: 13 }}
                >
                  <Pencil size={14} className="text-text-secondary" />
                  Edit
                </button>

                {/* Divider */}
                <div className="my-1 mx-3" style={{ height: 1, backgroundColor: "var(--border)" }} />

                {/* Status label */}
                <p
                  className="px-3 py-1 text-xs font-medium"
                  style={{ color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}
                >
                  Status
                </p>

                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-text-primary hover:bg-bg-muted transition-colors"
                    style={{ fontSize: 13 }}
                  >
                    <span
                      className="rounded-full"
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor:
                          status.toLowerCase() === application.status
                            ? "var(--accent)"
                            : "var(--text-tertiary)",
                      }}
                    />
                    {status}
                    {status.toLowerCase() === application.status && (
                      <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-tertiary)" }}>
                        Active
                      </span>
                    )}
                  </button>
                ))}

                {/* Divider */}
                <div className="my-1 mx-3" style={{ height: 1, backgroundColor: "var(--border)" }} />

                {/* Delete */}
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-danger hover:bg-danger-subtle transition-colors"
                  style={{ fontSize: 13 }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 size={14} />
                  {confirmDelete ? "Confirm delete?" : "Delete"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { ApplicationRow };
export type { ApplicationRowProps };

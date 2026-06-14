"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<Record<string, string | number> | null>(null);

  useEffect(() => {
    if (!menuOpen) {
      setMenuStyle(null);
      return;
    }

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuStyle({
          top: rect.bottom + 4,
          right: window.innerWidth - rect.right,
        });
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [menuOpen]);

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
      className="flex items-center transition-all duration-120 hover:bg-bg-muted relative min-w-[600px]"
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
        <button
          ref={buttonRef}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center text-text-tertiary hover:text-text-secondary transition-colors"
          style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)" }}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {menuOpen && menuStyle && createPortal(
        <>
          <div className="fixed inset-0 z-50" onClick={() => { setMenuOpen(false); setConfirmDelete(false); }} />
          <div
            className="fixed z-50 bg-bg-surface shadow-[var(--shadow-md)] rounded-md py-1 min-w-[180px]"
            style={{ top: menuStyle.top, right: menuStyle.right, borderRadius: "var(--radius-md)" }}
          >
            <button
              onClick={handleView}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-text-primary hover:bg-bg-muted transition-colors"
            >
              <Eye size={13} className="text-text-secondary shrink-0" />
              View
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-text-primary hover:bg-bg-muted transition-colors"
            >
              <Pencil size={13} className="text-text-secondary shrink-0" />
              Edit
            </button>
            <div className="my-1 mx-3" style={{ height: 1, backgroundColor: "var(--border)" }} />
            <p className="px-3 py-1 text-[11px] font-medium text-text-tertiary uppercase tracking-wide">
              Status
            </p>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-text-primary hover:bg-bg-muted transition-colors"
              >
                <span
                  className="rounded-full shrink-0"
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
                  <span className="ml-auto text-[11px] text-text-tertiary">Active</span>
                )}
              </button>
            ))}
            <div className="my-1 mx-3" style={{ height: 1, backgroundColor: "var(--border)" }} />
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-danger hover:bg-danger-subtle transition-colors"
              disabled={deleteMutation.isPending}
            >
              <Trash2 size={13} className="shrink-0" />
              {confirmDelete ? "Confirm delete?" : "Delete"}
            </button>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

export { ApplicationRow };
export type { ApplicationRowProps };

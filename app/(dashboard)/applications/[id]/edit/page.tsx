"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";

interface EditForm {
  company: string;
  jobTitle: string;
  jobDescription: string;
  jobUrl: string;
}

const STATUS_OPTIONS = ["draft", "applied", "interview", "offer", "rejected"] as const;

export default function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState<EditForm>({
    company: "",
    jobTitle: "",
    jobDescription: "",
    jobUrl: "",
  });
  const [status, setStatus] = useState("applied");

  useEffect(() => {
    fetch(`/api/applications/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setForm({
          company: data.company,
          jobTitle: data.role,
          jobDescription: data.jobDescription || "",
          jobUrl: data.jobUrl || "",
        });
        setStatus(data.status);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company,
          jobTitle: form.jobTitle,
          jobDescription: form.jobDescription,
          jobUrl: form.jobUrl || null,
          status,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast("success", "Application updated");
      router.push(`/applications/${id}`);
    } catch {
      toast("error", "Failed to update application");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6 h-4 w-32 bg-bg-muted rounded animate-skeleton" />
        <div className="space-y-6">
          <div className="h-8 w-48 bg-bg-muted rounded animate-skeleton" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-bg-muted rounded-lg animate-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 mb-6 transition-colors hover:text-accent"
          style={{ fontSize: 13, color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={14} />
          Back to applications
        </Link>
        <div className="flex flex-col items-center justify-center py-20">
          <h3
            className="font-display font-semibold"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}
          >
            Application not found
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href={`/applications/${id}`}
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
        Edit Application
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <Card className="p-6 space-y-5">
          {/* Company */}
          <div>
            <label
              htmlFor="company"
              style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 6 }}
            >
              Company
            </label>
            <input
              id="company"
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
              className="w-full h-9 bg-bg-muted border border-border rounded-md px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,126,247,0.12)] transition-all duration-120"
              style={{ fontSize: 13 }}
            />
          </div>

          {/* Job Title */}
          <div>
            <label
              htmlFor="jobTitle"
              style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 6 }}
            >
              Job Title
            </label>
            <input
              id="jobTitle"
              type="text"
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              required
              className="w-full h-9 bg-bg-muted border border-border rounded-md px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,126,247,0.12)] transition-all duration-120"
              style={{ fontSize: 13 }}
            />
          </div>

          {/* Job URL */}
          <div>
            <label
              htmlFor="jobUrl"
              style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 6 }}
            >
              Job URL
            </label>
            <input
              id="jobUrl"
              type="url"
              value={form.jobUrl}
              onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
              placeholder="https://..."
              className="w-full h-9 bg-bg-muted border border-border rounded-md px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,126,247,0.12)] transition-all duration-120"
              style={{ fontSize: 13 }}
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 6 }}
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-9 bg-bg-muted border border-border rounded-md px-3 text-sm text-text-primary appearance-none cursor-pointer focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,126,247,0.12)]"
              style={{ fontSize: 13 }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Job Description */}
          <div>
            <label
              htmlFor="jobDescription"
              style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 6 }}
            >
              Job Description
            </label>
            <textarea
              id="jobDescription"
              rows={8}
              value={form.jobDescription}
              onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
              className="w-full bg-bg-muted border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,126,247,0.12)] transition-all duration-120 resize-y"
              style={{ fontSize: 13 }}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" icon={<Save size={16} />} loading={saving}>
            Save Changes
          </Button>
          <Link href={`/applications/${id}`}>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

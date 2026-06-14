"use client";

import { useState } from "react";
import { Plus, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { useApplications } from "@/lib/presentation/hooks/useApplications";

const statuses = ["All", "Applied", "Interview", "Offer", "Rejected", "Draft"];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Score: High", value: "score-high" },
  { label: "Score: Low", value: "score-low" },
];

export default function ApplicationsPage() {
  const { data: applications = [], isLoading } = useApplications();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = applications
    .filter((a) => {
      const q = search.toLowerCase();
      const matchesSearch = a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || a.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest": return a.dateAdded.getTime() - b.dateAdded.getTime();
        case "score-high": return b.score - a.score;
        case "score-low": return a.score - b.score;
        default: return b.dateAdded.getTime() - a.dateAdded.getTime();
      }
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="font-display font-semibold"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.2, color: "var(--text-primary)" }}
        >
          Applications
        </h1>
        <Link href="/applications/new">
          <Button icon={<Plus size={16} />}>
            New Application
          </Button>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {/* Search */}
        <div className="relative" style={{ width: 280 }}>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-9 bg-bg-muted border border-border rounded-md pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,126,247,0.12)] transition-all duration-120"
            style={{ fontSize: 13 }}
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-9 bg-bg-muted border border-border rounded-md pl-3 pr-8 text-sm text-text-primary appearance-none cursor-pointer focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,126,247,0.12)]"
            style={{ fontSize: 13 }}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 bg-bg-muted border border-border rounded-md pl-3 pr-8 text-sm text-text-primary appearance-none cursor-pointer focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,126,247,0.12)]"
            style={{ fontSize: 13 }}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
        </div>
      </div>

      {/* Table / Loading */}
      {isLoading ? (
        <div className="bg-bg-surface rounded-lg" style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center px-1"
              style={{ height: 52, borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}
            >
              <div className="flex-1 space-y-2" style={{ flex: "0 0 35%" }}>
                <div className="h-3 w-24 bg-bg-muted rounded animate-skeleton" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} />
                <div className="h-2.5 w-36 bg-bg-muted rounded animate-skeleton" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} />
              </div>
              <div style={{ width: 100 }}><div className="h-5 w-16 bg-bg-muted rounded animate-skeleton" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} /></div>
              <div style={{ width: 120 }}><div className="h-5 w-20 bg-bg-muted rounded animate-skeleton" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} /></div>
              <div style={{ width: 100 }}><div className="h-3 w-14 bg-bg-muted rounded animate-skeleton" style={{ background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--border) 50%, var(--bg-muted) 75%)", backgroundSize: "200% 100%" }} /></div>
            </div>
          ))}
        </div>
      ) : (
        <ApplicationTable applications={paginated} />
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                fontWeight: 500,
                backgroundColor: p === page ? "var(--accent)" : "transparent",
                color: p === page ? "white" : "var(--text-secondary)",
                border: p === page ? "none" : "1px solid var(--border)",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="10" y="16" width="60" height="48" rx="6" stroke="var(--border)" strokeWidth="2" fill="none" />
            <line x1="20" y1="30" x2="60" y2="30" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="38" x2="50" y2="38" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="46" x2="40" y2="46" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="56" cy="46" r="10" fill="var(--accent-subtle)" stroke="var(--accent)" strokeWidth="1.5" />
            <line x1="56" y1="42" x2="56" y2="50" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
            <line x1="52" y1="46" x2="60" y2="46" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3
            className="mt-4 font-display font-semibold"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}
          >
            No applications found
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, marginBottom: 16 }}>
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}

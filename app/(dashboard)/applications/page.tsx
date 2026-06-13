"use client";

import { useState } from "react";
import { Plus, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import type { ApplicationData } from "@/components/applications/ApplicationRow";



const mockApplications: ApplicationData[] = [
  { id: "1", company: "Stripe", role: "Senior Frontend Engineer", score: 82, status: "interview", dateAdded: new Date(Date.now() - 86400000 * 2) },
  { id: "2", company: "Vercel", role: "Product Engineer", score: 65, status: "applied", dateAdded: new Date(Date.now() - 86400000 * 5) },
  { id: "3", company: "Linear", role: "Design Engineer", score: 91, status: "offer", dateAdded: new Date(Date.now() - 86400000 * 10) },
  { id: "4", company: "Railway", role: "Full Stack Developer", score: 45, status: "rejected", dateAdded: new Date(Date.now() - 86400000 * 14) },
  { id: "5", company: "Anthropic", role: "AI Engineer", score: 78, status: "interview", dateAdded: new Date(Date.now() - 86400000 * 3) },
  { id: "6", company: "Notion", role: "Frontend Engineer", score: 55, status: "applied", dateAdded: new Date(Date.now() - 86400000 * 7) },
  { id: "7", company: "Figma", role: "Design Engineer", score: 88, status: "applied", dateAdded: new Date(Date.now() - 86400000) },
  { id: "8", company: "GitHub", role: "Developer Advocate", score: 72, status: "draft", dateAdded: new Date(Date.now() - 86400000 * 20) },
  { id: "9", company: "Supabase", role: "Full Stack Developer", score: 60, status: "applied", dateAdded: new Date(Date.now() - 86400000 * 12) },
  { id: "10", company: "Tailwind Labs", role: "UI Engineer", score: 95, status: "offer", dateAdded: new Date(Date.now() - 86400000 * 30) },
  { id: "11", company: "Expo", role: "React Native Engineer", score: 70, status: "rejected", dateAdded: new Date(Date.now() - 86400000 * 45) },
  { id: "12", company: "PlanetScale", role: "Backend Engineer", score: 50, status: "applied", dateAdded: new Date(Date.now() - 86400000 * 60) },
];

const statuses = ["All", "Applied", "Interview", "Offer", "Rejected", "Draft"];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Score: High", value: "score-high" },
  { label: "Score: Low", value: "score-low" },
];

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = mockApplications
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
        <Button icon={<Plus size={16} />}>
          New Application
        </Button>
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

      {/* Table */}
      <ApplicationTable applications={paginated} />

      {/* Pagination */}
      {totalPages > 1 && (
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
      {filtered.length === 0 && (
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

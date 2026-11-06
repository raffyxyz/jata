import type { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { type CallerContext } from "@/lib/application/session/session";
import { stubSupabase } from "@/tests/support/supabase-stub";
import { GET, getHandler } from "./route";

const request = new Request("http://localhost/api/applications/app-1") as NextRequest;
const params = { params: Promise.resolve({ id: "app-1" }) };

const applicationRow = {
  id: "app-1",
  user_id: "user-1",
  resume_id: "res-1",
  company: "Acme",
  job_title: "Engineer",
  job_description: "Build things",
  job_url: "https://acme.dev/jobs/1",
  status: "applied",
  created_at: "2026-01-01T00:00:00Z",
};

const ctxFor = (tables: Parameters<typeof stubSupabase>[0]): CallerContext =>
  ({ user: { id: "user-1" }, supabase: stubSupabase(tables) }) as unknown as CallerContext;

describe("GET /api/applications/[id]", () => {
  it("is exported behind the session seam", () => {
    expect(typeof GET).toBe("function");
  });

  it("answers 404 when the application does not exist", async () => {
    const ctx = ctxFor({
      applications: { singleError: { code: "PGRST116", message: "not found" } },
    });

    const res = await getHandler(ctx, request, params);

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not found" });
  });

  it("answers 403 when the application belongs to another caller", async () => {
    const ctx = ctxFor({
      applications: { single: { ...applicationRow, user_id: "someone-else" } },
    });

    const res = await getHandler(ctx, request, params);

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Forbidden" });
  });

  it("returns the caller's application with score and documents", async () => {
    const ctx = ctxFor({
      applications: { single: applicationRow },
      ats_results: { maybe: { overall_score: 91 } },
      generated_documents: {
        rows: [{ id: "doc-1", type: "cover_letter", content: "Dear Acme", created_at: "2026-01-02T00:00:00Z" }],
      },
    });

    const res = await getHandler(ctx, request, params);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      id: "app-1",
      company: "Acme",
      role: "Engineer",
      jobDescription: "Build things",
      jobUrl: "https://acme.dev/jobs/1",
      score: 91,
      status: "applied",
      dateAdded: "2026-01-01T00:00:00Z",
      documents: [
        { id: "doc-1", type: "cover_letter", content: "Dear Acme", createdAt: "2026-01-02T00:00:00Z" },
      ],
    });
  });
});

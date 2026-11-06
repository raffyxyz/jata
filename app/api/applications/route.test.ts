import { describe, expect, it } from "vitest";
import { enforceSession, type CallerContext } from "@/lib/application/session/session";
import { stubSupabase } from "@/tests/support/supabase-stub";
import { GET, listHandler } from "./route";

const applicationRow = {
  id: "app-1",
  user_id: "user-1",
  resume_id: "res-1",
  company: "Acme",
  job_title: "Engineer",
  job_description: "Build things",
  job_url: null,
  status: "applied",
  created_at: "2026-01-01T00:00:00Z",
};

const caller: CallerContext = {
  user: { id: "user-1" },
  supabase: stubSupabase({
    applications: { rows: [applicationRow] },
    ats_results: { rows: [{ application_id: "app-1", overall_score: 91 }] },
  }),
} as unknown as CallerContext;

describe("GET /api/applications", () => {
  it("is exported behind the session seam", () => {
    expect(typeof GET).toBe("function");
  });

  it("rejects a caller without a session", async () => {
    const wrapped = enforceSession(listHandler, async () => null);

    const res = await wrapped();

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns the caller's applications enriched with ATS scores", async () => {
    const res = await listHandler(caller);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([
      {
        id: "app-1",
        company: "Acme",
        role: "Engineer",
        score: 91,
        status: "applied",
        dateAdded: "2026-01-01T00:00:00Z",
      },
    ]);
  });
});

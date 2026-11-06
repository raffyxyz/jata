import { afterEach, describe, expect, it, vi } from "vitest";
import { enforceSession, type CallerContext } from "@/lib/application/session/session";
import { POST, scoreHandler } from "./route";

const caller = { user: { id: "user-1" }, supabase: {} } as unknown as CallerContext;

const scoreRequest = () =>
  new Request("http://localhost/api/ats-score", {
    method: "POST",
    body: JSON.stringify({ parsedJD: "job analysis", resumeText: "resume text" }),
  });

describe("POST /api/ats-score", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("is exported behind the session seam", () => {
    expect(typeof POST).toBe("function");
  });

  it("rejects a caller without a session before any Cloudflare call", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const wrapped = enforceSession(scoreHandler, async () => null);

    const res = await wrapped(scoreRequest());

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("runs for a verified caller", async () => {
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "acct");
    vi.stubEnv("CLOUDFLARE_WORKERS_TOKEN", "token");
    const fetchMock = vi.fn(async () =>
      Response.json({ result: { choices: [{ message: { content: '{"overall_score": 80}' } }] } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const wrapped = enforceSession(scoreHandler, async () => caller);
    const res = await wrapped(scoreRequest());

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

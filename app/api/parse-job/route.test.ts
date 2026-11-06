import { afterEach, describe, expect, it, vi } from "vitest";
import { enforceSession, type CallerContext } from "@/lib/application/session/session";
import { POST, parseHandler } from "./route";

const caller = { user: { id: "user-1" }, supabase: {} } as unknown as CallerContext;

const parseRequest = () =>
  new Request("http://localhost/api/parse-job", {
    method: "POST",
    body: JSON.stringify({ jobDescription: "We are hiring an engineer" }),
  });

describe("POST /api/parse-job", () => {
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
    const wrapped = enforceSession(parseHandler, async () => null);

    const res = await wrapped(parseRequest());

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("runs for a verified caller", async () => {
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "acct");
    vi.stubEnv("CLOUDFLARE_WORKERS_TOKEN", "token");
    const fetchMock = vi.fn(async () =>
      Response.json({ result: { choices: [{ message: { content: '{"job_title": "Engineer"}' } }] } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const wrapped = enforceSession(parseHandler, async () => caller);
    const res = await wrapped(parseRequest());

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { enforceSession, type CallerContext } from "@/lib/application/session/session";
import { POST, generateHandler } from "./route";

const caller = { user: { id: "user-1" }, supabase: {} } as unknown as CallerContext;

const documentInput = {
  docType: "cover_letter",
  name: "Ada",
  jobTitle: "Engineer",
  company: "Acme",
  keyResponsibilities: ["Ship features"],
  matchedKeywords: ["TypeScript"],
  resumeSummary: "Built products",
  userTone: "warm",
};

const generateRequest = () =>
  new Request("http://localhost/api/generate-document", {
    method: "POST",
    body: JSON.stringify(documentInput),
  });

describe("POST /api/generate-document", () => {
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
    const wrapped = enforceSession(generateHandler, async () => null);

    const res = await wrapped(generateRequest());

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("runs for a verified caller", async () => {
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "acct");
    vi.stubEnv("CLOUDFLARE_WORKERS_TOKEN", "token");
    const fetchMock = vi.fn(async () =>
      Response.json({ result: { choices: [{ message: { content: "Dear Acme," } }] } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const wrapped = enforceSession(generateHandler, async () => caller);
    const res = await wrapped(generateRequest());

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

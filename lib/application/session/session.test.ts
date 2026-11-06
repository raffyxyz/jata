import { describe, expect, it } from "vitest";
import { enforceSession, type CallerContext } from "./session";

const caller = {
  user: { id: "user-1" },
  supabase: {},
} as unknown as CallerContext;

describe("enforceSession", () => {
  it("answers a caller without a session with the canonical 401 and never runs the handler", async () => {
    let called = false;
    const handler = async (_ctx: CallerContext, req: Request): Promise<Response> => {
      called = true;
      return Response.json({ ok: true, url: req.url });
    };

    const wrapped = enforceSession(handler, async () => null);
    const res = await wrapped(new Request("http://localhost/api/thing"));

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
    expect(called).toBe(false);
  });

  it("hands the verified caller context to the handler and forwards its arguments", async () => {
    const seen: CallerContext[] = [];
    const handler = async (ctx: CallerContext, req: Request): Promise<Response> => {
      seen.push(ctx);
      return Response.json({ id: ctx.user.id, url: req.url });
    };

    const wrapped = enforceSession(handler, async () => caller);
    const res = await wrapped(new Request("http://localhost/api/thing"));

    expect(seen).toEqual([caller]);
    expect(await res.json()).toEqual({ id: "user-1", url: "http://localhost/api/thing" });
  });

  it("wraps an argument-less handler (list routes)", async () => {
    const handler = async (ctx: CallerContext): Promise<Response> =>
      Response.json({ id: ctx.user.id });

    const wrapped = enforceSession(handler, async () => caller);
    const res = await wrapped();

    expect(await res.json()).toEqual({ id: "user-1" });
  });
});

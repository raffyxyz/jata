import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * The caller context: a verified Session (see GLOSSARY.md) and the data
 * client bound to it. Handlers only ever receive this — never an
 * unverified identity.
 */
export interface CallerContext {
  user: User;
  supabase: SupabaseClient;
}

/**
 * The seam. Resolves the caller's session, or null when the caller has
 * none. Production binds the cookie adapter
 * (lib/infrastructure/supabase/session.ts); tests bind a fake.
 */
export type SessionProvider = () => Promise<CallerContext | null>;

/** A route handler that only ever sees a verified caller context. */
export type SessionHandler = (
  ctx: CallerContext,
  ...args: never[]
) => Response | Promise<Response>;

/** The same handler, with the session resolution removed from its interface. */
export type Wrapped<H extends SessionHandler> =
  H extends (ctx: CallerContext, ...args: infer A) => infer R
    ? (...args: A) => R
    : never;

const unauthorized = (): Response =>
  Response.json({ error: "Unauthorized" }, { status: 401 });

/**
 * The rule, in one place: no session, no handler.
 *
 * The canonical 401 exists exactly once, and a handler cannot forget the
 * check — `withSession` is the only way to export it. This is the test
 * surface: bind a fake provider and call the wrapped route directly.
 */
export function enforceSession<H extends SessionHandler>(
  handler: H,
  provider: SessionProvider,
): Wrapped<H> {
  const wrapped = async (...args: unknown[]): Promise<Response> => {
    const ctx = await provider();
    if (!ctx) return unauthorized();
    return handler(ctx, ...(args as never[]));
  };
  return wrapped as unknown as Wrapped<H>;
}

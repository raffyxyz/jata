import { cookies } from "next/headers";
import {
  enforceSession,
  type CallerContext,
  type SessionHandler,
  type Wrapped,
} from "@/lib/application/session/session";
import { createClient } from "@/lib/infrastructure/supabase/server";

/** Cookie-backed adapter behind the session seam: Supabase session → caller context. */
export const cookieSessionProvider = async (): Promise<CallerContext | null> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { user, supabase };
};

/** The wrapper route handlers export: verifies the session once, then runs the handler. */
export const withSession = <H extends SessionHandler>(handler: H): Wrapped<H> =>
  enforceSession(handler, cookieSessionProvider);

export type { CallerContext } from "@/lib/application/session/session";

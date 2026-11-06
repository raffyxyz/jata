import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Minimal chainable Supabase stub for handler tests: each table resolves
 * the shapes route handlers actually read — awaited queries (`rows`),
 * `.single()`, `.maybeSingle()`.
 */
export interface TableResult {
  rows?: Record<string, unknown>[];
  single?: Record<string, unknown> | null;
  singleError?: { code?: string; message: string } | null;
  maybe?: Record<string, unknown> | null;
  count?: number;
}

export function stubSupabase(tables: Record<string, TableResult>): SupabaseClient {
  const from = (table: string) => {
    const cfg = tables[table] ?? {};
    const builder: Record<string, unknown> = {};
    const chain = () => builder;

    Object.assign(builder, {
      select: chain,
      eq: chain,
      neq: chain,
      in: chain,
      order: chain,
      limit: chain,
      insert: chain,
      update: chain,
      delete: chain,
      single: async () => ({ data: cfg.single ?? null, error: cfg.singleError ?? null }),
      maybeSingle: async () => ({ data: cfg.maybe ?? null, error: null }),
      then: (
        onFulfilled?: (value: unknown) => unknown,
        onRejected?: (reason: unknown) => unknown,
      ) =>
        Promise.resolve({
          data: cfg.rows ?? [],
          error: null,
          count: cfg.count ?? 0,
        }).then(onFulfilled, onRejected),
    });

    return builder;
  };

  return { from } as unknown as SupabaseClient;
}

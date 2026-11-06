import { NextRequest, NextResponse } from "next/server";
import { withSession, type CallerContext } from "@/lib/infrastructure/supabase/session";

export const patchHandler = async (
  { supabase }: CallerContext,
  request: NextRequest,
) => {
  const body = await request.json();
  const { name } = body;

  if (typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { data, error } = await supabase.auth.updateUser({
    data: { name },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: data.user.id,
    email: data.user.email ?? "",
    name: data.user.user_metadata?.name ?? null,
    avatarUrl: data.user.user_metadata?.avatar_url ?? null,
    createdAt: data.user.created_at,
  });
};

export const PATCH = withSession(patchHandler);

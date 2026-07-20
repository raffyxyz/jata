import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/infrastructure/supabase/server";

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, aiProvider } = body;

  if (typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const updateData: Record<string, string> = { name };
  if (aiProvider !== undefined) {
    updateData.ai_provider = aiProvider;
  }

  const { data, error } = await supabase.auth.updateUser({
    data: updateData,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: data.user.id,
    email: data.user.email ?? "",
    name: data.user.user_metadata?.name ?? null,
    avatarUrl: data.user.user_metadata?.avatar_url ?? null,
    aiProvider: data.user.user_metadata?.ai_provider ?? null,
    createdAt: data.user.created_at,
  });
}

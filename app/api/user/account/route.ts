import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/infrastructure/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getStoragePathFromUrl(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    const segments = url.pathname.split("/");
    const bucketIndex = segments.indexOf("resumes");
    if (bucketIndex === -1) return null;
    return segments.slice(bucketIndex + 1).join("/");
  } catch {
    return null;
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Fetch all user applications
  const { data: applications } = await supabase
    .from("applications")
    .select("id")
    .eq("user_id", user.id);

  const appIds = (applications ?? []).map((a) => a.id);

  // 2. Delete ATS results for all applications
  if (appIds.length > 0) {
    const { error } = await supabase
      .from("ats_results")
      .delete()
      .in("application_id", appIds);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // 3. Delete generated documents for all applications
  if (appIds.length > 0) {
    const { error } = await supabase
      .from("generated_documents")
      .delete()
      .in("application_id", appIds);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // 4. Delete all applications
  const { error: appDeleteError } = await supabase
    .from("applications")
    .delete()
    .eq("user_id", user.id);

  if (appDeleteError) {
    return NextResponse.json({ error: appDeleteError.message }, { status: 500 });
  }

  // 5. Fetch all user resumes and remove storage files
  const { data: resumes } = await supabase
    .from("resumes")
    .select("id, file_url")
    .eq("user_id", user.id);

  for (const resume of resumes ?? []) {
    const storagePath = getStoragePathFromUrl(resume.file_url);
    if (storagePath) {
      await supabase.storage.from("resumes").remove([storagePath]);
    }
  }

  // 6. Delete all resumes
  const { error: resumeDeleteError } = await supabase
    .from("resumes")
    .delete()
    .eq("user_id", user.id);

  if (resumeDeleteError) {
    return NextResponse.json({ error: resumeDeleteError.message }, { status: 500 });
  }

  // 7. Delete the auth user (requires service role key)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (serviceRoleKey && supabaseUrl) {
    const adminClient = createSupabaseClient(supabaseUrl, serviceRoleKey);
    const { error: adminError } = await adminClient.auth.admin.deleteUser(user.id);
    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/infrastructure/supabase/server";
import { SupabaseApplicationRepository } from "@/lib/infrastructure/repositories/supabase-application.repository";
import { ApplicationUseCases } from "@/lib/application/use-cases/application";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appRepo = new SupabaseApplicationRepository(supabase);
  const appUseCases = new ApplicationUseCases(appRepo);
  const application = await appUseCases.getApplicationById(id);

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (application.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: atsResult } = await supabase
    .from("ats_results")
    .select("overall_score")
    .eq("application_id", id)
    .maybeSingle();

  const { data: documents } = await supabase
    .from("generated_documents")
    .select("id, type, content, created_at")
    .eq("application_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    id: application.id,
    company: application.company,
    role: application.jobTitle,
    jobDescription: application.jobDescription,
    jobUrl: application.jobUrl,
    score: atsResult?.overall_score ?? 0,
    status: application.status,
    dateAdded: application.createdAt,
    documents: (documents ?? []).map((d) => ({
      id: d.id,
      type: d.type,
      content: d.content,
      createdAt: d.created_at,
    })),
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appRepo = new SupabaseApplicationRepository(supabase);
  const appUseCases = new ApplicationUseCases(appRepo);

  const existing = await appUseCases.getApplicationById(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { company, jobTitle, jobDescription, jobUrl, status } = body;

  const updated = await appUseCases.updateApplication(id, {
    company,
    jobTitle,
    jobDescription,
    jobUrl,
    status,
  });

  return NextResponse.json(updated);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { status } = body;

  if (!status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  const appRepo = new SupabaseApplicationRepository(supabase);
  const appUseCases = new ApplicationUseCases(appRepo);

  const existing = await appUseCases.getApplicationById(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await appUseCases.updateApplicationStatus(id, status);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appRepo = new SupabaseApplicationRepository(supabase);
  const appUseCases = new ApplicationUseCases(appRepo);

  const existing = await appUseCases.getApplicationById(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: atsError } = await supabase
    .from("ats_results")
    .delete()
    .eq("application_id", id);

  if (atsError) {
    return NextResponse.json({ error: atsError.message }, { status: 500 });
  }

  const { count: atsCount } = await supabase
    .from("ats_results")
    .select("*", { count: "exact", head: true })
    .eq("application_id", id);

  if (atsCount && atsCount > 0) {
    return NextResponse.json(
      {
        error:
          "Failed to delete ATS results — blocked by database permissions (RLS). " +
          'Add a DELETE policy for "ats_results" table in your Supabase dashboard.',
      },
      { status: 500 },
    );
  }

  const { error: docError } = await supabase
    .from("generated_documents")
    .delete()
    .eq("application_id", id);

  if (docError) {
    return NextResponse.json({ error: docError.message }, { status: 500 });
  }

  const { count: docCount } = await supabase
    .from("generated_documents")
    .select("*", { count: "exact", head: true })
    .eq("application_id", id);

  if (docCount && docCount > 0) {
    return NextResponse.json(
      {
        error:
          "Failed to delete generated documents — blocked by database permissions (RLS). " +
          'Add a DELETE policy for "generated_documents" table in your Supabase dashboard.',
      },
      { status: 500 },
    );
  }

  await appUseCases.deleteApplication(id);

  const { data: appCheck } = await supabase
    .from("applications")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (appCheck) {
    return NextResponse.json(
      {
        error:
          "Failed to delete application — blocked by database permissions (RLS). " +
          'Add a DELETE policy for "applications" table in your Supabase dashboard.',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/infrastructure/supabase/server";
import { SupabaseGeneratedDocumentRepository } from "@/lib/infrastructure/repositories/supabase-generated-document.repository";
import { GeneratedDocumentUseCases } from "@/lib/application/use-cases/generated-document";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repo = new SupabaseGeneratedDocumentRepository(supabase);
  const useCases = new GeneratedDocumentUseCases(repo);
  const documents = await useCases.getUserDocuments(user.id);

  if (documents.length === 0) {
    return NextResponse.json([]);
  }

  const appIds = [...new Set(documents.map((d) => d.applicationId))];

  const { data: applications } = await supabase
    .from("applications")
    .select("id, company, job_title")
    .in("id", appIds);

  const appMap = new Map(
    (applications ?? []).map((a) => [a.id, { company: a.company, jobTitle: a.job_title }]),
  );

  const enriched = documents.map((doc) => ({
    id: doc.id,
    type: doc.type,
    company: appMap.get(doc.applicationId)?.company ?? "",
    role: appMap.get(doc.applicationId)?.jobTitle ?? "",
    createdAt: doc.createdAt,
  }));

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { applicationId, type, content } = body;

  if (!applicationId || !type || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const repo = new SupabaseGeneratedDocumentRepository(supabase);
  const useCases = new GeneratedDocumentUseCases(repo);
  const doc = await useCases.saveDocument({ applicationId, type, content });

  return NextResponse.json(doc, { status: 201 });
}

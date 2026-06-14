import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/infrastructure/supabase/server";
import { SupabaseApplicationRepository } from "@/lib/infrastructure/repositories/supabase-application.repository";
import { SupabaseAtsResultRepository } from "@/lib/infrastructure/repositories/supabase-ats-result.repository";
import { ApplicationUseCases } from "@/lib/application/use-cases/application";
import { AtsResultUseCases } from "@/lib/application/use-cases/ats-result";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appRepo = new SupabaseApplicationRepository(supabase);
  const appUseCases = new ApplicationUseCases(appRepo);
  const applications = await appUseCases.getUserApplications(user.id);

  const { data: atsResults } = await supabase
    .from("ats_results")
    .select("application_id, overall_score")
    .in("application_id", applications.map((a) => a.id));

  const scoreMap = new Map(
    (atsResults ?? []).map((r) => [r.application_id, r.overall_score]),
  );

  const enriched = applications.map((app) => ({
    id: app.id,
    company: app.company,
    role: app.jobTitle,
    score: scoreMap.get(app.id) ?? 0,
    status: app.status,
    dateAdded: app.createdAt,
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
  const { company, jobTitle, jobDescription, jobUrl, resumeId, atsResult, parsedJd } = body;

  if (!company || !jobTitle || !jobDescription || !resumeId || !atsResult || !parsedJd) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const appRepo = new SupabaseApplicationRepository(supabase);
  const appUseCases = new ApplicationUseCases(appRepo);

  const application = await appUseCases.createApplication({
    userId: user.id,
    resumeId,
    company,
    jobTitle,
    jobDescription,
    jobUrl: jobUrl ?? null,
  });

  const atsRepo = new SupabaseAtsResultRepository(supabase);
  const atsUseCases = new AtsResultUseCases(atsRepo);

  await atsUseCases.createAtsResult({
    applicationId: application.id,
    overallScore: atsResult.overall_score,
    subscores: atsResult.subscores,
    matchedKeywords: atsResult.matched_keywords,
    missingKeywords: atsResult.missing_keywords,
    weakSections: atsResult.weak_sections,
    parsedJd,
    summary: atsResult.summary,
  });

  return NextResponse.json(application, { status: 201 });
}

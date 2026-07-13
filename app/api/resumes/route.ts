import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/infrastructure/supabase/server";
import { SupabaseResumeRepository } from "@/lib/infrastructure/repositories/supabase-resume.repository";
import { SupabaseApplicationRepository } from "@/lib/infrastructure/repositories/supabase-application.repository";
import { ResumeUseCases } from "@/lib/application/use-cases/resume";
import { randomUUID } from "crypto";

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

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repo = new SupabaseResumeRepository(supabase);
  const useCases = new ResumeUseCases(repo);
  const resumes = await useCases.getUserResumes(user.id);

  return NextResponse.json(resumes);
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File exceeds 5MB limit" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let parsedText: string | null = null;
  try {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    parsedText = text;
  } catch {
    // PDF parsing failed — save resume without extracted text
  }

  const storagePath = `${user.id}/${randomUUID()}.pdf`;
  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(storagePath, buffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (storageError) {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from("resumes")
    .getPublicUrl(storagePath);

  const repo = new SupabaseResumeRepository(supabase);
  const useCases = new ResumeUseCases(repo);
  const resume = await useCases.uploadResume(user.id, file.name, publicUrl, parsedText);

  return NextResponse.json(resume, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing resume ID" }, { status: 400 });
  }

  const repo = new SupabaseResumeRepository(supabase);
  const resume = await repo.findById(id);

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  if (resume.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const storagePath = getStoragePathFromUrl(resume.fileUrl);
  if (storagePath) {
    await supabase.storage.from("resumes").remove([storagePath]);
  }

  const appRepo = new SupabaseApplicationRepository(supabase);
  await appRepo.removeResumeReference(id);

  await repo.delete(id);

  return NextResponse.json({ success: true });
}

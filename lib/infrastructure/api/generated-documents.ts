import { apiPost } from "./client";
import type { DocType } from "@/lib/llm/generateDocument";

interface GenerateRequest {
  docType: DocType;
  name: string;
  jobTitle: string;
  company: string;
  keyResponsibilities: string[];
  matchedKeywords: string[];
  resumeSummary: string;
  userTone: string;
  applyInstructions?: string;
  providerId?: string;
}

interface SaveGeneratedDocRequest {
  applicationId: string;
  type: DocType;
  content: string;
}

export async function generateDocument(
  params: GenerateRequest,
): Promise<string> {
  const data = await apiPost<{ content: string }>(
    "/api/generate-document",
    params,
  );
  return data.content.replace(/^\n+/, "");
}

export async function saveGeneratedDocument(
  params: SaveGeneratedDocRequest,
): Promise<void> {
  await apiPost("/api/generated-documents", params);
}

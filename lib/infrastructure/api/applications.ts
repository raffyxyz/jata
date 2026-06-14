import { apiPost } from "./client";
import type { AtsScoreResult } from "@/lib/core/domain/entities/ats-score";
import type { ParsedJobData } from "./job-parser";

interface SaveApplicationRequest {
  company: string;
  jobTitle: string;
  jobUrl: string | null;
  jobDescription: string;
  resumeId: string;
  atsResult: AtsScoreResult;
  parsedJd: ParsedJobData;
}

interface ApplicationResponse {
  id: string;
}

export async function saveApplication(
  params: SaveApplicationRequest,
): Promise<ApplicationResponse> {
  return apiPost<ApplicationResponse>("/api/applications", params);
}

// Re-export other domain types used by the page
export type { ApplicationData } from "@/components/applications/ApplicationRow";

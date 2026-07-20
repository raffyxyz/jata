import { apiPost } from "./client";
import type { AtsScoreResult } from "@/lib/core/domain/entities/ats-score";

export async function getAtsScore(
  parsedJD: string,
  resumeText: string,
  providerId?: string,
): Promise<AtsScoreResult> {
  const data = await apiPost<{ content: string }>("/api/ats-score", {
    parsedJD,
    resumeText,
    providerId,
  });
  const raw = data.content;
  const cleaned = raw.replace(/```json\s*|\s*```/g, "");
  return JSON.parse(cleaned) as AtsScoreResult;
}

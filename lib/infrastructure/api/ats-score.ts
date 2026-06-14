import { apiPost } from "./client";
import type { AtsScoreResult } from "@/lib/core/domain/entities/ats-score";

interface AtsScoreResponse {
  result: {
    choices: { message: { content: string } }[];
  };
}

export async function getAtsScore(
  parsedJD: string,
  resumeText: string,
): Promise<AtsScoreResult> {
  const data = await apiPost<AtsScoreResponse>("/api/ats-score", {
    parsedJD,
    resumeText,
  });
  const raw = data.result.choices[0].message.content;
  const cleaned = raw.replace(/```json\s*|\s*```/g, "");
  return JSON.parse(cleaned) as AtsScoreResult;
}

import { apiPost } from "./client";

export interface ParsedJobData {
  job_title: string;
  seniority_level: string;
  required_skills: string[];
  preferred_skills: string[];
  required_experience_years: number | null;
  education_requirements: string | null;
  key_responsibilities: string[];
  industry_keywords: string[];
  red_flags: string[];
  apply_instructions: string | null;
}

export interface ParseJobResult {
  parsed: ParsedJobData;
  raw: string;
}

export async function parseJob(
  jobDescription: string,
  providerId?: string,
): Promise<ParseJobResult> {
  const data = await apiPost<{ content: string }>("/api/parse-job", {
    jobDescription,
    providerId,
  });
  const raw = data.content;
  const cleaned = raw.replace(/```json\s*|\s*```/g, "");
  const parsed = JSON.parse(cleaned) as ParsedJobData;
  return { parsed, raw };
}

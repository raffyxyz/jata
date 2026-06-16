import { apiPost } from "./client";

export interface ParseJobResponse {
  result: {
    choices: { message: { content: string } }[];
  };
}

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
): Promise<ParseJobResult> {
  const data = await apiPost<ParseJobResponse>("/api/parse-job", {
    jobDescription,
  });
  const raw = data.result.choices[0].message.content;
  const cleaned = raw.replace(/```json\s*|\s*```/g, "");
  const parsed = JSON.parse(cleaned) as ParsedJobData;
  return { parsed, raw };
}

import { apiGet } from "./client";

export interface ResumeItem {
  id: string;
  name: string | null;
  fileUrl: string;
  parsedText: string | null;
  createdAt: string;
}

export async function fetchResumes(): Promise<ResumeItem[]> {
  return apiGet<ResumeItem[]>("/api/resumes");
}

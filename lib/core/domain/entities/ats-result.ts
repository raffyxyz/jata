export interface AtsResult {
  id: string;
  applicationId: string;
  overallScore: number;
  subscores: {
    keyword_match: number;
    skills_alignment: number;
    experience_relevance: number;
    formatting_ats_safety: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  weakSections: {
    section: string;
    issue: string;
    severity: "low" | "medium" | "high";
  }[];
  parsedJd: Record<string, unknown>;
  summary: string;
  createdAt: string;
}

export interface WeakSection {
  section: string;
  issue: string;
  severity: "low" | "medium" | "high";
}

export interface AtsScoreResult {
  overall_score: number;
  subscores: {
    keyword_match: number;
    skills_alignment: number;
    experience_relevance: number;
    formatting_ats_safety: number;
  };
  matched_keywords: string[];
  missing_keywords: string[];
  matched_skills: string[];
  missing_skills: string[];
  weak_sections: WeakSection[];
  summary: string;
}

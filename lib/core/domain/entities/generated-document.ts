export type DocType = "cover_letter" | "cold_email" | "linkedin_dm" | "freelance_proposal" | "apply_instructions";

export interface GeneratedDocument {
  id: string;
  applicationId: string;
  type: DocType;
  content: string;
  createdAt: string;
}

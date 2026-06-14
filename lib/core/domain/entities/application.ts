export type ApplicationStatus = "draft" | "applied" | "interview" | "offer" | "rejected";

export interface Application {
  id: string;
  userId: string;
  resumeId: string;
  company: string;
  jobTitle: string;
  jobDescription: string;
  jobUrl: string | null;
  status: ApplicationStatus;
  createdAt: string;
}

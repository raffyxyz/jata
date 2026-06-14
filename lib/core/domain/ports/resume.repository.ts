import type { Resume } from "@/lib/core/domain/entities/resume";

export interface ResumeRepository {
  findByUserId(userId: string): Promise<Resume[]>;
  findById(id: string): Promise<Resume | null>;
  create(data: {
    userId: string;
    name: string | null;
    fileUrl: string;
    parsedText: string | null;
  }): Promise<Resume>;
  delete(id: string): Promise<void>;
}

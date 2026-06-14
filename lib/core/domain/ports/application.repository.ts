import type { Application } from "@/lib/core/domain/entities/application";

export interface ApplicationRepository {
  findByUserId(userId: string): Promise<Application[]>;
  findById(id: string): Promise<Application | null>;
  create(data: {
    userId: string;
    resumeId: string;
    company: string;
    jobTitle: string;
    jobDescription: string;
    jobUrl: string | null;
    status: string;
  }): Promise<Application>;
  update(
    id: string,
    data: Partial<{
      company: string;
      jobTitle: string;
      jobDescription: string;
      jobUrl: string | null;
      status: string;
    }>,
  ): Promise<Application>;
  updateStatus(id: string, status: string): Promise<Application>;
  delete(id: string): Promise<void>;
}

import type { ApplicationRepository } from "@/lib/core/domain/ports/application.repository";
import type { Application } from "@/lib/core/domain/entities/application";

export class ApplicationUseCases {
  constructor(private readonly repository: ApplicationRepository) {}

  async getUserApplications(userId: string): Promise<Application[]> {
    return this.repository.findByUserId(userId);
  }

  async getApplicationById(id: string): Promise<Application | null> {
    return this.repository.findById(id);
  }

  async createApplication(data: {
    userId: string;
    resumeId: string;
    company: string;
    jobTitle: string;
    jobDescription: string;
    jobUrl: string | null;
  }): Promise<Application> {
    return this.repository.create({
      ...data,
      status: "applied",
    });
  }

  async updateApplication(
    id: string,
    data: Partial<{
      company: string;
      jobTitle: string;
      jobDescription: string;
      jobUrl: string | null;
      status: string;
    }>,
  ): Promise<Application> {
    return this.repository.update(id, data);
  }

  async updateApplicationStatus(id: string, status: string): Promise<Application> {
    return this.repository.updateStatus(id, status);
  }

  async deleteApplication(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

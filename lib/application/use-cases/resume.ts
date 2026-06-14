import type { ResumeRepository } from "@/lib/core/domain/ports/resume.repository";
import type { Resume } from "@/lib/core/domain/entities/resume";

export class ResumeUseCases {
  constructor(private readonly repository: ResumeRepository) {}

  async getUserResumes(userId: string): Promise<Resume[]> {
    return this.repository.findByUserId(userId);
  }

  async uploadResume(
    userId: string,
    name: string | null,
    fileUrl: string,
    parsedText: string | null
  ): Promise<Resume> {
    return this.repository.create({ userId, name, fileUrl, parsedText });
  }

  async deleteResume(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

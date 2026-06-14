import type { AtsResultRepository } from "@/lib/core/domain/ports/ats-result.repository";
import type { AtsResult } from "@/lib/core/domain/entities/ats-result";

export class AtsResultUseCases {
  constructor(private readonly repository: AtsResultRepository) {}

  async createAtsResult(data: {
    applicationId: string;
    overallScore: number;
    subscores: Record<string, unknown>;
    matchedKeywords: string[];
    missingKeywords: string[];
    weakSections: Record<string, unknown>[];
    parsedJd: Record<string, unknown>;
    summary: string;
  }): Promise<AtsResult> {
    return this.repository.create(data);
  }
}

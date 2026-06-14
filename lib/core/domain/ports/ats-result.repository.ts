import type { AtsResult } from "@/lib/core/domain/entities/ats-result";

export interface AtsResultRepository {
  findByApplicationId(applicationId: string): Promise<AtsResult | null>;
  create(data: {
    applicationId: string;
    overallScore: number;
    subscores: Record<string, unknown>;
    matchedKeywords: string[];
    missingKeywords: string[];
    weakSections: Record<string, unknown>[];
    parsedJd: Record<string, unknown>;
    summary: string;
  }): Promise<AtsResult>;
}

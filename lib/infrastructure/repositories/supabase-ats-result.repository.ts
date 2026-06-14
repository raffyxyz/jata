import type { AtsResultRepository } from "@/lib/core/domain/ports/ats-result.repository";
import type { AtsResult } from "@/lib/core/domain/entities/ats-result";
import type { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseAtsResultRepository implements AtsResultRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findByApplicationId(applicationId: string): Promise<AtsResult | null> {
    const { data, error } = await this.client
      .from("ats_results")
      .select("*")
      .eq("application_id", applicationId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(error.message);
    }
    return mapAtsResult(data);
  }

  async create(data: {
    applicationId: string;
    overallScore: number;
    subscores: Record<string, unknown>;
    matchedKeywords: string[];
    missingKeywords: string[];
    weakSections: Record<string, unknown>[];
    parsedJd: Record<string, unknown>;
    summary: string;
  }): Promise<AtsResult> {
    const { data: result, error } = await this.client
      .from("ats_results")
      .insert({
        application_id: data.applicationId,
        overall_score: data.overallScore,
        subscores: data.subscores,
        matched_keywords: data.matchedKeywords,
        missing_keywords: data.missingKeywords,
        weak_sections: data.weakSections,
        parsed_jd: data.parsedJd,
        summary: data.summary,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapAtsResult(result);
  }
}

function mapAtsResult(data: Record<string, unknown>): AtsResult {
  return {
    id: data.id as string,
    applicationId: data.application_id as string,
    overallScore: data.overall_score as number,
    subscores: data.subscores as AtsResult["subscores"],
    matchedKeywords: data.matched_keywords as string[],
    missingKeywords: data.missing_keywords as string[],
    weakSections: data.weak_sections as AtsResult["weakSections"],
    parsedJd: data.parsed_jd as Record<string, unknown>,
    summary: data.summary as string,
    createdAt: data.created_at as string,
  };
}

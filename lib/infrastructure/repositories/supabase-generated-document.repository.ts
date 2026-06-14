import type { GeneratedDocumentRepository } from "@/lib/core/domain/ports/generated-document.repository";
import type { GeneratedDocument } from "@/lib/core/domain/entities/generated-document";
import type { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseGeneratedDocumentRepository implements GeneratedDocumentRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findByApplicationId(applicationId: string): Promise<GeneratedDocument[]> {
    const { data, error } = await this.client
      .from("generated_documents")
      .select("*")
      .eq("application_id", applicationId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapGeneratedDocument);
  }

  async findByUserId(userId: string): Promise<GeneratedDocument[]> {
    const { data: appIds } = await this.client
      .from("applications")
      .select("id")
      .eq("user_id", userId);

    const ids = (appIds ?? []).map((a) => a.id);
    if (ids.length === 0) return [];

    const { data, error } = await this.client
      .from("generated_documents")
      .select("*")
      .in("application_id", ids)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapGeneratedDocument);
  }

  async create(data: {
    applicationId: string;
    type: string;
    content: string;
  }): Promise<GeneratedDocument> {
    const { data: doc, error } = await this.client
      .from("generated_documents")
      .insert({
        application_id: data.applicationId,
        type: data.type,
        content: data.content,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapGeneratedDocument(doc);
  }
}

function mapGeneratedDocument(data: Record<string, unknown>): GeneratedDocument {
  return {
    id: data.id as string,
    applicationId: data.application_id as string,
    type: data.type as GeneratedDocument["type"],
    content: data.content as string,
    createdAt: data.created_at as string,
  };
}

import type { ResumeRepository } from "@/lib/core/domain/ports/resume.repository";
import type { Resume } from "@/lib/core/domain/entities/resume";
import type { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseResumeRepository implements ResumeRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findByUserId(userId: string): Promise<Resume[]> {
    const { data, error } = await this.client
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapResume);
  }

  async findById(id: string): Promise<Resume | null> {
    const { data, error } = await this.client
      .from("resumes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(error.message);
    }
    return mapResume(data);
  }

  async create(data: {
    userId: string;
    name: string | null;
    fileUrl: string;
    parsedText: string | null;
  }): Promise<Resume> {
    const { data: resume, error } = await this.client
      .from("resumes")
      .insert({
        user_id: data.userId,
        name: data.name,
        file_url: data.fileUrl,
        parsed_text: data.parsedText,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapResume(resume);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from("resumes").delete().eq("id", id);

    if (error) throw new Error(error.message);
  }
}

function mapResume(data: Record<string, unknown>): Resume {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    name: data.name as string | null,
    fileUrl: data.file_url as string,
    parsedText: data.parsed_text as string | null,
    createdAt: data.created_at as string,
  };
}

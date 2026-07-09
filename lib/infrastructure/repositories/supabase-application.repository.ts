import type { ApplicationRepository } from "@/lib/core/domain/ports/application.repository";
import type { Application } from "@/lib/core/domain/entities/application";
import type { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseApplicationRepository implements ApplicationRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findByUserId(userId: string): Promise<Application[]> {
    const { data, error } = await this.client
      .from("applications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapApplication);
  }

  async findById(id: string): Promise<Application | null> {
    const { data, error } = await this.client
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(error.message);
    }
    return mapApplication(data);
  }

  async create(data: {
    userId: string;
    resumeId: string;
    company: string;
    jobTitle: string;
    jobDescription: string;
    jobUrl: string | null;
    status: string;
  }): Promise<Application> {
    const { data: application, error } = await this.client
      .from("applications")
      .insert({
        user_id: data.userId,
        resume_id: data.resumeId,
        company: data.company,
        job_title: data.jobTitle,
        job_description: data.jobDescription,
        job_url: data.jobUrl,
        status: data.status,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapApplication(application);
  }

  async update(
    id: string,
    data: Partial<{
      company: string;
      jobTitle: string;
      jobDescription: string;
      jobUrl: string | null;
      status: string;
    }>,
  ): Promise<Application> {
    const payload: Record<string, unknown> = {};
    if (data.company !== undefined) payload.company = data.company;
    if (data.jobTitle !== undefined) payload.job_title = data.jobTitle;
    if (data.jobDescription !== undefined) payload.job_description = data.jobDescription;
    if (data.jobUrl !== undefined) payload.job_url = data.jobUrl;
    if (data.status !== undefined) payload.status = data.status;

    const { error } = await this.client
      .from("applications")
      .update(payload)
      .eq("id", id);

    if (error) throw new Error(error.message);

    const { data: updated, error: fetchError } = await this.client
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") throw new Error("Application not found");
      throw new Error(fetchError.message);
    }
    return mapApplication(updated);
  }

  async updateStatus(id: string, status: string): Promise<Application> {
    const { error } = await this.client
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) throw new Error(error.message);

    const { data: updated, error: fetchError } = await this.client
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") throw new Error("Application not found");
      throw new Error(fetchError.message);
    }

    const mapped = mapApplication(updated);
    if (mapped.status !== status) {
      throw new Error(
        "Failed to update application status — the database rejected the change. " +
          "This is usually caused by Row-Level Security (RLS) policies in Supabase. " +
          'Make sure your "applications" table has an UPDATE policy for authenticated users.',
      );
    }

    return mapped;
  }

  async removeResumeReference(resumeId: string): Promise<void> {
    const { error } = await this.client
      .from("applications")
      .update({ resume_id: null })
      .eq("resume_id", resumeId);

    if (error) throw new Error(error.message);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    const { data: check } = await this.client
      .from("applications")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (check) {
      throw new Error(
        "Failed to delete application — blocked by database permissions (RLS). " +
          'Add a DELETE policy for "applications" table in your Supabase dashboard.',
      );
    }
  }
}

function mapApplication(data: Record<string, unknown>): Application {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    resumeId: data.resume_id as string | null,
    company: data.company as string,
    jobTitle: data.job_title as string,
    jobDescription: data.job_description as string,
    jobUrl: data.job_url as string | null,
    status: data.status as Application["status"],
    createdAt: data.created_at as string,
  };
}

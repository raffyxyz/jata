CREATE TABLE "public"."applications" (
  "id"              uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"         uuid                     NOT NULL,
  "resume_id"       uuid,
  "company"         text,
  "job_title"       text,
  "job_description" text,
  "job_url"         text,
  "status"          text                     DEFAULT 'draft'::text,
  "created_at"      timestamp with time zone DEFAULT now(),
  CONSTRAINT "applications_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."applications"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."ats_results" (
  "id"               uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "application_id"   uuid,
  "overall_score"    integer,
  "subscores"        jsonb,
  "matched_keywords" text[],
  "missing_keywords" text[],
  "weak_sections"    jsonb,
  "parsed_jd"        jsonb,
  "summary"          text,
  "created_at"       timestamp with time zone DEFAULT now(),
  CONSTRAINT "ats_results_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."ats_results"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."generated_documents" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "application_id" uuid,
  "type"           text,
  "content"        text,
  "created_at"     timestamp with time zone DEFAULT now(),
  CONSTRAINT "generated_documents_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."generated_documents"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."resumes" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     uuid                     NOT NULL,
  "name"        text,
  "file_url"    text,
  "parsed_text" text,
  "created_at"  timestamp with time zone DEFAULT now(),
  CONSTRAINT "resumes_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."resumes"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."applications"
  ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE "public"."ats_results"
  ADD CONSTRAINT "ats_results_application_id_fkey" FOREIGN KEY (application_id) REFERENCES public.applications(id);

ALTER TABLE "public"."generated_documents"
  ADD CONSTRAINT "generated_documents_application_id_fkey" FOREIGN KEY (application_id) REFERENCES public.applications(id);

ALTER TABLE "public"."applications"
  ADD CONSTRAINT "applications_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES public.resumes(id);

ALTER TABLE "public"."resumes"
  ADD CONSTRAINT "resumes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id);

CREATE POLICY "Users can delete own applications" ON "public"."applications"
  FOR DELETE
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can insert their own applications" ON "public"."applications"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users can update own applications" ON "public"."applications"
  FOR UPDATE
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can update their own applications" ON "public"."applications"
  FOR UPDATE
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can view their own applications" ON "public"."applications"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can delete ats_results of own applications" ON "public"."ats_results"
  FOR DELETE
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.applications
  WHERE ((applications.id = ats_results.application_id) AND (applications.user_id = auth.uid())))));

CREATE POLICY "Users can insert ats_results" ON "public"."ats_results"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((auth.uid() = ( SELECT applications.user_id
   FROM public.applications
  WHERE (applications.id = ats_results.application_id))));

CREATE POLICY "Users can view their ats_results" ON "public"."ats_results"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() = ( SELECT applications.user_id
   FROM public.applications
  WHERE (applications.id = ats_results.application_id))));

CREATE POLICY "Users can delete generated_documents of own applications" ON "public"."generated_documents"
  FOR DELETE
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.applications
  WHERE ((applications.id = generated_documents.application_id) AND (applications.user_id = auth.uid())))));

CREATE POLICY "Users can insert generated_documents" ON "public"."generated_documents"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((auth.uid() = ( SELECT applications.user_id
   FROM public.applications
  WHERE (applications.id = generated_documents.application_id))));

CREATE POLICY "Users can view their generated_documents" ON "public"."generated_documents"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() = ( SELECT applications.user_id
   FROM public.applications
  WHERE (applications.id = generated_documents.application_id))));

CREATE POLICY "Users can delete own resumes" ON "public"."resumes"
  FOR DELETE
  TO "authenticated"
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can insert own resumes" ON "public"."resumes"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users can view own resumes" ON "public"."resumes"
  FOR SELECT
  TO "authenticated"
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can delete own resume files" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING (((bucket_id = 'resumes'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));

CREATE POLICY "Users can upload own resume files" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((bucket_id = 'resumes'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));

CREATE POLICY "Users can view own resume files" ON "storage"."objects"
  FOR SELECT
  TO "authenticated"
  USING (((bucket_id = 'resumes'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."applications" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."applications" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."applications" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."applications" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."ats_results" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."ats_results" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."ats_results" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."ats_results" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."generated_documents" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."generated_documents" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."generated_documents" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."generated_documents" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."resumes" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."resumes" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."resumes" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."resumes" TO "service_role";


import { getProviderById } from "@/lib/llm/provider";

const ATS_SCORE_PROMPT = `
You are an ATS (Applicant Tracking System) scanner and senior recruiter.
You have already analyzed the job description. Now score this resume against it.
Return ONLY a valid JSON object.

{
  "overall_score": number,
  "subscores": {
    "keyword_match": number,
    "skills_alignment": number,
    "experience_relevance": number,
    "formatting_ats_safety": number
  },
  "matched_keywords": ["string"],
  "missing_keywords": ["string"],
  "matched_skills": ["string"],
  "missing_skills": ["string"],
  "weak_sections": [
    {
      "section": "string",
      "issue": "string",
      "severity": "low | medium | high"
    }
  ],
  "summary": "string"
}
`;

export async function POST(request: Request) {
  const { parsedJD, resumeText, providerId } = await request.json();

  const provider = getProviderById(providerId ?? "cloudflare");

  const content = await provider.chat([
    {
      role: "system",
      content: `${ATS_SCORE_PROMPT}\n\nJob analysis: ${parsedJD}\nResume text: ${resumeText}`,
    },
    {
      role: "user",
      content: "Score this resume against the job description.",
    },
  ]);

  return Response.json({ content });
}

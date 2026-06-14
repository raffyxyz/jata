const CF_API = "https://api.cloudflare.com/client/v4/accounts";

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
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return Response.json(
      { error: "Cloudflare credentials not configured" },
      { status: 500 }
    );
  }

  const { parsedJD, resumeText } = await request.json();

  const res = await fetch(
    `${CF_API}/${accountId}/ai/run/@cf/google/gemma-4-26b-a4b-it`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `${ATS_SCORE_PROMPT}\n\nJob analysis: ${parsedJD}\nResume text: ${resumeText}`,
          },
          {
            role: "user",
            content: "Score this resume against the job description.",
          },
        ],
      }),
    }
  );

  const data = await res.json();
  return Response.json(data);
}

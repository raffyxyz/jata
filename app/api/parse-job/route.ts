const CF_API = "https://api.cloudflare.com/client/v4/accounts";

const JD_PARSE_PROMPT = `
You are an expert recruiter. Analyze this job description and extract the following.
Return ONLY a valid JSON object with no markdown or preamble.

{
  "job_title": "string",
  "seniority_level": "junior | mid | senior | lead | manager",
  "required_skills": ["string"],
  "preferred_skills": ["string"],
  "required_experience_years": number | null,
  "education_requirements": "string | null",
  "key_responsibilities": ["string"],
  "industry_keywords": ["string"],
  "red_flags": ["string"]
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

  const { jobDescription } = await request.json();

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
          { role: "system", content: JD_PARSE_PROMPT },
          { role: "user", content: jobDescription },
        ],
      }),
    }
  );

  const data = await res.json();
  return Response.json(data);
}

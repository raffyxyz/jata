import { getProviderById } from "@/lib/llm/provider";

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
  "red_flags": ["string"],
  "apply_instructions": "string | null"
}

For "apply_instructions", look for a section titled "How to apply" or instructions on what to send (e.g. links, specific information, format requirements). Include the full text of those instructions. Set to null if no specific apply instructions exist.
`;

export async function POST(request: Request) {
  const { jobDescription, providerId } = await request.json();

  const provider = getProviderById(providerId ?? "cloudflare");

  const content = await provider.chat([
    { role: "system", content: JD_PARSE_PROMPT },
    { role: "user", content: jobDescription },
  ]);

  return Response.json({ content });
}

export type DocType = "cover_letter" | "cold_email" | "linkedin_dm" | "freelance_proposal";

export interface GenerateDocumentInput {
  docType: DocType;
  name: string;
  jobTitle: string;
  company: string;
  keyResponsibilities: string[];
  matchedKeywords: string[];
  resumeSummary: string;
  userTone: string;
}

const DOCUMENT_PROMPTS: Record<DocType, string> = {
  cover_letter: `
You are an expert career coach writing on behalf of a job applicant.
Write a compelling cover letter that:
- Opens with a specific hook tied to the company or role (not "I am writing to apply")
- Highlights the 2-3 resume experiences most relevant to these responsibilities: {key_responsibilities}
- Naturally uses these keywords without keyword stuffing: {matched_keywords}
- Matches this tone: {user_tone}
- Is 3 short paragraphs. No filler. No clichés.

Applicant name: {name}
Target role: {job_title} at {company}
Resume summary: {resume_summary}
`,

  cold_email: `
You are an expert career coach writing on behalf of a job applicant.
Write a cold outreach email to a recruiter or hiring manager for this role.
- Subject line that gets opened (specific, not generic)
- Under 150 words in the body
- One specific reason based on this resume summary: {resume_summary}
- Naturally references these strengths: {matched_keywords}
- Clear CTA: a 20-minute call
- Tone: {user_tone}

Applicant name: {name}
Target role: {job_title} at {company}
Key responsibilities of the role: {key_responsibilities}
`,

  linkedin_dm: `
You are an expert career coach writing on behalf of a job applicant.
Write a LinkedIn connection message (under 300 characters) to a recruiter at {company}.
- Mention the {job_title} role
- One line on why the applicant fits, referencing: {resume_summary}
- No desperation

Applicant name: {name}
`,

  freelance_proposal: `
You are an expert career coach writing on behalf of a job applicant.
Write a project proposal for this freelance or contract role.
- Brief summary of the applicant's relevant experience: {resume_summary}
- Proposed approach to these responsibilities: {key_responsibilities}
- Estimated timeline or availability
- Rate range (if provided, otherwise omit)
- Professional but warm tone: {user_tone}

Applicant name: {name}
Target role: {job_title}
`,
};

function interpolatePrompt(template: string, input: GenerateDocumentInput): string {
  return template
    .replace(/{name}/g, input.name)
    .replace(/{job_title}/g, input.jobTitle)
    .replace(/{company}/g, input.company)
    .replace(/{key_responsibilities}/g, input.keyResponsibilities.join(", "))
    .replace(/{matched_keywords}/g, input.matchedKeywords.join(", "))
    .replace(/{resume_summary}/g, input.resumeSummary)
    .replace(/{user_tone}/g, input.userTone);
}

export function buildDocumentPrompt(input: GenerateDocumentInput): string {
  const template = DOCUMENT_PROMPTS[input.docType];
  return interpolatePrompt(template, input);
}

import { buildDocumentPrompt } from "@/lib/llm/generateDocument";
import type { GenerateDocumentInput } from "@/lib/llm/generateDocument";

const CF_API = "https://api.cloudflare.com/client/v4/accounts";

export async function POST(request: Request) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return Response.json(
      { error: "Cloudflare credentials not configured" },
      { status: 500 }
    );
  }

  const input: GenerateDocumentInput = await request.json();

  const prompt = buildDocumentPrompt(input);

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
          { role: "system", content: prompt },
          { role: "user", content: input.docType === "apply_instructions" ? "Write the application following the instructions above." : `Write a ${input.docType.replace("_", " ")} based on the instructions above.` },
        ],
      }),
    }
  );

  const data = await res.json();
  return Response.json(data);
}

import { buildDocumentPrompt } from "@/lib/llm/generateDocument";
import type { GenerateDocumentInput } from "@/lib/llm/generateDocument";
import { getProviderById } from "@/lib/llm/provider";

export async function POST(request: Request) {
  const input: GenerateDocumentInput & { providerId?: string } =
    await request.json();

  const provider = getProviderById(input.providerId ?? "cloudflare");

  const prompt = buildDocumentPrompt(input);

  const content = await provider.chat([
    { role: "system", content: prompt },
    {
      role: "user",
      content:
        input.docType === "apply_instructions"
          ? "Write the application following the instructions above."
          : `Write a ${input.docType.replace("_", " ")} based on the instructions above.`,
    },
  ]);

  return Response.json({ content });
}

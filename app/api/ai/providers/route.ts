import { getAvailableProviders } from "@/lib/llm/provider";

export async function GET() {
  const providers = getAvailableProviders().map((p) => ({
    id: p.id,
    name: p.name,
  }));

  return Response.json({ providers });
}

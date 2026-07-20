import { useQuery } from "@tanstack/react-query";

interface AiProviderInfo {
  id: string;
  name: string;
}

async function fetchProviders(): Promise<AiProviderInfo[]> {
  const res = await fetch("/api/ai/providers");
  if (!res.ok) throw new Error("Failed to fetch AI providers");
  const data = await res.json();
  return data.providers;
}

export function useAiProviders() {
  return useQuery({
    queryKey: ["ai-providers"],
    queryFn: fetchProviders,
    staleTime: 60_000,
  });
}

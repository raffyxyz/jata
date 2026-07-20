import type { AiProvider } from "./types";
import { CloudflareAiProvider } from "./providers/cloudflare";

const PROVIDERS: AiProvider[] = [
  new CloudflareAiProvider(),
];

export function getAvailableProviders(): AiProvider[] {
  return PROVIDERS.filter((p) => p.isConfigured());
}

export function getProviderById(id: string): AiProvider {
  const provider = PROVIDERS.find((p) => p.id === id);
  if (!provider) {
    throw new Error(`Unknown AI provider: ${id}`);
  }
  if (!provider.isConfigured()) {
    throw new Error(`AI provider "${provider.name}" is not configured`);
  }
  return provider;
}

export function getDefaultProvider(): AiProvider {
  const available = getAvailableProviders();
  if (available.length === 0) {
    throw new Error("No AI providers are configured");
  }
  return available[0];
}

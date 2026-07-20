import type { AiProvider, AiChatMessage } from "../types";

const CF_API = "https://api.cloudflare.com/client/v4/accounts";
const MODEL = "@cf/google/gemma-4-26b-a4b-it";

export class CloudflareAiProvider implements AiProvider {
  readonly id = "cloudflare";
  readonly name = "Cloudflare Workers AI";

  isConfigured(): boolean {
    return !!(
      process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_WORKERS_TOKEN
    );
  }

  async chat(messages: AiChatMessage[]): Promise<string> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_WORKERS_TOKEN;

    if (!accountId || !apiToken) {
      throw new Error("Cloudflare credentials not configured");
    }

    const res = await fetch(`${CF_API}/${accountId}/ai/run/${MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cloudflare AI request failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    return data.result.choices[0].message.content;
  }
}

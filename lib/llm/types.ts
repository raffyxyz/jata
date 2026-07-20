export interface AiChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiProvider {
  readonly id: string;
  readonly name: string;

  isConfigured(): boolean;
  chat(messages: AiChatMessage[]): Promise<string>;
}

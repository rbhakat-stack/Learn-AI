/**
 * Provider-agnostic AI abstraction.
 *
 * Goal: keep route handlers and server components free of vendor-specific code so
 * we can swap providers (or route across them with LiteLLM) without code changes.
 *
 * Implementations are intentionally minimal — extend with streaming, tool use,
 * structured outputs, and prompt caching as needs grow.
 */

export type Provider = "openai" | "anthropic" | "gemini" | "ollama";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  provider?: Provider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResult {
  text: string;
  provider: Provider;
  model: string;
  usage?: { inputTokens: number; outputTokens: number };
}

/**
 * Resolve the default provider for the current environment.
 * Prefers Anthropic when ANTHROPIC_API_KEY is set, then OpenAI, then Ollama.
 */
export function resolveDefaultProvider(): Provider {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GOOGLE_GENAI_API_KEY) return "gemini";
  return "ollama";
}

/**
 * Single entry point for chat completions. Each provider call is isolated so a
 * caller never needs to know which SDK is in play.
 */
export async function chat(
  messages: ChatMessage[],
  opts: ChatOptions = {}
): Promise<ChatResult> {
  const provider = opts.provider ?? resolveDefaultProvider();
  switch (provider) {
    case "anthropic":
      return chatAnthropic(messages, opts);
    case "openai":
      return chatOpenAI(messages, opts);
    case "gemini":
      return chatGemini(messages, opts);
    case "ollama":
      return chatOllama(messages, opts);
  }
}

async function chatAnthropic(
  messages: ChatMessage[],
  opts: ChatOptions
): Promise<ChatResult> {
  const model = opts.model ?? "claude-opus-4-7";
  const system = messages.find((m) => m.role === "system")?.content;
  const userAssistant = messages.filter((m) => m.role !== "system");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      max_tokens: opts.maxTokens ?? 1024,
      temperature: opts.temperature ?? 0.2,
      system,
      messages: userAssistant.map((m) => ({
        role: m.role,
        content: [{ type: "text", text: m.content }]
      }))
    })
  });
  if (!res.ok) throw new Error(`Anthropic error ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as {
    content: Array<{ type: string; text?: string }>;
    usage?: { input_tokens?: number; output_tokens?: number };
  };
  const text = data.content.map((c) => c.text ?? "").join("");
  return {
    text,
    provider: "anthropic",
    model,
    usage: {
      inputTokens: data.usage?.input_tokens ?? 0,
      outputTokens: data.usage?.output_tokens ?? 0
    }
  };
}

async function chatOpenAI(
  messages: ChatMessage[],
  opts: ChatOptions
): Promise<ChatResult> {
  const model = opts.model ?? "gpt-5";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: opts.temperature ?? 0.2,
      max_tokens: opts.maxTokens ?? 1024
    })
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  return {
    text: data.choices[0]?.message.content ?? "",
    provider: "openai",
    model,
    usage: {
      inputTokens: data.usage?.prompt_tokens ?? 0,
      outputTokens: data.usage?.completion_tokens ?? 0
    }
  };
}

async function chatGemini(
  messages: ChatMessage[],
  opts: ChatOptions
): Promise<ChatResult> {
  const model = opts.model ?? "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_GENAI_API_KEY ?? ""}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      systemInstruction: messages.find((m) => m.role === "system")
        ? { parts: [{ text: messages.find((m) => m.role === "system")!.content }] }
        : undefined,
      generationConfig: {
        temperature: opts.temperature ?? 0.2,
        maxOutputTokens: opts.maxTokens ?? 1024
      }
    })
  });
  if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  return { text, provider: "gemini", model };
}

async function chatOllama(
  messages: ChatMessage[],
  opts: ChatOptions
): Promise<ChatResult> {
  const model = opts.model ?? "llama3.1";
  const host = process.env.OLLAMA_HOST ?? "http://localhost:11434";
  const res = await fetch(`${host}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      options: { temperature: opts.temperature ?? 0.2 },
      stream: false
    })
  });
  if (!res.ok) throw new Error(`Ollama error ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { message?: { content?: string } };
  return { text: data.message?.content ?? "", provider: "ollama", model };
}

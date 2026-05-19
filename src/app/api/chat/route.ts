import { NextResponse } from "next/server";
import { z } from "zod";
import { chat } from "@/lib/ai/provider";

const Body = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant"]),
      content: z.string()
    })
  ),
  provider: z.enum(["openai", "anthropic", "gemini", "ollama"]).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional()
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  try {
    const result = await chat(parsed.data.messages, parsed.data);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

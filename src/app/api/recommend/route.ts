import { NextResponse } from "next/server";
import { z } from "zod";
import { TOOLS } from "@/data/tools";
import type { Tool } from "@/types";

/**
 * Lightweight recommender that scores tools against a free-text intent.
 *
 * This is intentionally explainable and offline-friendly. Swap to embedding-
 * based similarity (Supabase pgvector) when the catalog grows past ~500 items.
 */
const Body = z.object({
  intent: z.string().min(3),
  excludeSlugs: z.array(z.string()).optional(),
  limit: z.number().min(1).max(20).optional()
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  const { intent, excludeSlugs = [], limit = 6 } = parsed.data;

  const terms = intent
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);

  const scored = TOOLS.filter((t) => !excludeSlugs.includes(t.slug)).map((t) => ({
    tool: t,
    score: scoreTool(t, terms)
  }));

  scored.sort((a, b) => b.score - a.score);
  return NextResponse.json({
    intent,
    results: scored.slice(0, limit).map(({ tool, score }) => ({
      slug: tool.slug,
      name: tool.name,
      category: tool.category,
      tagline: tool.tagline,
      score: Math.round(score * 100) / 100
    }))
  });
}

function scoreTool(t: Tool, terms: string[]) {
  if (!terms.length) return 0;
  const haystack = [
    t.name,
    t.tagline,
    t.description,
    ...t.tags,
    ...t.capabilities,
    ...t.useCases,
    t.category
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const term of terms) {
    if (haystack.includes(term)) score += 1;
    if (t.tags.includes(term)) score += 0.5;
    if (t.name.toLowerCase().includes(term)) score += 1.5;
  }
  if (t.trending) score += 0.4;
  if (t.maturity === "enterprise-grade") score += 0.3;
  if (t.maturity === "production-ready") score += 0.2;
  return score;
}

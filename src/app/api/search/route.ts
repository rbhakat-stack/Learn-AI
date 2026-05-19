import { NextResponse } from "next/server";
import { TOOLS } from "@/data/tools";
import { PATTERNS } from "@/data/patterns";
import { PROJECTS } from "@/data/projects";

/**
 * Cross-module semantic-ish search. Returns hits across tools, patterns, and
 * projects with light scoring. Wire to embeddings later by replacing the score
 * function with a pgvector RPC call.
 */
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").toLowerCase().trim();
  if (!q) return NextResponse.json({ results: [] });

  const hits = [
    ...TOOLS.map((t) => ({
      type: "tool" as const,
      slug: t.slug,
      title: t.name,
      body: `${t.tagline} ${t.description}`,
      href: `/dashboard/ecosystem/${t.slug}`,
      score: score(`${t.name} ${t.tagline} ${t.tags.join(" ")} ${t.capabilities.join(" ")}`, q)
    })),
    ...PATTERNS.map((p) => ({
      type: "pattern" as const,
      slug: p.slug,
      title: p.name,
      body: p.summary,
      href: `/dashboard/patterns/${p.slug}`,
      score: score(`${p.name} ${p.summary} ${p.toolStack.join(" ")}`, q)
    })),
    ...PROJECTS.map((p) => ({
      type: "project" as const,
      slug: p.slug,
      title: p.title,
      body: p.businessProblem,
      href: `/dashboard/projects?id=${p.slug}`,
      score: score(`${p.title} ${p.domain} ${p.businessProblem} ${p.tags.join(" ")}`, q)
    }))
  ]
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 24);

  return NextResponse.json({ q, results: hits });
}

function score(haystack: string, q: string) {
  const hay = haystack.toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);
  let s = 0;
  for (const term of terms) {
    if (hay.includes(term)) s += 1;
  }
  return s;
}

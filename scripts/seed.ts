/**
 * Seed Supabase with the TypeScript catalog.
 *
 * Usage:
 *   1. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   2. npx tsx scripts/seed.ts
 *
 * This is idempotent — it upserts by `slug`.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { TOOLS } from "../src/data/tools";
import { PATTERNS } from "../src/data/patterns";
import { PROJECTS } from "../src/data/projects";
import { RADAR } from "../src/data/radar";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function seedTools() {
  const rows = TOOLS.map((t) => ({
    slug: t.slug,
    name: t.name,
    category: t.category,
    tagline: t.tagline,
    description: t.description,
    capabilities: t.capabilities,
    maturity: t.maturity,
    learning_curve: t.learningCurve,
    pricing: t.pricing,
    community: t.community,
    docs_url: t.docsUrl ?? null,
    tags: t.tags,
    trending: !!t.trending,
    released_year: t.releasedYear ?? null
  }));
  const { error } = await supabase.from("tools").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  console.log(`✓ tools: ${rows.length}`);
}

async function seedPatterns() {
  const rows = PATTERNS.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    summary: p.summary,
    components: p.components,
    flows: p.flows,
    tool_stack: p.toolStack,
    pros: p.pros,
    cons: p.cons,
    when_to_use: p.whenToUse,
    enterprise_implications: p.enterpriseImplications,
    scalability: p.scalability
  }));
  const { error } = await supabase.from("patterns").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  console.log(`✓ patterns: ${rows.length}`);
}

async function seedProjects() {
  const rows = PROJECTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    domain: p.domain,
    complexity: p.complexity,
    business_problem: p.businessProblem,
    outcomes: p.outcomes,
    architecture: p.architecture,
    tool_stack: p.toolStack,
    build_phases: p.buildPhases,
    cost_min: p.costEstimate.min,
    cost_max: p.costEstimate.max,
    sample_prompts: p.samplePrompts,
    deployment: p.deployment,
    risks: p.risks,
    governance: p.governance,
    enterprise_readiness: p.enterpriseReadiness,
    tags: p.tags
  }));
  const { error } = await supabase.from("projects").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  console.log(`✓ projects: ${rows.length}`);
}

async function seedRadar() {
  const rows = RADAR.map((r) => ({
    type: r.type,
    title: r.title,
    source: r.source,
    url: r.url ?? null,
    summary: r.summary,
    published_at: r.publishedAt,
    tags: r.tags,
    signal: r.signal
  }));
  const { error } = await supabase.from("radar_items").insert(rows);
  if (error) throw error;
  console.log(`✓ radar_items: ${rows.length}`);
}

async function main() {
  await seedTools();
  await seedPatterns();
  await seedProjects();
  await seedRadar();
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

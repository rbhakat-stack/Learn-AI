# Agentic AI Lab

A learning, design, and incubation platform for the agentic AI ecosystem.

It is **not** a tutorial site. It is a hybrid of an AI learning platform, AI tooling radar,
experiment sandbox, architecture explorer, project incubator, and agent workflow design studio.

## Modules

1. **Ecosystem Map** — interactive catalog of agentic AI tools, frameworks, and protocols
2. **Learning Roadmap Engine** — personalized roadmap by role + level
3. **Project Idea Generator** — enterprise-grade project ideas with architecture
4. **Agent Workflow Designer** — visual node-based builder (React Flow)
5. **Architecture Pattern Library** — reusable blueprints with diagrams
6. **Tool Comparison Engine** — side-by-side tool comparisons
7. **Daily AI Radar** — curated feed of releases, papers, and trends
8. **Enterprise AI Governance** — safety, compliance, observability, lifecycle

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind, Shadcn-style UI, Framer Motion, React Flow, Recharts
- **Backend**: Supabase (Postgres + pgvector + Edge Functions), Next.js route handlers
- **AI**: Provider-agnostic abstraction over OpenAI, Anthropic, Google, and Ollama

## Getting Started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

## Folder Structure

```
src/
  app/                # Next.js App Router (pages, route handlers)
    (marketing)/      # Landing surface
    dashboard/        # Authenticated shell
    api/              # Route handlers (AI, search, recommendations)
  components/
    ui/               # Primitives (button, card, input, ...)
    layout/           # Shell, navigation, sidebars
    ecosystem/        # Module-specific components
    roadmap/
    projects/
    workflow/
    patterns/
    compare/
    radar/
    governance/
    visualizations/   # Charts, graphs, knowledge maps
  data/               # Seeded JSON (tools, patterns, projects, roadmaps)
  lib/                # Utilities (cn, fetcher, ai, supabase)
  hooks/              # Custom React hooks
  stores/             # Zustand stores
  types/              # Shared TypeScript types
supabase/
  migrations/         # SQL schema
  seed.sql            # Seed data
scripts/              # CLI scripts (seed, generate, sync)
```

## Database

Supabase Postgres + `pgvector` for semantic search across tools, patterns, and projects.
See [supabase/migrations/](./supabase/migrations) for schema.

## Extending

Every module is a self-contained slice under `src/components/<module>` plus a route under
`src/app/dashboard/<module>`. To add a new tool to the ecosystem, append a record to
`src/data/tools.ts` — the catalog, comparison engine, and recommender pick it up automatically.

## License

MIT — for educational and internal use.

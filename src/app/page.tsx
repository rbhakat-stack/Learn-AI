import Link from "next/link";
import { ArrowRight, Sparkles, Workflow, Compass, GitCompare, ShieldCheck, Radar, Lightbulb, LayoutTemplate, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  { icon: Compass, title: "Ecosystem Map", desc: "Catalog 200+ agentic AI tools across 23 categories — frameworks, RAG, vector DBs, MCP, observability." },
  { icon: GraduationCap, title: "Learning Roadmap", desc: "Personalized roadmaps by role and level: from beginner to enterprise architect." },
  { icon: Lightbulb, title: "Project Incubator", desc: "Generate enterprise-grade project ideas with architecture, costs, risks, and build phases." },
  { icon: Workflow, title: "Workflow Designer", desc: "Visual node-based studio for agent + tool + memory orchestration. Export to JSON." },
  { icon: LayoutTemplate, title: "Pattern Library", desc: "Battle-tested architectures: planner-executor, reflection, human-in-the-loop, agentic CRM." },
  { icon: GitCompare, title: "Tool Comparison", desc: "Side-by-side decision matrices: CrewAI vs AutoGen, Pinecone vs Weaviate vs Qdrant." },
  { icon: Radar, title: "Daily AI Radar", desc: "Curated stream of releases, papers, MCP servers, and trending repos." },
  { icon: ShieldCheck, title: "Enterprise Governance", desc: "Safety, observability, prompt governance, agent lifecycle, responsible AI." }
] as const;

export default function MarketingPage() {
  return (
    <div className="relative">
      <div className="bg-grid absolute inset-x-0 top-0 -z-10 h-[600px]" />
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[linear-gradient(135deg,#8b5cf6,#22d3ee)] shadow-lg shadow-primary/30">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold">Agentic AI Lab</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="#features" className="hover:text-foreground">Modules</Link>
          <Link href="#stack" className="hover:text-foreground">Stack</Link>
          <Link href="#roles" className="hover:text-foreground">For teams</Link>
        </div>
        <Button asChild variant="gradient" size="sm">
          <Link href="/dashboard">Enter Lab <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </nav>

      {/* Hero */}
      <section className="container relative pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="info" className="mb-6">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Continuously updated · {new Date().toLocaleDateString("en", { month: "long", year: "numeric" })}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient">Learn, design, and ship</span>
            <br /> the agentic AI stack.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            A hybrid AI learning platform, tooling radar, architecture explorer, and project
            incubator — purpose-built for enterprise AI architects, engineers, and consultants.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild variant="gradient" size="lg">
              <Link href="/dashboard">
                Open the Lab <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/ecosystem">Explore ecosystem</Link>
            </Button>
          </div>
        </div>

        {/* Aurora orbs */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aurora opacity-20 blur-3xl" />
      </section>

      {/* Stats strip */}
      <section className="container -mt-10 mb-16">
        <Card className="glass">
          <CardContent className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
            {[
              { label: "Tools cataloged", value: "200+" },
              { label: "Architecture patterns", value: "24" },
              { label: "Project blueprints", value: "60+" },
              { label: "Learning paths", value: "12" }
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-gradient">{s.value}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section id="features" className="container py-16">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Eight modules. One operating system.</h2>
          <p className="mt-3 text-muted-foreground">
            Every surface is interactive, every blueprint is exportable, and every workflow is wired
            to a real toolchain.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="sheen group transition-transform hover:-translate-y-0.5">
              <CardHeader>
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30 group-hover:bg-primary/25">
                  <Icon className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {desc}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="container py-16">
        <Card className="glass overflow-hidden">
          <CardHeader>
            <Badge variant="muted" className="w-fit">Tech stack</Badge>
            <CardTitle className="mt-2 text-2xl">Built on a modern AI-native foundation.</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6 text-sm md:grid-cols-4">
            {[
              ["Frontend", "Next.js 14, React 18, TypeScript, Tailwind, Shadcn-style UI, Framer Motion, React Flow, Recharts"],
              ["Backend", "Supabase Postgres, pgvector, Edge Functions, Next.js route handlers"],
              ["AI Layer", "OpenAI, Anthropic, Google Gemini, Ollama via a provider-agnostic abstraction"],
              ["Patterns", "Modular slices, typed contracts, semantic search, observability hooks"]
            ].map(([label, body]) => (
              <div key={label}>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
                <p className="mt-1 leading-relaxed">{body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-border/60">
        <div className="container flex h-16 items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Agentic AI Lab</span>
          <span className="font-mono">v0.1 · alpha</span>
        </div>
      </footer>
    </div>
  );
}

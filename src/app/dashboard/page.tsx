import Link from "next/link";
import {
  Compass,
  GraduationCap,
  Lightbulb,
  Workflow,
  LayoutTemplate,
  GitCompare,
  Radar,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TOOLS } from "@/data/tools";
import { PATTERNS } from "@/data/patterns";
import { PROJECTS } from "@/data/projects";
import { RADAR } from "@/data/radar";
import { ROADMAPS } from "@/data/roadmaps";
import { formatCompact } from "@/lib/utils";
import { TrendingTools } from "@/components/visualizations/trending-tools";

const MODULES = [
  { href: "/dashboard/ecosystem", icon: Compass, label: "Ecosystem Map", body: "Catalog of 200+ agentic tools across 23 categories." },
  { href: "/dashboard/roadmap", icon: GraduationCap, label: "Learning Roadmap", body: "Personalized paths for your role and level." },
  { href: "/dashboard/projects", icon: Lightbulb, label: "Project Ideas", body: "Enterprise-grade blueprints with cost + governance." },
  { href: "/dashboard/workflow", icon: Workflow, label: "Workflow Designer", body: "Visual node-based agent + tool composer." },
  { href: "/dashboard/patterns", icon: LayoutTemplate, label: "Pattern Library", body: "Battle-tested architectures and blueprints." },
  { href: "/dashboard/compare", icon: GitCompare, label: "Tool Comparison", body: "Side-by-side decision matrices." },
  { href: "/dashboard/radar", icon: Radar, label: "Daily AI Radar", body: "Curated stream of releases and research." },
  { href: "/dashboard/governance", icon: ShieldCheck, label: "Governance", body: "Safety, observability, and responsible AI." }
] as const;

export default function DashboardPage() {
  const trending = TOOLS.filter((t) => t.trending).slice(0, 6);
  const recentRadar = RADAR.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Live · {new Date().toLocaleDateString("en", { weekday: "long", day: "numeric", month: "short" })}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-gradient">Ranabir</span>
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Pick up where you left off — the lab has new entries in the radar, two updated
            patterns, and a fresh roadmap suggestion based on your skill graph.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/mentor"><Sparkles className="h-4 w-4" /> Ask the mentor</Link>
          </Button>
          <Button asChild variant="gradient" size="sm">
            <Link href="/dashboard/workflow">New workflow <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Tools in catalog", value: formatCompact(TOOLS.length), accent: "from-violet-500 to-fuchsia-500" },
          { label: "Architecture patterns", value: PATTERNS.length.toString(), accent: "from-cyan-500 to-blue-500" },
          { label: "Project blueprints", value: PROJECTS.length.toString(), accent: "from-emerald-500 to-teal-500" },
          { label: "Active radar signals", value: RADAR.length.toString(), accent: "from-amber-500 to-orange-500" }
        ].map((k) => (
          <Card key={k.label} className="sheen overflow-hidden">
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{k.label}</div>
              <div className={`mt-2 bg-gradient-to-br ${k.accent} bg-clip-text text-3xl font-bold text-transparent`}>
                {k.value}
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
                <div className={`h-full w-2/3 rounded-full bg-gradient-to-r ${k.accent}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Modules */}
        <div className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Modules</h2>
            <Link href="/dashboard/ecosystem" className="text-xs text-muted-foreground hover:text-foreground">
              Browse the lab →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {MODULES.map(({ href, icon: Icon, label, body }) => (
              <Link key={href} href={href} className="group">
                <Card className="sheen h-full transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40">
                  <CardHeader className="space-y-2 pb-4">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30 transition-colors group-hover:bg-primary/25">
                      <Icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base">{label}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed">{body}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Trending */}
          <Card className="sheen">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Trending tools</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <TrendingTools tools={trending} />
            </CardContent>
          </Card>

          {/* Skill graph */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Your skill graph</CardTitle>
              <CardDescription className="text-xs">
                Self-assessed proficiency across core agent stack skills.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Agent frameworks", value: 72 },
                { label: "RAG + retrieval", value: 85 },
                { label: "Multi-agent orchestration", value: 48 },
                { label: "Observability + evals", value: 60 },
                { label: "Governance + responsible AI", value: 55 }
              ].map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-medium">{s.value}%</span>
                  </div>
                  <Progress value={s.value} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Roadmap nudge */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5">
            <CardHeader>
              <Badge variant="info" className="w-fit">Recommended next</Badge>
              <CardTitle className="mt-2 text-sm">
                Resume the AI Architect roadmap
              </CardTitle>
              <CardDescription className="text-xs">
                You&apos;re 38% through. Next node: <strong>Multi-agent orchestration</strong> (20 hours).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={38} className="mb-3" />
              <Button asChild size="sm" variant="gradient" className="w-full">
                <Link href={`/dashboard/roadmap?role=AI%20Architect`}>
                  Continue roadmap <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Radar strip */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">From the radar</h2>
          <Link href="/dashboard/radar" className="text-xs text-muted-foreground hover:text-foreground">
            View all signals →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {recentRadar.map((r) => (
            <Card key={r.id} className="sheen">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="muted" className="text-[10px] uppercase">{r.type}</Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(r.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="mt-2 text-sm leading-snug">{r.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs leading-relaxed text-muted-foreground">{r.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {r.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Roadmap snapshots */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Roadmaps for your team</h2>
          <Link href="/dashboard/roadmap" className="text-xs text-muted-foreground hover:text-foreground">
            Explore all paths →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {ROADMAPS.map((r) => (
            <Card key={r.id} className="sheen">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge>{r.level}</Badge>
                  <span className="text-[10px] text-muted-foreground">{r.totalHours}h</span>
                </div>
                <CardTitle className="mt-2 text-base">{r.role}</CardTitle>
                <CardDescription className="text-xs">{r.summary}</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {r.nodes.length} learning nodes · {r.nodes.flatMap((n) => n.tools).length} tools
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

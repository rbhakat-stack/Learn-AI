"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Building2,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  Layers,
  Wand2,
  ChevronRight,
  Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findTool } from "@/data/tools";
import { cn } from "@/lib/utils";
import type { ProjectIdea, ProjectComplexity } from "@/types";

const COMPLEXITY: Array<ProjectComplexity | "all"> = ["all", "starter", "intermediate", "production", "enterprise"];

export function ProjectIncubator({ projects }: { projects: ProjectIdea[] }) {
  const [query, setQuery] = useState("");
  const [complexity, setComplexity] = useState<ProjectComplexity | "all">("all");
  const [domain, setDomain] = useState<string>("all");
  const [selected, setSelected] = useState<ProjectIdea>(projects[0]);

  const domains = useMemo(
    () => Array.from(new Set(projects.map((p) => p.domain))),
    [projects]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (complexity !== "all" && p.complexity !== complexity) return false;
      if (domain !== "all" && p.domain !== domain) return false;
      if (!q) return true;
      const hay = [p.title, p.businessProblem, ...p.tags].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [projects, query, complexity, domain]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      <aside className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Browse ideas</CardTitle>
              <Button variant="gradient" size="sm">
                <Wand2 className="h-3.5 w-3.5" /> Generate
              </Button>
            </div>
            <CardDescription className="text-xs">
              {filtered.length} blueprint{filtered.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search problems, domains…"
                className="pl-8 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {COMPLEXITY.map((c) => (
                <button
                  key={c}
                  onClick={() => setComplexity(c)}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider transition-colors",
                    complexity === c
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              <DomainChip value="all" current={domain} onClick={setDomain}>all</DomainChip>
              {domains.map((d) => (
                <DomainChip key={d} value={d} current={domain} onClick={setDomain}>{d}</DomainChip>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={cn(
                "group w-full rounded-lg border bg-card/40 p-3 text-left transition-all",
                selected.id === p.id
                  ? "border-primary/40 bg-primary/10"
                  : "border-border/60 hover:border-primary/30 hover:bg-card/70"
              )}
            >
              <div className="flex items-center justify-between">
                <Badge variant="muted" className="text-[9px] uppercase">{p.complexity}</Badge>
                <span className="text-[10px] text-muted-foreground">{p.domain}</span>
              </div>
              <div className="mt-1.5 text-sm font-medium group-hover:text-primary">{p.title}</div>
              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{p.businessProblem}</p>
            </button>
          ))}
        </div>
      </aside>

      <ProjectDetail project={selected} />
    </div>
  );
}

function DomainChip({
  value,
  current,
  onClick,
  children
}: {
  value: string;
  current: string;
  onClick: (v: string) => void;
  children: React.ReactNode;
}) {
  const active = current === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] transition-colors",
        active
          ? "border-accent/40 bg-accent/15 text-accent"
          : "border-border/60 text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function ProjectDetail({ project }: { project: ProjectIdea }) {
  return (
    <div className="space-y-6">
      <Card className="sheen overflow-hidden">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="info">{project.domain}</Badge>
                <Badge variant="muted" className="uppercase">{project.complexity}</Badge>
              </div>
              <CardTitle className="mt-2 text-2xl">{project.title}</CardTitle>
              <CardDescription className="mt-1 max-w-2xl">
                {project.businessProblem}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Enterprise readiness
              </div>
              <div className="text-2xl font-bold text-gradient">{project.enterpriseReadiness}<span className="text-base">/100</span></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat icon={Layers} label="Tools" value={`${project.toolStack.length}`} />
          <Stat icon={DollarSign} label="Cost (USD)" value={`$${project.costEstimate.min.toLocaleString()}–$${project.costEstimate.max.toLocaleString()}`} />
          <Stat icon={Sparkles} label="Phases" value={`${project.buildPhases.length}`} />
          <Stat icon={Building2} label="Weeks" value={`${project.buildPhases.reduce((a, b) => a + b.durationWeeks, 0)}`} />
        </CardContent>
      </Card>

      <Tabs defaultValue="architecture">
        <TabsList>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="tools">Tool stack</TabsTrigger>
          <TabsTrigger value="phases">Build phases</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="risks">Risks & governance</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Components</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm">
                  {project.architecture.components.map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Data flow</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-1.5 text-sm">
                  {(project.architecture.dataFlow ?? []).map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                        {i + 1}
                      </span>
                      {d}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardContent className="grid grid-cols-1 gap-2 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {project.toolStack.map((slug) => {
                const t = findTool(slug);
                if (!t) return null;
                return (
                  <Link key={slug} href={`/dashboard/ecosystem/${slug}`}>
                    <Card className="sheen group transition-all hover:-translate-y-0.5 hover:border-primary/40">
                      <CardHeader className="pb-2">
                        <Badge variant="muted" className="w-fit text-[9px] uppercase">{t.category}</Badge>
                        <CardTitle className="mt-1 text-sm group-hover:text-primary">{t.name}</CardTitle>
                        <CardDescription className="line-clamp-2 text-[11px]">{t.tagline}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases">
          <div className="space-y-3">
            {project.buildPhases.map((p, i) => (
              <Card key={p.phase}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Phase {i + 1}
                    </div>
                    <CardTitle className="text-base">{p.phase}</CardTitle>
                  </div>
                  <Badge variant="info">{p.durationWeeks} weeks</Badge>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 gap-1.5 text-sm md:grid-cols-2">
                    {p.tasks.map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> {t}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prompts">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sample prompts to try</CardTitle>
              <CardDescription className="text-xs">
                Drop these into the workflow designer once you scaffold the crew.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {project.samplePrompts.map((p, i) => (
                <pre key={i} className="overflow-auto rounded-lg border border-border/60 bg-card/60 p-3 font-mono text-xs leading-relaxed">
                  {p}
                </pre>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-400" /> Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm">
                  {project.risks.map((r) => (
                    <li key={r} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" /> {r}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> Governance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm">
                  {project.governance.map((r) => (
                    <li key={r} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" /> {r}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-3">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

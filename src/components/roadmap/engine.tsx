"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  Circle,
  GraduationCap,
  BookOpen,
  FlaskConical,
  Video,
  FileText,
  ChevronRight,
  Wand2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { findTool } from "@/data/tools";
import { cn } from "@/lib/utils";
import type { Roadmap, Role, Level } from "@/types";

const ROLES: Role[] = [
  "AI Architect",
  "AI Engineer",
  "Full-Stack AI Developer",
  "Enterprise AI Leader",
  "Product Leader",
  "Pharma AI Consultant",
  "Innovation Lead",
  "Solution Architect"
];
const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

const RESOURCE_ICONS = {
  doc: BookOpen,
  video: Video,
  lab: FlaskConical,
  paper: FileText,
  course: GraduationCap
} as const;

export function RoadmapEngine({ roadmaps }: { roadmaps: Roadmap[] }) {
  const [role, setRole] = useState<Role>("AI Engineer");
  const [level, setLevel] = useState<Level>("Beginner");
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const roadmap = useMemo(() => {
    return (
      roadmaps.find((r) => r.role === role && r.level === level) ??
      // graceful fallback: closest role match
      roadmaps.find((r) => r.role === role) ??
      roadmaps[0]
    );
  }, [roadmaps, role, level]);

  const progress =
    roadmap.nodes.length === 0
      ? 0
      : Math.round((Array.from(completed).filter((id) => roadmap.nodes.some(n => n.id === id)).length / roadmap.nodes.length) * 100);

  const toggle = (id: string) => {
    setCompleted((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <CardTitle className="text-base">Build my roadmap</CardTitle>
              <CardDescription className="text-xs">
                Tailored to your role, level, and existing skill graph.
              </CardDescription>
            </div>
            <Button variant="gradient" size="sm">
              <Wand2 className="h-4 w-4" /> Regenerate with AI
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Role">
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Level">
              <Select value={level} onValueChange={(v) => setLevel(v as Level)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Total time">
              <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background/50 px-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{roadmap.totalHours}h</span>
                <span className="text-muted-foreground">· {roadmap.nodes.length} nodes</span>
              </div>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Badge variant="info">{roadmap.role} · {roadmap.level}</Badge>
              <CardTitle className="mt-2 text-xl">{roadmap.summary}</CardTitle>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Progress</div>
              <div className="text-2xl font-bold text-gradient">{progress}%</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} />
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-3 top-2 bottom-2 hidden w-px bg-gradient-to-b from-primary via-accent to-transparent sm:block" />
        <ol className="space-y-4">
          {roadmap.nodes.map((node, i) => {
            const done = completed.has(node.id);
            return (
              <li key={node.id} className="relative sm:pl-10">
                <button
                  onClick={() => toggle(node.id)}
                  className={cn(
                    "absolute left-0 top-3 hidden h-7 w-7 -translate-x-0 items-center justify-center rounded-full border-2 transition-all sm:flex",
                    done
                      ? "border-emerald-400 bg-emerald-500/15 text-emerald-300"
                      : "border-primary/40 bg-card text-primary"
                  )}
                  aria-label={done ? "Mark incomplete" : "Mark complete"}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                </button>
                <Card className={cn("sheen transition-colors", done && "border-emerald-500/30 bg-emerald-500/5")}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                          <span>Step {String(i + 1).padStart(2, "0")}</span>
                          <span>·</span>
                          <span>{node.durationHours}h</span>
                        </div>
                        <CardTitle className="mt-1 text-base">{node.title}</CardTitle>
                        <CardDescription className="text-xs">{node.description}</CardDescription>
                      </div>
                      <Button
                        variant={done ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggle(node.id)}
                      >
                        {done ? "Done" : "Mark done"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Pill label="Topics">
                      <ul className="space-y-1 text-xs">
                        {node.topics.map((t) => (
                          <li key={t} className="text-muted-foreground">· {t}</li>
                        ))}
                      </ul>
                    </Pill>
                    <Pill label="Tools">
                      <div className="flex flex-wrap gap-1">
                        {node.tools.map((slug) => {
                          const t = findTool(slug);
                          return (
                            <Link key={slug} href={`/dashboard/ecosystem/${slug}`}>
                              <Badge variant="secondary" className="text-[10px] hover:bg-primary/15 hover:text-primary">
                                {t?.name ?? slug}
                              </Badge>
                            </Link>
                          );
                        })}
                      </div>
                    </Pill>
                    <Pill label="Resources">
                      <ul className="space-y-1.5 text-xs">
                        {node.resources.map((r, idx) => {
                          const Icon = RESOURCE_ICONS[r.type] ?? FileText;
                          return (
                            <li key={idx} className="flex items-start gap-2">
                              <Icon className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                              <span>{r.label}</span>
                            </li>
                          );
                        })}
                        {node.resources.length === 0 && (
                          <li className="text-[11px] italic text-muted-foreground">No fixed resources — explore the ecosystem.</li>
                        )}
                      </ul>
                    </Pill>
                    <Pill label="Outcomes">
                      <ul className="space-y-1 text-xs">
                        {node.outcomes.map((o) => (
                          <li key={o} className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> {o}
                          </li>
                        ))}
                      </ul>
                    </Pill>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function Pill({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-3">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

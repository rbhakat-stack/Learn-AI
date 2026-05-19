"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Check, X as XIcon, Star, GitCompare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formatCompact, cn } from "@/lib/utils";
import { categoryColor } from "@/data/categories";
import type { Tool } from "@/types";

const RUBRIC = [
  { key: "category", label: "Category" },
  { key: "maturity", label: "Maturity" },
  { key: "learningCurve", label: "Learning curve" },
  { key: "pricing", label: "Pricing model" },
  { key: "releasedYear", label: "Released" },
  { key: "stars", label: "GitHub stars" },
  { key: "useCases", label: "Best use cases" },
  { key: "pros", label: "Pros" },
  { key: "cons", label: "Cons" },
  { key: "enterpriseSignals", label: "Enterprise signals" }
] as const;

const PRESETS: Array<{ label: string; slugs: [string, string, string?] }> = [
  { label: "CrewAI vs AutoGen vs LangGraph", slugs: ["crewai", "autogen", "langgraph"] },
  { label: "Pinecone vs Weaviate vs Qdrant", slugs: ["pinecone", "weaviate", "qdrant"] },
  { label: "LangGraph vs Semantic Kernel", slugs: ["langgraph", "semantic-kernel"] },
  { label: "Flowise vs n8n", slugs: ["flowise", "n8n"] },
  { label: "Claude Code vs OpenHands", slugs: ["claude-code", "openhands"] },
  { label: "Ollama vs vLLM", slugs: ["ollama", "vllm"] },
  { label: "Langfuse vs Helicone vs Phoenix", slugs: ["langfuse", "helicone", "phoenix"] }
];

export function Comparator({ tools }: { tools: Tool[] }) {
  const sp = useSearchParams();
  const initial: [string, string, string?] = [
    sp.get("a") ?? "crewai",
    sp.get("b") ?? "autogen",
    sp.get("c") ?? undefined
  ];
  const [picks, setPicks] = useState<[string, string, string?]>(initial);

  // sync if URL changes
  useEffect(() => {
    setPicks([
      sp.get("a") ?? picks[0],
      sp.get("b") ?? picks[1],
      sp.get("c") ?? picks[2]
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  const selected = useMemo(
    () => picks.map((s) => (s ? tools.find((t) => t.slug === s) : undefined)),
    [picks, tools]
  );

  const set = (idx: 0 | 1 | 2, slug: string) => {
    setPicks((p) => {
      const next = [...p] as [string, string, string?];
      next[idx] = slug;
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Selectors + presets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCompare className="h-4 w-4" /> Pick up to three tools
          </CardTitle>
          <CardDescription className="text-xs">
            Or jump to a popular comparison.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {([0, 1, 2] as const).map((i) => (
              <Select
                key={i}
                value={picks[i] ?? "none"}
                onValueChange={(v) => set(i, v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Tool ${i + 1}`} />
                </SelectTrigger>
                <SelectContent>
                  {i === 2 && <SelectItem value="none">— optional —</SelectItem>}
                  {tools.map((t) => (
                    <SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() =>
                  setPicks([p.slugs[0], p.slugs[1], p.slugs[2]] as [string, string, string?])
                }
                className="rounded-full border border-border/60 bg-card/40 px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {p.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Headers */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {selected.map((t, i) => (t ? <ToolHeader key={i} tool={t} /> : null))}
      </div>

      {/* Matrix */}
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-card/40">
              <th className="w-44 px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Dimension
              </th>
              {selected.map((t, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-semibold"
                >
                  {t ? t.name : "—"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RUBRIC.map((r) => (
              <tr key={r.key} className="border-b border-border/40 align-top">
                <td className="px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {r.label}
                </td>
                {selected.map((t, i) => (
                  <td key={i} className="px-4 py-3 text-xs">
                    {t ? <CellValue tool={t} dimension={r.key} /> : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function ToolHeader({ tool }: { tool: Tool }) {
  const color = categoryColor(tool.category);
  return (
    <Card className="sheen overflow-hidden">
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Badge variant="muted" className="text-[9px] uppercase">{tool.category}</Badge>
            <CardTitle className="mt-1 truncate text-base">{tool.name}</CardTitle>
            <CardDescription className="line-clamp-2 text-xs">{tool.tagline}</CardDescription>
          </div>
          {tool.community.githubStars ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border/60 bg-card/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              <Star className="h-3 w-3" /> {formatCompact(tool.community.githubStars)}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1 pt-0">
        {tool.capabilities.slice(0, 5).map((c) => (
          <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
        ))}
      </CardContent>
    </Card>
  );
}

function CellValue({ tool, dimension }: { tool: Tool; dimension: string }) {
  switch (dimension) {
    case "category":
      return <span className="capitalize">{tool.category}</span>;
    case "maturity":
      return <Badge variant={tool.maturity === "enterprise-grade" ? "success" : tool.maturity === "production-ready" ? "info" : "warn"}>
        {tool.maturity}
      </Badge>;
    case "learningCurve":
      return <Badge variant={tool.learningCurve === "easy" ? "success" : tool.learningCurve === "medium" ? "info" : "warn"}>
        {tool.learningCurve}
      </Badge>;
    case "pricing":
      return <span className="capitalize">{tool.pricing}</span>;
    case "releasedYear":
      return tool.releasedYear ?? "—";
    case "stars":
      return tool.community.githubStars ? formatCompact(tool.community.githubStars) : "—";
    case "useCases":
      return <BulletList items={tool.useCases} />;
    case "pros":
      return <BulletList items={tool.pros} icon="check" />;
    case "cons":
      return <BulletList items={tool.cons} icon="x" />;
    case "enterpriseSignals":
      return <BulletList items={tool.enterpriseSignals} />;
    default:
      return "—";
  }
}

function BulletList({ items, icon }: { items: string[]; icon?: "check" | "x" }) {
  return (
    <ul className="space-y-1">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2">
          {icon === "check" ? (
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
          ) : icon === "x" ? (
            <XIcon className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
          ) : (
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          )}
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  );
}

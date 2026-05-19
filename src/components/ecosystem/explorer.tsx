"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Star, ExternalLink, TrendingUp, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryColor } from "@/data/categories";
import { cn, formatCompact } from "@/lib/utils";
import type { Tool, Maturity, Difficulty } from "@/types";

const MATURITY: Maturity[] = ["experimental", "emerging", "production-ready", "enterprise-grade"];
const DIFFICULTY: Difficulty[] = ["easy", "medium", "hard", "expert"];

export function EcosystemExplorer({
  tools,
  categories
}: {
  tools: Tool[];
  categories: Array<{ name: string; color: string; description: string }>;
}) {
  const [query, setQuery] = useState("");
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [maturity, setMaturity] = useState<Maturity | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [trendingOnly, setTrendingOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (selectedCats.size && !selectedCats.has(t.category)) return false;
      if (maturity !== "all" && t.maturity !== maturity) return false;
      if (difficulty !== "all" && t.learningCurve !== difficulty) return false;
      if (trendingOnly && !t.trending) return false;
      if (!q) return true;
      const hay = [
        t.name,
        t.tagline,
        t.description,
        ...t.tags,
        ...t.capabilities,
        t.category
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [tools, query, selectedCats, maturity, difficulty, trendingOnly]);

  const toggle = (name: string) => {
    setSelectedCats((s) => {
      const next = new Set(s);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedCats(new Set());
    setMaturity("all");
    setDifficulty("all");
    setTrendingOnly(false);
    setQuery("");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      {/* Sidebar filters */}
      <aside className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Filter className="h-4 w-4" /> Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                Maturity
              </div>
              <div className="flex flex-wrap gap-1">
                <FilterChip active={maturity === "all"} onClick={() => setMaturity("all")}>any</FilterChip>
                {MATURITY.map((m) => (
                  <FilterChip key={m} active={maturity === m} onClick={() => setMaturity(m)}>
                    {m}
                  </FilterChip>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                Learning curve
              </div>
              <div className="flex flex-wrap gap-1">
                <FilterChip active={difficulty === "all"} onClick={() => setDifficulty("all")}>any</FilterChip>
                {DIFFICULTY.map((d) => (
                  <FilterChip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>
                    {d}
                  </FilterChip>
                ))}
              </div>
            </div>
            <div>
              <FilterChip active={trendingOnly} onClick={() => setTrendingOnly((v) => !v)}>
                <TrendingUp className="h-3 w-3" /> Trending only
              </FilterChip>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-3 w-3" /> Clear all
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Categories</CardTitle>
            <CardDescription className="text-xs">
              {selectedCats.size === 0 ? "All" : `${selectedCats.size} selected`}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[420px] overflow-y-auto pr-2">
            <ul className="space-y-1">
              {categories.map((c) => {
                const active = selectedCats.has(c.name);
                const count = tools.filter((t) => t.category === c.name).length;
                return (
                  <li key={c.name}>
                    <button
                      onClick={() => toggle(c.name)}
                      className={cn(
                        "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                        active ? "bg-primary/15 text-primary" : "hover:bg-secondary/60"
                      )}
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: c.color }}
                      />
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </aside>

      {/* Main grid */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools, capabilities, tags…"
              className="pl-9"
            />
          </div>
          <Badge variant="muted" className="px-3 py-1">
            {filtered.length} {filtered.length === 1 ? "tool" : "tools"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
          {filtered.length === 0 && (
            <Card className="col-span-full p-10 text-center text-sm text-muted-foreground">
              No tools match your filters. Try clearing one.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-colors",
        active
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const color = categoryColor(tool.category);
  return (
    <Link href={`/dashboard/ecosystem/${tool.slug}`} className="group block">
      <Card className="sheen relative h-full overflow-hidden transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40">
        <div
          className="absolute inset-x-0 top-0 h-0.5 opacity-70"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="truncate text-base group-hover:text-primary">{tool.name}</CardTitle>
                {tool.trending && (
                  <Badge variant="info" className="h-4 text-[9px]">
                    <TrendingUp className="mr-0.5 h-2.5 w-2.5" /> hot
                  </Badge>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px]">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: color }}
                />
                <span className="text-muted-foreground">{tool.category}</span>
              </div>
            </div>
            {tool.community.githubStars ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border/60 bg-card/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                <Star className="h-3 w-3" />
                {formatCompact(tool.community.githubStars)}
              </span>
            ) : null}
          </div>
          <CardDescription className="line-clamp-2 text-xs leading-relaxed">
            {tool.tagline}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex flex-wrap gap-1">
            {tool.capabilities.slice(0, 4).map((c) => (
              <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>{tool.maturity}</span>
            <span>{tool.learningCurve}</span>
            <span>{tool.pricing}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

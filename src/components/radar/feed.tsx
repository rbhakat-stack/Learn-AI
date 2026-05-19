"use client";

import { useMemo, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Filter,
  Search,
  Radar as RadarIcon,
  FileText,
  Tv,
  Sparkles,
  Rocket,
  Plug,
  TrendingUp,
  Wrench
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { RadarItem } from "@/types";
import { cn } from "@/lib/utils";

const TYPE_ICON = {
  release: Rocket,
  paper: FileText,
  trend: TrendingUp,
  demo: Sparkles,
  mcp: Plug,
  video: Tv,
  tool: Wrench
} as const;

const TYPES: Array<RadarItem["type"] | "all"> = [
  "all",
  "release",
  "paper",
  "trend",
  "demo",
  "mcp",
  "video",
  "tool"
];

export function RadarFeed({ items }: { items: RadarItem[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<RadarItem["type"] | "all">("all");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((r) => (type === "all" ? true : r.type === type))
      .filter((r) => {
        if (!q) return true;
        return [r.title, r.summary, ...r.tags, r.source].join(" ").toLowerCase().includes(q);
      })
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  }, [items, query, type]);

  const toggleBookmark = (id: string) => {
    setBookmarks((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Filter className="h-4 w-4" /> Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the feed…"
                className="pl-8 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t as never)}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider transition-colors",
                    type === t
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookmarkCheck className="h-4 w-4" /> Bookmarks
            </CardTitle>
            <CardDescription className="text-xs">{bookmarks.size} saved</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5 text-xs">
            {Array.from(bookmarks).map((id) => {
              const item = items.find((i) => i.id === id);
              if (!item) return null;
              return (
                <div key={id} className="rounded-md border border-border/60 bg-card/40 p-2">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-[10px] text-muted-foreground">{item.source}</div>
                </div>
              );
            })}
            {bookmarks.size === 0 && (
              <p className="text-[11px] italic text-muted-foreground">
                Click the bookmark on any signal to save it here.
              </p>
            )}
          </CardContent>
        </Card>
      </aside>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="muted" className="px-3 py-1">
            <RadarIcon className="mr-1 h-3 w-3" /> {filtered.length} signals
          </Badge>
          <Button variant="outline" size="sm">Refresh feed</Button>
        </div>

        <ul className="space-y-3">
          {filtered.map((r) => {
            const Icon = TYPE_ICON[r.type];
            const isBookmarked = bookmarks.has(r.id);
            return (
              <li key={r.id}>
                <Card className="sheen">
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="muted" className="text-[10px] uppercase">{r.type}</Badge>
                        <span className="text-[10px] text-muted-foreground">{r.source}</span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(r.publishedAt).toLocaleString()}
                        </span>
                        <SignalDots signal={r.signal} />
                      </div>
                      <div className="mt-1 text-sm font-semibold leading-snug">{r.title}</div>
                      <p className="mt-1 text-xs text-muted-foreground">{r.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {r.tags.map((t) => (
                          <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-row items-center gap-1 sm:flex-col">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(r.id)}
                        aria-label="Bookmark"
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                      {r.url && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={r.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function SignalDots({ signal }: { signal: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span className="ml-2 inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            i <= signal ? "bg-primary" : "bg-secondary"
          )}
        />
      ))}
    </span>
  );
}

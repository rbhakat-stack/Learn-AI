"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Recommendation = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  score: number;
};

const PROMPTS = [
  "What should I learn next as an AI architect?",
  "Recommend a vector DB for a multi-tenant SaaS",
  "Compare LangGraph and Semantic Kernel for enterprise",
  "Show me a pattern for an agentic CRM",
  "Plan a 4-week pilot for pharma competitive intel"
];

export function Mentor() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ask = async (q?: string) => {
    const intent = (q ?? input).trim();
    if (!intent) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ intent, limit: 6 })
      });
      const data = (await res.json()) as { results: Recommendation[] };
      setRecs(data.results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" /> Ask Mentor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. recommend a vector DB for multi-tenant pharma RAG…"
                className="text-sm"
              />
              <Button type="submit" variant="gradient" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setInput(p);
                    ask(p);
                  }}
                  className="rounded-full border border-border/60 bg-card/40 px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {p}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
          </Card>
        )}

        {recs && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recs.map((r) => (
                <Link
                  key={r.slug}
                  href={`/dashboard/ecosystem/${r.slug}`}
                  className="group block rounded-lg border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold group-hover:text-primary">{r.name}</div>
                    <Badge variant="muted" className="text-[10px]">match · {r.score}</Badge>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{r.category}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{r.tagline}</div>
                </Link>
              ))}
              {recs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No matches. Try a broader intent or rephrase.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <aside>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">How Mentor works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>
              Mentor scores your intent against the ecosystem catalog (tools, patterns,
              projects) and returns the closest matches with explainable signals.
            </p>
            <p>
              When you wire a Claude or OpenAI key (in <code className="font-mono">.env.local</code>),
              Mentor can synthesize the answer in prose — and cite the same catalog entries
              for traceability.
            </p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

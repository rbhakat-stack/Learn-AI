import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star,
  ExternalLink,
  ArrowLeft,
  Check,
  X as XIcon,
  TrendingUp,
  BookOpen,
  Workflow,
  Building2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { findTool, TOOLS } from "@/data/tools";
import { categoryColor } from "@/data/categories";
import { formatCompact } from "@/lib/utils";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const t = findTool(params.slug);
  if (!t) return {};
  return { title: t.name, description: t.tagline };
}

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  const tool = findTool(params.slug);
  if (!tool) notFound();
  const color = categoryColor(tool.category);
  const alternatives = tool.alternatives.map(findTool).filter(Boolean);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/ecosystem"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> Back to Ecosystem Map
      </Link>

      {/* Header */}
      <Card className="overflow-hidden">
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                <span className="text-muted-foreground">{tool.category}</span>
                {tool.trending && (
                  <Badge variant="info" className="h-4 text-[10px]">
                    <TrendingUp className="mr-0.5 h-3 w-3" /> trending
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-2 flex items-center gap-3 text-3xl">
                {tool.name}
              </CardTitle>
              <CardDescription className="mt-1 max-w-2xl text-sm">
                {tool.tagline}
              </CardDescription>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tool.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {tool.community.githubStars ? (
                <Badge variant="muted" className="gap-1 px-3 py-1">
                  <Star className="h-3 w-3" />
                  {formatCompact(tool.community.githubStars)} stars
                </Badge>
              ) : null}
              {tool.docsUrl && (
                <Button asChild size="sm" variant="outline">
                  <a href={tool.docsUrl} target="_blank" rel="noreferrer">
                    <BookOpen className="h-4 w-4" /> Docs <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}
              {tool.community.githubUrl && (
                <Button asChild size="sm" variant="gradient">
                  <a href={tool.community.githubUrl} target="_blank" rel="noreferrer">
                    GitHub <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatBox label="Maturity" value={tool.maturity} />
        <StatBox label="Learning curve" value={tool.learningCurve} />
        <StatBox label="Pricing" value={tool.pricing} />
        <StatBox label="Released" value={tool.releasedYear?.toString() ?? "—"} />
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="About">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {tool.description}
            </p>
          </Section>

          <Section title="Core capabilities">
            <div className="flex flex-wrap gap-1.5">
              {tool.capabilities.map((c) => (
                <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
              ))}
            </div>
          </Section>

          <Section title="Best use cases">
            <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {tool.useCases.map((u) => (
                <li key={u} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Pros / cons">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
                  Pros
                </div>
                <ul className="space-y-1.5 text-xs">
                  {tool.pros.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-amber-300">
                  Cons
                </div>
                <ul className="space-y-1.5 text-xs">
                  {tool.cons.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <XIcon className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Example workflow" icon={<Workflow className="h-4 w-4" />}>
            <pre className="overflow-auto rounded-lg border border-border/60 bg-card/60 p-3 font-mono text-xs leading-relaxed">
              {tool.exampleWorkflow}
            </pre>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Architecture fit">
            <ul className="space-y-1.5 text-xs">
              {tool.architectureFit.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> {a}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Enterprise signals" icon={<Building2 className="h-4 w-4" />}>
            <ul className="space-y-1.5 text-xs">
              {tool.enterpriseSignals.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-cyan-400" /> {s}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Alternatives">
            <div className="space-y-2">
              {alternatives.map((a) => (
                <Link
                  key={a!.id}
                  href={`/dashboard/ecosystem/${a!.slug}`}
                  className="group flex items-center justify-between rounded-md border border-border/60 bg-card/40 p-2 text-sm transition-colors hover:border-primary/40"
                >
                  <span className="font-medium group-hover:text-primary">{a!.name}</span>
                  <span className="text-[10px] text-muted-foreground">{a!.category}</span>
                </Link>
              ))}
              {alternatives.length === 0 && (
                <p className="text-xs text-muted-foreground">No alternatives mapped.</p>
              )}
            </div>
            {alternatives.length > 1 && (
              <Button asChild size="sm" variant="outline" className="mt-3 w-full">
                <Link
                  href={`/dashboard/compare?a=${tool.slug}&b=${alternatives[0]!.slug}`}
                >
                  Compare side by side
                </Link>
              </Button>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="mt-1 text-sm font-medium capitalize">{value}</div>
      </CardContent>
    </Card>
  );
}

function Section({
  title,
  icon,
  children
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

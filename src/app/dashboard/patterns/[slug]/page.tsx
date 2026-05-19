import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, X as XIcon, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PATTERNS } from "@/data/patterns";
import { findTool } from "@/data/tools";
import { PatternDiagram } from "@/components/patterns/diagram";

export function generateStaticParams() {
  return PATTERNS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = PATTERNS.find((x) => x.slug === params.slug);
  if (!p) return {};
  return { title: p.name, description: p.summary };
}

export default function PatternDetail({ params }: { params: { slug: string } }) {
  const pattern = PATTERNS.find((p) => p.slug === params.slug);
  if (!pattern) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/patterns"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> All patterns
      </Link>

      <Card>
        <CardHeader>
          <Badge variant="info" className="w-fit">{pattern.category}</Badge>
          <CardTitle className="mt-2 text-3xl">{pattern.name}</CardTitle>
          <CardDescription className="max-w-3xl text-sm">{pattern.summary}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Diagram</CardTitle>
          <CardDescription className="text-xs">
            Interactive — hover nodes to inspect.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatternDiagram pattern={pattern} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-sm">Pros</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {pattern.pros.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> {p}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-sm">Cons</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {pattern.cons.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" /> {p}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">When to use</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {pattern.whenToUse.map((w) => (
                <li key={w} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> {w}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4" /> Enterprise implications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {pattern.enterpriseImplications.map((e) => (
                <li key={e} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> {e}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tool stack</CardTitle>
          <CardDescription className="text-xs">Suggested implementations.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {pattern.toolStack.map((slug) => {
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

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Scalability</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          {pattern.scalability}
        </CardContent>
      </Card>
    </div>
  );
}

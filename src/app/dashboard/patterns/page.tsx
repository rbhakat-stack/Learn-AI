import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PATTERNS } from "@/data/patterns";

export const metadata = { title: "Pattern Library" };

export default function PatternsIndex() {
  const grouped = PATTERNS.reduce<Record<string, typeof PATTERNS>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Architecture Pattern Library</h1>
        <p className="text-sm text-muted-foreground">
          Reusable blueprints with diagrams, tradeoffs, and enterprise implications.
        </p>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <section key={cat}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">{cat}</h2>
            <Badge variant="muted">{items.length}</Badge>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => (
              <Link key={p.id} href={`/dashboard/patterns/${p.slug}`} className="group">
                <Card className="sheen h-full transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40">
                  <CardHeader>
                    <Badge variant="info" className="w-fit text-[10px]">{p.category}</Badge>
                    <CardTitle className="mt-2 text-base group-hover:text-primary">{p.name}</CardTitle>
                    <CardDescription className="line-clamp-3 text-xs">{p.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {p.toolStack.slice(0, 4).map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

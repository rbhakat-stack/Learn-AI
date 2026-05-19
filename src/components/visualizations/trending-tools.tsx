"use client";

import Link from "next/link";
import { TrendingUp, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCompact } from "@/lib/utils";
import { categoryColor } from "@/data/categories";
import type { Tool } from "@/types";

export function TrendingTools({ tools }: { tools: Tool[] }) {
  return (
    <ul className="space-y-2">
      {tools.map((t, i) => (
        <li key={t.id}>
          <Link
            href={`/dashboard/ecosystem/${t.slug}`}
            className="group flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-secondary/50"
          >
            <span className="w-5 text-xs font-mono text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: categoryColor(t.category) }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium group-hover:text-primary">
                  {t.name}
                </span>
                {t.trending && (
                  <Badge variant="info" className="h-4 text-[9px]">
                    <TrendingUp className="mr-0.5 h-2.5 w-2.5" /> hot
                  </Badge>
                )}
              </div>
              <div className="truncate text-[10px] text-muted-foreground">
                {t.category}
              </div>
            </div>
            {t.community.githubStars ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <Star className="h-3 w-3" /> {formatCompact(t.community.githubStars)}
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

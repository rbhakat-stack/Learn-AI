"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Compass,
  Map,
  Lightbulb,
  Workflow,
  LayoutTemplate,
  GitCompare,
  Radar,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  Home
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/ecosystem", label: "Ecosystem Map", icon: Compass },
  { href: "/dashboard/roadmap", label: "Learning Roadmap", icon: GraduationCap },
  { href: "/dashboard/projects", label: "Project Ideas", icon: Lightbulb },
  { href: "/dashboard/workflow", label: "Workflow Designer", icon: Workflow },
  { href: "/dashboard/patterns", label: "Pattern Library", icon: LayoutTemplate },
  { href: "/dashboard/compare", label: "Tool Comparison", icon: GitCompare },
  { href: "/dashboard/radar", label: "Daily AI Radar", icon: Radar },
  { href: "/dashboard/governance", label: "Governance", icon: ShieldCheck }
] as const;

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-card/30 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border/60 px-5">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#8b5cf6,#22d3ee)] shadow-lg shadow-primary/30">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Agentic AI Lab</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            v0.1 · alpha
          </div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                active
                  ? "bg-primary/15 text-primary shadow-inner shadow-primary/10"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-transform group-hover:scale-110",
                  active && "text-primary"
                )}
              />
              {label}
              {active && (
                <span className="ml-auto h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_2px_hsl(var(--primary))]" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border/60 p-3">
        <div className="rounded-lg border border-border/60 bg-gradient-to-br from-primary/15 to-accent/10 p-3">
          <div className="text-xs font-medium">Mentor AI</div>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Ask: &ldquo;What should I learn next?&rdquo; — the recommender will scan
            your skill graph and bookmarked tools.
          </p>
          <Link
            href="/dashboard/mentor"
            className="mt-2 inline-flex text-[11px] font-medium text-primary hover:underline"
          >
            Open mentor →
          </Link>
        </div>
      </div>
    </aside>
  );
}

export { NAV };

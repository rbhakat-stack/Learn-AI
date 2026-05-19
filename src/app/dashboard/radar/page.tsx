import { Suspense } from "react";
import { RadarFeed } from "@/components/radar/feed";
import { RADAR } from "@/data/radar";

export const metadata = { title: "Daily AI Radar" };

export default function RadarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Daily AI Radar</h1>
        <p className="text-sm text-muted-foreground">
          A curated stream of releases, papers, MCP servers, demos, and trend signals.
        </p>
      </div>
      <Suspense>
        <RadarFeed items={RADAR} />
      </Suspense>
    </div>
  );
}

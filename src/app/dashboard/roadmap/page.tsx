import { Suspense } from "react";
import { RoadmapEngine } from "@/components/roadmap/engine";
import { ROADMAPS } from "@/data/roadmaps";

export const metadata = { title: "Learning Roadmap" };

export default function RoadmapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Learning Roadmap Engine</h1>
        <p className="text-sm text-muted-foreground">
          Pick a role and level — the engine assembles topics, tools, labs, and projects
          into a paced visual roadmap.
        </p>
      </div>
      <Suspense>
        <RoadmapEngine roadmaps={ROADMAPS} />
      </Suspense>
    </div>
  );
}

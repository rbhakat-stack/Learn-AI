import { Suspense } from "react";
import { ProjectIncubator } from "@/components/projects/incubator";
import { PROJECTS } from "@/data/projects";

export const metadata = { title: "Project Ideas" };

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Project Idea Generator</h1>
        <p className="text-sm text-muted-foreground">
          Curated, enterprise-grade project blueprints with architecture, cost, risk, and governance.
        </p>
      </div>
      <Suspense>
        <ProjectIncubator projects={PROJECTS} />
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";
import { EcosystemExplorer } from "@/components/ecosystem/explorer";
import { TOOLS } from "@/data/tools";
import { CATEGORIES } from "@/data/categories";

export const metadata = { title: "Ecosystem Map" };

export default function EcosystemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agentic AI Ecosystem Map</h1>
        <p className="text-sm text-muted-foreground">
          An interactive catalog of frameworks, protocols, and platforms across the agentic AI stack.
          Filter, inspect, and bookmark anything that fits your architecture.
        </p>
      </div>
      <Suspense>
        <EcosystemExplorer tools={TOOLS} categories={CATEGORIES} />
      </Suspense>
    </div>
  );
}

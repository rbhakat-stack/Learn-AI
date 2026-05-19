import { Suspense } from "react";
import { Comparator } from "@/components/compare/comparator";
import { TOOLS } from "@/data/tools";

export const metadata = { title: "Tool Comparison" };

export default function ComparePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tool Comparison Engine</h1>
        <p className="text-sm text-muted-foreground">
          Side-by-side decision matrices across architecture, governance, cost, and community.
        </p>
      </div>
      <Suspense>
        <Comparator tools={TOOLS} />
      </Suspense>
    </div>
  );
}

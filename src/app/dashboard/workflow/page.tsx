import { WorkflowDesigner } from "@/components/workflow/designer";

export const metadata = { title: "Workflow Designer" };

export default function WorkflowPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agent Workflow Designer</h1>
        <p className="text-sm text-muted-foreground">
          Compose agents, tools, memory, planners, evaluators, and human gates. Export the
          workflow as JSON to wire into LangGraph or your runtime of choice.
        </p>
      </div>
      <WorkflowDesigner />
    </div>
  );
}

import {
  Bot,
  Wrench,
  Brain,
  ListChecks,
  Gauge,
  UserCheck,
  Database,
  Network,
  Plug,
  Globe,
  Zap,
  type LucideIcon
} from "lucide-react";

export type WorkflowNodeKind =
  | "agent"
  | "tool"
  | "memory"
  | "planner"
  | "evaluator"
  | "human"
  | "vectordb"
  | "knowledgegraph"
  | "api"
  | "browser"
  | "trigger";

export interface NodeTypeMeta {
  kind: WorkflowNodeKind;
  label: string;
  description: string;
  color: string;
  icon: LucideIcon;
  defaults: Record<string, unknown>;
}

export const NODE_TYPES: NodeTypeMeta[] = [
  {
    kind: "trigger",
    label: "Trigger",
    description: "Event, schedule, or webhook that starts the workflow.",
    color: "#f59e0b",
    icon: Zap,
    defaults: { source: "webhook" }
  },
  {
    kind: "agent",
    label: "Agent",
    description: "LLM-backed agent with a system prompt and toolset.",
    color: "#8b5cf6",
    icon: Bot,
    defaults: { model: "claude-opus-4-7", temperature: 0.2 }
  },
  {
    kind: "planner",
    label: "Planner",
    description: "Produces a structured plan consumed by an executor.",
    color: "#a78bfa",
    icon: ListChecks,
    defaults: { model: "gpt-5" }
  },
  {
    kind: "tool",
    label: "Tool",
    description: "Callable function or MCP tool exposed to an agent.",
    color: "#f97316",
    icon: Wrench,
    defaults: { name: "http_request" }
  },
  {
    kind: "memory",
    label: "Memory",
    description: "Short-term, episodic, or semantic memory layer.",
    color: "#ec4899",
    icon: Brain,
    defaults: { tier: "long-term" }
  },
  {
    kind: "evaluator",
    label: "Evaluator",
    description: "LLM-as-judge or rules-based eval node.",
    color: "#22d3ee",
    icon: Gauge,
    defaults: { strategy: "llm-as-judge" }
  },
  {
    kind: "human",
    label: "Human approval",
    description: "Pause for a human to approve or edit.",
    color: "#34d399",
    icon: UserCheck,
    defaults: { sla: "24h" }
  },
  {
    kind: "vectordb",
    label: "Vector DB",
    description: "Semantic retrieval store.",
    color: "#06b6d4",
    icon: Database,
    defaults: { provider: "pgvector" }
  },
  {
    kind: "knowledgegraph",
    label: "Knowledge Graph",
    description: "Cypher-traversable graph store.",
    color: "#0ea5e9",
    icon: Network,
    defaults: { provider: "neo4j" }
  },
  {
    kind: "api",
    label: "API",
    description: "REST/GraphQL API call.",
    color: "#84cc16",
    icon: Plug,
    defaults: { method: "POST" }
  },
  {
    kind: "browser",
    label: "Browser",
    description: "Drive a real browser for web tasks.",
    color: "#fb7185",
    icon: Globe,
    defaults: { engine: "playwright" }
  }
];

export function nodeMeta(kind: WorkflowNodeKind) {
  return NODE_TYPES.find((n) => n.kind === kind) ?? NODE_TYPES[0];
}

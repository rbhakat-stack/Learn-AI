import type { ToolCategory } from "@/types";

export const CATEGORIES: Array<{
  name: ToolCategory;
  color: string;
  icon: string;
  description: string;
}> = [
  { name: "Agent Frameworks", color: "#8b5cf6", icon: "Bot", description: "Build single or simple agentic loops." },
  { name: "Multi-Agent Systems", color: "#a78bfa", icon: "Users", description: "Coordinate teams of specialized agents." },
  { name: "Memory Systems", color: "#ec4899", icon: "Brain", description: "Long- and short-term memory for agents." },
  { name: "RAG Frameworks", color: "#22d3ee", icon: "BookOpen", description: "Retrieve and ground with proprietary data." },
  { name: "Vector Databases", color: "#06b6d4", icon: "Database", description: "Semantic indexes for retrieval at scale." },
  { name: "Knowledge Graphs", color: "#0ea5e9", icon: "Network", description: "Explicit relationships for explainable AI." },
  { name: "AI Orchestration", color: "#34d399", icon: "GitBranch", description: "Compose, route, and govern LLM traffic." },
  { name: "Workflow Engines", color: "#10b981", icon: "Workflow", description: "Visual or code workflows with AI nodes." },
  { name: "Browser Automation", color: "#f59e0b", icon: "Globe", description: "Drive real browsers for web tasks." },
  { name: "Tool Calling", color: "#f97316", icon: "Wrench", description: "Catalogs of authenticated tools for agents." },
  { name: "MCP Ecosystem", color: "#fb7185", icon: "Plug", description: "Model Context Protocol clients and servers." },
  { name: "LLM Providers", color: "#e11d48", icon: "Sparkles", description: "Frontier model APIs and platforms." },
  { name: "Local AI", color: "#64748b", icon: "Server", description: "Run inference locally or on-prem." },
  { name: "Voice AI", color: "#9333ea", icon: "Mic", description: "Voice agents and realtime audio." },
  { name: "Computer Use Agents", color: "#7c3aed", icon: "Monitor", description: "Drive a desktop with a model." },
  { name: "Autonomous Coding", color: "#2563eb", icon: "Code", description: "End-to-end engineering agents." },
  { name: "Evaluation & Observability", color: "#0891b2", icon: "Activity", description: "Trace, eval, and govern." },
  { name: "AI Governance", color: "#84cc16", icon: "ShieldCheck", description: "Policy, audit, and responsible AI." },
  { name: "Synthetic Data", color: "#a3e635", icon: "Database", description: "Generate training and eval data." },
  { name: "AI Security", color: "#dc2626", icon: "Lock", description: "Prompt injection, abuse, and red-team." },
  { name: "Deployment Platforms", color: "#0d9488", icon: "Rocket", description: "Ship AI apps to production." },
  { name: "Open Source AI", color: "#16a34a", icon: "GitBranch", description: "OSS models, runtimes, datasets." },
  { name: "Enterprise AI Platforms", color: "#1d4ed8", icon: "Building2", description: "All-in-one private AI workspaces." }
];

export function categoryColor(name: ToolCategory) {
  return CATEGORIES.find((c) => c.name === name)?.color ?? "#8b5cf6";
}

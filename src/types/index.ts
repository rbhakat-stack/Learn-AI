export type ToolCategory =
  | "Agent Frameworks"
  | "Multi-Agent Systems"
  | "Memory Systems"
  | "RAG Frameworks"
  | "Vector Databases"
  | "Knowledge Graphs"
  | "AI Orchestration"
  | "Workflow Engines"
  | "Browser Automation"
  | "Tool Calling"
  | "MCP Ecosystem"
  | "LLM Providers"
  | "Local AI"
  | "Voice AI"
  | "Computer Use Agents"
  | "Autonomous Coding"
  | "Evaluation & Observability"
  | "AI Governance"
  | "Synthetic Data"
  | "AI Security"
  | "Deployment Platforms"
  | "Open Source AI"
  | "Enterprise AI Platforms";

export type Maturity = "experimental" | "emerging" | "production-ready" | "enterprise-grade";
export type Difficulty = "easy" | "medium" | "hard" | "expert";
export type PricingModel = "open-source" | "free-tier" | "usage-based" | "subscription" | "enterprise";

export interface Tool {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  tagline: string;
  description: string;
  capabilities: string[];
  maturity: Maturity;
  learningCurve: Difficulty;
  useCases: string[];
  pros: string[];
  cons: string[];
  architectureFit: string[];
  exampleWorkflow: string;
  pricing: PricingModel;
  community: {
    githubStars?: number;
    githubUrl?: string;
    discordMembers?: number;
    weeklyDownloads?: number;
  };
  docsUrl?: string;
  alternatives: string[]; // slugs
  enterpriseSignals: string[];
  tags: string[];
  logo?: string;
  trending?: boolean;
  releasedYear?: number;
}

export type Role =
  | "AI Architect"
  | "AI Engineer"
  | "Full-Stack AI Developer"
  | "Enterprise AI Leader"
  | "Product Leader"
  | "Pharma AI Consultant"
  | "Innovation Lead"
  | "Solution Architect";

export type Level = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  durationHours: number;
  topics: string[];
  tools: string[]; // slugs
  resources: Array<{ label: string; type: "doc" | "video" | "lab" | "paper" | "course"; url?: string }>;
  projects: string[]; // slugs
  outcomes: string[];
}

export interface Roadmap {
  id: string;
  role: Role;
  level: Level;
  summary: string;
  totalHours: number;
  nodes: RoadmapNode[];
}

export type ProjectComplexity = "starter" | "intermediate" | "production" | "enterprise";

export interface ProjectIdea {
  id: string;
  slug: string;
  title: string;
  domain: string; // e.g. "Pharma", "CRM", "Finance"
  complexity: ProjectComplexity;
  businessProblem: string;
  outcomes: string[];
  architecture: {
    components: string[];
    dataFlow: string[];
    diagramKey?: string;
  };
  toolStack: string[]; // tool slugs
  buildPhases: Array<{ phase: string; tasks: string[]; durationWeeks: number }>;
  costEstimate: { min: number; max: number; currency: "USD" };
  samplePrompts: string[];
  deployment: string[];
  risks: string[];
  governance: string[];
  enterpriseReadiness: number; // 0-100
  tags: string[];
}

export interface ArchitecturePattern {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  components: Array<{ id: string; label: string; type: string }>;
  flows: Array<{ from: string; to: string; label?: string }>;
  toolStack: string[];
  pros: string[];
  cons: string[];
  scalability: string;
  enterpriseImplications: string[];
  whenToUse: string[];
}

export interface RadarItem {
  id: string;
  type: "release" | "paper" | "trend" | "demo" | "mcp" | "video" | "tool";
  title: string;
  source: string;
  url?: string;
  summary: string;
  publishedAt: string; // ISO
  tags: string[];
  signal: 1 | 2 | 3 | 4 | 5;
}

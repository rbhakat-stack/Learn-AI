import type { Roadmap } from "@/types";

export const ROADMAPS: Roadmap[] = [
  {
    id: "r-1",
    role: "AI Engineer",
    level: "Beginner",
    summary:
      "Get fluent with LLMs, prompts, embeddings, and a first agentic RAG app — end-to-end.",
    totalHours: 48,
    nodes: [
      {
        id: "n1",
        title: "LLM fundamentals",
        description: "Tokenization, context, sampling, system + user roles, message APIs.",
        durationHours: 6,
        topics: ["tokens", "system prompts", "streaming", "structured outputs"],
        tools: ["openai", "anthropic"],
        resources: [
          { label: "Anthropic prompting guide", type: "doc" },
          { label: "OpenAI cookbook", type: "doc" }
        ],
        projects: [],
        outcomes: ["Can call a model with structured outputs", "Knows token economics"]
      },
      {
        id: "n2",
        title: "Embeddings + Vector Search",
        description: "Build intuition for embeddings, similarity, chunking, and re-ranking.",
        durationHours: 8,
        topics: ["embeddings", "chunking", "cosine similarity", "hybrid search"],
        tools: ["supabase", "qdrant"],
        resources: [{ label: "pgvector tutorial", type: "lab" }],
        projects: ["starter-rag-chatbot"],
        outcomes: ["Builds first vector search", "Tunes chunk size + overlap"]
      },
      {
        id: "n3",
        title: "Agentic RAG",
        description: "Agent decides when to retrieve, with multi-hop and citations.",
        durationHours: 12,
        topics: ["tool use", "agent loops", "citations"],
        tools: ["llamaindex", "langchain"],
        resources: [{ label: "Agentic RAG pattern", type: "doc" }],
        projects: ["internal-knowledge-portal"],
        outcomes: ["Ships first agentic RAG app with citations"]
      },
      {
        id: "n4",
        title: "Observability + evals",
        description: "Trace, eval, and dashboard your agent.",
        durationHours: 10,
        topics: ["tracing", "eval datasets", "regressions"],
        tools: ["langfuse", "phoenix"],
        resources: [],
        projects: [],
        outcomes: ["Has eval-gated deploys", "Sees per-run cost"]
      },
      {
        id: "n5",
        title: "Production deploy",
        description: "Ship to a real environment with logs, auth, and rate-limits.",
        durationHours: 12,
        topics: ["auth", "rate-limit", "secrets", "CI/CD"],
        tools: ["supabase", "litellm"],
        resources: [],
        projects: [],
        outcomes: ["First production deploy"]
      }
    ]
  },
  {
    id: "r-2",
    role: "AI Architect",
    level: "Advanced",
    summary:
      "Design an enterprise agent platform: gateway, policy, observability, evals, and multi-agent patterns.",
    totalHours: 96,
    nodes: [
      {
        id: "n1",
        title: "AI Operating Model",
        description: "Define the platform layer: gateway, policy, observability, eval, registry.",
        durationHours: 12,
        topics: ["operating model", "platform thinking"],
        tools: ["litellm", "langfuse", "helicone"],
        resources: [],
        projects: [],
        outcomes: ["Ratified operating model"]
      },
      {
        id: "n2",
        title: "Multi-agent orchestration",
        description: "Supervisor + specialist, reflection, handoffs, durable execution.",
        durationHours: 20,
        topics: ["supervisor", "handoffs", "durable workflows"],
        tools: ["langgraph", "crewai", "temporal"],
        resources: [],
        projects: ["pharma-competitive-intel"],
        outcomes: ["Ships a multi-agent crew with audits"]
      },
      {
        id: "n3",
        title: "GraphRAG + memory",
        description: "Hybrid KG + vector + tiered memory.",
        durationHours: 16,
        topics: ["graphrag", "memory hierarchy"],
        tools: ["neo4j", "weaviate", "mem0"],
        resources: [],
        projects: [],
        outcomes: ["Designs a memory + KG architecture"]
      },
      {
        id: "n4",
        title: "Governance + responsible AI",
        description: "Policy, PII, audit, eval gates, model risk.",
        durationHours: 16,
        topics: ["governance", "responsible AI"],
        tools: ["langfuse", "phoenix"],
        resources: [],
        projects: [],
        outcomes: ["Has a documented governance program"]
      },
      {
        id: "n5",
        title: "Cost + performance",
        description: "Routing, caching, batching, eval-driven model pinning.",
        durationHours: 16,
        topics: ["routing", "caching", "batching"],
        tools: ["litellm", "helicone"],
        resources: [],
        projects: [],
        outcomes: ["30-50% cost reduction roadmap"]
      },
      {
        id: "n6",
        title: "Industry blueprint",
        description: "Apply to your domain: pharma, finance, CRM, or DevX.",
        durationHours: 16,
        topics: ["industry blueprints"],
        tools: [],
        resources: [],
        projects: ["agentic-crm-copilot", "ai-decisioning-engine"],
        outcomes: ["A board-ready blueprint"]
      }
    ]
  },
  {
    id: "r-3",
    role: "Product Leader",
    level: "Intermediate",
    summary:
      "Build literacy to commission agentic AI products: define wedge, measure outcomes, govern risk.",
    totalHours: 30,
    nodes: [
      {
        id: "n1",
        title: "Agent product anatomy",
        description: "What an agent is, what it isn't, and how to scope wedges.",
        durationHours: 6,
        topics: ["agent vs assistant", "wedge selection"],
        tools: [],
        resources: [],
        projects: [],
        outcomes: ["Can write an agent PRD"]
      },
      {
        id: "n2",
        title: "Measurement + evals",
        description: "Outcome metrics, eval-driven roadmaps, regression budgets.",
        durationHours: 8,
        topics: ["eval-driven dev", "outcome metrics"],
        tools: ["langfuse"],
        resources: [],
        projects: [],
        outcomes: ["A metric stack for an AI product"]
      },
      {
        id: "n3",
        title: "Risk + governance",
        description: "Where humans must remain in the loop and how.",
        durationHours: 8,
        topics: ["HITL", "policy"],
        tools: [],
        resources: [],
        projects: [],
        outcomes: ["A risk + HITL plan"]
      },
      {
        id: "n4",
        title: "Pricing + ROI",
        description: "Token cost, latency budget, and unit economics.",
        durationHours: 8,
        topics: ["unit economics", "pricing"],
        tools: ["helicone"],
        resources: [],
        projects: [],
        outcomes: ["A unit-economics model"]
      }
    ]
  }
];

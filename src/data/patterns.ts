import type { ArchitecturePattern } from "@/types";

export const PATTERNS: ArchitecturePattern[] = [
  {
    id: "single-agent",
    slug: "single-agent",
    name: "Single Agent + Tools",
    category: "Foundational",
    summary:
      "One LLM agent equipped with a small set of tools, optional memory, and a system prompt. The simplest viable pattern.",
    components: [
      { id: "user", label: "User", type: "actor" },
      { id: "agent", label: "Agent", type: "agent" },
      { id: "tools", label: "Tools", type: "tools" },
      { id: "memory", label: "Memory (optional)", type: "memory" }
    ],
    flows: [
      { from: "user", to: "agent", label: "query" },
      { from: "agent", to: "tools", label: "invoke" },
      { from: "tools", to: "agent", label: "result" },
      { from: "agent", to: "memory", label: "write" },
      { from: "agent", to: "user", label: "answer" }
    ],
    toolStack: ["langchain", "openai-agents-sdk", "pydantic-ai"],
    pros: ["Low cost", "Easy to reason about", "Quick to ship"],
    cons: ["Limited for complex tasks", "Hard to specialize behavior"],
    scalability: "Trivial to scale horizontally; cost per call dominates.",
    enterpriseImplications: [
      "Easiest to govern (single prompt + tool set)",
      "Good first production target",
      "Pair with observability from day one"
    ],
    whenToUse: ["FAQ + Q&A", "Tool-augmented assistants", "POCs"]
  },
  {
    id: "planner-executor",
    slug: "planner-executor",
    name: "Planner-Executor",
    category: "Cognitive",
    summary:
      "Separate the LLM call that produces a plan from the LLM call(s) that execute each step — enables review, partial retry, and cost control.",
    components: [
      { id: "planner", label: "Planner", type: "agent" },
      { id: "executor", label: "Executor", type: "agent" },
      { id: "tools", label: "Tools", type: "tools" },
      { id: "memory", label: "Memory", type: "memory" }
    ],
    flows: [
      { from: "planner", to: "executor", label: "plan" },
      { from: "executor", to: "tools", label: "step" },
      { from: "tools", to: "executor", label: "result" },
      { from: "executor", to: "memory", label: "trace" }
    ],
    toolStack: ["langgraph", "crewai", "semantic-kernel"],
    pros: ["Plan visibility", "Cheaper executor model", "Easier to debug"],
    cons: ["Plan staleness", "Two-call latency"],
    scalability: "Bound by executor concurrency; plan caching helps.",
    enterpriseImplications: [
      "Plans become an audit artifact",
      "Easier to apply policy at plan boundary"
    ],
    whenToUse: ["Multi-step tasks", "Cost-sensitive automation"]
  },
  {
    id: "reflection-loop",
    slug: "reflection-loop",
    name: "Reflection Loop",
    category: "Cognitive",
    summary:
      "An actor agent produces an answer; a critic agent reviews it and either accepts or asks for revisions.",
    components: [
      { id: "actor", label: "Actor", type: "agent" },
      { id: "critic", label: "Critic", type: "agent" },
      { id: "memory", label: "Working memory", type: "memory" }
    ],
    flows: [
      { from: "actor", to: "critic", label: "draft" },
      { from: "critic", to: "actor", label: "feedback" },
      { from: "actor", to: "memory", label: "final" }
    ],
    toolStack: ["langgraph", "autogen", "dspy"],
    pros: ["Improves quality", "Catches obvious errors"],
    cons: ["Doubles cost", "Can loop indefinitely without budget"],
    scalability: "Cap loops; persist drafts for debugging.",
    enterpriseImplications: ["Critic prompts become governance levers"],
    whenToUse: ["High-stakes outputs", "Writing/research tasks"]
  },
  {
    id: "human-in-the-loop",
    slug: "human-in-the-loop",
    name: "Human-in-the-Loop",
    category: "Governance",
    summary:
      "Inject human approval at sensitive nodes — typically before irreversible actions (sending email, executing a transaction, merging code).",
    components: [
      { id: "agent", label: "Agent", type: "agent" },
      { id: "approval", label: "Approval gate", type: "human" },
      { id: "tools", label: "Tools", type: "tools" }
    ],
    flows: [
      { from: "agent", to: "approval", label: "request" },
      { from: "approval", to: "tools", label: "approved" }
    ],
    toolStack: ["langgraph", "temporal", "n8n"],
    pros: ["Lowers risk", "Builds trust", "Regulatory compliance"],
    cons: ["Adds latency", "Requires UX"],
    scalability: "Asynchronous approval queues scale linearly.",
    enterpriseImplications: ["Mandatory for finance, pharma, legal"],
    whenToUse: ["Regulated industries", "Irreversible actions"]
  },
  {
    id: "rag-plus-agent",
    slug: "rag-plus-agent",
    name: "Agentic RAG",
    category: "Retrieval",
    summary:
      "RAG retrieval is exposed as a tool that the agent decides when to call — with query rewriting, multi-hop, and re-ranking.",
    components: [
      { id: "agent", label: "Agent", type: "agent" },
      { id: "retriever", label: "Retriever", type: "tool" },
      { id: "vectordb", label: "Vector DB", type: "store" },
      { id: "reranker", label: "Re-ranker", type: "tool" },
      { id: "llm", label: "LLM", type: "model" }
    ],
    flows: [
      { from: "agent", to: "retriever", label: "query" },
      { from: "retriever", to: "vectordb", label: "search" },
      { from: "vectordb", to: "reranker", label: "candidates" },
      { from: "reranker", to: "agent", label: "passages" },
      { from: "agent", to: "llm", label: "synthesize" }
    ],
    toolStack: ["llamaindex", "langchain", "pinecone", "weaviate", "qdrant"],
    pros: ["Grounded answers", "Citations", "Cheap iteration"],
    cons: ["Retrieval quality is the ceiling", "Index drift"],
    scalability: "Vector DB scaling + retrieval caching dominate.",
    enterpriseImplications: ["Index lineage and citation audit are critical"],
    whenToUse: ["Internal knowledge bases", "Compliance Q&A", "Pharma research"]
  },
  {
    id: "multi-agent-supervisor",
    slug: "multi-agent-supervisor",
    name: "Multi-Agent Supervisor",
    category: "Multi-Agent",
    summary:
      "A supervisor routes work to specialist agents — researcher, analyst, writer — with shared memory and a final synthesizer.",
    components: [
      { id: "supervisor", label: "Supervisor", type: "agent" },
      { id: "researcher", label: "Researcher", type: "agent" },
      { id: "analyst", label: "Analyst", type: "agent" },
      { id: "writer", label: "Writer", type: "agent" },
      { id: "memory", label: "Shared memory", type: "memory" }
    ],
    flows: [
      { from: "supervisor", to: "researcher", label: "task" },
      { from: "supervisor", to: "analyst", label: "task" },
      { from: "supervisor", to: "writer", label: "task" },
      { from: "researcher", to: "memory" },
      { from: "analyst", to: "memory" },
      { from: "writer", to: "memory" }
    ],
    toolStack: ["langgraph", "crewai", "autogen"],
    pros: ["Specialization", "Parallelism", "Clear roles"],
    cons: ["Coordination overhead", "Cost explosion"],
    scalability: "Bound by supervisor latency; queue specialist work.",
    enterpriseImplications: ["Specialist prompts become reusable assets"],
    whenToUse: ["Research crews", "Content production", "Investigations"]
  },
  {
    id: "knowledge-graph-hybrid",
    slug: "knowledge-graph-hybrid",
    name: "Knowledge Graph + Vector Hybrid",
    category: "Retrieval",
    summary:
      "Use a knowledge graph for explicit relationships and a vector index for fuzzy retrieval — agents traverse both.",
    components: [
      { id: "agent", label: "Agent", type: "agent" },
      { id: "kg", label: "Knowledge Graph", type: "store" },
      { id: "vector", label: "Vector DB", type: "store" }
    ],
    flows: [
      { from: "agent", to: "kg", label: "traverse" },
      { from: "agent", to: "vector", label: "search" },
      { from: "kg", to: "agent", label: "facts" },
      { from: "vector", to: "agent", label: "passages" }
    ],
    toolStack: ["neo4j", "weaviate", "llamaindex"],
    pros: ["Explainability", "Multi-hop reasoning", "Strong precision"],
    cons: ["KG construction effort", "Two systems to operate"],
    scalability: "Plan for cache + replication on the KG side.",
    enterpriseImplications: ["Strong fit for pharma, finance, compliance"],
    whenToUse: ["Pharma KG + RAG", "Regulatory Q&A", "Lineage-bound search"]
  },
  {
    id: "event-driven-agents",
    slug: "event-driven-agents",
    name: "Event-Driven Agents",
    category: "Architecture",
    summary:
      "Agents react to events from a queue or stream — durable execution handles retries, timers, and signals.",
    components: [
      { id: "events", label: "Event Bus", type: "stream" },
      { id: "agent", label: "Agent worker", type: "agent" },
      { id: "tools", label: "Tools", type: "tools" }
    ],
    flows: [
      { from: "events", to: "agent", label: "trigger" },
      { from: "agent", to: "tools", label: "action" },
      { from: "agent", to: "events", label: "emit" }
    ],
    toolStack: ["temporal", "n8n", "litellm"],
    pros: ["Decoupling", "Resilience", "Replayable"],
    cons: ["More moving parts", "Harder local dev"],
    scalability: "Scales with workers; backpressure via queue.",
    enterpriseImplications: ["Audit and retry are native"],
    whenToUse: ["Operations automation", "AI for ITSM/CRM"]
  },
  {
    id: "agentic-crm",
    slug: "agentic-crm",
    name: "Agentic CRM",
    category: "Industry",
    summary:
      "Agents triage leads, draft outreach, summarize calls, and update CRM records — gated by approvals and audited.",
    components: [
      { id: "triager", label: "Lead Triager", type: "agent" },
      { id: "writer", label: "Outreach Writer", type: "agent" },
      { id: "summarizer", label: "Call Summarizer", type: "agent" },
      { id: "crm", label: "CRM (Salesforce/HubSpot)", type: "system" },
      { id: "human", label: "Sales rep", type: "human" }
    ],
    flows: [
      { from: "crm", to: "triager", label: "new lead" },
      { from: "triager", to: "writer", label: "score + plan" },
      { from: "writer", to: "human", label: "approve" },
      { from: "human", to: "crm", label: "send" },
      { from: "summarizer", to: "crm", label: "call notes" }
    ],
    toolStack: ["langgraph", "composio", "temporal"],
    pros: ["Operational lift", "Measurable ROI"],
    cons: ["Sensitive data handling", "Brand-voice risk"],
    scalability: "Per-account routing + queue control.",
    enterpriseImplications: ["PII redaction, GDPR/CCPA, brand governance"],
    whenToUse: ["Sales ops", "Customer success", "Account management"]
  },
  {
    id: "autonomous-research",
    slug: "autonomous-research",
    name: "Autonomous Research System",
    category: "Multi-Agent",
    summary:
      "Long-running research crew with browser, retrieval, and synthesis — produces structured reports with citations.",
    components: [
      { id: "supervisor", label: "Supervisor", type: "agent" },
      { id: "browser", label: "Browser agent", type: "agent" },
      { id: "retrieval", label: "Retrieval agent", type: "agent" },
      { id: "writer", label: "Writer agent", type: "agent" }
    ],
    flows: [
      { from: "supervisor", to: "browser" },
      { from: "supervisor", to: "retrieval" },
      { from: "browser", to: "writer" },
      { from: "retrieval", to: "writer" }
    ],
    toolStack: ["langgraph", "browser-use", "llamaindex", "neo4j"],
    pros: ["Replaces hours of analyst work"],
    cons: ["Cost", "Hallucination risk without citations"],
    scalability: "Plan budget + concurrency caps per crew run.",
    enterpriseImplications: ["Citations are mandatory", "Eval gates each report"],
    whenToUse: ["Pharma competitive intel", "Strategy briefs"]
  },
  {
    id: "memory-hierarchy",
    slug: "memory-hierarchy",
    name: "Agent Memory Hierarchy",
    category: "Memory",
    summary:
      "Tiered memory: working memory (context), short-term (session), long-term (vector), and structured (KG) — with consolidation.",
    components: [
      { id: "working", label: "Working", type: "memory" },
      { id: "short", label: "Short-term", type: "memory" },
      { id: "long", label: "Long-term", type: "memory" },
      { id: "kg", label: "Structured (KG)", type: "memory" }
    ],
    flows: [
      { from: "working", to: "short", label: "rollup" },
      { from: "short", to: "long", label: "consolidate" },
      { from: "long", to: "kg", label: "promote" }
    ],
    toolStack: ["mem0", "weaviate", "neo4j"],
    pros: ["Personalization", "Cost control over context windows"],
    cons: ["Consolidation policies are subtle"],
    scalability: "Async consolidation jobs.",
    enterpriseImplications: ["Memory is PII — must support deletion"],
    whenToUse: ["Long-running assistants", "Personalized copilots"]
  },
  {
    id: "ai-operating-model",
    slug: "ai-operating-model",
    name: "AI Operating Model",
    category: "Governance",
    summary:
      "Reference operating model: model gateway, policy layer, observability, eval, and lifecycle management around all agents.",
    components: [
      { id: "gateway", label: "LLM Gateway", type: "system" },
      { id: "policy", label: "Policy + guardrails", type: "system" },
      { id: "obs", label: "Observability", type: "system" },
      { id: "evals", label: "Evals", type: "system" },
      { id: "registry", label: "Agent registry", type: "system" }
    ],
    flows: [
      { from: "gateway", to: "policy" },
      { from: "policy", to: "obs" },
      { from: "obs", to: "evals" },
      { from: "registry", to: "gateway" }
    ],
    toolStack: ["litellm", "langfuse", "helicone", "phoenix"],
    pros: ["Org-wide governance", "Cost control", "Auditability"],
    cons: ["Upfront investment"],
    scalability: "Designed for scale-out from day one.",
    enterpriseImplications: ["Foundation for responsible AI"],
    whenToUse: ["Any enterprise with >3 production AI apps"]
  }
];

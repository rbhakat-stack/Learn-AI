import type { ProjectIdea } from "@/types";

export const PROJECTS: ProjectIdea[] = [
  {
    id: "p-1",
    slug: "pharma-competitive-intel",
    title: "Pharma Competitive Intelligence Crew",
    domain: "Pharma",
    complexity: "enterprise",
    businessProblem:
      "Strategy teams spend weeks producing competitive landscape briefs covering pipeline, trials, M&A, and label changes — most of which is publicly available but fragmented across PubMed, ClinicalTrials.gov, press releases, and earnings calls.",
    outcomes: [
      "Weekly competitive brief auto-generated with citations",
      "Trial event alerts within hours of publication",
      "Searchable knowledge graph of competitors, drugs, indications, and trials"
    ],
    architecture: {
      components: [
        "Supervisor agent",
        "Sources: PubMed, ClinicalTrials.gov, SEC, press release feeds",
        "Browser-use agent for paywalled pages",
        "GraphRAG over Neo4j",
        "Vector store (Weaviate or Pinecone)",
        "Writer agent + reflection critic",
        "Human review portal"
      ],
      dataFlow: [
        "Sources → ingestion (Airbyte/n8n)",
        "Extraction → entity linker → Neo4j",
        "Embedding → Weaviate",
        "Crew run → draft → critic → human-in-the-loop → publish"
      ]
    },
    toolStack: ["langgraph", "crewai", "neo4j", "weaviate", "browser-use", "langfuse", "anthropic"],
    buildPhases: [
      { phase: "Foundation", tasks: ["Set up gateway + observability", "Ingest pilot sources", "Build entity schema"], durationWeeks: 3 },
      { phase: "Crew v1", tasks: ["Supervisor + retrieval crew", "Writer + critic", "Eval harness"], durationWeeks: 4 },
      { phase: "Human portal", tasks: ["Approval UI", "Citations checker", "Brand-voice guardrail"], durationWeeks: 2 },
      { phase: "Hardening", tasks: ["KG lineage", "RBAC", "Audit logs"], durationWeeks: 3 }
    ],
    costEstimate: { min: 18000, max: 45000, currency: "USD" },
    samplePrompts: [
      "Brief me on changes to the GLP-1 competitive landscape in the last 14 days.",
      "Which Phase III trials shifted endpoints this quarter?",
      "Summarize earnings-call commentary on biosimilars by top 5 originators."
    ],
    deployment: ["Vercel (frontend)", "AWS ECS (workers)", "Supabase or self-hosted Postgres", "Neo4j Aura", "LangGraph Cloud for crew runs"],
    risks: [
      "Source TOS violations from over-aggressive scraping",
      "Hallucinated citations without strong grounding eval",
      "PII or MNPI accidentally ingested"
    ],
    governance: [
      "Mandatory citations on every claim",
      "Citation eval gate before publish",
      "MNPI scrubber on outbound text",
      "Audit log of every crew run"
    ],
    enterpriseReadiness: 78,
    tags: ["pharma", "research", "multi-agent", "graphrag"]
  },
  {
    id: "p-2",
    slug: "agentic-crm-copilot",
    title: "Agentic CRM Copilot",
    domain: "CRM",
    complexity: "production",
    businessProblem:
      "Sales reps lose hours each week to manual CRM hygiene, follow-up drafting, and call summarization. An agent copilot can do the toil while reps approve outbound communication.",
    outcomes: ["50% reduction in manual CRM updates", "Faster follow-up cycle", "Higher data quality in pipeline"],
    architecture: {
      components: ["Lead triager", "Outreach writer", "Call summarizer", "Approval UI", "CRM connector", "Audit log"],
      dataFlow: ["CRM signal", "Agent triage", "Draft recommendation", "Human approval", "CRM update", "Audit log"]
    },
    toolStack: ["langgraph", "composio", "anthropic", "supabase", "langfuse"],
    buildPhases: [
      { phase: "Connector + auth", tasks: ["OAuth to CRM", "Composio tools", "PII tagging"], durationWeeks: 2 },
      { phase: "Triage + writer", tasks: ["Triager prompt", "Brand voice eval", "Outreach drafts"], durationWeeks: 3 },
      { phase: "Approval UX", tasks: ["Approval queue UI", "Inline edit", "Send tracking"], durationWeeks: 2 }
    ],
    costEstimate: { min: 9000, max: 22000, currency: "USD" },
    samplePrompts: [
      "Triage today's new leads by ICP fit and recommend next action.",
      "Draft a follow-up to the discovery call with Acme — concise, no fluff."
    ],
    deployment: ["Vercel", "Supabase", "LangSmith"],
    risks: ["Brand-voice drift", "PII leakage", "Over-automation eroding rep judgment"],
    governance: ["Send-only-after-approval", "Brand-voice eval", "PII redaction at ingest"],
    enterpriseReadiness: 72,
    tags: ["crm", "sales", "agentic"]
  },
  {
    id: "p-3",
    slug: "internal-knowledge-portal",
    title: "Internal Knowledge Portal (Agentic RAG)",
    domain: "Knowledge Management",
    complexity: "intermediate",
    businessProblem:
      "Engineering, HR, and policy docs are scattered across Confluence, Notion, Drive, and Slack. Employees waste hours hunting for answers.",
    outcomes: ["One assistant to query all knowledge", "Citations to source docs", "Drift dashboards for stale content"],
    architecture: {
      components: ["Connector workers", "Embedder", "Vector store", "Re-ranker", "Citation UI"],
      dataFlow: ["Source connectors", "Chunk + embed", "Vector store", "Hybrid retrieval + rerank", "Cited answer"]
    },
    toolStack: ["llamaindex", "supabase", "anythingllm", "langfuse"],
    buildPhases: [
      { phase: "Ingest", tasks: ["Connectors", "Chunking", "Embeddings"], durationWeeks: 2 },
      { phase: "Retrieval", tasks: ["Hybrid retrieval", "Re-rank", "Eval set"], durationWeeks: 2 },
      { phase: "UX", tasks: ["Chat UI", "Citations", "Feedback loop"], durationWeeks: 2 }
    ],
    costEstimate: { min: 6000, max: 15000, currency: "USD" },
    samplePrompts: [
      "What's our policy on parental leave for India-based employees?",
      "Find the engineering RFC for our event bus migration."
    ],
    deployment: ["Vercel", "Supabase + pgvector"],
    risks: ["Stale docs surfacing as authoritative", "PII in indexed docs"],
    governance: ["Source-of-truth labeling", "Freshness scoring", "RBAC by document"],
    enterpriseReadiness: 65,
    tags: ["rag", "knowledge", "internal"]
  },
  {
    id: "p-4",
    slug: "ai-decisioning-engine",
    title: "AI Decisioning Engine (Underwriting)",
    domain: "Finance",
    complexity: "enterprise",
    businessProblem:
      "Underwriting decisions blend rules, models, and analyst judgement. A decisioning agent can pre-score, surface comps, and prepare a memo for review.",
    outcomes: ["Faster turnaround", "Consistent reasoning trail", "Better risk capture"],
    architecture: {
      components: ["Rules engine", "Risk model", "Agent for memo drafting", "Comps retriever", "Reviewer portal"],
      dataFlow: ["Application intake", "Rules + risk model score", "Comps retrieval", "Memo draft + critic", "Reviewer approval", "Decision + reason codes"]
    },
    toolStack: ["langgraph", "anthropic", "weaviate", "temporal", "langfuse"],
    buildPhases: [
      { phase: "Foundation", tasks: ["Gateway", "Rules engine", "Audit"], durationWeeks: 4 },
      { phase: "Agent", tasks: ["Memo drafter", "Reflection critic", "Eval"], durationWeeks: 4 },
      { phase: "Reviewer UX", tasks: ["Approve/decline", "Override capture"], durationWeeks: 3 }
    ],
    costEstimate: { min: 35000, max: 90000, currency: "USD" },
    samplePrompts: [
      "Score this application and explain the top three risk factors.",
      "Pull three comparable approved applications and summarize the differences."
    ],
    deployment: ["VPC deploy", "Vertex or Bedrock", "Temporal Cloud"],
    risks: ["Regulatory exposure", "Bias", "Explainability gaps"],
    governance: ["Model risk management", "Bias eval suite", "Reason-codes on every decision"],
    enterpriseReadiness: 88,
    tags: ["finance", "decisioning", "governance"]
  },
  {
    id: "p-5",
    slug: "voice-clinical-scribe",
    title: "Voice Clinical Scribe",
    domain: "Pharma / Health",
    complexity: "production",
    businessProblem:
      "Clinicians spend 2+ hours daily on documentation. A voice agent can listen, structure SOAP notes, and propose orders for review.",
    outcomes: ["Less documentation burden", "Structured EHR-ready notes", "Order suggestions with rationale"],
    architecture: {
      components: ["Realtime voice", "Speaker-diarization", "Note structurer", "Order suggester", "EHR connector"],
      dataFlow: ["Mic capture", "ASR + diarization", "PHI scrub", "SOAP note structuring", "Order suggestions", "Clinician review", "FHIR write-back"]
    },
    toolStack: ["openai", "anthropic", "langgraph", "neo4j", "langfuse"],
    buildPhases: [
      { phase: "Voice pipeline", tasks: ["Realtime ASR", "Diarization", "PHI scrubbing"], durationWeeks: 4 },
      { phase: "Notes + orders", tasks: ["Structurer", "Order suggester", "Reviewer UI"], durationWeeks: 5 },
      { phase: "EHR", tasks: ["FHIR connector", "Audit trail"], durationWeeks: 3 }
    ],
    costEstimate: { min: 40000, max: 110000, currency: "USD" },
    samplePrompts: [
      "Convert this visit transcript into a SOAP note and propose orders.",
      "Flag any order that needs a senior review."
    ],
    deployment: ["On-prem or HIPAA-eligible cloud", "FHIR-compatible connector"],
    risks: ["PHI exposure", "Order error harm", "Regulatory approval"],
    governance: ["PHI redaction", "Human-in-the-loop on orders", "Comprehensive audit"],
    enterpriseReadiness: 84,
    tags: ["health", "voice", "regulated"]
  },
  {
    id: "p-6",
    slug: "starter-rag-chatbot",
    title: "Starter RAG Chatbot",
    domain: "Beginner",
    complexity: "starter",
    businessProblem: "Learn the RAG fundamentals by building a chat over your own docs.",
    outcomes: ["Hands-on with embeddings", "Practice with retrieval + LLM", "A demoable chatbot"],
    architecture: {
      components: ["Markdown loader", "Embedder", "pgvector", "Chat UI"],
      dataFlow: ["Load markdown", "Chunk + embed", "pgvector store", "Similarity search", "LLM answer with citations"]
    },
    toolStack: ["llamaindex", "supabase", "openai"],
    buildPhases: [
      { phase: "Ingest", tasks: ["Load markdown", "Chunk + embed"], durationWeeks: 1 },
      { phase: "Retrieval", tasks: ["Similarity search", "Top-k"], durationWeeks: 1 },
      { phase: "UI", tasks: ["Chat input", "Streaming"], durationWeeks: 1 }
    ],
    costEstimate: { min: 0, max: 100, currency: "USD" },
    samplePrompts: ["Summarize the AI safety policy we just ingested."],
    deployment: ["Local + Vercel"],
    risks: ["Hallucinations on out-of-corpus questions"],
    governance: ["Source-only answers (refuse otherwise)"],
    enterpriseReadiness: 25,
    tags: ["starter", "rag", "tutorial"]
  },
  {
    id: "p-7",
    slug: "autonomous-coding-agent",
    title: "Autonomous Coding Agent for Internal Migrations",
    domain: "DevX",
    complexity: "production",
    businessProblem: "Codemods and migrations across hundreds of services consume engineering quarters.",
    outcomes: ["10x faster migrations", "Consistent application of patterns", "Auditable PR trail"],
    architecture: {
      components: ["Repo orchestrator", "Plan + patch agent", "Sandbox runner", "Reviewer UI"],
      dataFlow: ["Repo clone", "Plan generation", "Patch + run tests in sandbox", "PR draft", "Human review + merge"]
    },
    toolStack: ["claude-code", "openhands", "temporal", "langfuse"],
    buildPhases: [
      { phase: "Sandbox", tasks: ["Container runtime", "Repo access", "Test harness"], durationWeeks: 3 },
      { phase: "Agent", tasks: ["Plan", "Patch", "Tests"], durationWeeks: 3 },
      { phase: "Review UX", tasks: ["PR portal", "Approval"], durationWeeks: 2 }
    ],
    costEstimate: { min: 25000, max: 60000, currency: "USD" },
    samplePrompts: ["Migrate this service from Express to Fastify with passing tests."],
    deployment: ["Self-hosted runners", "GitHub App"],
    risks: ["Secrets in repos", "Flaky tests masking regressions"],
    governance: ["Secrets scanner pre-run", "Mandatory PR review"],
    enterpriseReadiness: 80,
    tags: ["devx", "coding", "migrations"]
  },
  {
    id: "p-8",
    slug: "ai-customer-success",
    title: "AI Customer Success Agent",
    domain: "Customer Success",
    complexity: "production",
    businessProblem: "Detect churn risk early; draft outreach; surface usage patterns for QBRs.",
    outcomes: ["Earlier churn intervention", "Higher NRR", "Less prep time for QBRs"],
    architecture: {
      components: ["Product event stream", "Risk scorer", "Outreach writer", "QBR builder"],
      dataFlow: ["Product + support events", "Risk scoring", "Account segmentation", "Outreach draft", "CSM approval", "QBR pack"]
    },
    toolStack: ["langgraph", "composio", "anthropic"],
    buildPhases: [
      { phase: "Events", tasks: ["Ingest product analytics", "Define risk signals"], durationWeeks: 2 },
      { phase: "Agent", tasks: ["Scorer", "Outreach", "QBR pack"], durationWeeks: 3 }
    ],
    costEstimate: { min: 10000, max: 30000, currency: "USD" },
    samplePrompts: ["Which accounts had a usage drop and a support ticket open this month?"],
    deployment: ["Vercel", "Snowflake/BigQuery connector"],
    risks: ["Tone errors in outreach", "Privacy by region"],
    governance: ["Tone eval", "Region-aware data handling"],
    enterpriseReadiness: 70,
    tags: ["cs", "saas", "analytics"]
  }
];

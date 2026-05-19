import type { RadarItem } from "@/types";

/**
 * Seed radar items. In production, these are populated by a scheduled ingestion job
 * that fans out across GitHub, ArXiv, RSS, and curated channels.
 */
export const RADAR: RadarItem[] = [
  {
    id: "r1",
    type: "release",
    title: "LangGraph adds time-travel debugging in v0.3",
    source: "LangChain Blog",
    summary:
      "New checkpointer model lets you rewind agent state and replay from any node — useful for production triage.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    tags: ["langgraph", "debugging", "release"],
    signal: 5
  },
  {
    id: "r2",
    type: "tool",
    title: "Composio launches MCP server registry",
    source: "Composio",
    summary:
      "200+ Composio integrations now exposed via the Model Context Protocol — installable in Claude Desktop and Cursor.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    tags: ["mcp", "composio", "integrations"],
    signal: 4
  },
  {
    id: "r3",
    type: "paper",
    title: "GraphRAG-Bench: a benchmark for hybrid retrieval",
    source: "ArXiv",
    summary:
      "New benchmark comparing GraphRAG, hybrid, and pure-vector retrieval across multi-hop questions.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    tags: ["paper", "graphrag", "eval"],
    signal: 4
  },
  {
    id: "r4",
    type: "demo",
    title: "Browser-Use Cloud: shared workspaces for web agents",
    source: "Browser Use",
    summary:
      "Hosted runtime with shared cookies, session replay, and observability for browser-driving agents.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    tags: ["browser", "cloud"],
    signal: 3
  },
  {
    id: "r5",
    type: "trend",
    title: "Agentic CRM is the breakout enterprise wedge of Q2",
    source: "Internal radar",
    summary:
      "Multiple enterprise pilots converged on the same pattern: triage + outreach + summarization with HITL.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    tags: ["trend", "crm"],
    signal: 4
  },
  {
    id: "r6",
    type: "video",
    title: "Building a planner-executor with LangGraph and Claude",
    source: "YouTube",
    summary: "End-to-end walkthrough with code, traces, and eval dashboards.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    tags: ["langgraph", "claude", "video"],
    signal: 3
  },
  {
    id: "r7",
    type: "release",
    title: "Mem0 adds episodic + semantic consolidation",
    source: "Mem0",
    summary:
      "Background consolidation jobs let you promote short-term events into structured long-term memory.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    tags: ["mem0", "memory"],
    signal: 3
  },
  {
    id: "r8",
    type: "mcp",
    title: "MCP draft spec adds resource subscriptions",
    source: "modelcontextprotocol.io",
    summary:
      "Servers can now push resource updates — useful for live datasets and dashboards inside agents.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    tags: ["mcp", "spec"],
    signal: 4
  }
];

"use client";

import { useCallback, useMemo, useState } from "react";
import {
  type Node,
  type Edge,
  type Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Plus, RotateCcw, Copy } from "lucide-react";
import { NODE_TYPES, type WorkflowNodeKind } from "./node-types";
import { WorkflowCustomNode } from "./custom-node";

const NODE_TYPES_MAP = { workflow: WorkflowCustomNode };

const INITIAL_NODES: Node[] = [
  {
    id: "n-trigger",
    type: "workflow",
    position: { x: 0, y: 100 },
    data: { kind: "trigger", label: "New lead webhook", subtitle: "POST /leads" }
  },
  {
    id: "n-planner",
    type: "workflow",
    position: { x: 260, y: 100 },
    data: { kind: "planner", label: "Triage planner", subtitle: "Build outreach plan" }
  },
  {
    id: "n-agent",
    type: "workflow",
    position: { x: 540, y: 40 },
    data: { kind: "agent", label: "Outreach agent", subtitle: "Drafts email" }
  },
  {
    id: "n-vectordb",
    type: "workflow",
    position: { x: 540, y: 180 },
    data: { kind: "vectordb", label: "Account memory", subtitle: "pgvector" }
  },
  {
    id: "n-human",
    type: "workflow",
    position: { x: 820, y: 40 },
    data: { kind: "human", label: "Sales rep approval", subtitle: "Inline review" }
  },
  {
    id: "n-tool",
    type: "workflow",
    position: { x: 1080, y: 40 },
    data: { kind: "tool", label: "Send via Gmail", subtitle: "Composio tool" }
  }
];

const INITIAL_EDGES: Edge[] = [
  { id: "e1", source: "n-trigger", target: "n-planner", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e2", source: "n-planner", target: "n-agent", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e3", source: "n-planner", target: "n-vectordb", markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e4", source: "n-vectordb", target: "n-agent", markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e5", source: "n-agent", target: "n-human", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e6", source: "n-human", target: "n-tool", animated: true, markerEnd: { type: MarkerType.ArrowClosed } }
];

function DesignerInner() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (conn: Connection) =>
      setEdges((eds) =>
        addEdge({ ...conn, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, eds)
      ),
    []
  );

  const addNode = (kind: WorkflowNodeKind) => {
    const id = `n-${kind}-${Date.now()}`;
    const meta = NODE_TYPES.find((n) => n.kind === kind)!;
    setNodes((n) => [
      ...n,
      {
        id,
        type: "workflow",
        position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 200 },
        data: { kind, label: meta.label, subtitle: meta.description }
      }
    ]);
  };

  const reset = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setSelectedNodeId(null);
  };

  const exported = useMemo(
    () =>
      JSON.stringify(
        {
          version: 1,
          nodes: nodes.map((n) => ({ id: n.id, position: n.position, data: n.data })),
          edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target }))
        },
        null,
        2
      ),
    [nodes, edges]
  );

  const copyJson = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(exported);
    }
  };

  const download = () => {
    const blob = new Blob([exported], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_300px]">
      {/* Palette */}
      <Card className="h-[640px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Node palette</CardTitle>
          <CardDescription className="text-xs">Click to add to canvas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5 overflow-y-auto">
          {NODE_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.kind}
                onClick={() => addNode(t.kind)}
                className="group flex w-full items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2.5 py-2 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-white"
                  style={{ background: t.color }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium">{t.label}</span>
                  <span className="block truncate text-[10px] text-muted-foreground">{t.description}</span>
                </span>
                <Plus className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Canvas */}
      <Card className="h-[640px] overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/60 bg-card/40 px-3 py-2">
          <div className="flex items-center gap-2">
            <Badge variant="info">{nodes.length} nodes</Badge>
            <Badge variant="muted">{edges.length} edges</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={copyJson}>
              <Copy className="h-3.5 w-3.5" /> Copy JSON
            </Button>
            <Button variant="gradient" size="sm" onClick={download}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>
        <div className="h-[calc(100%-44px)]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            nodeTypes={NODE_TYPES_MAP}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={24} size={1} color="hsl(var(--border))" />
            <Controls className="!bg-card !border-border" showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              maskColor="hsl(var(--background) / 0.7)"
              nodeColor={() => "hsl(var(--primary))"}
              style={{ background: "hsl(var(--card))" }}
            />
          </ReactFlow>
        </div>
      </Card>

      {/* Inspector + JSON */}
      <Card className="h-[640px] overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{selectedNode ? "Inspector" : "Workflow JSON"}</CardTitle>
          <CardDescription className="text-xs">
            {selectedNode
              ? `Edit ${(selectedNode.data as { label: string }).label}`
              : "Live JSON. Wire into LangGraph or any agent runtime."}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-72px)] overflow-auto">
          {selectedNode ? (
            <Inspector
              node={selectedNode}
              onChange={(label, subtitle) =>
                setNodes((ns) =>
                  ns.map((n) =>
                    n.id === selectedNode.id ? { ...n, data: { ...n.data, label, subtitle } } : n
                  )
                )
              }
              onDelete={() => {
                setNodes((ns) => ns.filter((n) => n.id !== selectedNode.id));
                setEdges((es) =>
                  es.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
                );
                setSelectedNodeId(null);
              }}
            />
          ) : (
            <pre className="rounded-md border border-border/60 bg-card/60 p-3 font-mono text-[10px] leading-relaxed">
              {exported}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Inspector({
  node,
  onChange,
  onDelete
}: {
  node: Node;
  onChange: (label: string, subtitle: string) => void;
  onDelete: () => void;
}) {
  const data = node.data as { label: string; subtitle?: string };
  return (
    <div className="space-y-3 text-xs">
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">Label</label>
        <input
          value={data.label}
          onChange={(e) => onChange(e.target.value, data.subtitle ?? "")}
          className="mt-1 h-8 w-full rounded-md border border-input bg-background/50 px-2 text-xs"
        />
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">Subtitle</label>
        <textarea
          value={data.subtitle ?? ""}
          onChange={(e) => onChange(data.label, e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-input bg-background/50 px-2 py-1.5 text-xs"
        />
      </div>
      <div className="pt-2">
        <Button variant="destructive" size="sm" onClick={onDelete}>Delete node</Button>
      </div>
    </div>
  );
}

export { DesignerInner as WorkflowDesigner };

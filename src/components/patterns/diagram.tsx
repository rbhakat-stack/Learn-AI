"use client";

import { useMemo } from "react";
import {
  type Node,
  type Edge,
  Background,
  Controls,
  ReactFlow,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ArchitecturePattern } from "@/types";
import { WorkflowCustomNode } from "@/components/workflow/custom-node";
import type { WorkflowNodeKind } from "@/components/workflow/node-types";

const NODE_TYPES = { workflow: WorkflowCustomNode };

const TYPE_TO_KIND: Record<string, WorkflowNodeKind> = {
  actor: "human",
  agent: "agent",
  tool: "tool",
  tools: "tool",
  memory: "memory",
  human: "human",
  store: "vectordb",
  model: "agent",
  system: "api",
  stream: "trigger"
};

/** Computes a simple left-to-right layered layout based on graph topology. */
function layout(pattern: ArchitecturePattern): { nodes: Node[]; edges: Edge[] } {
  const incoming = new Map<string, number>();
  pattern.components.forEach((c) => incoming.set(c.id, 0));
  pattern.flows.forEach((f) => incoming.set(f.to, (incoming.get(f.to) ?? 0) + 1));

  // Topological layering
  const layers = new Map<string, number>();
  const queue: string[] = [];
  pattern.components.forEach((c) => {
    if ((incoming.get(c.id) ?? 0) === 0) {
      layers.set(c.id, 0);
      queue.push(c.id);
    }
  });
  const work = new Map(incoming);
  while (queue.length) {
    const id = queue.shift()!;
    const layer = layers.get(id) ?? 0;
    pattern.flows
      .filter((f) => f.from === id)
      .forEach((f) => {
        layers.set(f.to, Math.max(layers.get(f.to) ?? 0, layer + 1));
        work.set(f.to, (work.get(f.to) ?? 0) - 1);
        if ((work.get(f.to) ?? 0) <= 0) queue.push(f.to);
      });
  }
  // Default any disconnected nodes to layer 0
  pattern.components.forEach((c) => {
    if (!layers.has(c.id)) layers.set(c.id, 0);
  });

  // Bucket by layer for y-positioning
  const buckets = new Map<number, string[]>();
  layers.forEach((layer, id) => {
    if (!buckets.has(layer)) buckets.set(layer, []);
    buckets.get(layer)!.push(id);
  });

  const X_GAP = 260;
  const Y_GAP = 110;

  const nodes: Node[] = pattern.components.map((c) => {
    const layer = layers.get(c.id) ?? 0;
    const bucket = buckets.get(layer)!;
    const idx = bucket.indexOf(c.id);
    return {
      id: c.id,
      type: "workflow",
      position: { x: layer * X_GAP, y: idx * Y_GAP },
      data: {
        kind: TYPE_TO_KIND[c.type] ?? "agent",
        label: c.label,
        subtitle: c.type
      }
    };
  });

  const edges: Edge[] = pattern.flows.map((f, i) => ({
    id: `e-${i}`,
    source: f.from,
    target: f.to,
    label: f.label,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "hsl(var(--primary))" },
    labelStyle: { fontSize: 10, fill: "hsl(var(--muted-foreground))" }
  }));

  return { nodes, edges };
}

export function PatternDiagram({ pattern }: { pattern: ArchitecturePattern }) {
  const { nodes, edges } = useMemo(() => layout(pattern), [pattern]);
  return (
    <div className="h-[480px] rounded-md border border-border/60 bg-card/30">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView
        nodesDraggable
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} size={1} color="hsl(var(--border))" />
        <Controls className="!bg-card !border-border" showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

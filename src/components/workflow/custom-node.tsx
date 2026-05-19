"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { nodeMeta, type WorkflowNodeKind } from "./node-types";
import { cn } from "@/lib/utils";

export interface WorkflowNodeData extends Record<string, unknown> {
  kind: WorkflowNodeKind;
  label: string;
  subtitle?: string;
}

export function WorkflowCustomNode({ data, selected }: NodeProps) {
  const d = data as WorkflowNodeData;
  const meta = nodeMeta(d.kind);
  const Icon = meta.icon;
  return (
    <div
      className={cn(
        "group min-w-[200px] rounded-xl border bg-card/80 backdrop-blur transition-all",
        selected ? "border-primary shadow-lg shadow-primary/20" : "border-border/70"
      )}
    >
      <div
        className="flex items-center gap-2 rounded-t-xl px-3 py-2 text-xs font-medium"
        style={{
          background: `linear-gradient(90deg, ${meta.color}22, transparent)`,
          borderBottom: `1px solid ${meta.color}33`
        }}
      >
        <span
          className="grid h-6 w-6 place-items-center rounded-md text-white"
          style={{ background: meta.color }}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="text-foreground">{meta.label}</span>
      </div>
      <div className="px-3 py-2">
        <div className="text-sm font-medium leading-tight">{d.label}</div>
        {d.subtitle && (
          <div className="mt-0.5 line-clamp-2 text-[10px] text-muted-foreground">
            {d.subtitle}
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

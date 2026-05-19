import {
  ShieldCheck,
  AlertTriangle,
  Eye,
  Users,
  ClipboardCheck,
  Lock,
  DollarSign,
  Boxes,
  Recycle,
  FileText,
  Gauge,
  HeartHandshake,
  type LucideIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Topic = {
  icon: LucideIcon;
  title: string;
  summary: string;
  bullets: string[];
  signal: "core" | "advanced";
};

const TOPICS: Topic[] = [
  {
    icon: ShieldCheck,
    title: "AI Safety",
    summary: "Reduce harmful outputs, jailbreaks, and unsafe tool invocations.",
    bullets: [
      "Layered defenses: system prompts, classifiers, output checks",
      "Refusal patterns + jailbreak resistance evals",
      "Sandbox tool execution; least-privilege credentials"
    ],
    signal: "core"
  },
  {
    icon: AlertTriangle,
    title: "Hallucination Control",
    summary: "Ground responses in retrieval, citations, and structured outputs.",
    bullets: [
      "Mandatory citations for high-stakes answers",
      "Refuse-when-unsure prompts + confidence calibration",
      "Eval gates that fail on uncited claims"
    ],
    signal: "core"
  },
  {
    icon: Eye,
    title: "Agent Observability",
    summary: "Trace every step: tools, retrievals, sub-agent handoffs, costs.",
    bullets: [
      "OpenTelemetry spans across agent runs",
      "Replayable checkpoints and time-travel debugging",
      "Per-tool latency + error budgets"
    ],
    signal: "core"
  },
  {
    icon: Users,
    title: "Human Oversight",
    summary: "Insert approval gates at irreversible or sensitive steps.",
    bullets: [
      "Async approval queues with SLAs",
      "Override capture: what the human changed and why",
      "Reviewer-only telemetry dashboards"
    ],
    signal: "core"
  },
  {
    icon: ClipboardCheck,
    title: "Compliance",
    summary: "GDPR, HIPAA, SOC2, EU AI Act readiness for AI workloads.",
    bullets: [
      "Data residency + sub-processor control",
      "Right-to-delete plumbed through memory layers",
      "Audit trails immutable for the retention window"
    ],
    signal: "advanced"
  },
  {
    icon: Lock,
    title: "Security",
    summary: "Prompt injection, data exfiltration, and supply-chain risk.",
    bullets: [
      "Strict separation of system + tool + user content",
      "Outbound egress controls on agent runtimes",
      "Signed MCP servers + tool allowlists"
    ],
    signal: "core"
  },
  {
    icon: DollarSign,
    title: "Cost Governance",
    summary: "Routing, caching, batching, and budget guardrails.",
    bullets: [
      "Cost per task and per tenant",
      "Model routing by cost + latency + quality",
      "Daily/weekly budget alerts"
    ],
    signal: "core"
  },
  {
    icon: Boxes,
    title: "AI Operating Model",
    summary: "Org-wide platform layer for every AI workload.",
    bullets: [
      "Centralized gateway, policy, observability, eval, registry",
      "Federation across product teams",
      "Steering committee + monthly review cadence"
    ],
    signal: "advanced"
  },
  {
    icon: Recycle,
    title: "Agent Lifecycle Management",
    summary: "Versioning, rollout, rollback, deprecation.",
    bullets: [
      "Semantic versioning of prompts + agent graphs",
      "Shadow + canary rollouts with eval gates",
      "Deprecation windows for retired agents"
    ],
    signal: "advanced"
  },
  {
    icon: FileText,
    title: "Prompt Governance",
    summary: "Treat prompts as code: review, version, eval.",
    bullets: [
      "Prompt registry with diff + review",
      "Linked eval datasets per prompt",
      "Promotion criteria: dev → staging → prod"
    ],
    signal: "core"
  },
  {
    icon: Gauge,
    title: "Evaluation Frameworks",
    summary: "Eval-driven development for AI systems.",
    bullets: [
      "Offline datasets + online sampling",
      "LLM-as-judge with calibration",
      "Regression budgets per release"
    ],
    signal: "core"
  },
  {
    icon: HeartHandshake,
    title: "Responsible AI",
    summary: "Fairness, transparency, and user trust.",
    bullets: [
      "Bias audits across demographics",
      "Model cards + data sheets",
      "Clear disclosure when AI is in the loop"
    ],
    signal: "advanced"
  }
];

export const metadata = { title: "Enterprise AI Governance" };

export default function GovernancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Enterprise AI Governance</h1>
        <p className="text-sm text-muted-foreground">
          A reference body of knowledge for shipping agentic AI responsibly at scale.
        </p>
      </div>

      <Card className="glass overflow-hidden">
        <CardHeader>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Badge variant="info">Operating model</Badge>
              <CardTitle className="mt-2 text-xl">
                Twelve domains every enterprise AI program must cover
              </CardTitle>
              <CardDescription className="max-w-3xl text-sm">
                Treat governance as a platform — not a checklist. The same plumbing that
                makes agents safer also makes them faster to ship and cheaper to run.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TOPICS.map((t) => (
          <Card key={t.title} className="sheen">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
                  <t.icon className="h-4 w-4" />
                </span>
                <Badge variant={t.signal === "core" ? "info" : "muted"}>{t.signal}</Badge>
              </div>
              <CardTitle className="mt-3 text-base">{t.title}</CardTitle>
              <CardDescription className="text-xs">{t.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-xs">
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> {b}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

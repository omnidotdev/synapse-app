import { createFileRoute } from "@tanstack/react-router";
import {
  ActivityIcon,
  LayersIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react";

import { InternalLink } from "@/components/core";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

/** Static SVG showing request routing through the Synapse hub. */
function RoutingDiagram() {
  const providers = [
    { cx: 240, cy: 40, label: "LLM" },
    { cx: 250, cy: 82, label: "MCP" },
    { cx: 250, cy: 124, label: "STT" },
    { cx: 240, cy: 166, label: "TTS" },
  ];

  const outputPaths = [
    "M 162 96 Q 200 40 230 40",
    "M 162 100 Q 210 82 240 82",
    "M 162 104 Q 210 124 240 124",
    "M 162 108 Q 200 166 230 166",
  ];

  return (
    <svg
      viewBox="0 0 290 206"
      className="h-auto w-full max-w-xs"
      fill="none"
      role="img"
      aria-label="Diagram showing API requests routed through Synapse to multiple providers"
    >
      <circle
        cx="42"
        cy="103"
        r="16"
        fill="var(--primary)"
        fillOpacity={0.12}
        stroke="var(--primary)"
        strokeOpacity={0.7}
        strokeWidth={1.5}
      />
      <text
        x={42}
        y={107}
        textAnchor="middle"
        fill="var(--primary)"
        fontSize={9}
        fontWeight={500}
      >
        Req
      </text>
      <circle
        cx="142"
        cy="103"
        r="24"
        fill="var(--primary)"
        fillOpacity={0.12}
        stroke="var(--primary)"
        strokeWidth={1.5}
      />
      <text
        x={142}
        y={100}
        textAnchor="middle"
        fill="var(--foreground)"
        fontSize={9}
        fontWeight={600}
      >
        Synapse
      </text>
      <text
        x={142}
        y={112}
        textAnchor="middle"
        fill="var(--muted-foreground)"
        fontSize={7}
      >
        Router
      </text>
      {providers.map((node) => (
        <g key={node.label}>
          <circle
            cx={node.cx}
            cy={node.cy}
            r="12"
            fill="var(--secondary)"
            fillOpacity={0.12}
            stroke="var(--secondary)"
            strokeOpacity={0.7}
            strokeWidth={1.2}
          />
          <text
            x={node.cx}
            y={node.cy + 3}
            textAnchor="middle"
            fill="var(--secondary)"
            fontSize={7}
            fontWeight={500}
          >
            {node.label}
          </text>
        </g>
      ))}
      <line
        x1="60"
        y1="103"
        x2="116"
        y2="103"
        stroke="var(--primary)"
        strokeOpacity={0.5}
        strokeWidth={1.5}
        strokeDasharray="6 4"
        strokeLinecap="round"
      />
      {outputPaths.map((d) => (
        <path
          key={d}
          d={d}
          stroke="var(--secondary)"
          strokeOpacity={0.5}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

const features = [
  {
    icon: ZapIcon,
    title: "Unified Routing",
    description:
      "Route to any model with automatic fallback chains, cost optimization, and latency-aware selection",
    color: "primary" as const,
  },
  {
    icon: ActivityIcon,
    title: "Live Analytics",
    description:
      "Track tokens, latency, and spend across every provider in real time with per-key breakdowns",
    color: "secondary" as const,
  },
  {
    icon: ShieldCheckIcon,
    title: "Scoped Keys",
    description:
      "Fine-grained API keys with auto-rotation, audit trails, rate limits, and per-model permissions",
    color: "primary" as const,
  },
  {
    icon: LayersIcon,
    title: "Multi-Provider",
    description:
      "Connect OpenAI, Anthropic, and more through a single endpoint with unified request formatting",
    color: "secondary" as const,
  },
];

/** Landing page */
function HomePage() {
  return (
    <div className="flex flex-col">
      {/* hero */}
      <section className="flex flex-col items-center px-4 pt-20 pb-24 text-center sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40">
        <h1 className="pb-1 font-bold text-4xl text-shimmer sm:text-5xl lg:text-7xl">
          Synapse
        </h1>
        <p className="mt-3 font-medium text-base text-foreground lg:text-lg">
          The cortex for your AI stack
        </p>
        <p className="mt-4 max-w-md text-muted-foreground text-sm leading-relaxed sm:max-w-lg sm:text-base">
          Route to any model, track every token, and manage your keys through
          one unified control plane
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <InternalLink to="/dashboard" variant="unstyled">
            <Button variant="gradient" size="lg">
              Get Started
            </Button>
          </InternalLink>
          <InternalLink to="/pricing" variant="unstyled">
            <Button variant="outline" size="lg">
              View Pricing
            </Button>
          </InternalLink>
        </div>
      </section>

      {/* features */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="card-glow-hover rounded-xl border border-border bg-card p-6 transition-shadow"
            >
              <div
                className={`mb-4 flex size-10 items-center justify-center rounded-lg bg-${color}/10 text-${color}`}
              >
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold text-foreground dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* routing diagram + code snippet */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-24">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          {/* routing diagram */}
          <div className="flex flex-col items-center rounded-xl border border-border bg-card p-8">
            <h3 className="mb-2 font-semibold text-foreground text-lg dark:text-white">
              Intelligent Routing
            </h3>
            <p className="mb-6 text-center text-muted-foreground text-sm">
              Auto-select the best model based on cost, latency, or capability
              -- with built-in fallback chains
            </p>
            <RoutingDiagram />
          </div>

          {/* code snippet */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-border border-b px-6 py-2.5">
              <div className="size-2.5 rounded-full bg-primary/20" />
              <div className="size-2.5 rounded-full bg-secondary/20" />
              <div className="size-2.5 rounded-full bg-muted-foreground/20" />
              <span className="ml-2 font-mono text-muted-foreground text-xs">
                POST /v1/route
              </span>
            </div>
            <pre className="overflow-x-auto p-6 font-mono text-sm leading-relaxed">
              <div className="text-muted-foreground">{"{"}</div>
              <div>
                {"  "}
                <span className="text-foreground dark:text-white">
                  &quot;model&quot;
                </span>
                {": "}
                <span className="text-secondary">&quot;auto&quot;</span>,
              </div>
              <div>
                {"  "}
                <span className="text-foreground dark:text-white">
                  &quot;providers&quot;
                </span>
                {": ["}
                <span className="text-secondary">&quot;openai&quot;</span>
                {", "}
                <span className="text-secondary">&quot;anthropic&quot;</span>
                {"],"}
              </div>
              <div>
                {"  "}
                <span className="text-foreground dark:text-white">
                  &quot;strategy&quot;
                </span>
                {": "}
                <span className="text-secondary">
                  &quot;cost-optimized&quot;
                </span>
                ,
              </div>
              <div>
                {"  "}
                <span className="text-foreground dark:text-white">
                  &quot;fallback&quot;
                </span>
                {": "}
                <span className="text-primary">true</span>
              </div>
              <div className="text-muted-foreground">{"}"}</div>
            </pre>
          </div>
        </div>
      </section>

      {/* bottom cta */}
      <section className="flex flex-col items-center px-4 pb-24 text-center">
        <h2 className="font-bold text-2xl text-shimmer sm:text-3xl">
          Ready to unify your AI stack?
        </h2>
        <p className="mt-3 max-w-md text-muted-foreground text-sm">
          Start routing requests through Synapse in minutes. Free tier included,
          no credit card required.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <InternalLink to="/dashboard" variant="unstyled">
            <Button variant="gradient" size="lg">
              Get Started
            </Button>
          </InternalLink>
          <InternalLink to="/pricing" variant="unstyled">
            <Button variant="outline" size="lg">
              View Pricing
            </Button>
          </InternalLink>
        </div>
      </section>
    </div>
  );
}

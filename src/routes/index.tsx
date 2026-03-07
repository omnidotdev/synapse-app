import { createFileRoute, redirect } from "@tanstack/react-router";
import { ActivityIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";
import { useRef } from "react";

import { InternalLink } from "@/components/core";
import {
  HeroGraph,
  MetricsCharts,
  NeuralBackground,
} from "@/components/landing";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context: { auth } }) => {
    if (auth) throw redirect({ to: "/dashboard" });
  },
  component: HomePage,
});

/** Small label chip shown on each node section. */
function NodeChip({ id, label }: { id: string; label: string }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2">
      <span className="font-mono text-primary/60 text-xs">{id}</span>
      <span className="h-px w-8 bg-primary/20" />
      <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

/** Animated SVG showing request routing through the Synapse hub. */
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
      <circle
        cx="142"
        cy="103"
        r="24"
        fill="none"
        stroke="var(--primary)"
        strokeOpacity={0.15}
        strokeWidth={1.5}
      >
        <animate
          attributeName="r"
          values="24;34;24"
          dur="2.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0;0.6"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>
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
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-10"
          dur="1s"
          repeatCount="indefinite"
        />
      </line>
      {outputPaths.map((d, i) => (
        <path
          key={d}
          d={d}
          stroke="var(--secondary)"
          strokeOpacity={0.5}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-10"
            dur="1.2s"
            begin={`${i * 0.15}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}
    </svg>
  );
}

/**
 * Home page — neural network node graph layout.
 */
function HomePage() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <div className="relative z-[1]">
      <NeuralBackground />

      {/* Hero: full-viewport neural graph */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center overflow-hidden"
        style={{ height: "calc(100vh - 66px)" }}
      >
        <HeroGraph heroRef={heroRef} />

        {/* Hero text — pill-shaped soma node */}
        <div
          data-node="soma"
          className="soma-pill soma-ring relative z-10 flex flex-col items-center rounded-full px-10 py-8 text-center sm:px-16 sm:py-10"
          style={{ marginTop: "calc((100vh - 66px) / 2 - 5rem)" }}
        >
          <NodeChip id="node_00" label="soma" />
          <h1 className="pb-1 font-bold text-4xl text-shimmer sm:text-5xl lg:text-7xl">
            Synapse
          </h1>
          <p className="mt-3 font-medium text-base text-foreground lg:text-lg">
            The cortex for your AI stack
          </p>
          <p className="mt-3 max-w-xs text-muted-foreground text-sm leading-relaxed sm:max-w-sm">
            Route to any model, track every token, and manage your keys through
            one unified control plane
          </p>
        </div>

        {/* CTA buttons — below soma ring */}
        <div className="relative z-10 mt-6 flex flex-wrap justify-center gap-3">
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

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 opacity-40">
          <span className="font-mono text-muted-foreground text-xs">
            explore network
          </span>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            aria-hidden="true"
          >
            <g>
              <path
                d="M8 4 L8 20 M4 16 L8 20 L12 16"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="2s"
                repeatCount="indefinite"
              />
            </g>
          </svg>
        </div>
      </section>

      {/* Below-fold content nodes */}
      <div className="relative mx-auto max-w-5xl px-4 py-20">
        {/* Axon spine */}
        <div
          aria-hidden="true"
          className="axon-spine pointer-events-none absolute top-0 bottom-0 left-1/2 w-px"
        />

        {/* Node 01: Metrics charts */}
        <div className="mb-24 flex justify-end">
          <div className="node-panel w-full max-w-md rounded-2xl p-8 lg:max-w-lg">
            <NodeChip id="node_01" label="metrics" />
            <MetricsCharts />
          </div>
        </div>

        {/* Node 02: Routing diagram */}
        <div className="mb-24 flex justify-start">
          <div className="node-panel w-full max-w-md rounded-2xl p-8 lg:max-w-lg">
            <NodeChip id="node_02" label="routing engine" />
            <h3 className="mb-4 font-semibold text-lg">Intelligent Routing</h3>
            <p className="mb-6 text-muted-foreground text-sm">
              Auto-select the best model based on cost, latency, or capability —
              with built-in fallback chains that never let you down.
            </p>
            <RoutingDiagram />
          </div>
        </div>

        {/* Node 03: Code snippet */}
        <div className="mb-24 flex justify-end">
          <div className="node-panel w-full max-w-md overflow-hidden rounded-2xl lg:max-w-lg">
            <div className="p-8 pb-0">
              <NodeChip id="node_03" label="api terminal" />
            </div>
            {/* Terminal chrome */}
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
                <span className="text-foreground">&quot;model&quot;</span>
                {": "}
                <span className="text-secondary">&quot;auto&quot;</span>,
              </div>
              <div>
                {"  "}
                <span className="text-foreground">&quot;providers&quot;</span>
                {": ["}
                <span className="text-secondary">&quot;openai&quot;</span>
                {", "}
                <span className="text-secondary">&quot;anthropic&quot;</span>
                {"],"}
              </div>
              <div>
                {"  "}
                <span className="text-foreground">&quot;strategy&quot;</span>
                {": "}
                <span className="text-secondary">
                  &quot;cost-optimized&quot;
                </span>
                ,
              </div>
              <div>
                {"  "}
                <span className="text-foreground">&quot;fallback&quot;</span>
                {": "}
                <span className="text-primary">true</span>
              </div>
              <div className="text-muted-foreground">{"}"}</div>
            </pre>
          </div>
        </div>

        {/* Nodes 04–06: Feature leaf nodes */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="node-panel rounded-2xl p-6">
            <NodeChip id="node_04" label="routing" />
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ZapIcon className="size-5" />
            </div>
            <h3 className="font-semibold">Auto Routing</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Auto-select the best model based on cost, latency, or capability.
              Built-in fallback chains
            </p>
          </div>

          <div className="node-panel rounded-2xl p-6">
            <NodeChip id="node_05" label="analytics" />
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <ActivityIcon className="size-5" />
            </div>
            <h3 className="font-semibold">Live Analytics</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Track tokens, latency, and spend across every provider in real
              time
            </p>
          </div>

          <div className="node-panel rounded-2xl p-6">
            <NodeChip id="node_06" label="keys" />
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheckIcon className="size-5" />
            </div>
            <h3 className="font-semibold">Scoped Keys</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Fine-grained API keys with auto-rotation, audit trails, and rate
              limits
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 flex flex-col items-center text-center">
          <h2 className="font-bold text-2xl text-shimmer sm:text-3xl">
            Ready to unify your AI stack?
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground text-sm">
            Start routing requests through Synapse in minutes. Free tier
            included, no credit card required.
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
        </div>
      </div>
    </div>
  );
}

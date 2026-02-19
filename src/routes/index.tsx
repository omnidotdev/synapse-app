import { createFileRoute, redirect } from "@tanstack/react-router";
import { ActivityIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";

import { InternalLink } from "@/components/core";
import HeroGraph from "@/components/landing/HeroGraph";
import NeuralBackground from "@/components/landing/NeuralBackground";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context: { auth } }) => {
    if (auth) throw redirect({ to: "/dashboard" });
  },
  component: HomePage,
});

/**
 * Animated SVG showing request routing through the Synapse hub.
 */
const RoutingDiagram = () => {
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
      className="h-auto w-full"
      fill="none"
      role="img"
      aria-label="Diagram showing API requests routed through Synapse to multiple providers"
    >
      {/* Request input node */}
      <circle
        cx="42"
        cy="103"
        r="16"
        fill="var(--primary)"
        fillOpacity={0.06}
        stroke="var(--primary)"
        strokeOpacity={0.5}
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

      {/* Synapse hub */}
      <circle
        cx="142"
        cy="103"
        r="24"
        fill="var(--primary)"
        fillOpacity={0.06}
        stroke="var(--primary)"
        strokeWidth={1.5}
      />
      {/* Pulse ring */}
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

      {/* Provider nodes */}
      {providers.map((node) => (
        <g key={node.label}>
          <circle
            cx={node.cx}
            cy={node.cy}
            r="12"
            fill="var(--secondary)"
            fillOpacity={0.06}
            stroke="var(--secondary)"
            strokeOpacity={0.5}
            strokeWidth={1}
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

      {/* Input path: request -> hub */}
      <line
        x1="60"
        y1="103"
        x2="116"
        y2="103"
        stroke="var(--primary)"
        strokeOpacity={0.35}
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

      {/* Output paths: hub -> providers */}
      {outputPaths.map((d, i) => (
        <path
          key={d}
          d={d}
          stroke="var(--secondary)"
          strokeOpacity={0.35}
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
};

/**
 * Home page with bento grid layout.
 */
function HomePage() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 py-6 lg:py-10">
      <NeuralBackground />
      <HeroGraph />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/4 size-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/3 size-[400px] rounded-full bg-secondary/5 blur-[120px]" />

      {/* Bento grid */}
      <div className="relative grid gap-4 lg:grid-cols-3">
        {/* Hero cell */}
        <div className="glass-panel rounded-xl p-8 lg:col-span-2 lg:p-12">
          <p className="mb-3 font-mono text-muted-foreground text-xs uppercase tracking-widest">
            AI Router
          </p>
          <h1 className="pb-1 font-bold text-5xl text-shimmer sm:text-6xl">
            Synapse
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            The cortex for your AI stack
          </p>
          <p className="mt-4 max-w-md text-muted-foreground text-sm">
            Route to any model, track every token, and manage your keys — all
            through one unified control plane
          </p>

          <div className="mt-8 flex gap-3">
            <InternalLink to="/pricing" variant="unstyled">
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

        {/* Stats cell */}
        <div className="glass-panel flex flex-col justify-center gap-6 rounded-xl p-6">
          <div>
            <p className="font-bold text-4xl text-gradient">50+</p>
            <p className="text-muted-foreground text-sm">Models supported</p>
          </div>
          <div className="h-px bg-border" />
          <div>
            <p className="font-bold text-4xl text-gradient">&lt;50ms</p>
            <p className="text-muted-foreground text-sm">Routing overhead</p>
          </div>
          <div className="h-px bg-border" />
          <div>
            <p className="font-bold text-4xl text-gradient">99.9%</p>
            <p className="text-muted-foreground text-sm">Uptime SLA</p>
          </div>
        </div>

        {/* Routing diagram cell */}
        <div className="card-glow-hover glass-panel flex items-center justify-center rounded-xl p-6">
          <RoutingDiagram />
        </div>

        {/* Code snippet cell */}
        <div className="card-glow-hover glass-panel overflow-hidden rounded-xl lg:col-span-2">
          {/* Terminal chrome */}
          <div className="flex items-center gap-2 border-border border-b px-4 py-2.5">
            <div className="size-2.5 rounded-full bg-primary/20" />
            <div className="size-2.5 rounded-full bg-secondary/20" />
            <div className="size-2.5 rounded-full bg-muted-foreground/20" />
            <span className="ml-2 font-mono text-muted-foreground text-xs">
              POST /v1/route
            </span>
          </div>

          <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
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
              <span className="text-secondary">&quot;cost-optimized&quot;</span>
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

        {/* Feature: Intelligent Routing */}
        <div className="card-glow-hover glass-panel rounded-xl p-6">
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ZapIcon className="size-5" />
          </div>
          <h3 className="font-semibold">Intelligent Routing</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Auto-select the best model based on cost, latency, or capability.
            Built-in fallback chains
          </p>
        </div>

        {/* Feature: Live Analytics */}
        <div className="card-glow-hover glass-panel rounded-xl p-6">
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <ActivityIcon className="size-5" />
          </div>
          <h3 className="font-semibold">Live Analytics</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Track tokens, latency, and spend across every provider in real time
          </p>
        </div>

        {/* Feature: Scoped Keys */}
        <div className="card-glow-hover glass-panel rounded-xl p-6">
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
    </div>
  );
}

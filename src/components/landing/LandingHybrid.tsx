import "@/lib/util/patchThreeClock";

import { Button } from "@omnidotdev/thornberry/button";
import { OrbitControls, Preload } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ActivityIcon,
  LayersIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Color, Matrix4 } from "three";

import { InternalLink } from "@/components/core";
import NeuralGraph from "@/components/landing/NeuralGraph";

import type { FC } from "react";
import type { InstancedMesh } from "three";

/** Ref-based elapsed time tracker that avoids the deprecated THREE.Clock */
function useElapsedRef() {
  const ref = useRef(0);

  useEffect(() => {
    ref.current = 0;
  }, []);

  return ref;
}

const contentNodes = [
  {
    type: "feature" as const,
    icon: ZapIcon,
    nodeId: "node_01",
    title: "Unified Routing",
    description:
      "Route to any model with automatic fallback chains, cost optimization, and latency-aware selection",
    iconClasses: "bg-primary/10 text-primary dark:text-primary-300",
  },
  {
    type: "feature" as const,
    icon: ActivityIcon,
    nodeId: "node_02",
    title: "Live Analytics",
    description:
      "Track tokens, latency, and spend across every provider in real time with per-key breakdowns",
    iconClasses: "bg-secondary/10 text-secondary",
  },
  {
    type: "feature" as const,
    icon: ShieldCheckIcon,
    nodeId: "node_03",
    title: "Scoped Keys",
    description:
      "Fine-grained API keys with auto-rotation, audit trails, rate limits, and per-model permissions",
    iconClasses: "bg-primary/10 text-primary dark:text-primary-300",
  },
  {
    type: "feature" as const,
    icon: LayersIcon,
    nodeId: "node_04",
    title: "Multi-Provider",
    description:
      "Connect OpenAI, Anthropic, and more through a single endpoint with unified request formatting",
    iconClasses: "bg-secondary/10 text-secondary",
  },
];

const providers = [
  { cx: 240, cy: 40, label: "LLM" },
  { cx: 250, cy: 82, label: "MCP" },
  { cx: 250, cy: 124, label: "STT" },
  { cx: 240, cy: 166, label: "TTS" },
];

const outputPaths = [
  "M 166 96 Q 200 40 230 40",
  "M 166 100 Q 210 82 240 82",
  "M 166 104 Q 210 124 240 124",
  "M 166 108 Q 200 166 230 166",
];

function RoutingDiagram() {
  return (
    <svg
      viewBox="0 0 290 206"
      className="h-auto w-full max-w-xs"
      fill="none"
      role="img"
      aria-label="Diagram showing API requests routed through Synapse to multiple providers"
    >
      <style>
        {`
          @keyframes flowDash {
            to { stroke-dashoffset: -20; }
          }
          .routing-line {
            animation: flowDash 1.5s linear infinite;
          }
        `}
      </style>
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
        className="routing-line"
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
          className="routing-line"
        />
      ))}
    </svg>
  );
}

/** Subtle ambient particle mesh for the fixed background */
const AmbientBackground: FC = () => {
  const ref = useRef<InstancedMesh>(null);
  const elapsed = useElapsedRef();
  const count = 50;
  const spread = 16;

  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      arr.push([
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 2.5,
        (Math.random() - 0.5) * 4 - 3,
      ]);
    }
    return arr;
  }, []);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    elapsed.current += delta;
    const t = elapsed.current;
    const mat = new Matrix4();
    for (let i = 0; i < count; i++) {
      const [x, y, z] = positions[i];
      mat.setPosition(
        x + Math.sin(t * 0.12 + i) * 0.1,
        y + Math.cos(t * 0.08 + i * 0.3) * 0.1,
        z,
      );
      ref.current.setMatrixAt(i, mat);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshBasicMaterial
        color={new Color("#6366f1")}
        transparent
        opacity={0.08}
      />
    </instancedMesh>
  );
};

/** 3D hero graph + ambient background behind scrollable content */
const LandingHybrid: FC = () => {
  return (
    <div className="relative flex flex-col">
      {/* Fixed ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <AmbientBackground />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      {/* Hero */}
      <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-visible px-4 py-24 sm:py-28">
        {/* 3D neural graph backdrop (ambient, framed behind the headline) */}
        <div
          className="pointer-events-none absolute inset-0 overflow-visible opacity-35 sm:opacity-45"
          style={{ touchAction: "pan-y" }}
        >
          <Canvas
            camera={{ position: [0, 0, 7], fov: 50 }}
            style={{
              background: "transparent",
              overflow: "visible",
              touchAction: "pan-y",
            }}
            gl={{ alpha: true, antialias: true }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <NeuralGraph showAmbient={false} />
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                enableRotate={false}
                autoRotate
                autoRotateSpeed={0.25}
                maxPolarAngle={Math.PI * 0.62}
                minPolarAngle={Math.PI * 0.38}
              />
              <Preload all />
            </Suspense>
          </Canvas>
        </div>

        {/* Legibility scrim: fades the graph to near-solid background behind the
            headline so the type stays crisp while the graph frames the edges */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 56% 50% at 50% 46%, transparent 0%, color-mix(in oklch, var(--background) 82%, transparent) 48%, var(--background) 74%)",
          }}
        />

        {/* Brand glow */}
        <div
          className="pointer-events-none absolute top-[42%] left-1/2 z-[2] size-[680px] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--primary) 30%, transparent) 0%, transparent 62%)",
          }}
        />

        {/* Headline */}
        <div className="pointer-events-auto relative z-10 flex max-w-4xl select-text flex-col items-center text-center [text-shadow:0_1px_30px_var(--background)]">
          <h1 className="font-bold font-display text-5xl text-foreground leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl dark:text-white">
            One endpoint for{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent [-webkit-text-fill-color:transparent]">
              every model
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-base text-muted-foreground leading-relaxed sm:text-lg">
            Route, fail over, and meter every LLM, embedding, image, MCP, STT,
            and TTS provider through a single API. Bring your own keys, no token
            tax, fully self-hostable.
          </p>
          <div className="pointer-events-auto mt-8 flex flex-wrap justify-center gap-3">
            <InternalLink to="/dashboard" variant="unstyled">
              <Button
                variant="solid"
                size="lg"
                className="text-sm sm:text-base"
              >
                Get Started Free
              </Button>
            </InternalLink>
            <InternalLink to="/pricing" variant="unstyled">
              <Button
                variant="outline"
                size="lg"
                className="text-sm sm:text-base"
              >
                View Pricing
              </Button>
            </InternalLink>
          </div>
          <p className="mt-6 font-mono text-[11px] text-muted-foreground/60 tracking-wide">
            OpenAI- &amp; Anthropic-compatible · BYOK · Apache-2.0
          </p>
        </div>
      </section>

      {/* Control plane */}
      <section className="relative mx-auto w-full max-w-5xl px-4 py-14 sm:py-20 lg:py-24">
        <div className="mb-9 max-w-2xl sm:mb-12">
          <h2 className="font-display font-semibold text-2xl text-foreground leading-tight tracking-tight sm:text-4xl dark:text-white">
            Everything between your app and the models.
          </h2>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
          {/* Feature nodes (01-04) */}
          {contentNodes.map(
            ({ icon: Icon, title, description, iconClasses, nodeId }) => {
              const accent = iconClasses.includes("secondary")
                ? "text-secondary"
                : "text-primary";
              return (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-lg border border-border/70 bg-foreground/[0.015] p-5 transition-colors hover:border-primary/40 sm:p-6 dark:bg-white/[0.02] dark:hover:bg-white/[0.035]"
                >
                  <span className="absolute top-4 right-4 font-mono text-[10px] text-muted-foreground/35 tracking-wider">
                    {nodeId}
                  </span>
                  <Icon className={`size-5 ${accent}`} strokeWidth={1.6} />
                  <h3 className="mt-4 font-medium text-base text-foreground sm:text-lg dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
                    {description}
                  </p>
                  {/* hover underline accent */}
                  <span
                    className={`absolute bottom-0 left-0 h-px w-0 transition-all duration-300 group-hover:w-full ${accent.replace("text-", "bg-")}`}
                  />
                </div>
              );
            },
          )}

          {/* Routing diagram (node_05) */}
          <div className="group relative flex flex-col items-center overflow-hidden rounded-lg border border-border/70 bg-foreground/[0.015] p-5 transition-colors hover:border-primary/40 sm:p-6 dark:bg-white/[0.02] dark:hover:bg-white/[0.035]">
            <span className="absolute top-3 right-3 font-mono text-[10px] text-muted-foreground/40 tracking-wider sm:top-4 sm:right-4">
              node_05
            </span>
            <h3 className="mb-2 font-semibold text-base text-foreground sm:text-lg dark:text-white">
              Intelligent Routing
            </h3>
            <p className="mb-4 text-center text-muted-foreground text-xs sm:text-sm">
              Auto-select the best model based on cost, latency, or capability
              -- with built-in fallback chains
            </p>
            <RoutingDiagram />
            <span className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </div>

          {/* Code snippet (node_06) */}
          <div className="group relative self-start overflow-hidden rounded-lg border border-border/70 bg-foreground/[0.015] transition-colors hover:border-secondary/40 dark:bg-white/[0.02] dark:hover:bg-white/[0.035]">
            <div className="flex items-center gap-2 border-border border-b px-4 py-2 sm:px-5 sm:py-2.5">
              <div className="size-2 rounded-full bg-primary/20 sm:size-2.5" />
              <div className="size-2 rounded-full bg-secondary/20 sm:size-2.5" />
              <div className="size-2 rounded-full bg-muted-foreground/20 sm:size-2.5" />
              <span className="ml-2 font-mono text-[10px] text-muted-foreground sm:text-xs">
                POST /v1/route
              </span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground/40 tracking-wider">
                node_06
              </span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed sm:p-5 sm:text-sm">
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
            <span className="absolute bottom-0 left-0 h-px w-0 bg-secondary transition-all duration-300 group-hover:w-full" />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="flex flex-col items-center px-4 pb-16 text-center sm:pb-20 lg:pb-24">
        <h2 className="font-bold font-display text-3xl text-foreground tracking-tight sm:text-4xl lg:text-5xl dark:text-white">
          Point your SDK at Synapse.
        </h2>
        <p className="mt-3 max-w-md text-muted-foreground text-sm">
          Keep your OpenAI or Anthropic client, change the base URL, and get
          routing, failover, and metering for free.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:mt-6 sm:gap-3">
          <InternalLink to="/dashboard" variant="unstyled">
            <Button variant="solid" size="lg" className="text-sm sm:text-base">
              Get Started
            </Button>
          </InternalLink>
          <InternalLink to="/pricing" variant="unstyled">
            <Button
              variant="outline"
              size="lg"
              className="text-sm sm:text-base"
            >
              View Pricing
            </Button>
          </InternalLink>
        </div>
      </section>
    </div>
  );
};

export default LandingHybrid;

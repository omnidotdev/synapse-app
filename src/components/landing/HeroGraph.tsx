import EdgeCanvas from "./EdgeCanvas";

import type { RefObject } from "react";

type SatelliteNode = {
  id: string;
  label: string;
  sublabel?: string;
  /** Percentage from left edge */
  x: number;
  /** Percentage from top edge */
  y: number;
  /** Circle radius in px */
  r: number;
  color: "primary" | "secondary";
};

const SATELLITES: SatelliteNode[] = [
  { id: "api", label: "API", x: 10.5, y: 50, r: 26, color: "primary" },
  {
    id: "metrics",
    label: "Metrics",
    sublabel: "<50ms · 99.9%",
    x: 83,
    y: 25,
    r: 36,
    color: "secondary",
  },
  {
    id: "router",
    label: "Router",
    sublabel: "50+ models",
    x: 80,
    y: 74,
    r: 34,
    color: "secondary",
  },
  { id: "models", label: "Models", x: 32, y: 16, r: 26, color: "primary" },
  {
    id: "analytics",
    label: "Analytics",
    x: 25,
    y: 78,
    r: 30,
    color: "secondary",
  },
  { id: "keys", label: "Keys", x: 89, y: 52, r: 28, color: "primary" },
];

type HeroGraphProps = {
  heroRef: RefObject<HTMLElement | null>;
};

/**
 * Canvas + HTML hybrid neural graph hero visualization.
 *
 * Satellite nodes are HTML elements positioned by percentage. Edges are drawn
 * on a canvas overlay that reads actual DOM positions, so edges always connect
 * regardless of viewport size.
 */
function HeroGraph({ heroRef }: HeroGraphProps) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <EdgeCanvas containerRef={heroRef} />

      {SATELLITES.map((node) => {
        const diameter = node.r * 2;
        const haloDur = `${2 + Math.abs(Math.round(node.x * 10) % 3) * 0.4}s`;
        const colorVar = `var(--${node.color})`;

        return (
          <div
            key={node.id}
            data-node={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {/* Halo pulse ring */}
            <div
              className="satellite-halo absolute rounded-full"
              style={{
                width: diameter,
                height: diameter,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                border: `1px solid ${colorVar}`,
                opacity: 0.12,
                animationDuration: haloDur,
              }}
            />

            {/* Main circle */}
            <div
              className="satellite-glow flex flex-col items-center justify-center rounded-full"
              style={{
                width: diameter,
                height: diameter,
                background: `radial-gradient(ellipse at center, color-mix(in oklch, ${colorVar}, transparent 86%), color-mix(in oklch, ${colorVar}, transparent 96%))`,
                border: `1.5px solid color-mix(in oklch, ${colorVar}, transparent 30%)`,
              }}
            >
              <span
                className="font-semibold leading-none"
                style={{
                  fontSize: node.r < 30 ? 8 : 10,
                  color: colorVar,
                }}
              >
                {node.label}
              </span>
              {node.sublabel && (
                <span
                  className="mt-0.5 leading-none opacity-70"
                  style={{
                    fontSize: 7,
                    color: colorVar,
                  }}
                >
                  {node.sublabel}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HeroGraph;

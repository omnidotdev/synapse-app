import { useCallback, useEffect, useRef } from "react";

import type { RefObject } from "react";

type Point = { x: number; y: number };

type Edge = {
  from: string;
  to: string;
};

const EDGES: Edge[] = [
  { from: "soma", to: "api" },
  { from: "soma", to: "metrics" },
  { from: "soma", to: "router" },
  { from: "soma", to: "models" },
  { from: "soma", to: "analytics" },
  { from: "soma", to: "keys" },
  { from: "metrics", to: "keys" },
];

/** Resolve a CSS custom property to an RGB string for canvas. */
function resolveColor(varName: string, opacity: number): string {
  const el = document.documentElement;
  const raw = getComputedStyle(el).getPropertyValue(varName).trim();

  // Create a temporary element to let the browser resolve oklch/etc to rgb
  const tmp = document.createElement("div");
  tmp.style.color = raw;
  document.body.appendChild(tmp);
  const resolved = getComputedStyle(tmp).color;
  tmp.remove();

  // Parse rgb(r, g, b) or rgba(r, g, b, a)
  const match = resolved.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
  );
  if (!match) return `rgba(99, 102, 241, ${opacity})`;

  return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${opacity})`;
}

/** Compute cubic bezier control points with perpendicular offset. */
function computeControlPoints(
  a: Point,
  b: Point,
): [Point, Point, Point, Point] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  // Perpendicular unit vector
  const nx = len > 0 ? -dy / len : 0;
  const ny = len > 0 ? dx / len : 0;
  // Pull amount — subtle curve
  const pull = len * 0.15;

  return [
    a,
    { x: a.x + dx / 3 + nx * pull, y: a.y + dy / 3 + ny * pull },
    { x: a.x + (2 * dx) / 3 + nx * pull, y: a.y + (2 * dy) / 3 + ny * pull },
    b,
  ];
}

/** Get a point at parameter t along a cubic bezier. */
function getPointOnCubicBezier(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number,
): Point {
  const u = 1 - t;
  const uu = u * u;
  const uuu = uu * u;
  const tt = t * t;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

/** Draw a single dashed edge with glow. */
function drawDashedEdge(
  ctx: CanvasRenderingContext2D,
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  strokeColor: string,
  dashOffset: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  ctx.setLineDash([6, 5]);
  ctx.lineDashOffset = dashOffset;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.strokeStyle = strokeColor;
  ctx.shadowColor = strokeColor;
  ctx.shadowBlur = 6;
  ctx.stroke();
  ctx.restore();
}

/** Draw a signal dot at a position. */
function drawSignalDot(
  ctx: CanvasRenderingContext2D,
  pos: Point,
  color: string,
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.restore();
}

type EdgeCanvasProps = {
  containerRef: RefObject<HTMLElement | null>;
};

/** Canvas overlay that draws animated edges between `[data-node]` elements. */
function EdgeCanvas({ containerRef }: EdgeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const colorsRef = useRef({ stroke: "", signal: "" });
  const reducedMotionRef = useRef(false);

  const updateColors = useCallback(() => {
    colorsRef.current = {
      stroke: resolveColor("--primary", 0.4),
      signal: resolveColor("--signal", 1),
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reduced motion check
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = motionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    motionQuery.addEventListener("change", onMotionChange);

    // Resolve initial colors
    updateColors();

    // Watch theme changes via class on <html>
    const themeObserver = new MutationObserver(() => updateColors());
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Handle resize and HiDPI
    const syncSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resizeObserver = new ResizeObserver(() => syncSize());
    resizeObserver.observe(container);
    syncSize();

    // Get node center positions relative to container
    const getNodeCenter = (id: string): Point | null => {
      const el = container.querySelector(`[data-node="${id}"]`);
      if (!el) return null;
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      return {
        x: elRect.left - containerRect.left + elRect.width / 2,
        y: elRect.top - containerRect.top + elRect.height / 2,
      };
    };

    // Animation loop
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const { stroke, signal } = colorsRef.current;
      const reduced = reducedMotionRef.current;

      for (let i = 0; i < EDGES.length; i++) {
        const edge = EDGES[i];
        const fromPos = getNodeCenter(edge.from);
        const toPos = getNodeCenter(edge.to);
        if (!fromPos || !toPos) continue;

        const [p0, p1, p2, p3] = computeControlPoints(fromPos, toPos);

        // Dash animation: 11px/sec
        const dashOffset = reduced ? 0 : -(elapsed * 11) % 11;
        drawDashedEdge(ctx, p0, p1, p2, p3, stroke, dashOffset);

        if (!reduced) {
          // Signal dots — 2 per edge, staggered by half period
          const period = 2.0 + i * 0.2; // Vary period per edge
          const t1 = ((elapsed + i * 0.3) % period) / period;
          const t2 = ((elapsed + i * 0.3 + period / 2) % period) / period;

          const pos1 = getPointOnCubicBezier(p0, p1, p2, p3, t1);
          const pos2 = getPointOnCubicBezier(p0, p1, p2, p3, t2);

          drawSignalDot(ctx, pos1, signal);
          drawSignalDot(ctx, pos2, signal);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [containerRef, updateColors]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

export default EdgeCanvas;

/**
 * Ambient neural network background texture.
 *
 * Renders a fixed full-viewport SVG with ~52 micro-nodes and connecting edges,
 * producing a faint brain-tissue texture. Purely decorative.
 */

// Define PRNG at module scope
const makeRng = (seed: number) => {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

type Edge = { x1: number; y1: number; x2: number; y2: number };

const NODE_COUNT = 52;
const rng = makeRng(0xdeadbeef);

const NODES = Array.from({ length: NODE_COUNT }, (_, i) => ({
  id: i,
  x: rng() * 100,
  y: rng() * 100,
  r: 1.2 + rng() * 1.8,
  delay: rng() * 8,
}));

const EDGES: Edge[] = [];
for (let i = 0; i < NODE_COUNT; i++) {
  for (let j = i + 1; j < NODE_COUNT; j++) {
    const dx = NODES[i].x - NODES[j].x;
    const dy = NODES[i].y - NODES[j].y;
    if (Math.sqrt(dx * dx + dy * dy) < 22) {
      EDGES.push({
        x1: NODES[i].x,
        y1: NODES[i].y,
        x2: NODES[j].x,
        y2: NODES[j].y,
      });
    }
  }
}

function NeuralBackground() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 100 100"
    >
      {EDGES.map((e, i) => (
        <line
          // biome-ignore lint/suspicious/noArrayIndexKey: stable deterministic order
          key={i}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke="var(--primary)"
          strokeOpacity={0.035}
          strokeWidth={0.15}
        />
      ))}
      {NODES.map((n) => (
        <circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill="var(--primary)"
          fillOpacity={0.07}
          style={{
            animation: `neural-float ${6 + n.delay}s ease-in-out ${n.delay}s infinite`,
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        />
      ))}
    </svg>
  );
}

export default NeuralBackground;

/**
 * Ambient neural network background texture.
 *
 * Renders a fixed full-viewport SVG with ~52 micro-nodes and connecting edges,
 * producing a faint brain-tissue texture. Purely decorative.
 */
function NeuralBackground() {
  const rand = (seed: number) => {
    let s = seed;
    return () => {
      s |= 0;
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const rng = rand(0xdeadbeef);

  const NODE_COUNT = 52;
  const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
    id: i,
    x: rng() * 100,
    y: rng() * 100,
    r: 1.2 + rng() * 1.8,
    delay: rng() * 8,
  }));

  const edges: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < 22) {
        edges.push({
          x1: nodes[i].x,
          y1: nodes[i].y,
          x2: nodes[j].x,
          y2: nodes[j].y,
        });
      }
    }
  }

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: 0 }}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 100 100"
    >
      <title>Neural background</title>
      {edges.map((e, i) => (
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
      {nodes.map((n) => (
        <circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill="var(--primary)"
          fillOpacity={0.07}
          style={{
            animation: `neural-float ${6 + n.delay}s ease-in-out infinite`,
            animationDelay: `${n.delay}s`,
          }}
        />
      ))}
    </svg>
  );
}

export default NeuralBackground;

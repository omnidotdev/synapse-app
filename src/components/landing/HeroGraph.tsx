type SignalProps = {
  path: string;
  dur: string;
  begin?: string;
};

/** Animated signal dot traveling along a path. */
function Signal({ path, dur, begin = "0s" }: SignalProps) {
  return (
    <circle r="4.5" className="signal-dot">
      <animateMotion
        dur={dur}
        begin={begin}
        repeatCount="indefinite"
        path={path}
      />
    </circle>
  );
}

type NodeProps = {
  cx: number;
  cy: number;
  r: number;
  label: string;
  sublabel?: string;
  color: string;
};

/** A satellite node in the neural graph. */
function GraphNode({ cx, cy, r, label, sublabel, color }: NodeProps) {
  const haloDur = `${2 + Math.abs(cx % 3) * 0.4}s`;

  return (
    <g>
      {/* Halo pulse ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeOpacity={0.12}
        strokeWidth={1}
      >
        <animate
          attributeName="r"
          values={`${r};${r + 16};${r}`}
          dur={haloDur}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5;0;0.5"
          dur={haloDur}
          repeatCount="indefinite"
        />
      </circle>
      {/* Main node circle */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        fillOpacity={0.14}
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={1.5}
        className="satellite-glow"
      />
      {/* Label */}
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fill={color}
        fontSize={r < 30 ? 8 : 10}
        fontWeight={600}
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill={color}
          fontSize={7}
          opacity={0.7}
        >
          {sublabel}
        </text>
      )}
    </g>
  );
}

const CONNECTIONS = [
  { d: "M 131 280 L 320 280", dur: "1.8s", begin: "0s" },
  { d: "M 666 230 Q 720 160 794 150", dur: "2.2s", begin: "0.3s" },
  { d: "M 666 330 Q 710 388 766 407", dur: "2.4s", begin: "0.6s" },
  { d: "M 420 185 Q 380 125 342 100", dur: "2.0s", begin: "0.9s" },
  { d: "M 400 374 Q 330 412 272 427", dur: "2.3s", begin: "1.2s" },
  { d: "M 680 280 Q 750 275 862 282", dur: "2.1s", begin: "0.4s" },
  { d: "M 866 152 Q 900 200 888 262", dur: "1.9s", begin: "0.8s" },
];

/**
 * Full-viewport SVG neural graph hero visualization.
 *
 * Renders as an absolutely-positioned layer; hero text is overlaid as HTML
 * by the parent component.
 */
function HeroGraph() {
  return (
    <svg
      viewBox="0 0 1000 560"
      className="absolute inset-0 h-full w-full"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Connection paths */}
      {CONNECTIONS.map((c) => (
        <path
          key={c.d}
          d={c.d}
          stroke="var(--primary)"
          strokeOpacity={0.4}
          strokeWidth={1.5}
          strokeDasharray="6 5"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-11"
            dur={c.dur}
            repeatCount="indefinite"
          />
        </path>
      ))}

      {/* Signal pulses — 2 per connection for density */}
      {CONNECTIONS.map((c) => (
        <g key={c.d}>
          <Signal path={c.d} dur={c.dur} begin={c.begin} />
          <Signal
            path={c.d}
            dur={c.dur}
            begin={`${(parseFloat(c.begin) + parseFloat(c.dur) / 2).toFixed(2)}s`}
          />
        </g>
      ))}

      {/* Satellite nodes */}
      <GraphNode cx={105} cy={280} r={26} label="API" color="var(--primary)" />
      <GraphNode
        cx={830}
        cy={140}
        r={36}
        label="Metrics"
        sublabel="<50ms · 99.9%"
        color="var(--secondary)"
      />
      <GraphNode
        cx={800}
        cy={415}
        r={34}
        label="Router"
        sublabel="50+ models"
        color="var(--secondary)"
      />
      <GraphNode
        cx={320}
        cy={88}
        r={26}
        label="Models"
        color="var(--primary)"
      />
      <GraphNode
        cx={250}
        cy={435}
        r={30}
        label="Analytics"
        color="var(--secondary)"
      />
      <GraphNode cx={890} cy={290} r={28} label="Keys" color="var(--primary)" />
    </svg>
  );
}

export default HeroGraph;

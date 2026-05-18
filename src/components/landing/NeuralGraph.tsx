import { Float, Html, QuadraticBezierLine } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Color, Matrix4, QuadraticBezierCurve3, Vector3 } from "three";

import type { FC } from "react";
import type { InstancedMesh, Mesh, MeshBasicMaterial } from "three";

/** Ref-based elapsed time tracker that avoids the deprecated THREE.Clock */
function useElapsedRef() {
  const ref = useRef(0);

  // Reset on mount so remounts start fresh
  useEffect(() => {
    ref.current = 0;
  }, []);

  return ref;
}

type NodeDef = {
  id: string;
  label: string;
  sublabel?: string;
  nodeIndex?: string;
  position: [number, number, number];
  radius: number;
  color: "primary" | "secondary";
};

const NODES: NodeDef[] = [
  {
    id: "soma",
    label: "Synapse",
    sublabel: "The cortex for your AI stack",
    position: [0, 0.2, 0],
    radius: 0.55,
    color: "primary",
  },
  {
    id: "api",
    label: "API",
    nodeIndex: "node_01",
    position: [-2.2, 1.4, -0.3],
    radius: 0.28,
    color: "primary",
  },
  {
    id: "metrics",
    label: "Metrics",
    sublabel: "<50ms · 99.9%",
    nodeIndex: "node_02",
    position: [2.0, 1.6, 0.2],
    radius: 0.36,
    color: "secondary",
  },
  {
    id: "router",
    label: "Router",
    sublabel: "50+ models",
    nodeIndex: "node_03",
    position: [2.4, -0.8, -0.1],
    radius: 0.34,
    color: "secondary",
  },
  {
    id: "models",
    label: "Models",
    nodeIndex: "node_04",
    position: [-1.4, -1.5, 0.3],
    radius: 0.28,
    color: "primary",
  },
  {
    id: "analytics",
    label: "Analytics",
    nodeIndex: "node_05",
    position: [-2.5, -0.2, 0.4],
    radius: 0.3,
    color: "secondary",
  },
  {
    id: "keys",
    label: "Keys",
    nodeIndex: "node_06",
    position: [0.6, -1.8, 0.1],
    radius: 0.28,
    color: "primary",
  },
];

// Biologically-inspired connectivity:
// Soma is the cell body; axon/dendrite connections radiate outward.
// Peripheral nodes form lateral synapses where functionally related.
const EDGES = [
  // Soma dendrite/axon connections (hub)
  { from: "soma", to: "api" },
  { from: "soma", to: "metrics" },
  { from: "soma", to: "router" },
  { from: "soma", to: "models" },
  { from: "soma", to: "analytics" },
  { from: "soma", to: "keys" },
  // Lateral synapses (functionally related neighbors)
  { from: "metrics", to: "router" },
  { from: "api", to: "analytics" },
  { from: "router", to: "models" },
  { from: "models", to: "keys" },
];

// Hex colors that render reliably across all three.js versions
const PRIMARY_COLOR = new Color("#6366f1");
const SECONDARY_COLOR = new Color("#14b8a6");
const SIGNAL_COLOR = new Color("#67e8f9");
const PRIMARY_GLOW = new Color("#a5b4fc");
const SECONDARY_GLOW = new Color("#5eead4");
const EDGE_COLOR = new Color("#818cf8");
const EDGE_GLOW = new Color("#c7d2fe");

function getColor(c: "primary" | "secondary") {
  return c === "primary" ? PRIMARY_COLOR : SECONDARY_COLOR;
}

function getGlow(c: "primary" | "secondary") {
  return c === "primary" ? PRIMARY_GLOW : SECONDARY_GLOW;
}

/** Node with single aura field + core sphere */
const SynapseNode: FC<{ node: NodeDef; isSoma?: boolean }> = ({
  node,
  isSoma = false,
}) => {
  const meshRef = useRef<Mesh>(null);
  const auraRef = useRef<Mesh>(null);
  const elapsed = useElapsedRef();
  const [hovered, setHovered] = useState(false);
  const color = getColor(node.color);
  const glow = getGlow(node.color);

  useFrame((_state, delta) => {
    if (!meshRef.current || !auraRef.current) return;
    elapsed.current += delta;
    const t = elapsed.current;

    if (isSoma) {
      const pulse = 1 + Math.sin(t * 1.2) * 0.04;
      meshRef.current.scale.setScalar(pulse);
      auraRef.current.scale.setScalar(pulse);
    }

    // Breathe the aura
    (auraRef.current.material as MeshBasicMaterial).opacity =
      (isSoma ? 0.18 : 0.14) + Math.sin(t * 1.5 + (isSoma ? 0 : 1.5)) * 0.06;
  });

  return (
    <Float
      speed={isSoma ? 0.8 : 1.2}
      rotationIntensity={0}
      floatIntensity={isSoma ? 0.1 : 0.2}
      floatingRange={[-0.04, 0.04]}
    >
      <group position={node.position}>
        {/* Single aura field */}
        <mesh ref={auraRef}>
          <sphereGeometry args={[node.radius * 2.6, 32, 32]} />
          <meshBasicMaterial
            color={glow}
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>

        {/* Core sphere */}
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[node.radius, 48, 48]} />
          {isSoma ? (
            <meshPhysicalMaterial
              color={color}
              emissive={color}
              emissiveIntensity={hovered ? 1 : 0.6}
              transparent
              opacity={0.95}
              transmission={0.25}
              thickness={1.5}
              ior={1.5}
              roughness={0.02}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.03}
            />
          ) : (
            <meshPhysicalMaterial
              color={color}
              emissive={color}
              emissiveIntensity={hovered ? 0.9 : 0.5}
              transparent
              opacity={0.92}
              roughness={0.05}
              metalness={0.2}
              clearcoat={1}
              clearcoatRoughness={0.05}
              sheen={0.5}
              sheenColor={glow}
            />
          )}
        </mesh>

        {/* Label */}
        <Html
          center
          distanceFactor={isSoma ? 5 : 7}
          zIndexRange={[40, 0]}
          style={{
            pointerEvents: "none",
            userSelect: "none",
            overflow: "visible",
          }}
        >
          <div className="flex flex-col items-center whitespace-nowrap">
            {isSoma && (
              <span className="mb-1 font-mono text-[9px] text-white/70 uppercase tracking-widest drop-shadow-[0_0_6px_rgba(99,102,241,0.8)]">
                soma
              </span>
            )}
            <span
              className={
                isSoma
                  ? "font-bold text-white text-xl drop-shadow-[0_0_20px_rgba(99,102,241,1)] sm:text-2xl"
                  : "font-semibold text-[11px] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
              }
            >
              {node.label}
            </span>
            {node.sublabel && (
              <span className="mt-0.5 text-[9px] text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                {node.sublabel}
              </span>
            )}
            {node.nodeIndex && (
              <span className="mt-0.5 font-mono text-[8px] text-white/40 tracking-wider">
                {node.nodeIndex}
              </span>
            )}
          </div>
        </Html>
      </group>
    </Float>
  );
};

/** Signal dot traveling along an edge */
const SignalDot: FC<{
  from: [number, number, number];
  to: [number, number, number];
  mid: [number, number, number];
  speed?: number;
  delay?: number;
}> = ({ from, to, mid, speed = 0.35, delay = 0 }) => {
  const ref = useRef<Mesh>(null);
  const elapsed = useElapsedRef();
  const curve = useMemo(
    () =>
      new QuadraticBezierCurve3(
        new Vector3(...from),
        new Vector3(...mid),
        new Vector3(...to),
      ),
    [from, mid, to],
  );

  useFrame((_state, delta) => {
    if (!ref.current) return;
    elapsed.current += delta;
    const t = ((elapsed.current * speed + delay) % 1.6) / 1.6;
    if (t > 1) {
      ref.current.visible = false;
      return;
    }
    ref.current.visible = true;
    const pos = curve.getPoint(t);
    ref.current.position.copy(pos);
    const fade = Math.sin(t * Math.PI);
    (ref.current.material as MeshBasicMaterial).opacity = fade * 0.95;
    ref.current.scale.setScalar(0.8 + fade * 0.4);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshBasicMaterial
        color={SIGNAL_COLOR}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </mesh>
  );
};

/** Compute a curved midpoint for an edge */
function computeMid(
  from: [number, number, number],
  to: [number, number, number],
  curvature = 0.25,
): [number, number, number] {
  return [
    (from[0] + to[0]) / 2 + (from[1] - to[1]) * curvature,
    (from[1] + to[1]) / 2 + (to[0] - from[0]) * curvature,
    (from[2] + to[2]) / 2 + 0.2,
  ];
}

/** Animated edge with glow underlay */
const SynapseEdge: FC<{
  from: [number, number, number];
  to: [number, number, number];
  index: number;
}> = ({ from, to, index }) => {
  const mid = computeMid(from, to);

  return (
    <>
      {/* Soft glow underlay */}
      <QuadraticBezierLine
        start={from}
        end={to}
        mid={mid}
        lineWidth={6}
        color={EDGE_GLOW}
        transparent
        opacity={0.1}
      />
      {/* Main edge */}
      <QuadraticBezierLine
        start={from}
        end={to}
        mid={mid}
        lineWidth={2}
        color={EDGE_COLOR}
        transparent
        opacity={0.5}
        dashed
        dashScale={14}
        dashSize={1}
        gapSize={0.8}
      />
      <SignalDot
        from={from}
        to={to}
        mid={mid}
        speed={0.25 + index * 0.04}
        delay={index * 0.35}
      />
    </>
  );
};

/** Ambient floating micro-particles */
const AmbientParticles: FC<{ count?: number; spread?: number }> = ({
  count = 35,
  spread = 7,
}) => {
  const ref = useRef<InstancedMesh>(null);
  const elapsed = useElapsedRef();
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      arr.push([
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * 3 - 2,
      ]);
    }
    return arr;
  }, [count, spread]);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    elapsed.current += delta;
    const t = elapsed.current;
    const mat = new Matrix4();
    for (let i = 0; i < count; i++) {
      const [x, y, z] = positions[i];
      mat.setPosition(
        x + Math.sin(t * 0.18 + i) * 0.08,
        y + Math.cos(t * 0.12 + i * 0.4) * 0.08,
        z,
      );
      ref.current.setMatrixAt(i, mat);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshBasicMaterial color={PRIMARY_COLOR} transparent opacity={0.12} />
    </instancedMesh>
  );
};

/** Responsive camera adjuster */
const ResponsiveCamera: FC = () => {
  const { camera, size } = useThree();

  useMemo(() => {
    const aspect = size.width / size.height;

    if (size.width < 400) {
      // Very narrow mobile (375px and similar): pull back to keep edge nodes visible
      camera.position.z = 10;
    } else if (aspect < 0.8) {
      camera.position.z = 8;
    } else if (aspect < 1.2) {
      camera.position.z = 7.5;
    } else {
      camera.position.z = 7;
    }
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
};

/** Full neural graph scene content */
const NeuralGraph: FC<{ showAmbient?: boolean }> = ({ showAmbient = true }) => {
  const nodeMap = useMemo(() => {
    const m = new Map<string, NodeDef>();
    for (const n of NODES) m.set(n.id, n);
    return m;
  }, []);

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 4, 6]} intensity={1} color="#f8fafc" />
      <pointLight position={[-4, -2, 4]} intensity={0.5} color={SIGNAL_COLOR} />
      <pointLight
        position={[0, 3, 3]}
        intensity={0.35}
        color={SECONDARY_COLOR}
      />
      <pointLight position={[-2, 2, 5]} intensity={0.3} color="#818cf8" />

      <ResponsiveCamera />

      {EDGES.map((edge, i) => {
        const fromNode = nodeMap.get(edge.from);
        const toNode = nodeMap.get(edge.to);
        if (!fromNode || !toNode) return null;
        return (
          <SynapseEdge
            key={`${edge.from}-${edge.to}`}
            from={fromNode.position}
            to={toNode.position}
            index={i}
          />
        );
      })}

      {NODES.map((node) => (
        <SynapseNode key={node.id} node={node} isSoma={node.id === "soma"} />
      ))}

      {showAmbient && <AmbientParticles />}
    </>
  );
};

export { AmbientParticles, EDGES, NODES };
export default NeuralGraph;

import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface UsageChartProps {
  inputTokens: number;
  outputTokens: number;
}

/**
 * Bar chart comparing input vs output token usage.
 */
const UsageChart = ({ inputTokens, outputTokens }: UsageChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setDimensions({ width, height });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const data = [
    { name: "Input Tokens", input: inputTokens, output: 0 },
    { name: "Output Tokens", input: 0, output: outputTokens },
  ];

  return (
    <div ref={containerRef} className="h-64 w-full">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <BarChart
          data={data}
          width={dimensions.width}
          height={dimensions.height}
          margin={{ top: 8, right: 8, bottom: 16, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
            formatter={(value?: number) => (value ?? 0).toLocaleString()}
          />
          <Legend />
          <Bar
            dataKey="input"
            name="Input Tokens"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="output"
            name="Output Tokens"
            fill="hsl(var(--secondary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      )}
    </div>
  );
};

export default UsageChart;

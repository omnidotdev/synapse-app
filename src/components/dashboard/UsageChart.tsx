import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
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
  const data = [
    { name: "Input Tokens", value: inputTokens },
    { name: "Output Tokens", value: outputTokens },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
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
          <Bar
            dataKey="value"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;

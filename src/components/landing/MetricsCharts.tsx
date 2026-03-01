import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

const LATENCY_DATA = [
  { t: "00", ms: 42 },
  { t: "02", ms: 38 },
  { t: "04", ms: 45 },
  { t: "06", ms: 31 },
  { t: "08", ms: 48 },
  { t: "10", ms: 36 },
  { t: "12", ms: 44 },
  { t: "14", ms: 29 },
  { t: "16", ms: 47 },
  { t: "18", ms: 35 },
  { t: "20", ms: 41 },
  { t: "22", ms: 33 },
];

const MODEL_DATA = [
  { model: "GPT-4o", reqs: 12400 },
  { model: "Claude", reqs: 9800 },
  { model: "Gemini", reqs: 7200 },
  { model: "Llama", reqs: 4500 },
  { model: "Mistral", reqs: 2800 },
];

/** Decorative chart pair for the landing page metrics panel. */
function MetricsCharts() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Latency sparkline */}
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
              Avg Latency
            </span>
            <span className="font-bold text-gradient text-lg">&lt;50ms</span>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={LATENCY_DATA}
                margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
              >
                <defs>
                  <linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="ms"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#latencyFill)"
                  dot={false}
                  activeDot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model usage bars */}
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
              Model Usage
            </span>
            <span className="font-bold text-gradient text-lg">50+</span>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MODEL_DATA}
                margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
              >
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--secondary)"
                      stopOpacity={0.6}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="model"
                  tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar
                  dataKey="reqs"
                  fill="url(#barFill)"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Uptime indicator */}
      <div className="flex items-center gap-2 border-primary/10 border-t pt-4">
        <span className="size-2 rounded-full bg-secondary shadow-[0_0_8px] shadow-secondary/50" />
        <span className="font-mono text-muted-foreground text-xs">
          99.9% uptime SLA
        </span>
      </div>
    </div>
  );
}

export default MetricsCharts;

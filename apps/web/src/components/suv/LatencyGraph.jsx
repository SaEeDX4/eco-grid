import React from "react";
import { Activity } from "lucide-react";

const LatencyGraph = () => {
  // Generate realistic latency data
  const generateLatencyData = () => {
    const points = [];
    const baseLatency = 145;

    for (let i = 0; i < 50; i++) {
      const variance = (Math.random() - 0.5) * 40;
      const latency = Math.max(50, Math.min(250, baseLatency + variance));
      points.push(latency);
    }

    return points;
  };

  const latencyData = generateLatencyData();
  const avgLatency = (
    latencyData.reduce((sum, val) => sum + val, 0) / latencyData.length
  ).toFixed(0);
  const maxLatency = Math.max(...latencyData).toFixed(0);
  const minLatency = Math.min(...latencyData).toFixed(0);

  // Calculate SVG path
  const height = 200;
  const width = 800;
  const maxValue = 300;
  const points = latencyData
    .map((value, index) => {
      const x = (index / (latencyData.length - 1)) * width;
      const y = height - (value / maxValue) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const pathD = `M 0,${height} L ${points} L ${width},${height} Z`;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {avgLatency}ms
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Average
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {minLatency}ms
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Minimum
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
            {maxLatency}ms
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Maximum
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="relative bg-slate-900 rounded-2xl p-6 overflow-hidden">
        {/* Grid Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox={`0 0 ${width} ${height}`}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1="0"
              y1={height * ratio}
              x2={width}
              y2={height * ratio}
              stroke="white"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Latency Line */}
        <svg
          className="w-full"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="latencyGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d={pathD}
            fill="url(#latencyGradient)"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>

        {/* Y-axis Labels */}
        <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-400">
          <span>300ms</span>
          <span>225ms</span>
          <span>150ms</span>
          <span>75ms</span>
          <span>0ms</span>
        </div>

        {/* Current Status */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
          <Activity size={14} className="animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      {/* Performance Target */}
      <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-center">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <span className="font-bold text-blue-600 dark:text-blue-400">
            Target: &lt;200ms
          </span>{" "}
          - Current performance:{" "}
          <span className="font-bold text-green-600 dark:text-green-400">
            {avgLatency < 200 ? "Meeting target" : "Above target"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LatencyGraph;

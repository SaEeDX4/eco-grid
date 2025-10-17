// Shared chart styling configuration for Recharts

export const chartColors = {
  primary: "#10b981",
  secondary: "#06b6d4",
  tertiary: "#8b5cf6",
  warning: "#f59e0b",
  danger: "#ef4444",
  grid: "#e2e8f0",
  gridDark: "#334155",
  text: "#64748b",
  textDark: "#94a3b8",
};

export const chartConfig = {
  margin: { top: 5, right: 5, left: 5, bottom: 5 },

  // Grid styling
  cartesianGrid: {
    strokeDasharray: "3 3",
    stroke: chartColors.grid,
    vertical: false,
  },

  cartesianGridDark: {
    strokeDasharray: "3 3",
    stroke: chartColors.gridDark,
    vertical: false,
  },

  // Axis styling
  xAxis: {
    axisLine: false,
    tickLine: false,
    tick: { fill: chartColors.text, fontSize: 12 },
  },

  xAxisDark: {
    axisLine: false,
    tickLine: false,
    tick: { fill: chartColors.textDark, fontSize: 12 },
  },

  yAxis: {
    axisLine: false,
    tickLine: false,
    tick: { fill: chartColors.text, fontSize: 12 },
  },

  yAxisDark: {
    axisLine: false,
    tickLine: false,
    tick: { fill: chartColors.textDark, fontSize: 12 },
  },

  // Tooltip styling
  tooltip: {
    contentStyle: {
      backgroundColor: "#ffffff",
      border: "none",
      borderRadius: "12px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
      padding: "12px",
    },
    cursor: { fill: "rgba(16, 185, 129, 0.1)" },
  },

  tooltipDark: {
    contentStyle: {
      backgroundColor: "#1e293b",
      border: "none",
      borderRadius: "12px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
      padding: "12px",
    },
    cursor: { fill: "rgba(16, 185, 129, 0.1)" },
  },

  // Line styling
  line: {
    type: "monotone",
    strokeWidth: 3,
    dot: { r: 4, strokeWidth: 2 },
    activeDot: { r: 6, strokeWidth: 0 },
  },

  // Area styling
  area: {
    type: "monotone",
    strokeWidth: 3,
    fillOpacity: 0.1,
  },

  // Bar styling
  bar: {
    radius: [8, 8, 0, 0],
  },
};

// Animation configuration
export const chartAnimation = {
  animationDuration: 1000,
  animationEasing: "ease-out",
};

// Responsive configuration
export const responsiveConfig = {
  mobile: {
    height: 250,
    fontSize: 10,
  },
  tablet: {
    height: 300,
    fontSize: 12,
  },
  desktop: {
    height: 350,
    fontSize: 14,
  },
};

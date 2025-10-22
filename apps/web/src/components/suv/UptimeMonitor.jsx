import React, { useMemo } from "react";

const UptimeMonitor = ({ days = 90 }) => {
  // ✅ Generate uptime data (99.9% uptime with occasional incidents)
  const generateUptimeData = () => {
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // ~99.9% uptime means ~1 incident per 90 days
      const hasIncident = Math.random() > 0.989;
      const uptime = hasIncident
        ? 98.5 + Math.random() * 1.4
        : 99.9 + Math.random() * 0.1;

      data.push({
        date: date.toISOString().split("T")[0],
        uptime: Math.min(100, uptime),
        status:
          uptime >= 99.9
            ? "operational"
            : uptime >= 99
              ? "degraded"
              : "partial",
      });
    }

    return data;
  };

  // ✅ Memoized to prevent regenerating data on every render
  const uptimeData = useMemo(() => generateUptimeData(), [days]);

  // ✅ Calculate average uptime
  const averageUptime = useMemo(() => {
    return (
      uptimeData.reduce((sum, d) => sum + d.uptime, 0) / uptimeData.length
    ).toFixed(2);
  }, [uptimeData]);

  // ✅ Helper for color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "partial":
        return "bg-orange-500";
      default:
        return "bg-slate-300";
    }
  };

  return (
    <div className="relative w-full">
      {/* ================== Average Uptime ================== */}
      <div className="mb-6 text-center">
        <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
          {averageUptime}%
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Average Uptime (Last {days} Days)
        </div>
      </div>

      {/* ================== Uptime Grid ================== */}
      <div
        className="grid gap-1 mb-6 justify-items-center"
        // ✅ Replaces invalid grid-cols-15 with a responsive CSS grid
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(8px, 1fr))",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        {uptimeData.map((day, index) => (
          <div
            key={index}
            className={`
              aspect-square rounded-sm ${getStatusColor(day.status)} 
              hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer
              group relative
            `}
            title={`${day.date}: ${day.uptime.toFixed(1)}% uptime`}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              <div className="font-semibold">{day.date}</div>
              <div>{day.uptime.toFixed(2)}% uptime</div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
            </div>
          </div>
        ))}
      </div>

      {/* ================== Legend ================== */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <span>Operational (≥99.9%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-yellow-500" />
          <span>Degraded (≥99%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-orange-500" />
          <span>Partial (&lt;99%)</span>
        </div>
      </div>
    </div>
  );
};

export default UptimeMonitor;

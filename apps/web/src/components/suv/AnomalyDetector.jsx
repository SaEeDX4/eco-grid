import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Shield, Activity } from "lucide-react";

const AnomalyDetector = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalScanned: 0,
    threatsBlocked: 0,
    activeMonitoring: true,
  });

  // 🔄 Simulate real-time security events
  useEffect(() => {
    const eventTypes = [
      {
        type: "blocked",
        severity: "high",
        message: "Suspicious login attempt blocked from IP 192.168.1.x",
        icon: AlertTriangle,
        color: "text-red-600 dark:text-red-400",
      },
      {
        type: "cleared",
        severity: "low",
        message: "User authentication successful with 2FA",
        icon: CheckCircle,
        color: "text-green-600 dark:text-green-400",
      },
      {
        type: "detected",
        severity: "medium",
        message: "Unusual API access pattern detected and flagged",
        icon: Shield,
        color: "text-yellow-600 dark:text-yellow-400",
      },
      {
        type: "cleared",
        severity: "low",
        message: "Device health check completed — all systems normal",
        icon: CheckCircle,
        color: "text-green-600 dark:text-green-400",
      },
      {
        type: "blocked",
        severity: "high",
        message: "SQL injection attempt prevented on API endpoint",
        icon: AlertTriangle,
        color: "text-red-600 dark:text-red-400",
      },
      {
        type: "detected",
        severity: "medium",
        message: "Rate limit exceeded — temporary access restriction applied",
        icon: Shield,
        color: "text-yellow-600 dark:text-yellow-400",
      },
    ];

    const addEvent = () => {
      const randomEvent =
        eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const newEvent = {
        ...randomEvent,
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 4)]);

      setStats((prev) => ({
        ...prev,
        totalScanned: prev.totalScanned + Math.floor(Math.random() * 50) + 10,
        threatsBlocked:
          randomEvent.type === "blocked"
            ? prev.threatsBlocked + 1
            : prev.threatsBlocked,
      }));
    };

    const interval = setInterval(addEvent, 3000);

    // Initial trigger
    addEvent();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border-2 border-slate-800 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">
              Real-Time Threat Detection
            </h3>
            <p className="text-sm text-slate-400">
              AI-powered anomaly monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Active
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center">
          <div className="text-3xl font-bold text-white mb-1">
            {stats.totalScanned.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">Requests Scanned</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center">
          <div className="text-3xl font-bold text-red-400 mb-1">
            {stats.threatsBlocked}
          </div>
          <div className="text-xs text-slate-400">Threats Blocked</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">99.9%</div>
          <div className="text-xs text-slate-400">Uptime</div>
        </div>
      </div>

      {/* Event Log */}
      <div>
        <div className="text-sm font-semibold text-slate-400 mb-3">
          Recent Security Events
        </div>

        <div className="space-y-2">
          {events.map((event, index) => {
            const Icon = event.icon;
            return (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 animate-in slide-in-from-right duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon
                  className={`${event.color} flex-shrink-0 mt-0.5`}
                  size={18}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300">{event.message}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {event.timestamp}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${
                    event.severity === "high"
                      ? "bg-red-500/20 text-red-400"
                      : event.severity === "medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {event.severity}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
        <span>Last scan: {new Date().toLocaleTimeString()}</span>
        <span>Next scan: Continuous</span>
      </div>
    </div>
  );
};

export default AnomalyDetector;

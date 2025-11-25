import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

const AlertCenter = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
            <Icons.CheckCircle className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-green-900 dark:text-green-100">
              All Systems Normal
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              No active alerts
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityInfo = (severity) => {
    switch (severity) {
      case "critical":
        return {
          icon: "AlertCircle",
          bg: "bg-red-50 dark:bg-red-950/20",
          border: "border-red-200 dark:border-red-800",
          iconBg: "bg-red-500",
          textColor: "text-red-900 dark:text-red-100",
          subColor: "text-red-700 dark:text-red-300",
        };
      case "high":
        return {
          icon: "AlertTriangle",
          bg: "bg-orange-50 dark:bg-orange-950/20",
          border: "border-orange-200 dark:border-orange-800",
          iconBg: "bg-orange-500",
          textColor: "text-orange-900 dark:text-orange-100",
          subColor: "text-orange-700 dark:text-orange-300",
        };
      case "medium":
        return {
          icon: "AlertTriangle",
          bg: "bg-yellow-50 dark:bg-yellow-950/20",
          border: "border-yellow-200 dark:border-yellow-800",
          iconBg: "bg-yellow-500",
          textColor: "text-yellow-900 dark:text-yellow-100",
          subColor: "text-yellow-700 dark:text-yellow-300",
        };
      default:
        return {
          icon: "Info",
          bg: "bg-blue-50 dark:bg-blue-950/20",
          border: "border-blue-200 dark:border-blue-800",
          iconBg: "bg-blue-500",
          textColor: "text-blue-900 dark:text-blue-100",
          subColor: "text-blue-700 dark:text-blue-300",
        };
    }
  };

  // Sort by severity
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {sortedAlerts.map((alert, index) => {
          const severityInfo = getSeverityInfo(alert.severity);
          const Icon = Icons[severityInfo.icon];

          return (
            <motion.div
              key={alert.id || index}
              className={`p-4 rounded-xl border-2 ${severityInfo.bg} ${severityInfo.border}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${severityInfo.iconBg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="text-white" size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`font-bold ${severityInfo.textColor}`}>
                      {alert.type
                        ?.split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </h4>
                    <span
                      className={`text-xs font-semibold ${severityInfo.subColor} uppercase`}
                    >
                      {alert.severity}
                    </span>
                  </div>

                  <p className={`text-sm ${severityInfo.subColor}`}>
                    {alert.message}
                  </p>

                  {alert.tenantName && (
                    <p className={`text-xs ${severityInfo.subColor} mt-1`}>
                      Tenant:{" "}
                      <span className="font-semibold">{alert.tenantName}</span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AlertCenter;

import SystemStatus from "../models/SystemStatus.js";
import SecurityEvent from "../models/SecurityEvent.js";

export const getSystemStatus = async (req, res) => {
  try {
    // Get latest status
    let status = await SystemStatus.findOne().sort({ timestamp: -1 });

    // If no status exists, create one
    if (!status) {
      status = await SystemStatus.recordStatus();
    }

    res.json({
      success: true,
      status: {
        uptime: status.uptime,
        apiLatency: status.apiLatency,
        activeConnections: status.activeConnections,
        requestsPerSecond: status.requestsPerSecond,
        cpuUsage: status.cpuUsage,
        memoryUsage: status.memoryUsage,
        databaseHealth: status.databaseHealth,
        services: status.services,
        lastUpdated: status.timestamp,
      },
    });
  } catch (error) {
    console.error("Get system status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch system status",
    });
  }
};

export const getUptimeHistory = async (req, res) => {
  try {
    const { days = 90 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get one status record per day (latest for each day)
    const statuses = await SystemStatus.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
          },
          uptime: { $last: "$uptime" },
          date: { $last: "$timestamp" },
        },
      },
      {
        $sort: { date: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$date",
          uptime: "$uptime",
        },
      },
    ]);

    // Calculate average
    const avgUptime =
      statuses.reduce((sum, s) => sum + s.uptime, 0) / statuses.length;

    res.json({
      success: true,
      history: statuses,
      average: avgUptime.toFixed(2),
      days: parseInt(days),
    });
  } catch (error) {
    console.error("Get uptime history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch uptime history",
    });
  }
};

export const getLatencyHistory = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const statuses = await SystemStatus.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .select("apiLatency timestamp");

    res.json({
      success: true,
      history: statuses.reverse().map((s) => ({
        timestamp: s.timestamp,
        latency: s.apiLatency,
      })),
    });
  } catch (error) {
    console.error("Get latency history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch latency history",
    });
  }
};

export const getSecurityEvents = async (req, res) => {
  try {
    const { limit = 10, severity, resolved } = req.query;

    const query = {};
    if (severity) query.severity = severity;
    if (resolved !== undefined) query.resolved = resolved === "true";

    const events = await SecurityEvent.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      events: events.map((e) => ({
        id: e._id,
        timestamp: e.timestamp,
        eventType: e.eventType,
        severity: e.severity,
        message: e.message,
        action: e.action,
        resolved: e.resolved,
      })),
    });
  } catch (error) {
    console.error("Get security events error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch security events",
    });
  }
};

export const getSecurityStats = async (req, res) => {
  try {
    const [totalEvents, blockedCount, unresolvedCount, criticalCount] =
      await Promise.all([
        SecurityEvent.countDocuments(),
        SecurityEvent.countDocuments({ eventType: "blocked" }),
        SecurityEvent.countDocuments({ resolved: false }),
        SecurityEvent.countDocuments({ severity: "critical", resolved: false }),
      ]);

    res.json({
      success: true,
      stats: {
        total: totalEvents,
        blocked: blockedCount,
        unresolved: unresolvedCount,
        critical: criticalCount,
      },
    });
  } catch (error) {
    console.error("Get security stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch security stats",
    });
  }
};

export const recordSystemStatus = async (req, res) => {
  try {
    // Admin only or internal service
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const status = await SystemStatus.recordStatus();

    res.json({
      success: true,
      message: "Status recorded successfully",
      status,
    });
  } catch (error) {
    console.error("Record system status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record status",
    });
  }
};

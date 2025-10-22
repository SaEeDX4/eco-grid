import SecurityEvent from "../models/SecurityEvent.js";
import os from "os";

// Log security event
export const logSecurityEvent = async (eventData) => {
  try {
    const event = await SecurityEvent.create({
      eventType: eventData.type || "detected",
      severity: eventData.severity || "medium",
      category: eventData.category || "other",
      message: eventData.message,
      source: {
        ip: eventData.ip,
        userAgent: eventData.userAgent,
        userId: eventData.userId,
      },
      action: eventData.action || "logged",
    });

    // In production, trigger alerts for high/critical severity
    if (["high", "critical"].includes(event.severity)) {
      console.warn(`Security alert: ${event.message}`);
      // await sendSecurityAlert(event)
    }

    return event;
  } catch (error) {
    console.error("Log security event error:", error);
    return null;
  }
};

// Get current system health
export const getSystemHealth = () => {
  try {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = (usedMem / totalMem) * 100;

    const cpus = os.cpus();
    const cpuUsage =
      cpus.reduce((acc, cpu) => {
        const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
        const idle = cpu.times.idle;
        return acc + (100 - (idle / total) * 100);
      }, 0) / cpus.length;

    return {
      memoryUsage: memUsage.toFixed(2),
      cpuUsage: cpuUsage.toFixed(2),
      uptime: process.uptime(),
      platform: os.platform(),
      loadAverage: os.loadavg(),
    };
  } catch (error) {
    console.error("Get system health error:", error);
    return null;
  }
};

// Check database connection
export const checkDatabaseHealth = async (mongoose) => {
  try {
    const state = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

    if (state === 1) {
      return { status: "healthy", connected: true };
    } else if (state === 2) {
      return { status: "degraded", connected: false, reason: "connecting" };
    } else {
      return { status: "down", connected: false, reason: "disconnected" };
    }
  } catch (error) {
    console.error("Check database health error:", error);
    return { status: "down", connected: false, error: error.message };
  }
};

// Anomaly detection (simplified)
export const detectAnomalies = async (requestData) => {
  try {
    const anomalies = [];

    // Check for rapid successive requests (potential DDoS)
    if (requestData.requestsPerMinute > 1000) {
      anomalies.push({
        type: "high_request_rate",
        severity: "medium",
        message: `Unusually high request rate: ${requestData.requestsPerMinute}/min`,
      });
    }

    // Check for failed authentication attempts
    if (requestData.failedAuthAttempts > 5) {
      anomalies.push({
        type: "brute_force_attempt",
        severity: "high",
        message: `Multiple failed auth attempts: ${requestData.failedAuthAttempts}`,
      });
    }

    // Check for unusual latency
    if (requestData.avgLatency > 1000) {
      anomalies.push({
        type: "high_latency",
        severity: "medium",
        message: `High average latency: ${requestData.avgLatency}ms`,
      });
    }

    // Log detected anomalies
    for (const anomaly of anomalies) {
      await logSecurityEvent({
        type: "detected",
        severity: anomaly.severity,
        category: "anomaly",
        message: anomaly.message,
        action: "alerted",
      });
    }

    return {
      detected: anomalies.length > 0,
      count: anomalies.length,
      anomalies,
    };
  } catch (error) {
    console.error("Detect anomalies error:", error);
    return { detected: false, count: 0, anomalies: [] };
  }
};

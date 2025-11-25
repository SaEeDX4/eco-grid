import Tenant from "../models/Tenant.js";
import Hub from "../models/Hub.js";
import AllocationHistory from "../models/AllocationHistory.js";
import HubDevice from "../models/HubDevice.js";

class HubUsageMetricsService {
  /**
   * Aggregate tenant usage for a period
   */
  async aggregateTenantUsage(tenantId, period = "month") {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant) throw new Error("Tenant not found");

      const { startDate, endDate } = this._getPeriodDates(period);

      // Get allocation history
      const history = await AllocationHistory.find({
        tenantId,
        "decision.approved": true,
        createdAt: { $gte: startDate, $lte: endDate },
      });

      const metrics = {
        period: { start: startDate, end: endDate, type: period },
        totalRequests: history.length,
        totalGrantedKW: history.reduce(
          (s, h) => s + (h.decision?.grantedKW ?? 0),
          0
        ),
        avgGrantedKW: 0,
        peakKW: 0,
        minKW: Infinity,
        totalKWh: 0,
        utilizationPercent: 0,
        overageEvents: 0,
        throttleEvents: 0,
        hourlyPattern: Array(24).fill(0),
        dailyPattern: Array(7).fill(0),
      };

      if (history.length > 0) {
        const grantedValues = history.map((h) => h.decision?.grantedKW ?? 0);

        metrics.avgGrantedKW = metrics.totalGrantedKW / history.length;
        metrics.peakKW = Math.max(...grantedValues);
        metrics.minKW = Math.min(...grantedValues);

        // simplified energy estimate
        metrics.totalKWh = metrics.avgGrantedKW * (history.length / 24);

        if (tenant.capacity?.allocatedKW > 0) {
          metrics.utilizationPercent =
            (metrics.avgGrantedKW / tenant.capacity.allocatedKW) * 100;
        }

        metrics.overageEvents = history.filter(
          (h) => h.eventType === "overage-allowed"
        ).length;
        metrics.throttleEvents = history.filter(
          (h) => h.eventType === "throttled"
        ).length;

        // hourly pattern
        history.forEach((h) => {
          const hour = new Date(h.createdAt).getHours();
          metrics.hourlyPattern[hour] += h.decision?.grantedKW ?? 0;
        });
        metrics.hourlyPattern = metrics.hourlyPattern.map(
          (v) => v / history.length
        );

        // daily pattern
        history.forEach((h) => {
          const day = new Date(h.createdAt).getDay();
          metrics.dailyPattern[day] += h.decision?.grantedKW ?? 0;
        });
        const dayCount =
          Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000)) || 1;
        metrics.dailyPattern = metrics.dailyPattern.map(
          (v) => v / (dayCount / 7)
        );
      }

      // Update tenant metrics
      tenant.usage[period] = {
        currentKW: tenant.usage?.current?.currentKW ?? 0,
        peakKW: metrics.peakKW,
        avgKW: metrics.avgGrantedKW,
        totalKWh: metrics.totalKWh,
        lastUpdated: new Date(),
      };

      tenant.performance.avgUtilization = metrics.utilizationPercent;
      await tenant.save();

      return {
        success: true,
        tenant: { id: tenant._id, name: tenant.name },
        metrics,
      };
    } catch (error) {
      console.error("Aggregate tenant usage error:", error);
      throw error;
    }
  }

  /**
   * Calculate hub utilization for a period
   */
  async calculateUtilization(hubId, period = "month") {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) throw new Error("Hub not found");

      const { startDate, endDate } = this._getPeriodDates(period);

      const history = await AllocationHistory.find({
        hubId,
        "decision.approved": true,
        createdAt: { $gte: startDate, $lte: endDate },
      });

      const utilization = {
        period: { start: startDate, end: endDate, type: period },
        hubCapacity: hub.capacity?.totalKW ?? 0,
        allocated: hub.capacity?.allocatedKW ?? 0,
        metrics: {
          totalAllocations: history.length,
          avgUsageKW: 0,
          peakUsageKW: 0,
          avgUtilizationPercent: 0,
          peakUtilizationPercent: 0,
          totalEnergyKWh: 0,
        },
        hourlyUtilization: Array(24).fill(0),
        dailyUtilization: Array(7).fill(0),
        tenantBreakdown: [],
      };

      if (history.length > 0) {
        const grantedArr = history.map((h) => h.decision?.grantedKW ?? 0);
        const totalGranted = grantedArr.reduce((a, b) => a + b, 0);

        utilization.metrics.avgUsageKW = totalGranted / history.length;

        // hourly grouping
        const hourlyUsage = {};
        history.forEach((h) => {
          const hour = new Date(h.createdAt).getHours();
          if (!hourlyUsage[hour]) hourlyUsage[hour] = [];
          hourlyUsage[hour].push(h.decision?.grantedKW ?? 0);
        });

        Object.entries(hourlyUsage).forEach(([hour, values]) => {
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          utilization.hourlyUtilization[hour] = avg;
          if (avg > utilization.metrics.peakUsageKW) {
            utilization.metrics.peakUsageKW = avg;
          }
        });

        const cap = hub.capacity?.totalKW ?? 0;
        if (cap > 0) {
          utilization.metrics.avgUtilizationPercent =
            (utilization.metrics.avgUsageKW / cap) * 100;
          utilization.metrics.peakUtilizationPercent =
            (utilization.metrics.peakUsageKW / cap) * 100;
        }

        const hours = (endDate - startDate) / (1000 * 60 * 60);
        utilization.metrics.totalEnergyKWh =
          utilization.metrics.avgUsageKW * hours;

        // daily grouping
        const dailyUsage = {};
        history.forEach((h) => {
          const day = new Date(h.createdAt).getDay();
          if (!dailyUsage[day]) dailyUsage[day] = [];
          dailyUsage[day].push(h.decision?.grantedKW ?? 0);
        });
        Object.entries(dailyUsage).forEach(([day, values]) => {
          utilization.dailyUtilization[day] =
            values.reduce((a, b) => a + b, 0) / values.length;
        });
      }

      // tenant breakdown
      const tenants = await Tenant.find({ hubId, status: "active" });

      for (const tenant of tenants) {
        const tenantHistory = history.filter(
          (h) => h.tenantId?.toString() === tenant._id.toString()
        );
        if (tenantHistory.length === 0) continue;

        const total = tenantHistory.reduce(
          (s, h) => s + (h.decision?.grantedKW ?? 0),
          0
        );
        const avg = total / tenantHistory.length;

        const util = tenant.capacity?.allocatedKW
          ? (avg / tenant.capacity.allocatedKW) * 100
          : 0;

        const share = utilization.metrics.avgUsageKW
          ? (avg / utilization.metrics.avgUsageKW) * 100
          : 0;

        utilization.tenantBreakdown.push({
          tenantId: tenant._id,
          tenantName: tenant.name,
          allocatedKW: tenant.capacity?.allocatedKW ?? 0,
          avgUsageKW: avg,
          utilizationPercent: util,
          shareOfHubPercent: share,
          allocations: tenantHistory.length,
        });
      }

      utilization.tenantBreakdown.sort((a, b) => b.avgUsageKW - a.avgUsageKW);

      // update hub metrics
      hub.performance.avgUtilization =
        utilization.metrics.avgUtilizationPercent;
      hub.performance.peakDemandKW = utilization.metrics.peakUsageKW;
      hub.performance.totalEnergyKWh =
        (hub.performance.totalEnergyKWh ?? 0) +
        utilization.metrics.totalEnergyKWh;

      await hub.save();

      return {
        success: true,
        hub: { id: hub._id, name: hub.name },
        utilization,
      };
    } catch (error) {
      console.error("Calculate utilization error:", error);
      throw error;
    }
  }

  /**
   * Identify peak demand patterns
   */
  async identifyPeakDemandPatterns(hubId) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) throw new Error("Hub not found");

      const peakTimes = await AllocationHistory.getPeakUsageTimes(hubId, 30);

      const patterns = {
        identified: Array.isArray(peakTimes) && peakTimes.length > 0,
        peakPeriods: [],
        recommendations: [],
      };

      if (patterns.identified) {
        patterns.peakPeriods = peakTimes.map((pt) => {
          const capacity = hub.capacity?.totalKW ?? 1;
          const avgKW = pt.avgGrantedKW ?? 0;
          return {
            hour: pt._id.hour,
            dayOfWeek: pt._id.dayOfWeek,
            dayName: this._getDayName(pt._id.dayOfWeek),
            avgDemandKW: avgKW,
            totalDemandKW: pt.totalGrantedKW,
            requestCount: pt.requestCount,
            utilizationPercent: (avgKW / capacity) * 100,
          };
        });

        const highest = patterns.peakPeriods[0];
        if (highest) {
          if (highest.utilizationPercent > 90) {
            patterns.recommendations.push({
              type: "critical",
              message: "Peak demand exceeds 90% capacity",
              actions: [
                "Implement peak-hour pricing",
                "Enable demand response programs",
                "Consider capacity expansion",
                "Implement load shifting incentives",
              ],
            });
          } else if (highest.utilizationPercent > 75) {
            patterns.recommendations.push({
              type: "warning",
              message: "Peak demand approaching capacity limits",
              actions: [
                "Monitor peak periods closely",
                "Enable peak-hour allocation adjustments",
                "Encourage off-peak usage",
              ],
            });
          }
        }

        const morning = peakTimes.filter(
          (pt) => pt._id.hour >= 7 && pt._id.hour <= 11
        );
        if (morning.length >= 3) {
          patterns.recommendations.push({
            type: "pattern",
            message: "Consistent morning peak demand detected",
            actions: [
              "Implement morning peak pricing",
              "Pre-charge batteries overnight",
              "Stagger tenant operations where possible",
            ],
          });
        }

        const evening = peakTimes.filter(
          (pt) => pt._id.hour >= 17 && pt._id.hour <= 21
        );
        if (evening.length >= 3) {
          patterns.recommendations.push({
            type: "pattern",
            message: "Consistent evening peak demand detected",
            actions: [
              "Implement evening peak pricing",
              "Discharge batteries during evening peak",
              "Shift flexible loads to off-peak hours",
            ],
          });
        }
      }

      return {
        success: true,
        hub: { id: hub._id, name: hub.name, capacity: hub.capacity.totalKW },
        patterns,
      };
    } catch (error) {
      console.error("Identify peak demand patterns error:", error);
      throw error;
    }
  }

  /**
   * Detect anomalies for a tenant
   */
  async detectAnomalies(tenantId, currentUsageKW) {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant) throw new Error("Tenant not found");

      const detection = await AllocationHistory.detectAnomalies(tenantId, 2);

      const mean = detection?.statistics?.mean ?? 0;
      const stdDev = detection?.statistics?.stdDev ?? 1;
      const threshold = detection?.statistics?.threshold ?? 3;

      const result = {
        tenantId: tenant._id,
        tenantName: tenant.name,
        currentUsageKW,
        baseline: {
          meanKW: mean,
          stdDevKW: stdDev,
        },
        anomalies: detection?.anomalies ?? [],
        isCurrentAnomaly: false,
        severity: "normal",
      };

      if (detection?.statistics) {
        const zScore = Math.abs((currentUsageKW - mean) / stdDev);

        if (zScore > threshold) {
          result.isCurrentAnomaly = true;
          result.zScore = zScore;

          if (zScore > 3) result.severity = "critical";
          else if (zScore > 2.5) result.severity = "high";
          else result.severity = "medium";

          result.explanation =
            currentUsageKW > mean
              ? `Current usage is ${((currentUsageKW / mean - 1) * 100).toFixed(1)}% higher than average`
              : `Current usage is ${((1 - currentUsageKW / mean) * 100).toFixed(1)}% lower than average`;
        }
      }

      if (result.isCurrentAnomaly) {
        result.recommendations = [];

        if (currentUsageKW > mean) {
          result.recommendations.push({
            action: "investigate-high-usage",
            message:
              "Investigate potential equipment issues or unauthorized usage",
          });
          if (result.severity === "critical") {
            result.recommendations.push({
              action: "immediate-inspection",
              message:
                "Critical usage spike detected - immediate inspection recommended",
            });
          }
        } else {
          result.recommendations.push({
            action: "investigate-low-usage",
            message:
              "Unusually low usage - check for equipment offline or operational changes",
          });
        }
      }

      return { success: true, result };
    } catch (error) {
      console.error("Detect anomalies error:", error);
      throw error;
    }
  }

  /**
   * Generate report
   */
  async generateUsageReport(hubId, format = "json") {
    try {
      const hub = await Hub.findById(hubId).populate("tenants");
      if (!hub) throw new Error("Hub not found");

      const { startDate, endDate } = this._getPeriodDates("month");

      const report = {
        hub: {
          id: hub._id,
          name: hub.name,
          type: hub.type,
          location: hub.location,
          capacity: hub.capacity,
        },
        period: { start: startDate, end: endDate, type: "monthly" },
        summary: {},
        tenants: [],
        devices: [],
        patterns: {},
        recommendations: [],
      };

      const utilization = await this.calculateUtilization(hubId, "month");
      report.summary = utilization.utilization.metrics;

      for (const tenant of hub.tenants ?? []) {
        const tenantUsage = await this.aggregateTenantUsage(
          tenant._id,
          "month"
        );
        report.tenants.push({
          id: tenant._id,
          name: tenant.name,
          businessType: tenant.businessType,
          allocatedKW: tenant.capacity?.allocatedKW,
          metrics: tenantUsage.metrics,
          compliance: {
            violations: tenant.compliance?.violations ?? 0,
            warningLevel: tenant.compliance?.warningLevel ?? "none",
          },
        });
      }

      const devices = await HubDevice.find({
        hubId,
        "status.operational": "online",
      });
      for (const device of devices) {
        report.devices.push({
          id: device._id,
          name: device.name,
          type: device.type,
          capacity: device.capacity,
          status: device.status,
          performance: device.performance?.current,
          health: device.status?.health,
        });
      }

      const patterns = await this.identifyPeakDemandPatterns(hubId);
      report.patterns = patterns.patterns;

      const statistics = await AllocationHistory.getStatistics(
        hubId,
        startDate,
        endDate
      );
      report.statistics = statistics;

      report.recommendations = await this._generateReportRecommendations(
        hub,
        report.summary,
        report.tenants,
        patterns.patterns
      );

      if (format === "json") return { success: true, report };
      if (format === "pdf")
        return {
          success: true,
          report,
          message: "PDF generation not implemented in this version",
        };

      return { success: true, report };
    } catch (error) {
      console.error("Generate usage report error:", error);
      throw error;
    }
  }

  /**
   * Real-time snapshot
   */
  async getRealtimeSnapshot(hubId) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) throw new Error("Hub not found");

      const tenants = await Tenant.find({ hubId, status: "active" });

      const currentTotalUsage = tenants.reduce(
        (s, t) => s + (t.usage?.current?.currentKW ?? 0),
        0
      );

      const snapshot = {
        timestamp: new Date(),
        hub: {
          id: hub._id,
          name: hub.name,
          capacity: {
            total: hub.capacity?.totalKW ?? 0,
            allocated: hub.capacity?.allocatedKW ?? 0,
            available: hub.capacity?.availableKW ?? 0,
            reserved: hub.capacity?.reservedKW ?? 0,
          },
          current: {
            usageKW: currentTotalUsage,
            utilizationPercent:
              ((currentTotalUsage ?? 0) / (hub.capacity?.totalKW || 1)) * 100,
          },
        },
        tenants: tenants
          .map((t) => ({
            id: t._id,
            name: t.name,
            current: {
              usageKW: t.usage?.current?.currentKW ?? 0,
              allocatedKW: t.capacity?.allocatedKW ?? 0,
              utilizationPercent:
                ((t.usage?.current?.currentKW ?? 0) /
                  (t.capacity?.allocatedKW || 1)) *
                100,
            },
            status: t.status,
            warningLevel: t.compliance?.warningLevel,
          }))
          .sort((a, b) => b.current.usageKW - a.current.usageKW),
        alerts: [],
      };

      if (snapshot.hub.current.utilizationPercent > 90) {
        snapshot.alerts.push({
          severity: "critical",
          type: "capacity",
          message: "Hub utilization exceeds 90%",
        });
      }

      tenants.forEach((t) => {
        const util =
          ((t.usage?.current?.currentKW ?? 0) /
            (t.capacity?.allocatedKW || 1)) *
          100;

        if (util > 95) {
          snapshot.alerts.push({
            severity: "high",
            type: "tenant-capacity",
            tenantId: t._id,
            tenantName: t.name,
            message: `Tenant "${t.name}" at ${util.toFixed(1)}% utilization`,
          });
        }

        if (
          t.compliance?.warningLevel === "critical" ||
          t.compliance?.warningLevel === "high"
        ) {
          snapshot.alerts.push({
            severity: t.compliance.warningLevel,
            type: "compliance",
            tenantId: t._id,
            tenantName: t.name,
            message: `Tenant "${t.name}" has ${t.compliance?.violations ?? 0} violations`,
          });
        }
      });

      return { success: true, snapshot };
    } catch (error) {
      console.error("Get realtime snapshot error:", error);
      throw error;
    }
  }

  /**
   * Helper: date range
   */
  _getPeriodDates(period) {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case "day":
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "quarter":
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    return { startDate, endDate };
  }

  /**
   * Helper: day name
   * Input from Mongo getDay(): Sunday=0 ... Saturday=6
   */
  _getDayName(dayOfWeek) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayOfWeek] ?? "Unknown";
  }

  /**
   * Helper: recommendations
   */
  async _generateReportRecommendations(hub, summary, tenants, patterns) {
    const recommendations = [];

    if (summary.avgUtilizationPercent > 85) {
      recommendations.push({
        priority: "high",
        category: "capacity",
        title: "Hub Capacity Near Limit",
        description: `Average utilization at ${summary.avgUtilizationPercent.toFixed(1)}%`,
        actions: [
          "Plan capacity expansion",
          "Implement demand response program",
          "Review tenant allocations",
        ],
      });
    }

    const problematic = tenants.filter(
      (t) =>
        (t.compliance?.violations ?? 0) > 5 ||
        t.compliance?.warningLevel === "high"
    );
    if (problematic.length > 0) {
      recommendations.push({
        priority: "medium",
        category: "compliance",
        title: "Tenant Compliance Issues",
        description: `${problematic.length} tenant(s) with repeated violations`,
        actions: [
          "Review capacity allocations for problem tenants",
          "Schedule tenant meetings to discuss usage",
          "Consider policy adjustments",
        ],
      });
    }

    if (summary.avgUtilizationPercent < 40) {
      recommendations.push({
        priority: "low",
        category: "efficiency",
        title: "Underutilized Capacity",
        description: `Only ${summary.avgUtilizationPercent.toFixed(1)}% average utilization`,
        actions: [
          "Recruit additional tenants",
          "Review pricing strategy",
          "Enable VPP participation to monetize spare capacity",
        ],
      });
    }

    if (patterns?.identified && Array.isArray(patterns.recommendations)) {
      recommendations.push({
        priority: "medium",
        category: "demand-management",
        title: "Peak Demand Optimization",
        description: "Consistent peak demand patterns detected",
        actions: patterns.recommendations.flatMap((r) => r.actions),
      });
    }

    return recommendations;
  }
}

export default new HubUsageMetricsService();

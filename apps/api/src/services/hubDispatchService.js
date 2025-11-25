import Hub from "../models/Hub.js";
import Tenant from "../models/Tenant.js";
import HubDevice from "../models/HubDevice.js";
import AllocationHistory from "../models/AllocationHistory.js";
import VPPDispatch from "../models/VPPDispatch.js";

class HubDispatchService {
  /**
   * Assess VPP readiness for a hub
   */
  async assessVPPReadiness(hubId, bidWindow) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) {
        throw new Error("Hub not found");
      }

      if (!hub.vpp?.enabled) {
        return {
          success: false,
          ready: false,
          reason: "VPP not enabled for this hub",
        };
      }

      const assessment = {
        hubId: hub._id,
        hubName: hub.name,
        timestamp: new Date(),
        bidWindow,
        ready: false,
        availableCapacity: 0,
        constraints: [],
        warnings: [],
      };

      // Calculate available capacity for VPP
      const vppAvailableKW = hub.getVPPAvailableCapacity?.() || 0;
      assessment.availableCapacity = vppAvailableKW;

      if (vppAvailableKW < 10) {
        assessment.ready = false;
        assessment.constraints.push({
          type: "insufficient-capacity",
          message: `Only ${vppAvailableKW.toFixed(1)} kW available (minimum 10 kW required)`,
        });
      }

      // Tenant buffer
      const tenantBufferPercent = 0.2;
      const tenantBuffer = hub.capacity.allocatedKW * tenantBufferPercent;
      const totalAvailable = hub.capacity.totalKW - hub.capacity.allocatedKW;

      if (totalAvailable < tenantBuffer) {
        assessment.warnings.push({
          type: "low-tenant-buffer",
          message: "Tenant buffer below recommended 20%",
        });
      }

      // Devices check
      const devices = await HubDevice.find({
        hubId,
        "vpp.eligible": true,
        "vpp.enrolled": true,
      });

      const onlineDevices = devices.filter(
        (d) => d.status.operational === "online"
      );

      if (onlineDevices.length === 0) {
        assessment.ready = false;
        assessment.constraints.push({
          type: "no-devices",
          message: "No VPP-eligible devices online",
        });
      }

      // Peak-hour warning
      const bidStartHour = new Date(bidWindow.start).getHours();
      const isPeakHour =
        (bidStartHour >= 7 && bidStartHour < 11) ||
        (bidStartHour >= 17 && bidStartHour < 21);

      if (isPeakHour) {
        assessment.warnings.push({
          type: "peak-hour",
          message: "Bid window overlaps with tenant peak hours",
        });
      }

      if (hub.capacity.utilizationPercent > 85) {
        assessment.ready = false;
        assessment.constraints.push({
          type: "high-utilization",
          message: `Hub at ${hub.capacity.utilizationPercent.toFixed(1)}% utilization`,
        });
      }

      // Final decision
      if (assessment.constraints.length === 0 && vppAvailableKW >= 10) {
        assessment.ready = true;
        assessment.recommendedBidKW = Math.min(
          vppAvailableKW,
          hub.vpp.maxContributionKW || vppAvailableKW
        );
      }

      return {
        success: true,
        assessment,
      };
    } catch (error) {
      console.error("Assess VPP readiness error:", error);
      throw error;
    }
  }

  /**
   * Reserve tenant capacity for VPP
   */
  async reserveTenantCapacity(hubId, tenants, bufferPercent = 20) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) throw new Error("Hub not found");

      const reservations = [];

      for (const tenantId of tenants) {
        const tenant = await Tenant.findById(tenantId);
        if (tenant) {
          const bufferKW = tenant.capacity.allocatedKW * (bufferPercent / 100);

          reservations.push({
            tenantId: tenant._id,
            tenantName: tenant.name,
            allocatedKW: tenant.capacity.allocatedKW,
            reservedKW: bufferKW,
            availableForVPP: tenant.capacity.allocatedKW - bufferKW,
          });
        }
      }

      hub.capacity.reservedKW = reservations.reduce(
        (sum, r) => sum + r.reservedKW,
        0
      );
      await hub.save();

      return {
        success: true,
        hub: {
          id: hub._id,
          name: hub.name,
        },
        bufferPercent,
        reservations,
        totalReservedKW: hub.capacity.reservedKW,
      };
    } catch (error) {
      console.error("Reserve tenant capacity error:", error);
      throw error;
    }
  }

  /**
   * Coordinate with VPP
   */
  async coordinateWithVPP(hubId, poolId, dispatch) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) throw new Error("Hub not found");

      const readiness = await this.assessVPPReadiness(hubId, {
        start: dispatch.startTime,
        end: dispatch.endTime,
      });

      if (!readiness.assessment.ready) {
        return {
          success: false,
          accepted: false,
          reason: "Hub not ready for dispatch",
          constraints: readiness.assessment.constraints,
        };
      }

      const requestedKW = Math.abs(dispatch.requestedKW);
      const availableKW = readiness.assessment.availableCapacity;
      const contributionKW = Math.min(requestedKW, availableKW);

      const tenants = await Tenant.find({ hubId, status: "active" });
      await this.reserveTenantCapacity(
        hubId,
        tenants.map((t) => t._id),
        20
      );

      await AllocationHistory.recordAllocation({
        hubId: hub._id,
        tenantId: null,
        eventType: "vpp-dispatch-accepted",
        request: {
          requestedKW: dispatch.requestedKW,
          purpose: `VPP dispatch for pool ${poolId}`,
        },
        decision: {
          approved: true,
          grantedKW: contributionKW,
          reason: "VPP coordination successful",
        },
        context: {
          hubAvailableKW: availableKW,
          hubUtilizationPercent: hub.capacity.utilizationPercent,
        },
        metadata: {
          triggeredBy: "vpp",
          source: "dispatch-service",
          poolId,
          dispatchId: dispatch._id,
        },
      });

      return {
        success: true,
        accepted: true,
        hub: {
          id: hub._id,
          name: hub.name,
        },
        dispatch: {
          id: dispatch._id,
          requestedKW: dispatch.requestedKW,
          contributionKW,
          startTime: dispatch.startTime,
          endTime: dispatch.endTime,
        },
        reservedForTenants: hub.capacity.reservedKW,
      };
    } catch (error) {
      console.error("Coordinate with VPP error:", error);
      throw error;
    }
  }

  /**
   * Handle dispatch conflict with tenant
   */
  async handleDispatchConflict(hubId, tenantId, dispatch) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) throw new Error("Hub not found");

      const tenant = await Tenant.findById(tenantId);
      if (!tenant) throw new Error("Tenant not found");

      const conflict = {
        hubId: hub._id,
        tenantId: tenant._id,
        dispatchId: dispatch._id,
        timestamp: new Date(),
        resolution: null,
        actions: [],
      };

      const tenantCurrentUsage = tenant.usage.current?.currentKW || 0;
      const tenantAllocated = tenant.capacity.allocatedKW;
      const dispatchImpact = Math.abs(dispatch.requestedKW);

      const hubAvailable = hub.capacity.availableKW;
      const tenantAvailable = tenantAllocated - tenantCurrentUsage;

      conflict.analysis = {
        tenantCurrentUsage,
        tenantAllocated,
        tenantAvailable,
        hubAvailable,
        dispatchImpact,
        potentialShortfall: Math.max(0, dispatchImpact - hubAvailable),
      };

      if (conflict.analysis.potentialShortfall === 0) {
        conflict.resolution = "no-conflict";
        conflict.actions.push({
          type: "continue",
          message: "Sufficient capacity available",
        });
      } else if (tenant.priorityTier === "critical") {
        conflict.resolution = "prioritize-tenant";
        conflict.actions.push({
          type: "reduce-dispatch",
          message: "Critical tenant priority",
          reducedDispatchKW: Math.max(
            0,
            dispatchImpact - conflict.analysis.potentialShortfall
          ),
        });
      } else if (
        hub.vpp?.tenantOptIn &&
        tenant.preferences.allowVPPParticipation
      ) {
        conflict.resolution = "shared-reduction";
        const shortfall = conflict.analysis.potentialShortfall;
        const tenantReduction = shortfall * 0.3;
        const dispatchReduction = shortfall * 0.7;

        conflict.actions.push({
          type: "throttle-tenant",
          message: "Throttle tenant by 30%",
          throttleKW: tenantReduction,
        });

        conflict.actions.push({
          type: "reduce-dispatch",
          message: "Reduce dispatch by 70%",
          reducedDispatchKW: dispatchImpact - dispatchReduction,
        });
      } else {
        conflict.resolution = "cancel-dispatch";
        conflict.actions.push({
          type: "cancel-dispatch",
          reason: "tenant-priority",
        });
      }

      await AllocationHistory.recordAllocation({
        hubId: hub._id,
        tenantId: tenant._id,
        eventType: "vpp-dispatch-conflict",
        request: {
          requestedKW: dispatchImpact,
          purpose: "VPP dispatch conflict resolution",
        },
        decision: {
          approved: conflict.resolution !== "cancel-dispatch",
          grantedKW:
            conflict.resolution === "cancel-dispatch" ? 0 : dispatchImpact,
          reason: conflict.resolution,
        },
        context: {
          tenantCurrentUsageKW: tenantCurrentUsage,
          tenantAllocatedKW: tenantAllocated,
          hubAvailableKW: hubAvailable,
        },
        metadata: {
          triggeredBy: "vpp",
          source: "dispatch-service",
          dispatchId: dispatch._id,
          resolution: conflict.resolution,
        },
      });

      // Apply actions
      for (const action of conflict.actions) {
        if (action.type === "throttle-tenant") {
          tenant.usage.current.currentKW = Math.max(
            0,
            tenantCurrentUsage - action.throttleKW
          );
          await tenant.save();
        }
      }

      return {
        success: true,
        conflict,
      };
    } catch (error) {
      console.error("Handle dispatch conflict error:", error);
      throw error;
    }
  }

  /**
   * Record dispatch impact & performance
   */
  async recordDispatchImpact(hubId, dispatch, performance) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) throw new Error("Hub not found");

      const impact = {
        hubId: hub._id,
        dispatchId: dispatch._id,
        startTime: dispatch.startTime,
        endTime: dispatch.endTime,
        requested: {
          kW: Math.abs(dispatch.requestedKW),
          duration:
            (new Date(dispatch.endTime) - new Date(dispatch.startTime)) /
            (1000 * 60 * 60),
        },
        actual: {
          kW: Math.abs(performance.actualKW),
          duration: performance.actualDuration,
        },
        performance: {
          deliveryPercent: (performance.actualKW / dispatch.requestedKW) * 100,
          reliability: performance.reliability || 100,
          responseTime: performance.responseTime,
        },
        tenantImpact: [],
      };

      impact.requested.kWh = impact.requested.kW * impact.requested.duration;
      impact.actual.kWh = impact.actual.kW * impact.actual.duration;

      const tenants = await Tenant.find({ hubId, status: "active" });

      for (const tenant of tenants) {
        const tenantAllocations = await AllocationHistory.find({
          tenantId: tenant._id,
          createdAt: {
            $gte: new Date(dispatch.startTime),
            $lte: new Date(dispatch.endTime),
          },
          "decision.approved": false,
        });

        if (tenantAllocations.length > 0) {
          const deniedKW = tenantAllocations.reduce(
            (sum, a) => sum + (a.decision.deniedKW || 0),
            0
          );

          impact.tenantImpact.push({
            tenantId: tenant._id,
            tenantName: tenant.name,
            deniedRequests: tenantAllocations.length,
            totalDeniedKW: deniedKW,
            compensationDue: deniedKW > 0,
          });
        }
      }

      hub.performance.revenue30d =
        (hub.performance.revenue30d || 0) + (performance.revenueCAD || 0);
      await hub.save();

      await AllocationHistory.recordAllocation({
        hubId: hub._id,
        tenantId: null,
        eventType: "vpp-dispatch-completed",
        request: {
          requestedKW: dispatch.requestedKW,
          purpose: "VPP dispatch performance recording",
        },
        decision: {
          approved: true,
          grantedKW: performance.actualKW,
          reason: "Dispatch completed",
        },
        context: {
          hubUtilizationPercent: hub.capacity.utilizationPercent,
        },
        metadata: {
          triggeredBy: "vpp",
          source: "dispatch-service",
          dispatchId: dispatch._id,
          performance: impact.performance,
        },
      });

      return {
        success: true,
        impact,
      };
    } catch (error) {
      console.error("Record dispatch impact error:", error);
      throw error;
    }
  }

  /**
   * Get dispatch schedule
   */
  async getDispatchSchedule(hubId, days = 7) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) throw new Error("Hub not found");

      if (!hub.vpp?.enabled || !hub.vpp.poolId) {
        return {
          success: false,
          message: "VPP not configured for this hub",
        };
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      const dispatches = await VPPDispatch.find({
        poolId: hub.vpp.poolId,
        startTime: { $gte: startDate, $lte: endDate },
        status: { $in: ["scheduled", "active"] },
      }).sort({ startTime: 1 });

      const schedule = {};

      dispatches.forEach((dispatch) => {
        const dateKey = new Date(dispatch.startTime)
          .toISOString()
          .split("T")[0];

        if (!schedule[dateKey]) schedule[dateKey] = [];

        schedule[dateKey].push({
          dispatchId: dispatch._id,
          startTime: dispatch.startTime,
          endTime: dispatch.endTime,
          requestedKW: dispatch.requestedKW,
          status: dispatch.status,
          hubContribution: Math.min(
            Math.abs(dispatch.requestedKW),
            hub.getVPPAvailableCapacity?.() || 0
          ),
        });
      });

      return {
        success: true,
        hub: { id: hub._id, name: hub.name },
        schedule,
        totalDispatches: dispatches.length,
      };
    } catch (error) {
      console.error("Get dispatch schedule error:", error);
      throw error;
    }
  }

  /**
   * Calculate dispatch revenue
   */
  async calculateDispatchRevenue(hubId, dispatch, marketPrice) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) throw new Error("Hub not found");

      const durationHours =
        (new Date(dispatch.endTime) - new Date(dispatch.startTime)) /
        (1000 * 60 * 60);

      const energyKWh = Math.abs(dispatch.requestedKW) * durationHours;
      const grossRevenue = energyKWh * marketPrice;

      const platformFeePercent = 10;
      const operatorFeePercent = 5;

      const platformFee = grossRevenue * (platformFeePercent / 100);
      const operatorFee = grossRevenue * (operatorFeePercent / 100);
      const netRevenue = grossRevenue - platformFee - operatorFee;

      const hubShare = netRevenue * (hub.vpp.revenueSharePercent / 100);
      const tenantShare = netRevenue - hubShare;

      return {
        success: true,
        dispatch: {
          id: dispatch._id,
          requestedKW: dispatch.requestedKW,
          duration: durationHours,
          energyKWh,
        },
        revenue: {
          marketPricePerKWh: marketPrice,
          grossRevenue,
          platformFee,
          operatorFee,
          netRevenue,
          hubShare,
          tenantShare,
        },
        breakdown: [
          { item: "Gross Revenue", amount: grossRevenue },
          { item: "Platform Fee", amount: -platformFee },
          { item: "Operator Fee", amount: -operatorFee },
          { item: "Net Revenue", amount: netRevenue },
          { item: "Hub Share", amount: hubShare },
          { item: "Tenant Share", amount: tenantShare },
        ],
      };
    } catch (error) {
      console.error("Calculate dispatch revenue error:", error);
      throw error;
    }
  }

  /**
   * Optimize dispatch strategy
   */
  async optimizeDispatchStrategy(hubId, forecastData) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) throw new Error("Hub not found");

      const optimization = {
        hubId: hub._id,
        timestamp: new Date(),
        recommendations: [],
      };

      // Price opportunities
      if (forecastData.prices) {
        const highPricePeriods = forecastData.prices.filter(
          (p) => p.price > forecastData.avgPrice * 1.2
        );

        if (highPricePeriods.length > 0) {
          optimization.recommendations.push({
            priority: "high",
            type: "dispatch-timing",
            title: "High-Price Discharge",
            description: `${highPricePeriods.length} windows >20% above avg`,
            action: "Discharge batteries during these windows",
            estimatedRevenue: highPricePeriods.reduce((sum, p) => {
              const cap = hub.getVPPAvailableCapacity?.() || 0;
              return sum + cap * p.price;
            }, 0),
          });
        }
      }

      // Tenant usage patterns
      const tenants = await Tenant.find({ hubId, status: "active" });
      const tenantPatterns = await AllocationHistory.getUsagePatterns(
        hubId,
        30
      );

      const lowDemandHours = tenantPatterns
        .filter((p) => p.avgGrantedKW < hub.capacity.totalKW * 0.4)
        .map((p) => p._id.hour);

      if (lowDemandHours.length > 0) {
        optimization.recommendations.push({
          priority: "medium",
          type: "capacity-availability",
          title: "Low-Demand Dispatch Windows",
          description: `${lowDemandHours.length} hours <40% utilization`,
          action: "Prioritize VPP in these hours",
          hours: lowDemandHours,
        });
      }

      // Battery strategy
      const batteries = await HubDevice.find({
        hubId,
        type: "battery",
        "status.operational": "online",
        "vpp.enrolled": true,
      });

      if (batteries.length > 0) {
        const totalBatteryCapacity = batteries.reduce(
          (sum, b) => sum + b.capacity.usableKW,
          0
        );

        optimization.recommendations.push({
          priority: "high",
          type: "battery-strategy",
          title: "Battery Dispatch Strategy",
          description: `${totalBatteryCapacity.toFixed(1)} kW battery capacity`,
          action: "Charge at low-price, discharge at high-price",
          details: {
            optimalChargeHours: [0, 1, 2, 3, 4, 5],
            optimalDischargeHours: [17, 18, 19, 20],
            cyclesPerDay: 1,
            expectedRevenue:
              totalBatteryCapacity * 4 * forecastData.avgPrice * 1.3,
          },
        });
      }

      // Tenant opt-in strategy
      const optedInTenants = tenants.filter(
        (t) => t.preferences?.allowVPPParticipation
      );

      if (optedInTenants.length < tenants.length * 0.5) {
        optimization.recommendations.push({
          priority: "medium",
          type: "tenant-engagement",
          title: "Increase Tenant VPP Participation",
          description: `${optedInTenants.length}/${tenants.length} tenants opted in`,
          action: "Education campaign on revenue sharing",
          potentialRevenue: (tenants.length - optedInTenants.length) * 50,
        });
      }

      return {
        success: true,
        optimization,
      };
    } catch (error) {
      console.error("Optimize dispatch strategy error:", error);
      throw error;
    }
  }
}

export default new HubDispatchService();

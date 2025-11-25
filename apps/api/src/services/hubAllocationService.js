import Hub from "../models/Hub.js";
import Tenant from "../models/Tenant.js";
import CapacityPolicy from "../models/CapacityPolicy.js";
import AllocationHistory from "../models/AllocationHistory.js";
import HubDevice from "../models/HubDevice.js";

class HubAllocationService {
  /**
   * Calculate fair share allocation for all tenants in a hub
   */
  async calculateFairShare(hubId, method = "proportional", options = {}) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) {
        throw new Error("Hub not found");
      }

      const tenants = await Tenant.find({
        hubId,
        status: "active",
      });

      if (tenants.length === 0) {
        return {
          success: true,
          allocations: [],
          message: "No active tenants to allocate capacity",
        };
      }

      const policy = await CapacityPolicy.findById(hub.activePolicyId);

      let allocations = [];

      if (policy) {
        // Use policy-defined allocation
        allocations = await policy.calculateFairAllocation(hub, tenants);
      } else {
        // Use default method
        allocations = this._calculateDefaultAllocation(
          hub,
          tenants,
          method,
          options
        );
      }

      return {
        success: true,
        allocations,
        totalAllocated: allocations.reduce((sum, a) => sum + a.allocatedKW, 0),
        hubCapacity: hub.capacity.totalKW,
        method: policy ? policy.allocationRule.type : method,
      };
    } catch (error) {
      console.error("Calculate fair share error:", error);
      throw error;
    }
  }

  /**
   * Default allocation calculation methods
   */
  _calculateDefaultAllocation(hub, tenants, method, options) {
    const allocations = [];

    switch (method) {
      case "equal":
        const equalShare = hub.capacity.totalKW / tenants.length;
        tenants.forEach((tenant) => {
          allocations.push({
            tenantId: tenant._id,
            tenantName: tenant.name,
            allocatedKW: equalShare,
            method: "equal-split",
          });
        });
        break;

      case "proportional":
        const proportionKey = options.proportionKey || "squareFootage";
        const totalProportion = tenants.reduce(
          (sum, t) => sum + (t.location?.[proportionKey] || 1),
          0
        );

        tenants.forEach((tenant) => {
          const proportion =
            (tenant.location?.[proportionKey] || 1) / totalProportion;
          allocations.push({
            tenantId: tenant._id,
            tenantName: tenant.name,
            allocatedKW: hub.capacity.totalKW * proportion,
            method: "proportional",
            basis: proportionKey,
            proportion: proportion * 100,
          });
        });
        break;

      case "weighted":
        // Weighted by historical usage
        const totalUsage = tenants.reduce(
          (sum, t) => sum + (t.usage.month?.avgKW || 1),
          0
        );

        tenants.forEach((tenant) => {
          const weight = (tenant.usage.month?.avgKW || 1) / totalUsage;
          allocations.push({
            tenantId: tenant._id,
            tenantName: tenant.name,
            allocatedKW: hub.capacity.totalKW * weight,
            method: "weighted",
            basis: "historical-usage",
          });
        });
        break;

      case "priority":
        // Priority-based allocation
        const priorityWeights = {
          critical: 3,
          priority: 2,
          standard: 1,
        };

        const totalWeight = tenants.reduce(
          (sum, t) => sum + (priorityWeights[t.priorityTier] || 1),
          0
        );

        tenants.forEach((tenant) => {
          const weight =
            (priorityWeights[tenant.priorityTier] || 1) / totalWeight;
          allocations.push({
            tenantId: tenant._id,
            tenantName: tenant.name,
            allocatedKW: hub.capacity.totalKW * weight,
            method: "priority-based",
            tier: tenant.priorityTier,
          });
        });
        break;

      default:
        throw new Error(`Unknown allocation method: ${method}`);
    }

    return allocations;
  }

  /**
   * Enforce capacity limits for a tenant request
   */
  async enforceCapacityLimits(tenantId, requestedKW, deviceId, context = {}) {
    const startTime = Date.now();

    try {
      const tenant = await Tenant.findById(tenantId).populate("hubId");
      if (!tenant) {
        throw new Error("Tenant not found");
      }

      const hub = tenant.hubId;
      if (!hub) {
        throw new Error("Hub not found");
      }

      // Get current usage
      const currentUsageKW = tenant.usage.current?.currentKW || 0;

      // Check tenant capacity
      const tenantCheck = tenant.canRequest(requestedKW);

      // Get active policy
      const policy = await CapacityPolicy.findById(hub.activePolicyId);

      let decision = {
        approved: false,
        grantedKW: 0,
        deniedKW: requestedKW,
        reason: "",
        warnings: [],
        actions: [],
      };

      // If policy exists, use it for evaluation
      if (policy) {
        const evaluationContext = {
          tenant,
          requestedKW,
          currentUsageKW,
          hub,
          timeOfDay: new Date().getHours(),
          isPeak: await this._isPeakPeriod(hub),
        };

        decision = await policy.evaluate(evaluationContext);
      } else {
        // Default evaluation without policy
        if (tenantCheck.allowed) {
          // Check hub capacity
          hub.updateAvailableCapacity();

          if (hub.capacity.availableKW >= requestedKW) {
            decision.approved = true;
            decision.grantedKW = requestedKW;
            decision.reason = "Within allocated capacity";
          } else {
            decision.approved = false;
            decision.reason = "Hub capacity insufficient";
            decision.warnings.push(
              `Hub only has ${hub.capacity.availableKW.toFixed(1)} kW available`
            );
          }
        } else {
          decision.approved = false;
          decision.reason = tenantCheck.reason;
          decision.warnings.push(
            `Tenant allocation: ${tenant.capacity.allocatedKW} kW`
          );
        }
      }

      // Record allocation in history
      const eventType = decision.approved
        ? "allocation-granted"
        : "allocation-denied";

      await AllocationHistory.recordAllocation({
        hubId: hub._id,
        tenantId: tenant._id,
        eventType,
        request: {
          requestedKW,
          deviceId,
          deviceType: context.deviceType,
          purpose: context.purpose,
        },
        decision: {
          approved: decision.approved,
          grantedKW: decision.grantedKW,
          deniedKW: decision.deniedKW,
          reason: decision.reason,
        },
        context: {
          tenantCurrentUsageKW: currentUsageKW,
          tenantAllocatedKW: tenant.capacity.allocatedKW,
          tenantUtilizationPercent: tenant.utilizationPercent,
          hubAvailableKW: hub.capacity.availableKW,
          hubUtilizationPercent: hub.capacity.utilizationPercent,
          timeOfDay: new Date().toISOString(),
          isPeakPeriod: await this._isPeakPeriod(hub),
          dayOfWeek: new Date().getDay(),
        },
        policy: policy
          ? {
              policyId: policy._id,
              policyName: policy.name,
              policyType: policy.type,
              ruleApplied: policy.allocationRule.type,
            }
          : undefined,
        metadata: {
          triggeredBy: context.triggeredBy || "system",
          triggeredById: context.triggeredById,
          source: context.source,
        },
        evaluationTimeMs: Date.now() - startTime,
      });

      // Update tenant usage if approved
      if (decision.approved) {
        tenant.updateCurrentUsage(currentUsageKW + decision.grantedKW);
        await tenant.save();
      }

      return {
        success: true,
        decision,
        tenant: {
          id: tenant._id,
          name: tenant.name,
          currentUsage: currentUsageKW,
          allocated: tenant.capacity.allocatedKW,
          utilization: tenant.utilizationPercent,
        },
        hub: {
          id: hub._id,
          name: hub.name,
          available: hub.capacity.availableKW,
          utilization: hub.capacity.utilizationPercent,
        },
      };
    } catch (error) {
      console.error("Enforce capacity limits error:", error);
      throw error;
    }
  }

  /**
   * Rebalance capacity across all tenants
   */
  async rebalanceCapacity(hubId, trigger = "manual", options = {}) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) {
        throw new Error("Hub not found");
      }

      const tenants = await Tenant.find({
        hubId,
        status: "active",
      });

      if (tenants.length === 0) {
        return {
          success: true,
          message: "No tenants to rebalance",
          changes: [],
        };
      }

      // Check if rebalance is needed
      const policy = await CapacityPolicy.findById(hub.activePolicyId);

      if (policy && !policy.shouldRebalance(hub, trigger)) {
        return {
          success: true,
          message: "Rebalance not needed per policy",
          trigger,
        };
      }

      // Calculate new allocations
      const newAllocations = await this.calculateFairShare(
        hubId,
        options.method || "proportional",
        options
      );

      const changes = [];

      // Apply new allocations
      for (const allocation of newAllocations.allocations) {
        const tenant = tenants.find(
          (t) => t._id.toString() === allocation.tenantId.toString()
        );

        if (tenant) {
          const oldAllocation = tenant.capacity.allocatedKW;
          const newAllocation = allocation.allocatedKW;
          const difference = newAllocation - oldAllocation;

          if (Math.abs(difference) > 0.1) {
            // Only apply if change > 0.1 kW
            tenant.capacity.allocatedKW = newAllocation;
            tenant.capacity.baseKW = newAllocation * 0.8; // 80% base
            tenant.capacity.burstKW = newAllocation * 0.2; // 20% burst

            await tenant.save();

            // Record rebalance event
            await AllocationHistory.recordAllocation({
              hubId: hub._id,
              tenantId: tenant._id,
              eventType: "rebalanced",
              request: {
                requestedKW: newAllocation,
                purpose: `Capacity rebalance - ${trigger}`,
              },
              decision: {
                approved: true,
                grantedKW: newAllocation,
                reason: `Rebalanced using ${allocation.method} method`,
              },
              context: {
                tenantCurrentUsageKW: tenant.usage.current?.currentKW || 0,
                tenantAllocatedKW: oldAllocation,
                hubUtilizationPercent: hub.capacity.utilizationPercent,
              },
              metadata: {
                triggeredBy: trigger,
                source: "rebalance-service",
              },
            });

            changes.push({
              tenantId: tenant._id,
              tenantName: tenant.name,
              oldAllocation,
              newAllocation,
              difference,
              percentChange: ((difference / oldAllocation) * 100).toFixed(2),
            });
          }
        }
      }

      // Update hub capacity tracking
      hub.capacity.allocatedKW = newAllocations.totalAllocated;
      hub.updateAvailableCapacity();
      await hub.save();

      // Update policy performance
      if (policy) {
        policy.performance.rebalanceCount += 1;
        policy.performance.lastEvaluated = new Date();
        await policy.save();
      }

      return {
        success: true,
        message: `Rebalanced ${changes.length} tenant allocations`,
        trigger,
        method: newAllocations.method,
        changes,
        summary: {
          totalAllocated: newAllocations.totalAllocated,
          hubCapacity: hub.capacity.totalKW,
          utilizationPercent:
            (newAllocations.totalAllocated / hub.capacity.totalKW) * 100,
        },
      };
    } catch (error) {
      console.error("Rebalance capacity error:", error);
      throw error;
    }
  }

  /**
   * Apply policy to hub
   */
  async applyPolicy(hubId, policyId, override = false) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) {
        throw new Error("Hub not found");
      }

      const policy = await CapacityPolicy.findById(policyId);
      if (!policy) {
        throw new Error("Policy not found");
      }

      // Check if policy belongs to this hub
      if (policy.hubId.toString() !== hubId.toString()) {
        throw new Error("Policy does not belong to this hub");
      }

      // Check if another policy is already active
      if (hub.activePolicyId && !override) {
        throw new Error(
          "Another policy is already active. Use override=true to replace."
        );
      }

      // Deactivate old policy
      if (hub.activePolicyId) {
        const oldPolicy = await CapacityPolicy.findById(hub.activePolicyId);
        if (oldPolicy) {
          oldPolicy.status = "inactive";
          oldPolicy.deactivatedAt = new Date();
          await oldPolicy.save();
        }
      }

      // Activate new policy
      policy.status = "active";
      policy.activatedAt = new Date();
      await policy.save();

      // Update hub
      hub.activePolicyId = policy._id;
      await hub.save();

      // Trigger rebalance if policy requires it
      if (
        policy.rebalanceRule.enabled &&
        policy.rebalanceRule.trigger === "scheduled"
      ) {
        await this.rebalanceCapacity(hubId, "policy-applied");
      }

      return {
        success: true,
        message: "Policy applied successfully",
        policy: {
          id: policy._id,
          name: policy.name,
          type: policy.type,
        },
      };
    } catch (error) {
      console.error("Apply policy error:", error);
      throw error;
    }
  }

  /**
   * Record allocation event
   */
  async recordAllocation(tenantId, allocation, reason) {
    try {
      const tenant = await Tenant.findById(tenantId).populate("hubId");

      await AllocationHistory.recordAllocation({
        hubId: tenant.hubId._id,
        tenantId: tenant._id,
        eventType: "allocation-adjusted",
        request: {
          requestedKW: allocation.allocatedKW,
          purpose: reason,
        },
        decision: {
          approved: true,
          grantedKW: allocation.allocatedKW,
          reason,
        },
        context: {
          tenantAllocatedKW: tenant.capacity.allocatedKW,
        },
        metadata: {
          triggeredBy: "admin",
          source: "allocation-service",
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Record allocation error:", error);
      throw error;
    }
  }

  /**
   * Get allocation recommendations
   */
  async getRecommendations(hubId) {
    try {
      const hub = await Hub.findById(hubId);
      const tenants = await Tenant.find({ hubId, status: "active" });

      const recommendations = [];

      // Analyze utilization patterns
      for (const tenant of tenants) {
        const utilizationPercent = tenant.utilizationPercent || 0;

        if (utilizationPercent > 95) {
          recommendations.push({
            tenantId: tenant._id,
            tenantName: tenant.name,
            type: "increase-allocation",
            severity: "high",
            currentAllocation: tenant.capacity.allocatedKW,
            suggestedAllocation: tenant.capacity.allocatedKW * 1.2,
            reason: `Tenant consistently at ${utilizationPercent.toFixed(1)}% utilization`,
          });
        } else if (utilizationPercent < 30) {
          recommendations.push({
            tenantId: tenant._id,
            tenantName: tenant.name,
            type: "decrease-allocation",
            severity: "low",
            currentAllocation: tenant.capacity.allocatedKW,
            suggestedAllocation: tenant.capacity.allocatedKW * 0.8,
            reason: `Tenant only using ${utilizationPercent.toFixed(1)}% of allocation`,
          });
        }
      }

      // Check hub-level recommendations
      const hubUtilization = hub.capacity.utilizationPercent || 0;

      if (hubUtilization > 85) {
        recommendations.push({
          type: "expand-capacity",
          severity: "high",
          currentCapacity: hub.capacity.totalKW,
          suggestedCapacity: hub.capacity.totalKW * 1.3,
          reason: `Hub at ${hubUtilization.toFixed(1)}% utilization`,
        });
      }

      return {
        success: true,
        recommendations,
        summary: {
          total: recommendations.length,
          high: recommendations.filter((r) => r.severity === "high").length,
          medium: recommendations.filter((r) => r.severity === "medium").length,
          low: recommendations.filter((r) => r.severity === "low").length,
        },
      };
    } catch (error) {
      console.error("Get recommendations error:", error);
      throw error;
    }
  }

  /**
   * Helper: Check if current time is peak period
   */
  async _isPeakPeriod(hub) {
    const hour = new Date().getHours();

    // Default peak hours: 7am-11am and 5pm-9pm
    return (hour >= 7 && hour < 11) || (hour >= 17 && hour < 21);
  }
}

export default new HubAllocationService();

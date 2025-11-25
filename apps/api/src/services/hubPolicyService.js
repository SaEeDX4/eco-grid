import CapacityPolicy from "../models/CapacityPolicy.js";
import Hub from "../models/Hub.js";
import Tenant from "../models/Tenant.js";
import AllocationHistory from "../models/AllocationHistory.js";

class HubPolicyService {
  /**
   * Create a new capacity policy
   */
  async createPolicy(hubId, policyData, createdBy) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) {
        throw new Error("Hub not found");
      }

      const policy = await CapacityPolicy.create({
        hubId,
        name: policyData.name,
        description: policyData.description,
        type: policyData.type || "standard",
        allocationRule: policyData.allocationRule,
        enforcementRule: policyData.enforcementRule,
        rebalanceRule: policyData.rebalanceRule || { enabled: false },
        overagePolicy: policyData.overagePolicy || {
          allowed: true,
          maxOveragePercent: 20,
          maxOverageDurationMinutes: 15,
          overageRateMultiplier: 1.5,
        },
        schedule: policyData.schedule || { enabled: false },
        vppCoordination: policyData.vppCoordination || { enabled: false },
        status: "draft",
        createdBy,
      });

      return {
        success: true,
        policy,
        message: "Policy created successfully",
      };
    } catch (error) {
      console.error("Create policy error:", error);
      throw error;
    }
  }

  /**
   * Create policy from template
   */
  async createFromTemplate(hubId, templateName, createdBy) {
    try {
      const policy = await CapacityPolicy.createFromTemplate(
        hubId,
        templateName,
        createdBy
      );

      return {
        success: true,
        policy,
        message: `Policy created from template: ${templateName}`,
      };
    } catch (error) {
      console.error("Create from template error:", error);
      throw error;
    }
  }

  /**
   * Evaluate policy for a specific request
   */
  async evaluatePolicy(hubId, tenantId, request) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) {
        throw new Error("Hub not found");
      }

      const tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        throw new Error("Tenant not found");
      }

      const policy = await CapacityPolicy.findById(hub.activePolicyId);
      if (!policy) {
        return {
          success: false,
          message: "No active policy found for this hub",
        };
      }

      const context = {
        tenant,
        requestedKW: request.requestedKW,
        currentUsageKW: tenant.usage.current?.currentKW || 0,
        hub,
        timeOfDay: new Date().getHours(),
        isPeak: await this._isPeakPeriod(hub),
      };

      const decision = await policy.evaluate(context);

      // Update policy performance metrics
      policy.performance.lastEvaluated = new Date();
      if (!decision.approved) {
        policy.performance.violationsCount += 1;
      }
      await policy.save();

      return {
        success: true,
        decision,
        policy: {
          id: policy._id,
          name: policy.name,
          type: policy.type,
        },
      };
    } catch (error) {
      console.error("Evaluate policy error:", error);
      throw error;
    }
  }

  /**
   * Escalate a capacity violation
   */
  async escalateViolation(tenantId, violation) {
    try {
      const tenant = await Tenant.findById(tenantId).populate("hubId");
      if (!tenant) {
        throw new Error("Tenant not found");
      }

      const hub = tenant.hubId;
      const policy = await CapacityPolicy.findById(hub.activePolicyId);

      // Add violation to tenant record
      await tenant.addViolation(
        violation.type,
        `${violation.description} - Exceeded by ${violation.exceededByKW.toFixed(2)} kW`
      );

      // Determine severity
      let severity = "low";
      if (tenant.compliance.violations >= 10) {
        severity = "critical";
      } else if (tenant.compliance.violations >= 5) {
        severity = "high";
      } else if (tenant.compliance.violations >= 3) {
        severity = "medium";
      }

      // Record in allocation history
      await AllocationHistory.recordAllocation({
        hubId: hub._id,
        tenantId: tenant._id,
        eventType: "violation",
        request: {
          requestedKW: violation.requestedKW,
          purpose: "Capacity limit exceeded",
        },
        decision: {
          approved: false,
          grantedKW: 0,
          deniedKW: violation.exceededByKW,
          reason: violation.description,
        },
        context: {
          tenantCurrentUsageKW: tenant.usage.current?.currentKW || 0,
          tenantAllocatedKW: tenant.capacity.allocatedKW,
          tenantUtilizationPercent: tenant.utilizationPercent,
        },
        compliance: {
          isViolation: true,
          violationType: violation.type,
          severityLevel: severity,
          actionTaken: this._getViolationAction(tenant, policy),
        },
        metadata: {
          triggeredBy: "system",
          source: "policy-service",
        },
      });

      // Take action based on policy and violation count
      const action = this._getViolationAction(tenant, policy);

      let actionTaken = null;

      switch (action) {
        case "warn":
          actionTaken = await this._sendWarning(tenant, violation);
          break;

        case "throttle":
          actionTaken = await this._throttleTenant(tenant, 80); // Throttle to 80%
          break;

        case "suspend":
          if (tenant.compliance.violations >= 15) {
            actionTaken = await this._suspendTenant(tenant, "24h");
          }
          break;

        case "cutoff":
          if (tenant.compliance.violations >= 20) {
            actionTaken = await this._emergencyCutoff(tenant);
          }
          break;
      }

      return {
        success: true,
        violation: {
          tenantId: tenant._id,
          tenantName: tenant.name,
          type: violation.type,
          severity,
          totalViolations: tenant.compliance.violations,
          warningLevel: tenant.compliance.warningLevel,
          actionTaken: action,
          actionDetails: actionTaken,
        },
      };
    } catch (error) {
      console.error("Escalate violation error:", error);
      throw error;
    }
  }

  /**
   * Adjust policy based on usage patterns
   */
  async adjustPolicyBasedOnUsage(hubId, historicalData) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) {
        throw new Error("Hub not found");
      }

      const policy = await CapacityPolicy.findById(hub.activePolicyId);
      if (!policy) {
        return {
          success: false,
          message: "No active policy to adjust",
        };
      }

      // Analyze historical patterns
      const patterns = await AllocationHistory.getUsagePatterns(hubId, 30);

      const adjustments = [];

      // Identify peak hours
      const peakHours = patterns
        .filter((p) => p.avgGrantedKW > hub.capacity.totalKW * 0.7)
        .map((p) => p._id.hour);

      if (peakHours.length > 0 && !policy.schedule.enabled) {
        // Suggest enabling peak management
        adjustments.push({
          type: "enable-peak-schedule",
          reason: "Detected consistent peak usage patterns",
          peakHours,
          suggestedMultiplier: 0.9,
        });
      }

      // Check if violations are frequent
      const recentViolations = await AllocationHistory.getViolations(
        hubId,
        null,
        {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        }
      );

      if (recentViolations.length > 20) {
        // Policy too strict
        adjustments.push({
          type: "relax-enforcement",
          reason: "High violation rate indicates policy may be too strict",
          currentThreshold: policy.enforcementRule.threshold,
          suggestedThreshold: Math.min(
            100,
            policy.enforcementRule.threshold + 10
          ),
        });
      } else if (
        recentViolations.length < 3 &&
        hub.capacity.utilizationPercent < 60
      ) {
        // Policy may be too lenient
        adjustments.push({
          type: "tighten-enforcement",
          reason:
            "Low utilization and few violations suggest policy could be stricter",
          currentThreshold: policy.enforcementRule.threshold,
          suggestedThreshold: Math.max(
            70,
            policy.enforcementRule.threshold - 10
          ),
        });
      }

      // Check rebalance frequency
      if (policy.rebalanceRule.enabled) {
        const rebalanceEvents = await AllocationHistory.find({
          hubId,
          eventType: "rebalanced",
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        });

        if (rebalanceEvents.length > 10) {
          adjustments.push({
            type: "reduce-rebalance-frequency",
            reason: "Frequent rebalancing may be disruptive",
            currentTrigger: policy.rebalanceRule.trigger,
            suggestedAction: "Increase threshold or use scheduled rebalancing",
          });
        }
      }

      return {
        success: true,
        policy: {
          id: policy._id,
          name: policy.name,
        },
        analysis: {
          totalPatterns: patterns.length,
          peakHours: peakHours.length,
          recentViolations: recentViolations.length,
          hubUtilization: hub.capacity.utilizationPercent,
        },
        adjustments,
        message:
          adjustments.length > 0
            ? `Found ${adjustments.length} potential policy adjustments`
            : "Policy appears well-calibrated",
      };
    } catch (error) {
      console.error("Adjust policy error:", error);
      throw error;
    }
  }

  /**
   * Get policy recommendations for a hub
   */
  async getPolicyRecommendations(hubId, usagePatterns) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) {
        throw new Error("Hub not found");
      }

      const tenants = await Tenant.find({ hubId, status: "active" });

      const recommendations = [];

      // Analyze hub characteristics
      const hubUtilization = hub.capacity.utilizationPercent || 0;
      const tenantCount = tenants.length;

      // High utilization - suggest stricter enforcement
      if (hubUtilization > 85) {
        recommendations.push({
          templateName: "peak-management",
          priority: "high",
          reason: "High hub utilization requires peak demand management",
          benefits: [
            "Prevent capacity overload",
            "Smooth demand curves",
            "Reduce infrastructure strain",
          ],
          settings: {
            enforcementThreshold: 90,
            peakHoursMultiplier: 0.85,
            enableRebalancing: true,
          },
        });
      }

      // Many tenants - suggest fair allocation
      if (tenantCount > 10) {
        recommendations.push({
          templateName: "equal-share",
          priority: "medium",
          reason: "Large number of tenants benefit from fair allocation",
          benefits: [
            "Equitable resource distribution",
            "Simplified management",
            "Reduced disputes",
          ],
          settings: {
            allocationMethod: "proportional",
            enableRebalancing: true,
            rebalanceTrigger: "tenant-change",
          },
        });
      }

      // VPP enabled - suggest coordination policy
      if (hub.vpp.enabled) {
        recommendations.push({
          templateName: "vpp-coordination",
          priority: "high",
          reason: "VPP participation requires tenant buffer management",
          benefits: [
            "Protect tenant access during dispatches",
            "Maximize VPP revenue",
            "Maintain reliability",
          ],
          settings: {
            tenantBufferPercent: 20,
            vppPriority: "medium",
            allowDispatchDuringPeak: false,
          },
        });
      }

      // Priority tenants exist
      const hasPriorityTenants = tenants.some(
        (t) => t.priorityTier !== "standard"
      );

      if (hasPriorityTenants) {
        recommendations.push({
          templateName: "priority-tiered",
          priority: "medium",
          reason: "Priority tenants require differentiated allocation",
          benefits: [
            "Guarantee capacity for critical tenants",
            "Flexible allocation tiers",
            "Revenue optimization",
          ],
          settings: {
            allocationMethod: "priority-based",
            priorities: {
              critical: 40,
              priority: 35,
              standard: 25,
            },
          },
        });
      }

      // Low utilization - suggest growth optimization
      if (hubUtilization < 40 && tenantCount < 5) {
        recommendations.push({
          templateName: "growth-optimization",
          priority: "low",
          reason: "Low utilization suggests capacity for growth",
          benefits: [
            "Attract new tenants",
            "Maximize revenue",
            "Efficient resource use",
          ],
          settings: {
            allowOverage: true,
            maxOveragePercent: 30,
            incentivizeUsage: true,
          },
        });
      }

      return {
        success: true,
        hubProfile: {
          utilizationPercent: hubUtilization,
          tenantCount,
          totalCapacity: hub.capacity.totalKW,
          vppEnabled: hub.vpp.enabled,
        },
        recommendations: recommendations.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }),
      };
    } catch (error) {
      console.error("Get policy recommendations error:", error);
      throw error;
    }
  }

  /**
   * Simulate policy impact
   */
  async simulatePolicy(hubId, policyConfig, simulationDays = 7) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) {
        throw new Error("Hub not found");
      }

      const tenants = await Tenant.find({ hubId, status: "active" });

      // Get historical usage data
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - simulationDays);

      const historicalRequests = await AllocationHistory.find({
        hubId,
        createdAt: { $gte: startDate },
        eventType: { $in: ["allocation-granted", "allocation-denied"] },
      });

      // Create temporary policy for simulation
      const tempPolicy = new CapacityPolicy({
        hubId,
        ...policyConfig,
        status: "draft",
      });

      // Replay historical requests through new policy
      const simulationResults = {
        totalRequests: historicalRequests.length,
        approved: 0,
        denied: 0,
        throttled: 0,
        violations: 0,
        avgGrantedPercent: 0,
        estimatedSavings: 0,
        tenantImpact: {},
      };

      let totalGrantedPercent = 0;

      for (const request of historicalRequests) {
        const tenant = tenants.find(
          (t) => t._id.toString() === request.tenantId.toString()
        );

        if (tenant) {
          const context = {
            tenant,
            requestedKW: request.request.requestedKW,
            currentUsageKW: request.context.tenantCurrentUsageKW,
            hub,
            timeOfDay: new Date(request.createdAt).getHours(),
            isPeak: request.context.isPeakPeriod,
          };

          const decision = await tempPolicy.evaluate(context);

          if (decision.approved) {
            simulationResults.approved++;
            totalGrantedPercent +=
              (decision.grantedKW / request.request.requestedKW) * 100;

            if (decision.grantedKW < request.request.requestedKW) {
              simulationResults.throttled++;
            }
          } else {
            simulationResults.denied++;
            simulationResults.violations++;
          }

          // Track per-tenant impact
          if (!simulationResults.tenantImpact[tenant._id]) {
            simulationResults.tenantImpact[tenant._id] = {
              name: tenant.name,
              requests: 0,
              approved: 0,
              denied: 0,
              avgGrantedPercent: 0,
            };
          }

          const tenantImpact = simulationResults.tenantImpact[tenant._id];
          tenantImpact.requests++;

          if (decision.approved) {
            tenantImpact.approved++;
            tenantImpact.avgGrantedPercent +=
              (decision.grantedKW / request.request.requestedKW) * 100;
          } else {
            tenantImpact.denied++;
          }
        }
      }

      // Calculate averages
      if (simulationResults.approved > 0) {
        simulationResults.avgGrantedPercent =
          totalGrantedPercent / simulationResults.approved;
      }

      // Calculate per-tenant averages
      Object.values(simulationResults.tenantImpact).forEach((impact) => {
        if (impact.approved > 0) {
          impact.avgGrantedPercent = impact.avgGrantedPercent / impact.approved;
        }
      });

      // Compare with actual historical performance
      const actualApproved = historicalRequests.filter(
        (r) => r.decision.approved
      ).length;
      const actualDenied = historicalRequests.filter(
        (r) => !r.decision.approved
      ).length;

      const comparison = {
        approvalRateChange:
          (simulationResults.approved / simulationResults.totalRequests -
            actualApproved / historicalRequests.length) *
          100,
        denialRateChange:
          (simulationResults.denied / simulationResults.totalRequests -
            actualDenied / historicalRequests.length) *
          100,
      };

      return {
        success: true,
        simulationConfig: {
          days: simulationDays,
          policyType: policyConfig.type,
          allocationMethod: policyConfig.allocationRule?.type,
          enforcementType: policyConfig.enforcementRule?.type,
        },
        results: simulationResults,
        comparison,
        recommendation: this._generateSimulationRecommendation(
          comparison,
          simulationResults
        ),
      };
    } catch (error) {
      console.error("Simulate policy error:", error);
      throw error;
    }
  }

  /**
   * Helper: Determine action for violation
   */
  _getViolationAction(tenant, policy) {
    const violationCount = tenant.compliance.violations;

    if (!policy || !policy.enforcementRule) {
      // Default escalation
      if (violationCount >= 20) return "cutoff";
      if (violationCount >= 15) return "suspend";
      if (violationCount >= 5) return "throttle";
      return "warn";
    }

    const action = policy.enforcementRule.action;

    // Escalate based on violation count
    if (violationCount >= 20 && action !== "cutoff") return "cutoff";
    if (violationCount >= 10 && action === "warn") return "throttle";

    return action;
  }

  /**
   * Helper: Send warning to tenant
   */
  async _sendWarning(tenant, violation) {
    // In production, this would send email/SMS
    return {
      type: "warning",
      sentTo: tenant.contactInfo.email,
      message: `Capacity violation: ${violation.description}`,
      timestamp: new Date(),
    };
  }

  /**
   * Helper: Throttle tenant capacity
   */
  async _throttleTenant(tenant, percent) {
    const originalCapacity = tenant.capacity.allocatedKW;
    tenant.capacity.allocatedKW = originalCapacity * (percent / 100);
    await tenant.save();

    return {
      type: "throttle",
      originalCapacity,
      throttledCapacity: tenant.capacity.allocatedKW,
      percent,
      duration: "24 hours",
      timestamp: new Date(),
    };
  }

  /**
   * Helper: Suspend tenant
   */
  async _suspendTenant(tenant, duration) {
    tenant.status = "suspended";
    await tenant.save();

    return {
      type: "suspension",
      duration,
      reason: "Repeated capacity violations",
      timestamp: new Date(),
    };
  }

  /**
   * Helper: Emergency cutoff
   */
  async _emergencyCutoff(tenant) {
    // This would trigger actual device disconnection in production
    tenant.status = "suspended";
    tenant.capacity.allocatedKW = 0;
    await tenant.save();

    return {
      type: "emergency-cutoff",
      reason: "Critical violation threshold exceeded",
      requiresManualReactivation: true,
      timestamp: new Date(),
    };
  }

  /**
   * Helper: Generate simulation recommendation
   */
  _generateSimulationRecommendation(comparison, results) {
    if (comparison.denialRateChange > 10) {
      return {
        verdict: "not-recommended",
        reason: "Policy would significantly increase denial rate",
        impact: "negative",
      };
    }

    if (
      comparison.approvalRateChange < -5 &&
      results.violations > results.totalRequests * 0.2
    ) {
      return {
        verdict: "caution",
        reason: "Policy may be too restrictive",
        impact: "moderate",
      };
    }

    if (
      results.avgGrantedPercent > 95 &&
      results.violations < results.totalRequests * 0.05
    ) {
      return {
        verdict: "recommended",
        reason: "Policy maintains high approval rate with low violations",
        impact: "positive",
      };
    }

    return {
      verdict: "neutral",
      reason: "Policy shows mixed results, may need tuning",
      impact: "neutral",
    };
  }

  /**
   * Helper: Check if peak period
   */
  async _isPeakPeriod(hub) {
    const hour = new Date().getHours();
    return (hour >= 7 && hour < 11) || (hour >= 17 && hour < 21);
  }
}

export default new HubPolicyService();

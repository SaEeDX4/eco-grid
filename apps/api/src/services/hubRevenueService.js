import HubRevenue from "../models/HubRevenue.js";
import Hub from "../models/Hub.js";
import Tenant from "../models/Tenant.js";
import AllocationHistory from "../models/AllocationHistory.js";
import VPPRevenue from "../models/VPPRevenue.js";

class HubRevenueService {
  /**
   * Calculate tenant bill for a period
   */
  async calculateTenantBill(tenantId, period = "current") {
    try {
      const tenant = await Tenant.findById(tenantId).populate("hubId");
      if (!tenant) {
        throw new Error("Tenant not found");
      }

      const hub = tenant.hubId;

      let startDate, endDate;

      if (period === "current") {
        // Current billing cycle
        startDate = new Date();
        startDate.setDate(1); // First day of current month
        endDate = new Date();
      } else {
        // Parse period (e.g., "2025-01" for January 2025)
        const [year, month] = period.split("-").map(Number);
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0, 23, 59, 59);
      }

      // Get allocation history for period
      const history = await AllocationHistory.find({
        tenantId,
        "decision.approved": true,
        createdAt: { $gte: startDate, $lte: endDate },
      });

      // Calculate usage metrics
      const usageMetrics = {
        totalAllocations: history.length,
        totalGrantedKW: history.reduce(
          (sum, h) => sum + h.decision.grantedKW,
          0
        ),
        avgGrantedKW: 0,
        peakDemandKW: 0,
        estimatedKWh: 0,
        overageKWh: 0,
      };

      if (history.length > 0) {
        usageMetrics.avgGrantedKW =
          usageMetrics.totalGrantedKW / history.length;
        usageMetrics.peakDemandKW = Math.max(
          ...history.map((h) => h.decision.grantedKW)
        );

        // Estimate energy consumption (simplified)
        const hours = (endDate - startDate) / (1000 * 60 * 60);
        usageMetrics.estimatedKWh =
          usageMetrics.avgGrantedKW * Math.min(hours, 730); // Cap at month hours

        // Calculate overage
        const overageEvents = history.filter(
          (h) => h.eventType === "overage-allowed"
        );
        usageMetrics.overageKWh = overageEvents.reduce((sum, h) => {
          const overage = h.decision.grantedKW - tenant.capacity.allocatedKW;
          return sum + Math.max(0, overage);
        }, 0);
      }

      // Calculate charges based on billing model
      const charges = {
        baseCAD: 0,
        usageCAD: 0,
        demandCAD: 0,
        overageCAD: 0,
        creditsCAD: 0,
      };

      // Base charge
      if (hub.billing.baseFeeCAD) {
        charges.baseCAD = hub.billing.baseFeeCAD;
      }

      // Usage charge (per kWh)
      const ratePerKWh =
        tenant.billing.rateCAD?.perKWh || hub.billing.ratePerKWhCAD || 0.15;
      charges.usageCAD = usageMetrics.estimatedKWh * ratePerKWh;

      // Demand charge (per kW of peak demand)
      const demandRate =
        tenant.billing.rateCAD?.demandCharge ||
        hub.billing.demandChargePerKWCAD ||
        10;
      charges.demandCAD = usageMetrics.peakDemandKW * demandRate;

      // Overage charge (premium rate)
      if (usageMetrics.overageKWh > 0) {
        const overageRate =
          ratePerKWh * (hub.settings.overageRateMultiplier || 1.5);
        charges.overageCAD = usageMetrics.overageKWh * overageRate;
      }

      // Apply any credits
      // (Could be from VPP revenue sharing, promotions, etc.)
      charges.creditsCAD = 0;

      const totalCAD =
        charges.baseCAD +
        charges.usageCAD +
        charges.demandCAD +
        charges.overageCAD -
        charges.creditsCAD;

      return {
        success: true,
        tenant: {
          id: tenant._id,
          name: tenant.name,
          businessType: tenant.businessType,
        },
        period: {
          start: startDate,
          end: endDate,
        },
        usage: usageMetrics,
        charges,
        totalCAD: Math.max(0, totalCAD),
        breakdown: [
          { item: "Base Fee", amount: charges.baseCAD },
          {
            item: `Energy Usage (${usageMetrics.estimatedKWh.toFixed(1)} kWh @ $${ratePerKWh.toFixed(3)}/kWh)`,
            amount: charges.usageCAD,
          },
          {
            item: `Peak Demand (${usageMetrics.peakDemandKW.toFixed(1)} kW @ $${demandRate.toFixed(2)}/kW)`,
            amount: charges.demandCAD,
          },
          ...(charges.overageCAD > 0
            ? [{ item: "Overage Charges", amount: charges.overageCAD }]
            : []),
          ...(charges.creditsCAD > 0
            ? [{ item: "Credits", amount: -charges.creditsCAD }]
            : []),
        ],
      };
    } catch (error) {
      console.error("Calculate tenant bill error:", error);
      throw error;
    }
  }

  /**
   * Allocate shared costs across tenants
   */
  async allocateSharedCosts(hubId, period) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) {
        throw new Error("Hub not found");
      }

      const tenants = await Tenant.find({ hubId, status: "active" });

      if (tenants.length === 0) {
        return {
          success: true,
          message: "No active tenants for cost allocation",
          allocations: [],
        };
      }

      // Define shared costs for the period
      const sharedCosts = {
        maintenanceCAD: 0,
        energyCAD: 0,
        platformFeeCAD: 0,
        otherCAD: 0,
      };

      // In production, these would come from actual invoices/expenses
      // For now, estimate based on hub capacity and usage
      sharedCosts.maintenanceCAD = hub.capacity.totalKW * 5; // $5 per kW per month
      sharedCosts.energyCAD = hub.capacity.totalKW * 50; // Estimated grid costs
      sharedCosts.platformFeeCAD = 500; // Fixed platform fee

      const totalSharedCosts = Object.values(sharedCosts).reduce(
        (a, b) => a + b,
        0
      );

      // Allocation method based on hub billing model
      const allocations = [];

      switch (hub.billing.model) {
        case "equal-split":
          const equalShare = totalSharedCosts / tenants.length;
          tenants.forEach((tenant) => {
            allocations.push({
              tenantId: tenant._id,
              tenantName: tenant.name,
              allocatedCostCAD: equalShare,
              method: "equal-split",
              percentage: (1 / tenants.length) * 100,
            });
          });
          break;

        case "proportional":
        default:
          // Proportional to allocated capacity
          const totalAllocated = tenants.reduce(
            (sum, t) => sum + t.capacity.allocatedKW,
            0
          );

          tenants.forEach((tenant) => {
            const proportion = tenant.capacity.allocatedKW / totalAllocated;
            allocations.push({
              tenantId: tenant._id,
              tenantName: tenant.name,
              allocatedCostCAD: totalSharedCosts * proportion,
              method: "proportional",
              percentage: proportion * 100,
              basis: "allocated-capacity",
            });
          });
          break;

        case "usage-based":
          // Get actual usage for period
          const [year, month] = period.split("-").map(Number);
          const startDate = new Date(year, month - 1, 1);
          const endDate = new Date(year, month, 0, 23, 59, 59);

          const usagePromises = tenants.map(async (tenant) => {
            const history = await AllocationHistory.find({
              tenantId: tenant._id,
              "decision.approved": true,
              createdAt: { $gte: startDate, $lte: endDate },
            });

            const totalUsage = history.reduce(
              (sum, h) => sum + h.decision.grantedKW,
              0
            );
            return { tenantId: tenant._id, totalUsage };
          });

          const usageData = await Promise.all(usagePromises);
          const totalUsage = usageData.reduce(
            (sum, u) => sum + u.totalUsage,
            0
          );

          usageData.forEach(({ tenantId, totalUsage: tenantUsage }) => {
            const tenant = tenants.find(
              (t) => t._id.toString() === tenantId.toString()
            );
            const proportion = totalUsage > 0 ? tenantUsage / totalUsage : 0;

            allocations.push({
              tenantId: tenant._id,
              tenantName: tenant.name,
              allocatedCostCAD: totalSharedCosts * proportion,
              method: "usage-based",
              percentage: proportion * 100,
              basis: "actual-usage",
            });
          });
          break;
      }

      return {
        success: true,
        hub: {
          id: hub._id,
          name: hub.name,
        },
        period,
        sharedCosts,
        totalSharedCosts,
        allocations,
      };
    } catch (error) {
      console.error("Allocate shared costs error:", error);
      throw error;
    }
  }

  /**
   * Distribute VPP revenue to tenants
   */
  async distributeVPPRevenue(hubId, poolId, period) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) {
        throw new Error("Hub not found");
      }

      if (!hub.vpp.enabled) {
        return {
          success: false,
          message: "VPP not enabled for this hub",
        };
      }

      // Get VPP revenue for the period
      const [year, month] = period.split("-").map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      // In production, fetch from VPPRevenue model
      // For now, simulate
      const vppRevenue = {
        grossCAD: 0,
        feesCAD: 0,
        netCAD: 0,
      };

      // Fetch actual VPP revenue if available
      const vppRevenueRecords = await VPPRevenue.find({
        poolId,
        "period.start": { $gte: startDate, $lte: endDate },
      });

      if (vppRevenueRecords.length > 0) {
        vppRevenue.grossCAD = vppRevenueRecords.reduce(
          (sum, r) => sum + (r.grossRevenue || 0),
          0
        );
        vppRevenue.feesCAD = vppRevenueRecords.reduce(
          (sum, r) => sum + (r.platformFee || 0) + (r.operatorFee || 0),
          0
        );
        vppRevenue.netCAD = vppRevenue.grossCAD - vppRevenue.feesCAD;
      }

      if (vppRevenue.netCAD <= 0) {
        return {
          success: true,
          message: "No VPP revenue to distribute for this period",
          distribution: [],
        };
      }

      // Hub takes its share
      const hubShare = vppRevenue.netCAD * (hub.vpp.revenueSharePercent / 100);
      const tenantPool = vppRevenue.netCAD - hubShare;

      // Get tenants who opted into VPP
      const tenants = await Tenant.find({
        hubId,
        status: "active",
        "preferences.allowVPPParticipation": true,
      });

      if (tenants.length === 0) {
        return {
          success: true,
          message: "No tenants opted into VPP revenue sharing",
          hubRetainsAll: true,
          hubShareCAD: vppRevenue.netCAD,
        };
      }

      // Distribute to tenants proportionally by their allocated capacity
      const totalAllocated = tenants.reduce(
        (sum, t) => sum + t.capacity.allocatedKW,
        0
      );

      const distribution = tenants.map((tenant) => {
        const proportion = tenant.capacity.allocatedKW / totalAllocated;
        const shareCAD = tenantPool * proportion;

        return {
          tenantId: tenant._id,
          tenantName: tenant.name,
          allocatedKW: tenant.capacity.allocatedKW,
          proportion: proportion * 100,
          shareCAD,
        };
      });

      return {
        success: true,
        hub: {
          id: hub._id,
          name: hub.name,
        },
        period,
        vppRevenue,
        hubSharePercent: hub.vpp.revenueSharePercent,
        hubShareCAD,
        tenantPoolCAD: tenantPool,
        distribution,
      };
    } catch (error) {
      console.error("Distribute VPP revenue error:", error);
      throw error;
    }
  }

  /**
   * Apply credits to tenant
   */
  async applyCredits(tenantId, amountCAD, reason) {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        throw new Error("Tenant not found");
      }

      // Update tenant balance
      tenant.billing.currentBalanceCAD -= amountCAD;
      await tenant.save();

      return {
        success: true,
        tenant: {
          id: tenant._id,
          name: tenant.name,
        },
        creditApplied: amountCAD,
        reason,
        newBalance: tenant.billing.currentBalanceCAD,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Apply credits error:", error);
      throw error;
    }
  }

  /**
   * Generate invoice for tenant
   */
  async generateInvoice(tenantId, period) {
    try {
      const tenant = await Tenant.findById(tenantId).populate("hubId");
      if (!tenant) {
        throw new Error("Tenant not found");
      }

      // Calculate bill
      const bill = await this.calculateTenantBill(tenantId, period);

      // Generate invoice number
      const invoiceNumber = `INV-${tenant.hubId._id.toString().slice(-6).toUpperCase()}-${Date.now()}`;

      const invoice = {
        invoiceNumber,
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        tenant: {
          id: tenant._id,
          name: tenant.name,
          businessType: tenant.businessType,
          contactEmail: tenant.contactInfo.email,
          location: tenant.location,
        },
        hub: {
          id: tenant.hubId._id,
          name: tenant.hubId.name,
          location: tenant.hubId.location,
        },
        period: bill.period,
        lineItems: bill.breakdown,
        subtotal: bill.totalCAD,
        tax: bill.totalCAD * 0.05, // 5% tax (simplified)
        total: bill.totalCAD * 1.05,
        paymentTerms: "30 days",
        status: "pending",
      };

      // Update tenant billing
      tenant.billing.nextBillingDate = invoice.dueDate;
      tenant.billing.currentBalanceCAD += invoice.total;
      await tenant.save();

      return {
        success: true,
        invoice,
      };
    } catch (error) {
      console.error("Generate invoice error:", error);
      throw error;
    }
  }

  /**
   * Generate revenue summary for hub
   */
  async getRevenueSummary(hubId, startDate, endDate) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) {
        throw new Error("Hub not found");
      }

      const summary = await HubRevenue.getRevenueSummary(
        hubId,
        startDate,
        endDate
      );

      // Get additional metrics
      const tenants = await Tenant.find({ hubId, status: "active" });

      const metrics = {
        ...summary,
        tenantCount: tenants.length,
        avgRevenuePerTenant:
          tenants.length > 0 ? summary.totalTenantRevenue / tenants.length : 0,
        utilizationPercent: hub.capacity.utilizationPercent || 0,
        vppEnabled: hub.vpp.enabled,
      };

      return {
        success: true,
        hub: {
          id: hub._id,
          name: hub.name,
        },
        period: {
          start: startDate,
          end: endDate,
        },
        summary: metrics,
      };
    } catch (error) {
      console.error("Get revenue summary error:", error);
      throw error;
    }
  }

  /**
   * Create monthly revenue period
   */
  async createMonthlyPeriod(hubId, year, month) {
    try {
      const hub = await Hub.findById(hubId);
      if (!hub) {
        throw new Error("Hub not found");
      }

      const revenue = await HubRevenue.createMonthlyPeriod(hubId, year, month);

      // Calculate bills for all tenants
      const tenants = await Tenant.find({ hubId, status: "active" });

      for (const tenant of tenants) {
        const period = `${year}-${String(month + 1).padStart(2, "0")}`;
        const bill = await this.calculateTenantBill(tenant._id, period);

        const tenantCharge = {
          tenantId: tenant._id,
          tenantName: tenant.name,
          charges: {
            baseCAD: bill.charges.baseCAD,
            usageCAD: bill.charges.usageCAD,
            demandCAD: bill.charges.demandCAD,
            overageCAD: bill.charges.overageCAD,
            creditsCAD: bill.charges.creditsCAD,
          },
          usage: {
            energyKWh: bill.usage.estimatedKWh,
            peakDemandKW: bill.usage.peakDemandKW,
            avgDemandKW: bill.usage.avgGrantedKW,
            overageKWh: bill.usage.overageKWh,
          },
          totalCAD: bill.totalCAD,
          status: "draft",
        };

        revenue.addTenantCharge(tenantCharge);
      }

      // Calculate shared costs
      const period = `${year}-${String(month + 1).padStart(2, "0")}`;
      const sharedCosts = await this.allocateSharedCosts(hubId, period);

      revenue.operatingCosts.maintenanceCAD =
        sharedCosts.sharedCosts.maintenanceCAD;
      revenue.operatingCosts.energyCAD = sharedCosts.sharedCosts.energyCAD;
      revenue.operatingCosts.platformFeeCAD =
        sharedCosts.sharedCosts.platformFeeCAD;

      // Add VPP revenue if applicable
      if (hub.vpp.enabled && hub.vpp.poolId) {
        const vppDistribution = await this.distributeVPPRevenue(
          hubId,
          hub.vpp.poolId,
          period
        );

        if (vppDistribution.vppRevenue) {
          revenue.vppRevenue = {
            poolId: hub.vpp.poolId,
            poolName: "VPP Pool",
            grossCAD: vppDistribution.vppRevenue.grossCAD,
            feesCAD: vppDistribution.vppRevenue.feesCAD,
            netCAD: vppDistribution.vppRevenue.netCAD,
            dispatches: 0,
            energyKWh: 0,
          };
        }
      }

      revenue.calculateTotals();
      await revenue.save();

      return {
        success: true,
        revenue,
        message: "Monthly revenue period created successfully",
      };
    } catch (error) {
      console.error("Create monthly period error:", error);
      throw error;
    }
  }

  /**
   * Finalize revenue period and generate invoices
   */
  async finalizePeriod(revenueId) {
    try {
      const revenue = await HubRevenue.findById(revenueId);
      if (!revenue) {
        throw new Error("Revenue record not found");
      }

      await revenue.finalize();
      const invoices = await revenue.generateInvoices();

      return {
        success: true,
        revenue,
        invoices,
        message: `Period finalized with ${invoices.length} invoices generated`,
      };
    } catch (error) {
      console.error("Finalize period error:", error);
      throw error;
    }
  }

  /**
   * Get tenant payment history
   */
  async getTenantPaymentHistory(tenantId, months = 12) {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        throw new Error("Tenant not found");
      }

      const history = await HubRevenue.getTenantRevenueHistory(
        tenantId,
        months
      );

      return {
        success: true,
        tenant: {
          id: tenant._id,
          name: tenant.name,
        },
        history,
      };
    } catch (error) {
      console.error("Get tenant payment history error:", error);
      throw error;
    }
  }
}

export default new HubRevenueService();

import express from "express";
import * as hubController from "../controllers/hubController.js";
import * as tenantController from "../controllers/tenantController.js";
import * as allocationController from "../controllers/allocationController.js";
import * as policyController from "../controllers/policyController.js";
import * as hubRevenueController from "../controllers/hubRevenueController.js";

const router = express.Router();

// ==================== HUB ROUTES ====================

// Get all hubs
router.get("/hubs", hubController.getHubs);

// Get hub by ID
router.get("/hubs/:id", hubController.getHubById);

// Create hub
router.post("/hubs", hubController.createHub);

// Update hub
router.put("/hubs/:id", hubController.updateHub);

// Delete hub
router.delete("/hubs/:id", hubController.deleteHub);

// Get hub overview (stats, snapshot, recommendations)
router.get("/hubs/:id/overview", hubController.getHubOverview);

// Get hub metrics
router.get("/hubs/:id/metrics", hubController.getHubMetrics);

// Get hub alerts
router.get("/hubs/:id/alerts", hubController.getHubAlerts);

// Rebalance hub capacity
router.post("/hubs/:id/rebalance", hubController.rebalanceHub);

// Calculate fair share
router.post("/hubs/:id/fair-share", hubController.calculateFairShare);

// Get recommendations
router.get("/hubs/:id/recommendations", hubController.getRecommendations);

// ==================== TENANT ROUTES ====================

// Get all tenants
router.get("/tenants", tenantController.getTenants);

// Get tenant by ID
router.get("/tenants/:id", tenantController.getTenantById);

// Create tenant
router.post("/tenants", tenantController.createTenant);

// Update tenant
router.put("/tenants/:id", tenantController.updateTenant);

// Delete tenant
router.delete("/tenants/:id", tenantController.deleteTenant);

// Get tenant usage
router.get("/tenants/:id/usage", tenantController.getTenantUsage);

// Get tenant history
router.get("/tenants/:id/history", tenantController.getTenantHistory);

// Request capacity
router.post("/tenants/:id/request-capacity", tenantController.requestCapacity);

// Get tenant violations
router.get("/tenants/:id/violations", tenantController.getTenantViolations);

// Add device to tenant
router.post("/tenants/:id/devices", tenantController.addDevice);

// Remove device from tenant
router.delete("/tenants/:id/devices/:deviceId", tenantController.removeDevice);

// Reset violations
router.post("/tenants/:id/reset-violations", tenantController.resetViolations);

// ==================== ALLOCATION ROUTES ====================

// Get allocation history
router.get("/allocations/history", allocationController.getAllocationHistory);

// Get allocation statistics
router.get(
  "/allocations/statistics",
  allocationController.getAllocationStatistics
);

// Get violations
router.get("/allocations/violations", allocationController.getViolations);

// Get usage patterns
router.get("/allocations/patterns", allocationController.getUsagePatterns);

// Detect anomalies
router.get("/allocations/anomalies", allocationController.detectAnomalies);

// Enforce capacity
router.post("/allocations/enforce", allocationController.enforceCapacity);

// Calculate fair share
router.post("/allocations/fair-share", allocationController.calculateFairShare);

// Rebalance capacity
router.post("/allocations/rebalance", allocationController.rebalanceCapacity);

// Get recommendations
router.get(
  "/allocations/recommendations",
  allocationController.getRecommendations
);

// ==================== POLICY ROUTES ====================

// Get all policies
router.get("/policies", policyController.getPolicies);

// Get policy by ID
router.get("/policies/:id", policyController.getPolicyById);

// Get active policy
router.get("/policies/active/hub", policyController.getActivePolicy);

// Create policy
router.post("/policies", policyController.createPolicy);

// Create policy from template
router.post("/policies/from-template", policyController.createFromTemplate);

// Update policy
router.put("/policies/:id", policyController.updatePolicy);

// Delete policy
router.delete("/policies/:id", policyController.deletePolicy);

// Apply policy to hub
router.post("/policies/:id/apply", policyController.applyPolicy);

// Evaluate policy
router.post("/policies/:id/evaluate", policyController.evaluatePolicy);

// Simulate policy
router.post("/policies/simulate", policyController.simulatePolicy);

// Get policy recommendations
router.get(
  "/policies/recommendations",
  policyController.getPolicyRecommendations
);

// Adjust policy based on usage
router.post("/policies/adjust", policyController.adjustPolicy);

// Escalate violation
router.post(
  "/policies/violations/escalate",
  policyController.escalateViolation
);

// ==================== REVENUE ROUTES ====================

// Get revenue periods
router.get("/revenue/periods", hubRevenueController.getRevenuePeriods);

// Get revenue period by ID
router.get("/revenue/periods/:id", hubRevenueController.getRevenuePeriodById);

// Get current period
router.get("/revenue/current", hubRevenueController.getCurrentPeriod);

// Create monthly period
router.post(
  "/revenue/periods/monthly",
  hubRevenueController.createMonthlyPeriod
);

// Calculate tenant bill
router.get("/revenue/tenant-bill", hubRevenueController.calculateTenantBill);

// Allocate shared costs
router.post(
  "/revenue/allocate-costs",
  hubRevenueController.allocateSharedCosts
);

// Distribute VPP revenue
router.post(
  "/revenue/distribute-vpp",
  hubRevenueController.distributeVPPRevenue
);

// Generate invoice
router.post("/revenue/generate-invoice", hubRevenueController.generateInvoice);

// Finalize period
router.post(
  "/revenue/periods/:id/finalize",
  hubRevenueController.finalizePeriod
);

// Get revenue summary
router.get("/revenue/summary", hubRevenueController.getRevenueSummary);

// Get tenant payment history
router.get(
  "/revenue/tenant-history",
  hubRevenueController.getTenantPaymentHistory
);

// Apply credits
router.post("/revenue/apply-credits", hubRevenueController.applyCredits);

export default router;

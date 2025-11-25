import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import api from "../lib/api";
import {
  formatKW,
  formatKWh,
  formatCAD,
  formatPercent,
  getStatusBadgeColor,
  getPriorityTierInfo,
  getBusinessTypeIcon,
  formatSquareFootage,
  formatRelativeTime,
} from "../lib/hubHelpers";
import UsageTimelineChart from "../components/hub/UsageTimelineChart";

const TenantDetail = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [usageHistory, setUsageHistory] = useState([]);
  const [violations, setViolations] = useState([]);

  // ==========================
  // FETCH DATA
  // ==========================
  useEffect(() => {
    if (tenantId) {
      fetchTenant();
      fetchUsageHistory();
      fetchViolations();
    }
  }, [tenantId]);

  const fetchTenant = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hub/tenants/${tenantId}`);
      if (response.data.success) {
        setTenant(response.data.tenant);
      }
    } catch (error) {
      console.error("Fetch tenant error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageHistory = async () => {
    try {
      const response = await api.get(
        `/hub/tenants/${tenantId}/usage?period=week`
      );
      if (response.data.success) {
        const data =
          response.data.usage?.history?.map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString("en-CA", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            allocated: item.allocatedKW,
            current: item.currentKW,
          })) || [];
        setUsageHistory(data);
      }
    } catch (error) {
      console.error("Fetch usage history error:", error);
    }
  };

  const fetchViolations = async () => {
    try {
      const response = await api.get(`/hub/tenants/${tenantId}/violations`);
      if (response.data.success) {
        setViolations(response.data.violations || []);
      }
    } catch (error) {
      console.error("Fetch violations error:", error);
    }
  };

  // ==========================
  // ACTIONS
  // ==========================
  const handleRequestCapacity = async () => {
    const requestedKW = prompt("Enter requested capacity (kW):");
    if (!requestedKW) return;
    try {
      const response = await api.post(
        `/hub/tenants/${tenantId}/request-capacity`,
        {
          requestedKW: parseFloat(requestedKW),
          purpose: "manual-request",
        }
      );
      if (response.data.success) {
        alert(
          response.data.granted
            ? "Capacity granted!"
            : "Capacity request denied"
        );
        fetchTenant();
      }
    } catch (error) {
      console.error("Request capacity error:", error);
      alert("Failed to request capacity");
    }
  };

  const handleResetViolations = async () => {
    if (!confirm("Are you sure you want to reset all violations?")) return;
    try {
      const response = await api.post(
        `/hub/tenants/${tenantId}/reset-violations`
      );
      if (response.data.success) {
        alert("Violations reset successfully");
        fetchTenant();
        fetchViolations();
      }
    } catch (error) {
      console.error("Reset violations error:", error);
      alert("Failed to reset violations");
    }
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-semibold">
            Loading tenant data...
          </p>
        </div>
      </div>
    );
  }

  // ==========================
  // NOT FOUND
  // ==========================
  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Tenant Not Found
          </h2>
          <button
            onClick={() => navigate("/hub/list")}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
          >
            Back to Hubs
          </button>
        </div>
      </div>
    );
  }

  // ==========================
  // METRICS
  // ==========================
  const priorityInfo = getPriorityTierInfo(tenant.priorityTier);
  const BusinessIcon = Icons[getBusinessTypeIcon(tenant.businessType)];
  const currentUsage = tenant?.usage?.current?.currentKW || 0;
  const allocatedKW = tenant?.capacity?.allocatedKW || 0;
  const utilizationPercent =
    allocatedKW > 0 ? (currentUsage / allocatedKW) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* TOP SECTION */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Icons.ArrowLeft
                    className="text-slate-600 dark:text-slate-400"
                    size={20}
                  />
                </button>

                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                  <BusinessIcon
                    className="text-slate-600 dark:text-slate-400"
                    size={32}
                  />
                </div>

                <div>
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                    {tenant.name}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 capitalize">
                    {tenant.businessType?.replace("-", " ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-[72px]">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(tenant.status)}`}
                >
                  {tenant.status?.toUpperCase()}
                </span>

                <span
                  className={`px-3 py-1 rounded-md ${priorityInfo.bg} ${priorityInfo.color} font-semibold text-sm`}
                >
                  {priorityInfo.label} Priority
                </span>

                {tenant.preferences?.allowVPPParticipation && (
                  <span className="px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center gap-1">
                    <Icons.Zap size={12} />
                    VPP Participant
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRequestCapacity}
                className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Icons.Plus size={20} />
                Request Capacity
              </button>

              <button
                onClick={() => navigate(`/hub/tenants/${tenantId}/edit`)}
                className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <Icons.Settings size={20} />
                Settings
              </button>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: "LayoutDashboard" },
              { id: "usage", label: "Usage", icon: "Activity" },
              { id: "billing", label: "Billing", icon: "DollarSign" },
              {
                id: "violations",
                label: "Violations",
                icon: "AlertTriangle",
                count: violations.length,
              },
              { id: "devices", label: "Devices", icon: "Zap" },
            ].map((tab) => {
              const Icon = Icons[tab.icon];
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === tab.id
                          ? "bg-white/20 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================ */}
      {/* MAIN CONTENT */}
      {/* ============================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================================================================= */}
        {/* ========================= OVERVIEW TAB ========================== */}
        {/* ================================================================= */}
        {activeTab === "overview" && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* ---------------- STATS GRID ---------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Current Usage",
                  value: formatKW(currentUsage),
                  subvalue: `${formatPercent(utilizationPercent)} of capacity`,
                  icon: "Activity",
                  gradient: "from-blue-500 to-cyan-600",
                },
                {
                  label: "Allocated Capacity",
                  value: formatKW(allocatedKW),
                  subvalue: `${formatKW(tenant.capacity?.baseKW)} base`,
                  icon: "Gauge",
                  gradient: "from-purple-500 to-pink-600",
                },
                {
                  label: "Peak Demand",
                  value: formatKW(tenant.usage?.current?.peakKW || 0),
                  subvalue: formatRelativeTime(
                    tenant.usage?.current?.lastUpdated
                  ),
                  icon: "TrendingUp",
                  gradient: "from-orange-500 to-red-600",
                },
                {
                  label: "Reliability Score",
                  value: formatPercent(
                    tenant.performance?.reliabilityScore || 100,
                    0
                  ),
                  subvalue:
                    tenant.compliance?.violations > 0
                      ? `${tenant.compliance.violations} violations`
                      : "No violations",
                  icon: "Shield",
                  gradient: "from-green-500 to-emerald-600",
                },
              ].map((stat, index) => {
                const Icon = Icons[stat.icon];
                return (
                  <motion.div
                    key={stat.label}
                    className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-md`}
                    >
                      <Icon className="text-white" size={24} />
                    </div>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {stat.subvalue}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ---------------- OVERVIEW TWO-COLUMN ---------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ================= LEFT SIDE ================= */}
              <div className="lg:col-span-2 space-y-8">
                {/* === Usage Chart === */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    Usage Timeline (7d)
                  </h2>

                  {usageHistory.length > 0 ? (
                    <UsageTimelineChart data={usageHistory} />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      No usage data available
                    </div>
                  )}
                </div>

                {/* === Contact Info === */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Icons.User className="text-slate-400 mt-1" size={20} />
                      <div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Primary Contact
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {tenant.contactInfo?.primaryContact || "Not provided"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Icons.Mail className="text-slate-400 mt-1" size={20} />
                      <div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Email
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {tenant.contactInfo?.email || "Not provided"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Icons.Phone className="text-slate-400 mt-1" size={20} />
                      <div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Phone
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {tenant.contactInfo?.phone || "Not provided"}
                        </div>
                      </div>
                    </div>

                    {tenant.location?.squareFootage && (
                      <div className="flex items-start gap-3">
                        <Icons.Home className="text-slate-400 mt-1" size={20} />
                        <div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Space
                          </div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {formatSquareFootage(tenant.location.squareFootage)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ================= RIGHT SIDEBAR ================= */}
              <div className="space-y-8">
                {/* === Capacity Details === */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                    Capacity Details
                  </h2>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Base",
                        value: formatKW(tenant.capacity?.baseKW || 0),
                      },
                      {
                        label: "Burst",
                        value: formatKW(tenant.capacity?.burstKW || 0),
                      },
                      {
                        label: "Guaranteed",
                        value: formatKW(tenant.capacity?.guaranteedKW || 0),
                      },
                      {
                        label: "Allocated",
                        value: formatKW(tenant.capacity?.allocatedKW || 0),
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {item.label}
                        </span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* === Performance === */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                    Performance
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Avg Utilization
                      </span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatPercent(tenant.performance?.avgUtilization || 0)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Load Factor
                      </span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatPercent(
                          (tenant.performance?.loadFactor || 0) * 100
                        )}
                      </span>
                    </div>

                    {/* Violations */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Violations
                      </span>

                      <span
                        className={`text-lg font-bold ${
                          tenant.compliance?.violations > 5
                            ? "text-red-600 dark:text-red-400"
                            : tenant.compliance?.violations > 0
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        {tenant.compliance?.violations || 0}
                      </span>
                    </div>

                    {tenant.compliance?.violations > 0 && (
                      <button
                        onClick={handleResetViolations}
                        className="w-full py-3 rounded-xl bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold hover:bg-red-200 dark:hover:bg-red-950/50 transition-colors"
                      >
                        Reset Violations
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* ========================= USAGE TAB ============================== */}
        {/* ================================================================= */}
        {activeTab === "usage" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Detailed Usage Analytics
              </h2>

              {usageHistory.length > 0 ? (
                <UsageTimelineChart data={usageHistory} />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  No usage data available
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* ========================= BILLING TAB ============================ */}
        {/* ================================================================= */}
        {activeTab === "billing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Billing Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Current Balance
                  </span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCAD(tenant.billing?.currentBalanceCAD || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Billing Cycle
                  </span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                    {tenant.billing?.billingCycle || "Monthly"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Payment Status
                  </span>
                  <span
                    className={`text-lg font-bold capitalize ${
                      tenant.billing?.paymentStatus === "current"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {tenant.billing?.paymentStatus || "Current"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* ======================= VIOLATIONS TAB ========================== */}
        {/* ================================================================= */}
        {activeTab === "violations" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Violation History
                </h2>

                {violations.length > 0 && (
                  <button
                    onClick={handleResetViolations}
                    className="px-4 py-2 rounded-xl bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold hover:bg-red-200 dark:hover:bg-red-950/50 transition-colors"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {violations.length > 0 ? (
                <div className="space-y-3">
                  {violations.map((v, index) => (
                    <motion.div
                      key={index}
                      className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex items-start gap-3">
                        <Icons.AlertTriangle
                          className="text-red-600 dark:text-red-400 mt-1"
                          size={20}
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="font-bold text-red-900 dark:text-red-100">
                              {v.type
                                ?.split("-")
                                .map(
                                  (w) => w.charAt(0).toUpperCase() + w.slice(1)
                                )
                                .join(" ")}
                            </div>

                            <span className="text-xs text-red-700 dark:text-red-300 whitespace-nowrap">
                              {formatRelativeTime(v.timestamp)}
                            </span>
                          </div>

                          <p className="text-sm text-red-700 dark:text-red-300">
                            Exceeded by {formatKW(v.exceededByKW || 0)}
                          </p>

                          {v.duration && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              Duration: {v.duration} minutes
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
                    <Icons.CheckCircle
                      className="text-green-600 dark:text-green-400"
                      size={40}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    No Violations
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    This tenant has no capacity violations
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* ========================== DEVICES TAB ========================== */}
        {/* ================================================================= */}
        {activeTab === "devices" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Connected Devices
                </h2>

                <button
                  onClick={() =>
                    navigate(`/hub/tenants/${tenantId}/devices/add`)
                  }
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Icons.Plus size={16} />
                  Add Device
                </button>
              </div>

              {tenant.devices && tenant.devices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tenant.devices.map((device, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                          <Icons.Zap
                            className="text-blue-600 dark:text-blue-400"
                            size={20}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {device.name || "Unnamed Device"}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                            {device.type?.replace("-", " ")}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            ID: {device.deviceId}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Icons.Zap className="text-slate-400" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    No Devices
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    This tenant has no connected devices
                  </p>
                  <button
                    onClick={() =>
                      navigate(`/hub/tenants/${tenantId}/devices/add`)
                    }
                    className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
                  >
                    Add First Device
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TenantDetail;

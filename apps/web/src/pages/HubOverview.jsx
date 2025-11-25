import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import useHub from "../hooks/useHub";
import useHubTenants from "../hooks/useHubTenants";
import useHubMetrics from "../hooks/useHubMetrics";
import HubStats from "../components/hub/HubStats";
import HubCapacityGauge from "../components/hub/HubCapacityGauge";
import TenantCard from "../components/hub/TenantCard";
import AlertCenter from "../components/hub/AlertCenter";
import UsageTimelineChart from "../components/hub/UsageTimelineChart";
import RecommendationsPanel from "../components/hub/RecommendationsPanel";
import { getHubTypeLabel } from "../lib/hubHelpers";

const HubOverview = () => {
  const { hubId } = useParams();
  const navigate = useNavigate();
  const { hub, loading: hubLoading, fetchOverview, rebalance } = useHub(hubId);
  const { tenants, loading: tenantsLoading } = useHubTenants(hubId);
  const { snapshot, fetchAlerts } = useHubMetrics(hubId);

  const [overview, setOverview] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [rebalancing, setRebalancing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (hubId) {
      loadOverview();
      loadAlerts();
      generateUsageData();
    }
  }, [hubId]);

  const loadOverview = async () => {
    const data = await fetchOverview();
    if (data) {
      setOverview(data);
    }
  };

  const loadAlerts = async () => {
    const alertsData = await fetchAlerts();
    setAlerts(alertsData || []);
  };

  const generateUsageData = () => {
    // Generate mock 24-hour usage data
    const data = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now - i * 60 * 60 * 1000);
      const hour = time.getHours();

      // Peak hours: 9-11 AM and 5-8 PM
      const isPeak = (hour >= 9 && hour <= 11) || (hour >= 17 && hour <= 20);
      const baseUsage = isPeak ? 0.7 : 0.4;
      const variation = Math.random() * 0.15;

      data.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        allocated: hub?.capacity.allocatedKW || 420,
        current: (hub?.capacity.allocatedKW || 420) * (baseUsage + variation),
      });
    }

    setUsageData(data);
  };

  const handleRebalance = async () => {
    try {
      setRebalancing(true);
      await rebalance("proportional");
      await loadOverview();
      // Show success notification (implement toast later)
      alert("Hub rebalanced successfully");
    } catch (error) {
      console.error("Rebalance error:", error);
      alert("Failed to rebalance hub");
    } finally {
      setRebalancing(false);
    }
  };

  const handleApplyRecommendation = (recommendation) => {
    console.log("Apply recommendation:", recommendation);
    // Implement recommendation application
  };

  const handleDismissRecommendation = (recommendation) => {
    console.log("Dismiss recommendation:", recommendation);
    // Implement recommendation dismissal
  };

  if (hubLoading || tenantsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-semibold">
            Loading hub data...
          </p>
        </div>
      </div>
    );
  }

  if (!hub) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Hub Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The requested hub could not be found
          </p>
          <button
            onClick={() => navigate("/hub/list")}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
          >
            View All Hubs
          </button>
        </div>
      </div>
    );
  }

  const topTenants = tenants.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate("/hub/list")}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Icons.ArrowLeft
                    className="text-slate-600 dark:text-slate-400"
                    size={20}
                  />
                </button>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                  {hub.name}
                </h1>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <Icons.MapPin size={16} />
                  {hub.location.city}, {hub.location.province}
                </span>
                <span>•</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold">
                  {getHubTypeLabel(hub.type)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRebalance}
                disabled={rebalancing}
                className="px-6 py-3 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Icons.RefreshCw
                  size={20}
                  className={rebalancing ? "animate-spin" : ""}
                />
                {rebalancing ? "Rebalancing..." : "Rebalance"}
              </button>

              <button
                onClick={() => navigate(`/hub/${hubId}/settings`)}
                className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <Icons.Settings size={20} />
                Settings
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: "LayoutDashboard" },
              { id: "capacity", label: "Capacity", icon: "Gauge" },
              { id: "tenants", label: "Tenants", icon: "Users" },
              {
                id: "alerts",
                label: "Alerts",
                icon: "Bell",
                count: alerts.length,
              },
              {
                id: "recommendations",
                label: "Recommendations",
                icon: "Lightbulb",
                count: overview?.recommendations?.length || 0,
              },
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats */}
            <HubStats hub={hub} snapshot={snapshot} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Usage Timeline */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Usage Timeline (24h)
                    </h2>
                    <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                      View Details
                    </button>
                  </div>
                  <UsageTimelineChart data={usageData} />
                </div>

                {/* Top Tenants */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Top Tenants
                    </h2>
                    <button
                      onClick={() => setActiveTab("tenants")}
                      className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      View All ({tenants.length})
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {topTenants.map((tenant) => (
                      <TenantCard
                        key={tenant._id}
                        tenant={tenant}
                        onClick={() => navigate(`/hub/tenants/${tenant._id}`)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Capacity Gauge */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    Capacity
                  </h2>
                  <HubCapacityGauge hub={hub} />
                </div>

                {/* Quick Stats */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    Quick Stats
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Uptime
                      </span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {hub.performance?.uptimePercent?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Peak Demand
                      </span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {hub.capacity.peakKW} kW
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Active Tenants
                      </span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {tenants.filter((t) => t.status === "active").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        VPP Status
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          hub.vpp?.enabled
                            ? "text-green-600 dark:text-green-400"
                            : "text-slate-400"
                        }`}
                      >
                        {hub.vpp?.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Capacity Tab */}
        {activeTab === "capacity" && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Capacity Distribution
                </h2>
                <HubCapacityGauge hub={hub} />
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Capacity Details
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      label: "Total Capacity",
                      value: `${hub.capacity.totalKW} kW`,
                      color: "text-blue-600 dark:text-blue-400",
                    },
                    {
                      label: "Allocated",
                      value: `${hub.capacity.allocatedKW} kW`,
                      color: "text-purple-600 dark:text-purple-400",
                    },
                    {
                      label: "Reserved (VPP)",
                      value: `${hub.capacity.reservedKW} kW`,
                      color: "text-orange-600 dark:text-orange-400",
                    },
                    {
                      label: "Available",
                      value: `${hub.capacity.availableKW} kW`,
                      color: "text-green-600 dark:text-green-400",
                    },
                    {
                      label: "Peak Recorded",
                      value: `${hub.capacity.peakKW} kW`,
                      color: "text-red-600 dark:text-red-400",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800"
                    >
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {item.label}
                      </span>
                      <span className={`text-2xl font-bold ${item.color}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tenants Tab */}
        {activeTab === "tenants" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                All Tenants
              </h2>
              <button
                onClick={() => navigate(`/hub/${hubId}/tenants/new`)}
                className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Icons.Plus size={20} />
                Add Tenant
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenants.map((tenant) => (
                <TenantCard
                  key={tenant._id}
                  tenant={tenant}
                  onClick={() => navigate(`/hub/tenants/${tenant._id}`)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Alerts Tab */}
        {activeTab === "alerts" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Active Alerts
            </h2>
            <AlertCenter alerts={alerts} />
          </motion.div>
        )}

        {/* Recommendations Tab */}
        {activeTab === "recommendations" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Optimization Recommendations
            </h2>
            <RecommendationsPanel
              recommendations={overview?.recommendations || []}
              onApply={handleApplyRecommendation}
              onDismiss={handleDismissRecommendation}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HubOverview;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import api from "../lib/api";
import useHub from "../hooks/useHub";
import RevenueSummary from "../components/hub/RevenueSummary";
import { formatCAD, formatKWh } from "../lib/hubHelpers";

const HubRevenue = () => {
  const { hubId } = useParams();
  const navigate = useNavigate();
  const { hub, loading: hubLoading } = useHub(hubId);

  const [loading, setLoading] = useState(true);
  const [revenuePeriods, setRevenuePeriods] = useState([]);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (hubId) {
      fetchRevenue();
    }
  }, [hubId]);

  const fetchRevenue = async () => {
    try {
      setLoading(true);

      const currentRes = await api.get(`/hub/revenue/current?hubId=${hubId}`);
      if (currentRes.data.success) {
        setCurrentPeriod(currentRes.data.period);
      }

      const periodsRes = await api.get(`/hub/revenue/periods?hubId=${hubId}`);
      if (periodsRes.data.success) {
        setRevenuePeriods(periodsRes.data.periods || []);
      }

      const summaryRes = await api.get(`/hub/revenue/summary?hubId=${hubId}`);
      if (summaryRes.data.success) {
        setSummary(summaryRes.data.summary);
      }
    } catch (error) {
      console.error("Fetch revenue error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizePeriod = async (periodId) => {
    if (
      !confirm("Finalize this billing period? This action cannot be undone.")
    ) {
      return;
    }

    try {
      const response = await api.post(
        `/hub/revenue/periods/${periodId}/finalize`
      );
      if (response.data.success) {
        alert("Period finalized successfully");
        fetchRevenue();
      }
    } catch (error) {
      console.error("Finalize period error:", error);
      alert("Failed to finalize period");
    }
  };

  if (hubLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-semibold">
            Loading revenue data...
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate(`/hub/${hubId}`)}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Icons.ArrowLeft
                    className="text-slate-600 dark:text-slate-400"
                    size={20}
                  />
                </button>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                  Revenue Management
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 ml-[52px]">
                {hub.name}
              </p>
            </div>

            <button
              onClick={fetchRevenue}
              className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Icons.RefreshCw size={20} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Revenue Summary */}
        {summary && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Revenue Summary
            </h2>
            <RevenueSummary summary={summary} />
          </div>
        )}

        {/* Current Period */}
        {currentPeriod && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-500 dark:border-blue-500 p-8 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Icons.Clock
                    className="text-blue-600 dark:text-blue-400"
                    size={24}
                  />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Current Billing Period
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {new Date(currentPeriod.period.start).toLocaleDateString(
                    "en-CA"
                  )}{" "}
                  -{" "}
                  {new Date(currentPeriod.period.end).toLocaleDateString(
                    "en-CA"
                  )}
                </p>
              </div>

              <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-sm font-bold">
                IN PROGRESS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Total Revenue
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCAD(currentPeriod.totals?.totalTenantRevenueCAD || 0)}
                </div>
              </div>

              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Total Energy
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatKWh(currentPeriod.totals?.totalEnergyKWh || 0)}
                </div>
              </div>

              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Tenants Billed
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {currentPeriod.tenantCharges?.length || 0}
                </div>
              </div>

              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  VPP Revenue
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCAD(currentPeriod.totals?.totalVPPRevenueCAD || 0)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing history */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Billing History
          </h2>

          {revenuePeriods.length > 0 ? (
            <div className="space-y-4">
              {revenuePeriods.map((period, index) => (
                <motion.div
                  key={period._id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                          {new Date(period.period.start).toLocaleDateString(
                            "en-CA",
                            { month: "long", year: "numeric" }
                          )}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(period.period.start).toLocaleDateString(
                            "en-CA"
                          )}{" "}
                          -{" "}
                          {new Date(period.period.end).toLocaleDateString(
                            "en-CA"
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            period.status === "finalized"
                              ? "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400"
                              : period.status === "draft"
                                ? "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {period.status?.toUpperCase()}
                        </span>

                        {period.status === "draft" && (
                          <button
                            onClick={() => handleFinalizePeriod(period._id)}
                            className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors"
                          >
                            Finalize
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Total Revenue
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          {formatCAD(period.totals?.totalTenantRevenueCAD || 0)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Operating Costs
                        </div>
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">
                          {formatCAD(
                            period.totals?.totalOperatingCostsCAD || 0
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Net Revenue
                        </div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatCAD(period.totals?.netRevenueCAD || 0)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Energy
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          {formatKWh(period.totals?.totalEnergyKWh || 0)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Tenants
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          {period.tenantCharges?.length || 0}
                        </div>
                      </div>
                    </div>

                    {/* Tenant Breakdown */}
                    {period.tenantCharges &&
                      period.tenantCharges.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                          <button
                            onClick={() => {
                              const el = document.getElementById(
                                `breakdown-${period._id}`
                              );
                              el.classList.toggle("hidden");
                            }}
                            className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-2"
                          >
                            <Icons.ChevronDown size={16} />
                            View Tenant Breakdown
                          </button>

                          <div
                            id={`breakdown-${period._id}`}
                            className="hidden mt-4 space-y-2"
                          >
                            {period.tenantCharges.map((charge, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                              >
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {charge.tenantId?.name || "Unknown Tenant"}
                                </span>
                                <div className="flex items-center gap-6 text-sm">
                                  <span className="text-slate-600 dark:text-slate-400">
                                    {formatKWh(charge.energyKWh || 0)}
                                  </span>
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    {formatCAD(charge.totalCAD || 0)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
              <Icons.FileText
                className="mx-auto text-slate-400 mb-4"
                size={48}
              />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No Billing History
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Revenue periods will appear here once created
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HubRevenue;

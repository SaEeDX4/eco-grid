import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import useHubPolicies from "../hooks/useHubPolicies";
import PolicyCard from "../components/hub/PolicyCard";

const HubPolicies = () => {
  const { hubId } = useParams();
  const navigate = useNavigate();
  const { policies, activePolicy, loading, applyPolicy, simulatePolicy } =
    useHubPolicies(hubId);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [simulationResults, setSimulationResults] = useState(null);
  const [simulatingPolicy, setSimulatingPolicy] = useState(null);

  const handleApplyPolicy = async (policy) => {
    if (
      !window.confirm(
        `Apply policy "${policy.name}"? This will replace the current active policy.`
      )
    ) {
      return;
    }

    try {
      await applyPolicy(policy._id, true);
      alert("Policy applied successfully");
    } catch (error) {
      console.error("Apply policy error:", error);
      alert("Failed to apply policy");
    }
  };

  const handleSimulatePolicy = async (policy) => {
    try {
      setSimulatingPolicy(policy._id);
      const results = await simulatePolicy(policy, 7);
      setSimulationResults({
        policy: policy.name,
        ...results,
      });
    } catch (error) {
      console.error("Simulate policy error:", error);
      alert("Failed to simulate policy");
    } finally {
      setSimulatingPolicy(null);
    }
  };

  const handleEditPolicy = (policy) => {
    navigate(`/hub/${hubId}/policies/${policy._id}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-semibold">
            Loading policies...
          </p>
        </div>
      </div>
    );
  }

  // Filter policies
  let filteredPolicies =
    policies?.filter((policy) => {
      if (filterStatus !== "all" && policy.status !== filterStatus)
        return false;
      if (filterType !== "all" && policy.type !== filterType) return false;
      return true;
    }) || [];

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
                  Capacity Policies
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 ml-[52px]">
                Manage allocation and enforcement rules
              </p>
            </div>

            <button
              onClick={() => navigate(`/hub/${hubId}/policies/new`)}
              className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Icons.Plus size={20} />
              Create Policy
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="peak-management">Peak Management</option>
              <option value="cost-optimization">Cost Optimization</option>
              <option value="vpp-coordination">VPP Coordination</option>
              <option value="custom">Custom</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Policy Banner */}
        {activePolicy && (
          <motion.div
            className="mb-8 p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Icons.CheckCircle
                className="text-blue-600 dark:text-blue-400"
                size={24}
              />
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                Active Policy: {activePolicy.name}
              </h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {activePolicy.description || "No description provided"}
            </p>
          </motion.div>
        )}

        {/* Simulation Results */}
        {simulationResults && (
          <motion.div
            className="mb-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="p-6 bg-purple-50 dark:bg-purple-950/20 border-b border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icons.Play
                    className="text-purple-600 dark:text-purple-400"
                    size={24}
                  />
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">
                    Simulation Results: {simulationResults.policy}
                  </h3>
                </div>
                <button
                  onClick={() => setSimulationResults(null)}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  <Icons.X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Avg Compliance
                  </div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {simulationResults.simulation?.avgCompliance?.toFixed(1) ||
                      0}
                    %
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Predicted Violations
                  </div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {simulationResults.simulation?.violationsCount || 0}
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Peak Utilization
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {simulationResults.simulation?.peakUtilization?.toFixed(
                      1
                    ) || 0}
                    %
                  </div>
                </div>
              </div>

              {simulationResults.simulation?.issues &&
                simulationResults.simulation.issues.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <div className="font-bold text-red-900 dark:text-red-100 mb-2">
                      Potential Issues:
                    </div>
                    <ul className="space-y-1">
                      {simulationResults.simulation.issues.map((issue, i) => (
                        <li
                          key={i}
                          className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2"
                        >
                          <Icons.AlertCircle
                            size={14}
                            className="flex-shrink-0 mt-0.5"
                          />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {filteredPolicies.length}
            </span>{" "}
            of <span className="font-bold">{policies.length}</span> policies
          </p>

          {(filterStatus !== "all" || filterType !== "all") && (
            <button
              onClick={() => {
                setFilterStatus("all");
                setFilterType("all");
              }}
              className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Policy Grid */}
        {filteredPolicies.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPolicies.map((policy, index) => (
              <motion.div
                key={policy._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <PolicyCard
                  policy={policy}
                  isActive={activePolicy?._id === policy._id}
                  onApply={handleApplyPolicy}
                  onEdit={handleEditPolicy}
                  onSimulate={handleSimulatePolicy}
                />

                {simulatingPolicy === policy._id && (
                  <div className="mt-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-purple-700 dark:text-purple-300 font-semibold">
                      Simulating policy...
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
            <Icons.FileText className="mx-auto text-slate-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No Policies Found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {filterStatus !== "all" || filterType !== "all"
                ? "Try adjusting your filters"
                : "Create your first capacity policy to get started"}
            </p>
            {filterStatus === "all" && filterType === "all" && (
              <button
                onClick={() => navigate(`/hub/${hubId}/policies/new`)}
                className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
              >
                Create Policy
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HubPolicies;

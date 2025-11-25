import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import {
  formatKW,
  formatCAD,
  meetsPoolRequirements,
  getDeviceVPPCapacity,
} from "../../lib/vppHelpers";
import api from "../../lib/api";

const PoolJoinFlow = ({ pool, onSuccess, onCancel }) => {
  const [step, setStep] = useState(1);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/devices");

      if (response.data.success) {
        // Filter devices eligible for VPP
        const eligibleDevices = response.data.devices.filter((device) => {
          // Check if device type is allowed
          if (pool.requirements.deviceTypes.length > 0) {
            return pool.requirements.deviceTypes.includes(device.type);
          }
          return true;
        });

        setDevices(eligibleDevices);
      }
    } catch (err) {
      console.error("Fetch devices error:", err);
      setError("Failed to load devices");
    } finally {
      setLoading(false);
    }
  };

  const toggleDevice = (deviceId) => {
    setSelectedDeviceIds((prev) => {
      if (prev.includes(deviceId)) {
        return prev.filter((id) => id !== deviceId);
      }
      return [...prev, deviceId];
    });
  };

  const calculateTotalCapacity = () => {
    const selected = devices.filter((d) => selectedDeviceIds.includes(d._id));
    return selected.reduce((sum, d) => sum + getDeviceVPPCapacity(d), 0);
  };

  const canProceed = () => {
    if (selectedDeviceIds.length === 0) return false;

    const totalCapacity = calculateTotalCapacity();
    if (totalCapacity < pool.requirements.minCapacityKW) return false;

    return true;
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    try {
      setSubmitting(true);
      setError(null);

      const response = await api.post(`/vpp/pools/${pool._id}/join`, {
        deviceIds: selectedDeviceIds,
      });

      if (response.data.success) {
        setStep(3); // Success step
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      console.error("Join pool error:", err);
      setError(err.response?.data?.message || "Failed to join pool");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  step > s
                    ? "bg-gradient-to-r from-blue-500 to-purple-600"
                    : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Select Devices */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Select Devices
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Choose devices to enroll in {pool.name}
              </p>
            </div>

            {/* Requirements */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 mb-6">
              <div className="flex items-start gap-3">
                <Icons.Info
                  className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1"
                  size={20}
                />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <div className="font-semibold mb-1">Pool Requirements:</div>
                  <ul className="space-y-1">
                    <li>
                      • Minimum capacity:{" "}
                      {formatKW(pool.requirements.minCapacityKW)}
                    </li>
                    {pool.requirements.deviceTypes.length > 0 && (
                      <li>
                        • Allowed devices:{" "}
                        {pool.requirements.deviceTypes
                          .map((t) => t.replace("-", " "))
                          .join(", ")}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Device List */}
            {devices.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Icons.Inbox className="text-slate-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  No Eligible Devices
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  You don't have any devices that meet this pool's requirements
                </p>
                <button
                  onClick={onCancel}
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Go Back
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {devices.map((device) => {
                    const isSelected = selectedDeviceIds.includes(device._id);
                    const capacity = getDeviceVPPCapacity(device);

                    return (
                      <motion.button
                        key={device._id}
                        onClick={() => toggleDevice(device._id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-4">
                          {/* Checkbox */}
                          <div
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                              isSelected
                                ? "bg-blue-500 border-blue-500"
                                : "border-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {isSelected && (
                              <Icons.Check className="text-white" size={16} />
                            )}
                          </div>

                          {/* Device Info */}
                          <div className="flex-1">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {device.name}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                              {device.type.replace("-", " ")}
                            </div>
                          </div>

                          {/* Capacity */}
                          <div className="text-right">
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              Capacity
                            </div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {formatKW(capacity)}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Total Capacity */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Total Selected Capacity
                    </span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formatKW(calculateTotalCapacity())}
                    </span>
                  </div>
                  {calculateTotalCapacity() < pool.requirements.minCapacityKW &&
                    selectedDeviceIds.length > 0 && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-red-600 dark:text-red-400">
                        <Icons.AlertCircle size={14} />
                        Need{" "}
                        {formatKW(
                          pool.requirements.minCapacityKW -
                            calculateTotalCapacity()
                        )}{" "}
                        more to meet minimum
                      </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!canProceed()}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Step 2: Review & Confirm */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Review & Confirm
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Review your enrollment details
              </p>
            </div>

            {/* Pool Info */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 border-2 border-blue-100 dark:border-slate-700 mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {pool.name}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Market
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {pool.market?.name}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Region
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {pool.region}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Platform Fee
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {pool.fees.platformPercent}%
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Operator Fee
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {pool.fees.operatorPercent}%
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Devices */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Selected Devices ({selectedDeviceIds.length})
              </h3>
              <div className="space-y-2">
                {devices
                  .filter((d) => selectedDeviceIds.includes(d._id))
                  .map((device) => (
                    <div
                      key={device._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                    >
                      <span className="font-medium text-slate-900 dark:text-white">
                        {device.name}
                      </span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {formatKW(getDeviceVPPCapacity(device))}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="mt-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 dark:text-blue-100">
                    Total Contribution
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatKW(calculateTotalCapacity())}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 mb-6">
              <div className="flex items-start gap-3">
                <Icons.FileText
                  className="text-slate-600 dark:text-slate-400 flex-shrink-0 mt-1"
                  size={20}
                />
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  By joining this pool, you agree to:
                  <ul className="mt-2 space-y-1 ml-4">
                    <li>
                      • Allow remote dispatch of your devices during bid windows
                    </li>
                    <li>• Battery cycling within configured constraints</li>
                    <li>• Revenue sharing per pool fee structure</li>
                    <li>• Pool performance and reliability tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 mb-6">
                <div className="flex items-center gap-3">
                  <Icons.AlertCircle
                    className="text-red-600 dark:text-red-400"
                    size={20}
                  />
                  <span className="text-sm text-red-900 dark:text-red-100">
                    {error}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <Icons.CheckCircle size={20} />
                    Confirm & Join
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-6">
              <Icons.CheckCircle
                className="text-green-600 dark:text-green-400"
                size={48}
              />
            </div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Successfully Joined!
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              You've joined {pool.name} with {selectedDeviceIds.length} device
              {selectedDeviceIds.length !== 1 ? "s" : ""}
            </p>

            <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 mb-6 inline-block">
              <div className="text-sm text-green-700 dark:text-green-300 mb-2">
                Your Contribution
              </div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {formatKW(calculateTotalCapacity())}
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Redirecting to your VPP dashboard...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PoolJoinFlow;

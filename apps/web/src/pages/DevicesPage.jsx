import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, LayoutGrid, List, Filter } from "lucide-react";
import { useDevices } from "../hooks/useDevices";
import { useDeviceControl } from "../hooks/useDeviceControl";
import { useToast } from "../hooks/useToast";
import DeviceGrid from "../components/devices/DeviceGrid";
import DeviceGrouping from "../components/devices/DeviceGrouping";
import PowerMeter from "../components/devices/PowerMeter";
import ScenarioSelector from "../components/devices/ScenarioSelector";
import PowerDistribution from "../components/devices/PowerDistribution";
import DeviceAdvisor from "../components/devices/DeviceAdvisor";
import Button from "../components/ui/Button";
import IconButton from "../components/ui/IconButton";
import { Tabs } from "../components/ui/Tabs";

const DevicesPage = () => {
  const navigate = useNavigate();

  // ✅ Added: check for token and redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
    }
  }, [navigate]);

  const { devices, loading, refresh } = useDevices();
  const { toggleDevice } = useDeviceControl();
  const { success } = useToast();
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'grouped'
  const [currentScenario, setCurrentScenario] = useState("normal");

  // Calculate totals
  const totalConsumption = devices
    .filter((d) => d.powerW > 0)
    .reduce((sum, d) => sum + d.powerW, 0);

  const totalGeneration = Math.abs(
    devices.filter((d) => d.powerW < 0).reduce((sum, d) => sum + d.powerW, 0),
  );

  const netPower = totalConsumption - totalGeneration;

  const handleDeviceToggle = async (deviceId, state) => {
    await toggleDevice(deviceId, state);
    refresh();
  };

  const handleDeviceConfigure = (device) => {
    success(`Opening configuration for ${device.name}`);
    // TODO: Open configuration modal
  };

  const handleScenarioChange = (scenarioId) => {
    setCurrentScenario(scenarioId);
    // TODO: Apply scenario to all devices
  };

  const handleAddDevice = () => {
    success("Opening device wizard...");
    // TODO: Open add device wizard
  };

  const handleRefresh = () => {
    refresh();
    success("Devices refreshed!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Device Hub
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Monitor and control all your smart energy devices
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
              <IconButton
                icon={LayoutGrid}
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                tooltip="Grid View"
              />
              <IconButton
                icon={List}
                variant={viewMode === "grouped" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grouped")}
                tooltip="Grouped View"
              />
            </div>

            <IconButton
              icon={RefreshCw}
              variant="outline"
              onClick={handleRefresh}
              tooltip="Refresh"
            />

            <Button variant="gradient" size="default" onClick={handleAddDevice}>
              <Plus size={18} />
              Add Device
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <ScenarioSelector
                currentScenario={currentScenario}
                onScenarioChange={handleScenarioChange}
              />
            </div>
          </div>
          <div className="animate-in fade-in slide-in-from-right duration-700">
            <PowerMeter
              totalConsumption={totalConsumption}
              totalGeneration={totalGeneration}
              netPower={netPower}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Devices List - Takes 2/3 width */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Your Devices ({devices.length})
              </h2>
              {devices.length > 0 && (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {
                    devices.filter(
                      (d) =>
                        d.status === "active" ||
                        d.status === "charging" ||
                        d.status === "generating",
                    ).length
                  }{" "}
                  active
                </div>
              )}
            </div>

            {viewMode === "grid" ? (
              <DeviceGrid
                devices={devices}
                loading={loading}
                onToggle={handleDeviceToggle}
                onConfigure={handleDeviceConfigure}
              />
            ) : (
              <DeviceGrouping
                devices={devices}
                onToggle={handleDeviceToggle}
                onConfigure={handleDeviceConfigure}
              />
            )}
          </div>

          {/* Right Sidebar - Takes 1/3 width */}
          <div className="space-y-6">
            {/* Power Distribution */}
            <div className="animate-in fade-in slide-in-from-right duration-700 delay-100">
              <PowerDistribution devices={devices} />
            </div>

            {/* AI Advisor */}
            <div className="animate-in fade-in slide-in-from-right duration-700 delay-200">
              <DeviceAdvisor devices={devices} />
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl animate-in fade-in duration-700 delay-300">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            💡 Device Hub Pro Tips
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>
                Click device cards to see detailed controls and history
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Use scenarios to quickly optimize multiple devices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Group view helps manage devices by type</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>AI Advisor provides personalized optimization tips</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DevicesPage;

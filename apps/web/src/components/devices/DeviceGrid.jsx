import React from "react";
import DeviceCard from "./DeviceCard";
import { Skeleton } from "../ui/Skeleton";

const DeviceGrid = ({
  devices = [],
  loading = false,
  onToggle,
  onConfigure,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 animate-pulse"
          >
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-4" />
            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
          <span className="text-4xl">📱</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          No Devices Yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
          Start by adding your first smart device to monitor and control your
          energy usage.
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          Add Your First Device
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {devices.map((device, index) => (
        <div
          key={device.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <DeviceCard
            device={device}
            onToggle={onToggle}
            onConfigure={onConfigure}
          />
        </div>
      ))}
    </div>
  );
};

export default DeviceGrid;

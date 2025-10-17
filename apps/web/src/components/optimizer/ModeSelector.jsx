import React, { useState } from "react";
import { Home, Moon, Zap, Settings, CheckCircle } from "lucide-react";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import { useToast } from "../../hooks/useToast";

const ModeSelector = ({
  currentMode,
  onModeSelect,
  onCalculate,
  calculating,
}) => {
  const { success } = useToast();

  const modes = [
    {
      id: "normal",
      name: "Normal",
      icon: Home,
      color: "from-blue-500 to-cyan-500",
      description: "Current schedule without changes",
      features: [
        "No device shifts",
        "Current usage patterns",
        "Baseline for comparison",
      ],
    },
    {
      id: "off_peak",
      name: "Off-Peak Priority",
      icon: Moon,
      color: "from-purple-500 to-indigo-500",
      description: "Maximum savings by shifting to night hours",
      features: [
        "Shift to 12 AM - 6 AM",
        "Up to 35% savings",
        "Recommended for flexible loads",
      ],
    },
    {
      id: "partial",
      name: "Partial Shift",
      icon: Zap,
      color: "from-green-500 to-emerald-500",
      description: "Balanced approach with moderate shifting",
      features: [
        "Shift 50% of loads",
        "Up to 20% savings",
        "Maintains convenience",
      ],
    },
    {
      id: "custom",
      name: "Custom",
      icon: Settings,
      color: "from-orange-500 to-amber-500",
      description: "Build your own optimization plan",
      features: [
        "Full control",
        "Set device schedules",
        "Advanced constraints",
      ],
    },
  ];

  const handleModeClick = (modeId) => {
    onModeSelect(modeId);
    success(`${modes.find((m) => m.id === modeId)?.name} mode selected`);
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Select Optimization Mode
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Choose how aggressively you want to optimize your energy usage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeClick(mode.id)}
              className={`
                relative group p-6 rounded-2xl text-left
                transition-all duration-300 hover:scale-105 active:scale-95
                ${
                  currentMode === mode.id
                    ? "ring-4 ring-green-500/30 shadow-xl scale-105"
                    : "hover:shadow-lg"
                }
              `}
            >
              {/* Background Gradient */}
              <div
                className={`
                absolute inset-0 rounded-2xl bg-gradient-to-br ${mode.color}
                ${currentMode === mode.id ? "opacity-20" : "opacity-10"}
                group-hover:opacity-20 transition-opacity
              `}
              />

              {/* Selected Indicator */}
              {currentMode === mode.id && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                </div>
              )}

              {/* Icon */}
              <div
                className={`
                relative w-14 h-14 rounded-xl flex items-center justify-center mb-4
                bg-gradient-to-br ${mode.color}
                shadow-lg group-hover:shadow-xl group-hover:scale-110
                transition-all duration-300
              `}
              >
                <mode.icon className="text-white" size={24} />
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  {mode.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {mode.description}
                </p>

                {/* Features */}
                <ul className="space-y-1">
                  {mode.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-green-600 dark:text-green-400 mt-0.5">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          ))}
        </div>

        {/* Calculate Button */}
        <div className="flex items-center justify-center">
          <Button
            variant="gradient"
            size="lg"
            onClick={onCalculate}
            loading={calculating}
            disabled={calculating || !currentMode}
            className="px-12"
          >
            {calculating ? "Calculating..." : "Calculate Savings"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ModeSelector;

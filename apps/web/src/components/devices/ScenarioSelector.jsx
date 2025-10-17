import React, { useState } from "react";
import { Home, Leaf, Moon, Plane, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { useToast } from "../../hooks/useToast";

const ScenarioSelector = ({ currentScenario = "normal", onScenarioChange }) => {
  const [activeScenario, setActiveScenario] = useState(currentScenario);
  const { success } = useToast();

  const scenarios = [
    {
      id: "normal",
      name: "Normal",
      icon: Home,
      color: "from-blue-500 to-cyan-500",
      description: "Regular operation with balanced comfort and efficiency",
    },
    {
      id: "eco",
      name: "Eco Mode",
      icon: Leaf,
      color: "from-green-500 to-emerald-500",
      description: "Maximum energy savings with minimal device usage",
    },
    {
      id: "away",
      name: "Away",
      icon: Plane,
      color: "from-purple-500 to-pink-500",
      description: "Essential devices only, security features active",
    },
    {
      id: "sleep",
      name: "Sleep",
      icon: Moon,
      color: "from-indigo-500 to-blue-500",
      description: "Optimized for nighttime with reduced power usage",
    },
    {
      id: "boost",
      name: "Boost",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      description: "High performance mode, comfort prioritized",
    },
  ];

  const handleScenarioClick = (scenarioId) => {
    setActiveScenario(scenarioId);
    onScenarioChange?.(scenarioId);
    const scenario = scenarios.find((s) => s.id === scenarioId);
    success(`${scenario.name} mode activated`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Scenarios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioClick(scenario.id)}
              className={`
                group relative p-6 rounded-2xl text-center
                transition-all duration-300 hover:scale-105 active:scale-95
                ${
                  activeScenario === scenario.id
                    ? "ring-4 ring-green-500/30 shadow-xl"
                    : "hover:shadow-lg"
                }
              `}
            >
              {/* Background Gradient */}
              <div
                className={`
                absolute inset-0 rounded-2xl bg-gradient-to-br ${scenario.color}
                ${activeScenario === scenario.id ? "opacity-20" : "opacity-10"}
                group-hover:opacity-20 transition-opacity
              `}
              />

              {/* Icon */}
              <div
                className={`
                relative mx-auto w-14 h-14 rounded-xl flex items-center justify-center mb-3
                bg-gradient-to-br ${scenario.color}
                shadow-lg group-hover:shadow-xl group-hover:scale-110
                transition-all duration-300
              `}
              >
                <scenario.icon className="text-white" size={24} />
              </div>

              {/* Name */}
              <div className="relative font-semibold text-slate-900 dark:text-white mb-1">
                {scenario.name}
              </div>

              {/* Active Indicator */}
              {activeScenario === scenario.id && (
                <div className="relative flex items-center justify-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Active
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Active Scenario Description */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {scenarios.find((s) => s.id === activeScenario)?.description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioSelector;

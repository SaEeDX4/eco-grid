import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { TreePine, Car, Home, Droplet, Wind, Recycle } from "lucide-react";
import AnimatedNumber from "../ui/AnimatedNumber";

const EnvironmentalImpact = ({ impactData, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const impacts = [
    {
      icon: TreePine,
      label: "Trees Planted",
      value: impactData.treesEquivalent,
      suffix: " trees",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      description: "Equivalent to planting this many trees",
    },
    {
      icon: Car,
      label: "Miles Not Driven",
      value: impactData.milesSaved,
      suffix: " mi",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      description: "Equivalent carbon saved from not driving",
    },
    {
      icon: Home,
      label: "Homes Powered",
      value: impactData.homesPowered,
      suffix: " homes",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      description: "Could power this many homes for a day",
    },
    {
      icon: Droplet,
      label: "Water Saved",
      value: impactData.waterSaved,
      suffix: " L",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
      description: "Water conserved through efficiency",
    },
    {
      icon: Wind,
      label: "Clean Energy",
      value: impactData.cleanEnergyPercent,
      suffix: "%",
      color: "from-yellow-500 to-amber-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      description: "Percentage from renewable sources",
    },
    {
      icon: Recycle,
      label: "Waste Avoided",
      value: impactData.wasteAvoided,
      suffix: " kg",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      description: "Equivalent waste reduction",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          Real-World Environmental Impact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impacts.map((impact, index) => (
            <div
              key={impact.label}
              className={`
                p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700
                ${impact.bgColor}
                hover:shadow-xl hover:scale-105
                transition-all duration-300
                animate-in fade-in slide-in-from-bottom-4
                group
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div
                className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center mb-4
                  bg-gradient-to-br ${impact.color}
                  shadow-lg group-hover:shadow-2xl group-hover:scale-110
                  transition-all duration-300
                `}
              >
                <impact.icon className="text-white" size={32} />
              </div>

              {/* Value */}
              <div className="mb-2">
                <div className="text-4xl font-bold text-slate-900 dark:text-white">
                  <AnimatedNumber
                    value={impact.value}
                    suffix={impact.suffix}
                    decimals={impact.suffix === "%" ? 1 : 0}
                    duration={2000}
                  />
                </div>
              </div>

              {/* Label */}
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                {impact.label}
              </h4>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {impact.description}
              </p>

              {/* Visual Indicator */}
              <div className="mt-4 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${impact.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">🎉</div>
            <div>
              <h3 className="text-2xl font-bold mb-1">Your Impact Matters!</h3>
              <p className="text-green-100">
                Every kilowatt-hour saved contributes to a healthier planet
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <div className="text-3xl font-bold mb-1">
                <AnimatedNumber value={impactData.totalCO2Saved} decimals={0} />
              </div>
              <div className="text-sm text-green-100">kg CO₂ Avoided</div>
            </div>
            <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <div className="text-3xl font-bold mb-1">Top 15%</div>
              <div className="text-sm text-green-100">In Your Region</div>
            </div>
            <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <div className="text-3xl font-bold mb-1">
                <AnimatedNumber
                  value={impactData.consistencyDays}
                  decimals={0}
                />
              </div>
              <div className="text-sm text-green-100">Days Streak</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvironmentalImpact;

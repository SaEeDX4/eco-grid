import React from "react";
import { Zap, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { formatPower } from "../../lib/deviceUtils";

const PowerMeter = ({
  totalConsumption = 0,
  totalGeneration = 0,
  netPower = 0,
}) => {
  const isExporting = netPower < 0;
  const percentage = Math.min((Math.abs(netPower) / 10000) * 100, 100); // Assume 10kW max

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="text-yellow-600" size={24} />
          Power Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Net Power Display */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            {isExporting ? (
              <TrendingDown className="text-green-600" size={32} />
            ) : (
              <TrendingUp className="text-blue-600" size={32} />
            )}
          </div>
          <div
            className={`
            text-5xl font-bold mb-2
            ${isExporting ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}
          `}
          >
            {isExporting && "+"}
            {formatPower(Math.abs(netPower))}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {isExporting ? "Exporting to Grid" : "Net Consumption"}
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-slate-200 dark:text-slate-700"
            />
            {/* Progress Circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke={isExporting ? "#10b981" : "#3b82f6"}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {percentage.toFixed(0)}%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Capacity
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-sm text-blue-700 dark:text-blue-400 mb-1">
              Consuming
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">
              {formatPower(totalConsumption)}
            </div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-sm text-green-700 dark:text-green-400 mb-1">
              Generating
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-300">
              {formatPower(totalGeneration)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PowerMeter;

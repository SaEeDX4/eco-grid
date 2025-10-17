import React, { useState } from "react";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";

const SavingsSimulator = () => {
  const [inputs, setInputs] = useState({
    shiftPercentage: 30,
    solarPercentage: 0,
    evCharging: false,
  });

  const [results, setResults] = useState(null);

  const calculateSavings = () => {
    // Simulation logic
    const baseMonthlyBill = 120;
    const shiftSavings =
      baseMonthlyBill * (inputs.shiftPercentage / 100) * 0.35;
    const solarSavings = baseMonthlyBill * (inputs.solarPercentage / 100) * 0.8;
    const evSavings = inputs.evCharging ? 45 : 0;

    const totalMonthlySavings = shiftSavings + solarSavings + evSavings;
    const yearlyProjection = totalMonthlySavings * 12;
    const fiveYearProjection = yearlyProjection * 5;

    setResults({
      monthly: totalMonthlySavings,
      yearly: yearlyProjection,
      fiveYear: fiveYearProjection,
      newBill: baseMonthlyBill - totalMonthlySavings,
      percentageSaved: ((totalMonthlySavings / baseMonthlyBill) * 100).toFixed(
        1,
      ),
    });
  };

  const handleSliderChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="text-purple-600" size={24} />
          Savings Simulator
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Inputs */}
        <div className="space-y-6 mb-6">
          {/* Load Shifting Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Load Shifting to Off-Peak
              </label>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {inputs.shiftPercentage}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={inputs.shiftPercentage}
              onChange={(e) =>
                handleSliderChange("shiftPercentage", parseInt(e.target.value))
              }
              className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${inputs.shiftPercentage}%, rgb(226, 232, 240) ${inputs.shiftPercentage}%, rgb(226, 232, 240) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Solar Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Solar Coverage
              </label>
              <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                {inputs.solarPercentage}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={inputs.solarPercentage}
              onChange={(e) =>
                handleSliderChange("solarPercentage", parseInt(e.target.value))
              }
              className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(234, 179, 8) 0%, rgb(234, 179, 8) ${inputs.solarPercentage}%, rgb(226, 232, 240) ${inputs.solarPercentage}%, rgb(226, 232, 240) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* EV Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                EV Charging Optimization
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Automatic off-peak scheduling
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.evCharging}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    evCharging: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          variant="gradient"
          size="lg"
          className="w-full mb-6"
          onClick={calculateSavings}
        >
          <Calculator size={20} />
          Calculate Savings
        </Button>

        {/* Results */}
        {results && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Highlight - Monthly Savings */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
              <div className="text-sm font-semibold mb-2 opacity-90">
                Estimated Monthly Savings
              </div>
              <div className="text-5xl font-bold mb-2">
                ${results.monthly.toFixed(2)}
              </div>
              <div className="text-sm opacity-90">
                New bill: ${results.newBill.toFixed(2)}/mo (
                {results.percentageSaved}% savings)
              </div>
            </div>

            {/* Projections Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                <DollarSign
                  className="mx-auto text-green-600 dark:text-green-400 mb-2"
                  size={24}
                />
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${results.yearly.toFixed(0)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  First Year
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                <TrendingUp
                  className="mx-auto text-purple-600 dark:text-purple-400 mb-2"
                  size={24}
                />
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${results.fiveYear.toFixed(0)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  5-Year Total
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <strong>💡 Tip:</strong> These savings are based on current BC
                Hydro rates. Actual results may vary based on your usage
                patterns.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsSimulator;

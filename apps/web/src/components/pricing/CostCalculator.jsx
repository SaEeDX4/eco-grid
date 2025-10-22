import React, { useState, useEffect } from "react";
import { Calculator, TrendingUp, Leaf, DollarSign, Zap } from "lucide-react";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import {
  propertyTypes,
  calculateSavings,
  formatCurrency,
  formatNumber,
} from "../../lib/calculatorLogic";

const CostCalculator = ({ onRecommendation }) => {
  const [inputs, setInputs] = useState({
    propertyType: "house",
    monthlyBill: 150,
    numberOfDevices: 10,
  });
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Auto-calculate on input change with debounce
    const timer = setTimeout(() => {
      const calculatedResults = calculateSavings(inputs);
      setResults(calculatedResults);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    setShowResults(true);
    if (onRecommendation && results) {
      onRecommendation(results.recommendedPlan);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full mb-4">
              <Calculator size={20} />
              <span className="font-semibold">Calculate Your Savings</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              See How Much You Can Save
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Get a personalized estimate of your energy savings and cost
              reduction
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Your Details
                </h3>

                {/* Property Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Property Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(propertyTypes).map(([key, type]) => (
                      <button
                        key={key}
                        onClick={() => handleInputChange("propertyType", key)}
                        className={`
                          p-4 rounded-xl border-2 transition-all duration-300 text-left
                          ${
                            inputs.propertyType === key
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                          }
                        `}
                      >
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">
                          {type.label}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          ~{type.baselineDevices} devices
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monthly Bill */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Current Monthly Energy Bill
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="number"
                      value={inputs.monthlyBill}
                      onChange={(e) =>
                        handleInputChange(
                          "monthlyBill",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      max="10000"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-500 font-semibold">
                      CAD/month
                    </span>
                  </div>
                  <input
                    type="range"
                    value={inputs.monthlyBill}
                    onChange={(e) =>
                      handleInputChange("monthlyBill", parseInt(e.target.value))
                    }
                    min="50"
                    max="2000"
                    step="10"
                    className="w-full mt-3"
                  />
                </div>

                {/* Number of Devices */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Number of Smart Devices
                  </label>
                  <div className="relative">
                    <Zap
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="number"
                      value={inputs.numberOfDevices}
                      onChange={(e) =>
                        handleInputChange(
                          "numberOfDevices",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      max="200"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-500 font-semibold">
                      devices
                    </span>
                  </div>
                  <input
                    type="range"
                    value={inputs.numberOfDevices}
                    onChange={(e) =>
                      handleInputChange(
                        "numberOfDevices",
                        parseInt(e.target.value)
                      )
                    }
                    min="1"
                    max="100"
                    step="1"
                    className="w-full mt-3"
                  />
                </div>

                {/* Calculate Button */}
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={handleCalculate}
                >
                  <Calculator size={20} />
                  Calculate Savings
                </Button>
              </div>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
              {results && showResults && (
                <>
                  {/* Monthly Savings */}
                  <Card className="animate-in fade-in slide-in-from-right duration-700">
                    <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <TrendingUp size={24} />
                        </div>
                        <div>
                          <div className="text-sm opacity-90">
                            Estimated Monthly Savings
                          </div>
                          <div className="text-4xl font-bold">
                            {formatCurrency(results.monthlySavings)}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm opacity-90">
                        {formatCurrency(results.annualSavings)} per year
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Savings Rate
                        </span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {results.savingsRate}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${results.savingsRate}%` }}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Carbon Reduction */}
                  <Card
                    className="animate-in fade-in slide-in-from-right duration-700"
                    style={{ animationDelay: "100ms" }}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                          <Leaf className="text-white" size={24} />
                        </div>
                        <div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            CO₂ Reduction
                          </div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {formatNumber(results.co2Reduced)} kg/month
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                          That's equivalent to{" "}
                          <span className="font-bold">
                            {formatNumber(results.annualCO2)} kg
                          </span>{" "}
                          per year, or about{" "}
                          <span className="font-bold">
                            {Math.round(results.annualCO2 / 21)}
                          </span>{" "}
                          trees planted annually.
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Net Savings */}
                  <Card
                    className="animate-in fade-in slide-in-from-right duration-700"
                    style={{ animationDelay: "200ms" }}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                          <DollarSign className="text-white" size={24} />
                        </div>
                        <div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Net Savings (After Plan Cost)
                          </div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(results.netMonthlySavings)}/month
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">
                            Gross Savings
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {formatCurrency(results.monthlySavings)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">
                            Recommended Plan Cost
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            -
                            {formatCurrency(
                              results.monthlySavings - results.netMonthlySavings
                            )}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            ROI
                          </span>
                          <span className="font-bold text-green-600 dark:text-green-400">
                            {results.roi}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Recommendation */}
                  <Card
                    className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-right duration-700"
                    style={{ animationDelay: "300ms" }}
                  >
                    <div className="p-6 text-center">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                        Recommended Plan
                      </h3>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                        {results.recommendedPlan.charAt(0).toUpperCase() +
                          results.recommendedPlan.slice(1)}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Based on your usage profile and savings potential
                      </p>
                      <Button
                        variant="gradient"
                        size="default"
                        onClick={() => {
                          const element =
                            document.getElementById("pricing-plans");
                          element?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        View Plans
                      </Button>
                    </div>
                  </Card>
                </>
              )}

              {!showResults && (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <div className="text-center p-8">
                    <Calculator
                      className="mx-auto mb-4 text-slate-300 dark:text-slate-700"
                      size={64}
                    />
                    <p className="text-slate-500 dark:text-slate-500">
                      Enter your details and click Calculate to see your
                      personalized savings estimate
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500">
            * Estimates are based on average usage patterns and may vary. Actual
            savings depend on your specific devices, usage behavior, and local
            energy rates.
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostCalculator;

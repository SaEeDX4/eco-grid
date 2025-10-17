import React, { useState } from "react";
import { RefreshCw, TrendingUp } from "lucide-react";
import { useDevices } from "../hooks/useDevices";
import { useOptimizer } from "../hooks/useOptimizer";
import { useToast } from "../hooks/useToast";
import ModeSelector from "../components/optimizer/ModeSelector";
import ComparisonCards from "../components/optimizer/ComparisonCards";
import OptimizationTimeline from "../components/optimizer/OptimizationTimeline";
import AIExplainer from "../components/optimizer/AIExplainer";
import AcceptanceFlow from "../components/optimizer/AcceptanceFlow";
import Button from "../components/ui/Button";

const OptimizerPage = () => {
  const { devices, loading: devicesLoading } = useDevices();
  const { success } = useToast();
  const [showResults, setShowResults] = useState(false);

  const {
    mode,
    setMode,
    schedule,
    beforeData,
    afterData,
    savings,
    validation,
    calculating,
    calculate,
    reset,
  } = useOptimizer(devices);

  const handleCalculate = async () => {
    await calculate();
    setShowResults(true);
  };

  const handleReset = () => {
    reset();
    setShowResults(false);
    success("Optimizer reset");
  };

  const handleAccept = (response) => {
    success("Optimization plan activated successfully! 🎉");
    // TODO: Update device schedules
  };

  const handleDecline = () => {
    success("Optimization plan declined");
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Energy Optimizer
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              AI-powered optimization to maximize your savings
            </p>
          </div>
          {showResults && (
            <Button variant="outline" size="default" onClick={handleReset}>
              <RefreshCw size={18} />
              Start Over
            </Button>
          )}
        </div>

        {/* Mode Selection */}
        {!showResults && (
          <div className="animate-in fade-in slide-in-from-bottom duration-700">
            <ModeSelector
              currentMode={mode}
              onModeSelect={setMode}
              onCalculate={handleCalculate}
              calculating={calculating}
            />
          </div>
        )}

        {/* Results */}
        {showResults && (
          <>
            {/* Comparison Cards */}
            <div className="mb-8 animate-in fade-in slide-in-from-bottom duration-700">
              <ComparisonCards
                beforeData={beforeData}
                afterData={afterData}
                loading={calculating}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Timeline - Takes 2/3 width */}
              <div className="lg:col-span-2">
                <div className="mb-6 animate-in fade-in slide-in-from-left duration-700 delay-100">
                  <OptimizationTimeline
                    schedule={schedule}
                    title="Optimized Schedule"
                  />
                </div>

                {/* Acceptance Flow */}
                <div className="animate-in fade-in slide-in-from-left duration-700 delay-200">
                  <AcceptanceFlow
                    schedule={schedule}
                    mode={mode}
                    savings={savings}
                    validation={validation}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                  />
                </div>
              </div>

              {/* AI Explainer - Takes 1/3 width */}
              <div className="animate-in fade-in slide-in-from-right duration-700 delay-100">
                <AIExplainer
                  schedule={schedule}
                  mode={mode}
                  savings={savings}
                />
              </div>
            </div>

            {/* Info Banner */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl animate-in fade-in duration-700 delay-300">
              <div className="flex items-start gap-4">
                <TrendingUp
                  className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                  size={32}
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    How Optimization Works
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    Our AI analyzes your devices, energy rates, and usage
                    patterns to create a personalized schedule that maximizes
                    savings while maintaining your comfort and convenience.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Shifts flexible loads to off-peak hours</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Avoids capacity overload</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Maintains essential device schedules</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Updates automatically based on rates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OptimizerPage;

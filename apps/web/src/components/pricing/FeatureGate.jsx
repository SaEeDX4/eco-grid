import React from "react";
import { Lock, Sparkles } from "lucide-react";
import Button from "../ui/Button";

const FeatureGate = ({
  featureName,
  requiredPlan = "Household",
  onUpgrade,
  children,
  showOverlay = true,
}) => {
  return (
    <div className="relative">
      {/* Content (blurred when locked) */}
      <div
        className={
          showOverlay ? "filter blur-sm pointer-events-none select-none" : ""
        }
      >
        {children}
      </div>

      {/* Overlay */}
      {showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {featureName} is a Premium Feature
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Upgrade to{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {requiredPlan}
              </span>{" "}
              plan to unlock this feature
            </p>
            <Button variant="gradient" size="lg" onClick={onUpgrade}>
              <Sparkles size={20} />
              Upgrade to {requiredPlan}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureGate;

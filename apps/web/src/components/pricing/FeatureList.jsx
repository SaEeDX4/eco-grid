import React from "react";
import { Check, X } from "lucide-react";

const FeatureList = ({ features, compact = false }) => {
  const renderFeatureValue = (value) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check
          className="text-green-600 dark:text-green-400"
          size={compact ? 16 : 20}
        />
      ) : (
        <X
          className="text-slate-300 dark:text-slate-700"
          size={compact ? 16 : 20}
        />
      );
    }
    return (
      <span className="text-slate-700 dark:text-slate-300 text-sm">
        {value}
      </span>
    );
  };

  const featureList = [
    { label: "Connected Devices", value: features.devices },
    { label: "AI Optimization", value: features.optimization },
    { label: "Energy Reports", value: features.reports },
    { label: "Customer Support", value: features.support },
    { label: "API Access", value: features.api },
    { label: "Multi-Site Management", value: features.multiSite },
    { label: "Priority Support", value: features.priority },
    { label: "Custom Integrations", value: features.customIntegration },
    { label: "White-Label", value: features.whiteLabel },
    { label: "Dedicated Account Manager", value: features.dedicatedAccount },
  ].filter((f) => f.value !== false || typeof f.value === "boolean");

  return (
    <ul className={`space-y-${compact ? "2" : "3"}`}>
      {featureList.map((feature, index) => (
        <li key={index} className="flex items-center gap-3">
          {renderFeatureValue(feature.value)}
          <span
            className={`text-slate-600 dark:text-slate-400 ${compact ? "text-xs" : "text-sm"}`}
          >
            {feature.label}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default FeatureList;

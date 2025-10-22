import React, { useState } from "react";
import { Check, X, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import { pricingPlans, comparisonFeatures } from "../../lib/pricingData";
import { formatCurrency } from "../../lib/calculatorLogic";

const ComparisonTable = ({ onSelectPlan }) => {
  const [expandedCategories, setExpandedCategories] = useState(
    comparisonFeatures.map((_, index) => index === 0) // First category expanded by default
  );

  const toggleCategory = (index) => {
    setExpandedCategories((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const renderFeatureValue = (plan, featureKey) => {
    const value = plan.features[featureKey];

    if (typeof value === "boolean") {
      return value ? (
        <Check
          className="text-green-600 dark:text-green-400 mx-auto"
          size={24}
        />
      ) : (
        <X className="text-slate-300 dark:text-slate-700 mx-auto" size={24} />
      );
    }

    if (value === false || value === null || value === undefined) {
      return (
        <X className="text-slate-300 dark:text-slate-700 mx-auto" size={24} />
      );
    }

    return (
      <div className="text-sm text-slate-700 dark:text-slate-300 text-center">
        {value}
      </div>
    );
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Compare Plans
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Detailed feature comparison to help you choose the right plan
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block max-w-7xl mx-auto overflow-x-auto">
          <Card>
            <table className="w-full">
              {/* Table Header */}
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="p-6 text-left font-bold text-slate-900 dark:text-white border-b-2 border-slate-200 dark:border-slate-800">
                    Features
                  </th>
                  {pricingPlans.map((plan) => (
                    <th
                      key={plan.id}
                      className="p-6 text-center border-b-2 border-slate-200 dark:border-slate-800"
                    >
                      <div className="mb-2 font-bold text-slate-900 dark:text-white">
                        {plan.name}
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {plan.price.monthly === null
                          ? "Custom"
                          : plan.price.monthly === 0
                            ? "Free"
                            : formatCurrency(plan.price.monthly)}
                      </div>
                      {plan.price.monthly !== null &&
                        plan.price.monthly > 0 && (
                          <div className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                            per month
                          </div>
                        )}
                      <Button
                        variant={plan.popular ? "gradient" : "outline"}
                        size="sm"
                        onClick={() => onSelectPlan(plan)}
                      >
                        {plan.cta}
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {comparisonFeatures.map((category, categoryIndex) => (
                  <React.Fragment key={categoryIndex}>
                    {/* Category Header */}
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <td colSpan={pricingPlans.length + 1} className="p-4">
                        <button
                          onClick={() => toggleCategory(categoryIndex)}
                          className="flex items-center justify-between w-full text-left font-bold text-slate-900 dark:text-white"
                        >
                          <span>{category.category}</span>
                          {expandedCategories[categoryIndex] ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Category Features */}
                    {expandedCategories[categoryIndex] &&
                      category.features.map((feature, featureIndex) => (
                        <tr
                          key={featureIndex}
                          className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-700 dark:text-slate-300">
                                {feature.name}
                              </span>
                              {feature.tooltip && (
                                <div className="group relative">
                                  <Info
                                    size={16}
                                    className="text-slate-400 cursor-help"
                                  />
                                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg shadow-xl z-20">
                                    {feature.tooltip}
                                    <div className="absolute top-full left-4 -mt-2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          {pricingPlans.map((plan) => (
                            <td key={plan.id} className="p-4 text-center">
                              {renderFeatureValue(plan, feature.key)}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-6">
          {pricingPlans.map((plan, index) => (
            <Card
              key={plan.id}
              className="animate-in fade-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                {/* Plan Header */}
                <div className="mb-6 pb-6 border-b-2 border-slate-200 dark:border-slate-800">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {plan.price.monthly === null
                      ? "Custom"
                      : plan.price.monthly === 0
                        ? "Free"
                        : formatCurrency(plan.price.monthly)}
                  </div>
                  {plan.price.monthly !== null && plan.price.monthly > 0 && (
                    <div className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                      per month
                    </div>
                  )}
                  <Button
                    variant={plan.popular ? "gradient" : "outline"}
                    size="default"
                    className="w-full"
                    onClick={() => onSelectPlan(plan)}
                  >
                    {plan.cta}
                  </Button>
                </div>

                {/* Features by Category */}
                {comparisonFeatures.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="mb-6">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-3">
                      {category.category}
                    </h4>
                    <div className="space-y-2">
                      {category.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800"
                        >
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {feature.name}
                          </span>
                          <div className="flex-shrink-0 ml-4">
                            {renderFeatureValue(plan, feature.key)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Still not sure which plan is right for you?
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => (window.location.href = "/contact")}
          >
            Talk to Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;

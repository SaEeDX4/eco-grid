import React from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import FeatureList from "./FeatureList";
import { formatCurrency } from "../../lib/calculatorLogic";

const PricingCard = ({ plan, period, onSelect, featured = false }) => {
  const price = plan.price[period];
  const isCustom = price === null;

  return (
    <Card
      className={`
        relative overflow-hidden transition-all duration-300
        ${
          featured
            ? "border-4 border-blue-500 dark:border-blue-400 shadow-2xl scale-105 z-10"
            : "hover:shadow-xl hover:scale-105"
        }
      `}
    >
      {/* Popular Badge */}
      {featured && (
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32">
          <div className="absolute transform rotate-45 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold py-1 right-12 top-12 w-32 text-center shadow-lg">
            <Sparkles size={12} className="inline mr-1" />
            POPULAR
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {plan.name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-8">
          {isCustom ? (
            <div className="text-4xl font-bold text-slate-900 dark:text-white">
              Custom
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(price, plan.currency)}
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  /{period === "monthly" ? "month" : "year"}
                </span>
              </div>
              {period === "annual" && price > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-semibold">
                  {formatCurrency(price * 12, plan.currency)} billed annually
                </p>
              )}
            </>
          )}
        </div>

        {/* CTA Button */}
        <Button
          variant={featured ? "gradient" : "outline"}
          size="lg"
          className="w-full mb-8"
          onClick={() => onSelect(plan)}
        >
          {plan.cta}
          <ArrowRight size={20} />
        </Button>

        {/* Features */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            What's included:
          </h4>
          <FeatureList features={plan.features} compact />
        </div>

        {/* Limits */}
        {plan.id !== "enterprise" && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3">
              PLAN LIMITS
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Max Devices</span>
                <span className="font-semibold">
                  {plan.limits.maxDevices === 999999
                    ? "Unlimited"
                    : plan.limits.maxDevices}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Max Users</span>
                <span className="font-semibold">{plan.limits.maxUsers}</span>
              </div>
              <div className="flex justify-between">
                <span>Data Retention</span>
                <span className="font-semibold">
                  {Math.floor(plan.limits.dataRetentionDays / 365)} year
                  {plan.limits.dataRetentionDays >= 730 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PricingCard;

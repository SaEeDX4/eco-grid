import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PricingCard from "./PricingCard";
import BillingToggle from "./BillingToggle";
import { pricingPlans, trialDetails } from "../../lib/pricingData";
import { useToast } from "../../hooks/useToast";

const PricingPlans = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const navigate = useNavigate();
  const { success } = useToast();

  const handlePlanSelect = (plan) => {
    if (plan.id === "enterprise") {
      navigate("/contact");
    } else {
      success(
        `Starting ${trialDetails.duration}-day free trial of ${plan.name}!`
      );
      navigate("/signup");
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Start with a {trialDetails.duration}-day free trial. No credit card
            required. Cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <BillingToggle period={billingPeriod} onChange={setBillingPeriod} />

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.id}
              className="animate-in fade-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PricingCard
                plan={plan}
                period={billingPeriod}
                onSelect={handlePlanSelect}
                featured={plan.popular}
              />
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {trialDetails.duration} Days
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Free Trial Period
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              No Card
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Credit Card Required
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              Cancel
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Anytime, No Questions
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;

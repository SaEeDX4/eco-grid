import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, Zap, Shield, Users } from "lucide-react";
import PricingPlans from "../components/pricing/PricingPlans";
import CostCalculator from "../components/pricing/CostCalculator";
import ComparisonTable from "../components/pricing/ComparisonTable";

const PricingPage = () => {
  const navigate = useNavigate();
  const [recommendedPlan, setRecommendedPlan] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePlanSelect = (plan) => {
    if (plan.id === "enterprise") {
      navigate("/contact");
    } else {
      navigate("/signup");
    }
  };

  const handleCalculatorRecommendation = (planId) => {
    setRecommendedPlan(planId);
    // Scroll to pricing plans
    setTimeout(() => {
      const element = document.getElementById("pricing-plans");
      element?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full mb-6">
              <DollarSign size={20} />
              <span className="font-semibold">Transparent Pricing</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              Choose the perfect plan for your energy optimization needs. Start
              with a 14-day free trial, no credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: "14-Day Free Trial",
                description: "Full access to all features with no commitment",
                color: "from-yellow-500 to-orange-600",
              },
              {
                icon: Shield,
                title: "No Credit Card",
                description: "Start your trial without any payment details",
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: Users,
                title: "Cancel Anytime",
                description: "No questions asked, no hidden fees",
                color: "from-blue-500 to-cyan-600",
              },
              {
                icon: DollarSign,
                title: "Money-Back Guarantee",
                description: "30-day guarantee on all paid plans",
                color: "from-purple-500 to-pink-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Calculator */}
      <CostCalculator onRecommendation={handleCalculatorRecommendation} />

      {/* Pricing Plans */}
      <div id="pricing-plans">
        <PricingPlans />
      </div>

      {/* Comparison Table */}
      <ComparisonTable onSelectPlan={handlePlanSelect} />

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  question: "Can I change plans later?",
                  answer:
                    "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans.",
                },
                {
                  question: "Is there a setup fee?",
                  answer:
                    "No setup fees ever. The price you see is the price you pay, with no hidden charges.",
                },
                {
                  question: "What happens after the free trial?",
                  answer:
                    "After your 14-day trial, you'll be prompted to select a plan. If you don't choose one, your account reverts to the free tier.",
                },
                {
                  question: "Do you offer discounts for annual billing?",
                  answer:
                    "Yes! Save 20% by choosing annual billing. That's 2 months free every year.",
                },
                {
                  question: "Can I get a refund?",
                  answer:
                    "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.",
                },
              ].map((faq, index) => (
                <details
                  key={index}
                  className="group p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <summary className="cursor-pointer font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    {faq.question}
                    <span className="ml-4 text-blue-600 dark:text-blue-400 group-open:rotate-180 transition-transform duration-300">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Saving?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of homes and businesses already saving with
              Eco-Grid
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                Talk to Sales
              </button>
            </div>
            <p className="text-sm text-blue-100 mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;

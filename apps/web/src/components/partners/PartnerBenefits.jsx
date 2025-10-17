import React, { useState } from "react";
import { Building, Rocket, Briefcase } from "lucide-react";
import { partnerBenefits } from "../../lib/partnerData";
import * as LucideIcons from "lucide-react";

const PartnerBenefits = () => {
  const [activeTab, setActiveTab] = useState("utilities");

  const tabs = [
    { id: "utilities", label: "Utilities", icon: Building },
    { id: "incubators", label: "Incubators", icon: Rocket },
    { id: "enterprises", label: "Enterprises", icon: Briefcase },
  ];

  const benefits = partnerBenefits[activeTab] || [];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Partnership Benefits
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Tailored value propositions for different partner types
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                  transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }
                `}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = LucideIcons[benefit.icon] || LucideIcons.Award;

            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Icon className="text-white" size={28} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Context */}
        <div className="mt-12 max-w-4xl mx-auto text-center">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Every partnership is unique. We work closely with you to identify
            and deliver the most valuable outcomes for your organization.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnerBenefits;

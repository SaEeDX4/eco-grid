import React from "react";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { integrationSteps } from "../../lib/partnerData";

const IntegrationProcess = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Integration Process
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A proven, step-by-step approach to ensure successful partnership
            launch
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500" />

            {/* Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
              {integrationSteps.map((step, index) => (
                <div
                  key={step.step}
                  className="relative animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Step Number Circle */}
                  <div className="relative z-10 flex justify-center mb-6">
                    <div
                      className={`
                      w-24 h-24 rounded-full flex items-center justify-center
                      bg-gradient-to-br ${index === 0 ? "from-blue-500 to-cyan-600" : index === integrationSteps.length - 1 ? "from-green-500 to-emerald-600" : "from-purple-500 to-pink-600"}
                      shadow-lg group-hover:scale-110 transition-transform duration-300
                    `}
                    >
                      <span className="text-3xl font-bold text-white">
                        {step.step}
                      </span>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 h-full">
                    {/* Duration Badge */}
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold mb-3">
                      <Circle size={8} className="fill-current" />
                      {step.duration}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Deliverables */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-500 mb-2">
                        Key Deliverables:
                      </h4>
                      <ul className="space-y-1">
                        {step.deliverables.map((deliverable, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400"
                          >
                            <CheckCircle
                              size={12}
                              className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                            />
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Arrow (desktop only) */}
                  {index < integrationSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-2 z-20">
                      <ArrowRight className="text-purple-500" size={24} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Summary */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">
              Typical Timeline: 2-4 Months
            </h3>
            <p className="text-blue-100">
              From initial consultation to full deployment, with ongoing support
              at every stage
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationProcess;

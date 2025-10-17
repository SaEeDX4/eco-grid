import React from "react";
import { Rocket, Package, Settings, ArrowRight, Check } from "lucide-react";
import { Card } from "../ui/Card";
import { partnershipModels } from "../../lib/partnerData";
import Button from "../ui/Button";

const iconMap = {
  Rocket,
  Package,
  Settings,
};

const PartnershipModels = ({ onInquire }) => {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Partnership Models
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Flexible collaboration options designed to meet your organization's
            unique needs and goals
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {partnershipModels.map((model, index) => {
            const Icon = iconMap[model.icon];

            return (
              <Card
                key={model.id}
                className="group hover:shadow-2xl transition-all duration-300 flex flex-col animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div
                  className={`p-6 bg-gradient-to-br ${model.color} rounded-t-2xl`}
                >
                  <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {model.name}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {model.description}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Features */}
                  <div className="mb-6 flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                      What's Included:
                    </h4>
                    <ul className="space-y-2">
                      {model.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                        >
                          <Check
                            size={16}
                            className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-3 mb-6">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-500 mb-1">
                        Ideal For
                      </div>
                      <div className="text-sm text-slate-900 dark:text-white">
                        {model.idealFor}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-500 mb-1">
                        Commitment Level
                      </div>
                      <div className="text-sm text-slate-900 dark:text-white">
                        {model.commitment}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-500 mb-1">
                        Pricing
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {model.pricing}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => onInquire(model.name)}
                    className="w-full group"
                  >
                    Learn More
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Not sure which model fits your needs?
          </p>
          <Button
            variant="gradient"
            size="lg"
            onClick={() => onInquire("General Inquiry")}
          >
            Schedule a Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PartnershipModels;

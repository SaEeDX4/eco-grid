import React from "react";
import {
  Download,
  Link as LinkIcon,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const Step = ({ number, icon: Icon, title, description, delay = 0 }) => {
  const [ref, isVisible] = useScrollAnimation(0.3);

  return (
    <div
      ref={ref}
      className="relative animate-in fade-in slide-in-from-left duration-1000"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-center text-center group">
        {/* Step Number */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
            {number}
          </div>
        </div>

        {/* Icon */}
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all">
          <Icon size={32} className="text-green-600 dark:text-green-400" />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const [ref, isVisible] = useScrollAnimation(0.2);

  const steps = [
    {
      number: 1,
      icon: Download,
      title: "Sign Up",
      description:
        "Create your account in 2 minutes. No credit card required for the pilot program.",
      delay: 0,
    },
    {
      number: 2,
      icon: LinkIcon,
      title: "Connect Devices",
      description:
        "Link your smart devices, EV charger, solar panels, and battery storage seamlessly.",
      delay: 200,
    },
    {
      number: 3,
      icon: BarChart3,
      title: "AI Learns",
      description:
        "Our AI studies your patterns for 7 days to create a personalized optimization strategy.",
      delay: 400,
    },
    {
      number: 4,
      icon: TrendingUp,
      title: "Start Saving",
      description:
        "Watch your bills drop and CO₂ emissions fall while earning from energy trading.",
      delay: 600,
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16" ref={ref}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Get started in minutes and see results within the first week
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>

        {/* Connection Lines (Desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500/20 to-transparent -z-10" />
      </div>
    </section>
  );
};

export default HowItWorks;

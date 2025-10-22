import React, { useEffect } from "react";
import { Award, Rocket, Shield, TrendingUp, Globe, Leaf } from "lucide-react";

// ✅ Fixed import paths (use ../ instead of ../../)
import InnovationNarrative from "../components/suv/InnovationNarrative";
import ImpactTimeline from "../components/suv/ImpactTimeline";
import SuccessMetrics from "../components/suv/SuccessMetrics";
import LiveImpactCounter from "../components/suv/LiveImpactCounter";
import SecurityPosture from "../components/suv/SecurityPosture";
import GreenHosting from "../components/suv/GreenHosting";
import ScalabilityStatus from "../components/suv/ScalabilityStatus";
import LanguageSwitcher from "../components/suv/LanguageSwitcher";

const SUVPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-30 animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-30 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/30">
              <Award size={24} className="text-yellow-300" />
              <span className="text-lg font-bold">
                Canadian Startup Visa Application
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Innovation That Powers
              <br />
              Canada's Clean Energy Future
            </h1>

            {/* Subheadline */}
            <p className="text-2xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto">
              Eco-Grid represents a unique convergence of AI innovation,
              environmental leadership, and social impact—delivering measurable
              results for households, businesses, and communities across Canada.
            </p>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Rocket,
                  label: "Deep Tech Innovation",
                  value: "AI + IoT",
                },
                {
                  icon: TrendingUp,
                  label: "Economic Impact",
                  value: "$3M+ Savings",
                },
                { icon: Leaf, label: "Carbon Reduced", value: "500+ Tonnes" },
                { icon: Globe, label: "Market Reach", value: "Pan-Canadian" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <item.icon className="mx-auto mb-3" size={32} />
                  <div className="text-3xl font-bold mb-2">{item.value}</div>
                  <div className="text-sm text-blue-100">{item.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12">
              <a
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Shield size={24} />
                Learn About Our Startup Visa Journey
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LANGUAGE SHOWCASE ================= */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Committed to Inclusion
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Supporting Canada's multicultural communities with
                multi-language accessibility
              </p>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </section>

      {/* ================= MAIN SECTIONS ================= */}
      <LiveImpactCounter />
      <InnovationNarrative />
      <SuccessMetrics />
      <ImpactTimeline />
      <SecurityPosture />
      <GreenHosting />
      <ScalabilityStatus />

      {/* ================= PIPEDA COMPLIANCE ================= */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Shield size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    Privacy & Data Protection
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                    Our commitment to privacy goes beyond compliance. We've
                    built PIPEDA and GDPR principles into every aspect of our
                    platform, ensuring your data is protected with
                    industry-leading security measures and transparent
                    practices.
                  </p>
                  <a
                    href="/privacy-policy"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    View Full Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Building Canada's Clean Energy Future
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Through the Startup Visa program, we're creating high-value jobs,
              driving technological innovation, and establishing Vancouver as a
              global hub for AI-powered climate solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/partners"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Partnership Opportunities
              </a>
              <a
                href="/contact"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SUVPage;

import React from "react";
import { Target, Eye, Compass } from "lucide-react";

const MissionSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
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
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Empowering a Sustainable Energy Future
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Eco-Grid is transforming how Canadians manage, optimize, and benefit
            from their energy consumption through intelligent automation and
            community-driven innovation.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Mission */}
          <div className="group p-8 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Our Mission
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To democratize energy management by providing every household and
              business with AI-powered tools to reduce costs, cut emissions, and
              contribute to grid stability.
            </p>
          </div>

          {/* Vision */}
          <div className="group p-8 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 hover:shadow-xl animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Eye className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Our Vision
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              A future where every building is a smart energy hub, participating
              in virtual power plants and peer-to-peer energy markets for a
              resilient, carbon-neutral grid.
            </p>
          </div>

          {/* Values */}
          <div className="group p-8 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-xl animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Compass className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Our Approach
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Privacy-first design, open standards, Canadian-led innovation, and
              measurable impact. We build trust through transparency and deliver
              results through technology.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;

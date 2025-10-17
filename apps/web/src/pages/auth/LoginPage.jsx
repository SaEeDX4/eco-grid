import React from "react";
import { Link } from "react-router-dom";
import { Zap, TrendingDown, Leaf, Users, ArrowLeft } from "lucide-react";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-900 relative">
        {/* Back to Home Button */}
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400 transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium">Back to Home</span>
        </Link>

        <LoginForm />
      </div>

      {/* Right Side - Branding & Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-12 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full max-w-xl mx-auto">
          {/* Logo & Tagline */}
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Zap className="text-white" size={32} />
              </div>
              <span className="text-3xl font-bold text-white">Eco-Grid</span>
            </Link>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Transform Your Energy Usage Today
            </h2>
            <p className="text-xl text-green-100 leading-relaxed">
              Join 2,000+ Vancouver residents saving money and fighting climate
              change with AI-powered energy management.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-left duration-700 delay-300">
            {[
              {
                icon: TrendingDown,
                label: "Save up to 40%",
                sublabel: "on energy bills",
              },
              { icon: Leaf, label: "Reduce CO₂", sublabel: "carbon tracking" },
              {
                icon: Users,
                label: "P2P Trading",
                sublabel: "sell excess energy",
              },
              {
                icon: Zap,
                label: "24/7 AI Coach",
                sublabel: "smart optimization",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <feature.icon className="text-white mb-3" size={32} />
                <p className="text-white font-bold text-lg mb-1">
                  {feature.label}
                </p>
                <p className="text-green-100 text-sm">{feature.sublabel}</p>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="animate-in fade-in duration-700 delay-500">
            <p className="text-green-100 text-sm mb-3">
              Trusted by leading organizations
            </p>
            <div className="flex flex-wrap gap-6">
              {["BC Hydro", "Innovate BC", "Startup Visa", "Clean BC"].map(
                (org, index) => (
                  <div
                    key={index}
                    className="text-white font-semibold opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {org}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

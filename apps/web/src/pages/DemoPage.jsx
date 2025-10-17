import React from "react";
import { Play, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const DemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-green-950 dark:to-slate-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft size={20} />
              Back to Home
            </Button>
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="primary" className="mb-4">
              <Play size={14} className="mr-1" />
              Live Demo
            </Badge>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
              See Eco-Grid in Action
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Watch how Eco-Grid transforms energy management for Vancouver
              homes and businesses
            </p>
          </div>

          {/* Video Placeholder - Main Demo */}
          <div className="relative group cursor-pointer mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-slate-800 rounded-3xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center border-2 border-slate-700 hover:border-green-500 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
              <div className="relative text-center">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-4 mx-auto">
                  <Play size={40} className="text-white ml-2" />
                </div>
                <p className="text-white text-2xl font-bold mb-2">
                  Full Platform Demo
                </p>
                <p className="text-green-200">
                  5 minutes • Complete walkthrough
                </p>
              </div>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Dashboard Demo */}
            <div className="relative group cursor-pointer animate-in fade-in slide-in-from-left duration-1000 delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-slate-800 rounded-2xl overflow-hidden shadow-xl aspect-video flex items-center justify-center border border-slate-700 hover:border-green-500 transition-all">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-3 mx-auto">
                    <Play size={24} className="text-white ml-1" />
                  </div>
                  <p className="text-white font-semibold">Dashboard Tour</p>
                  <p className="text-green-200 text-sm">2 min</p>
                </div>
              </div>
            </div>

            {/* Device Control Demo */}
            <div className="relative group cursor-pointer animate-in fade-in slide-in-from-right duration-1000 delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-slate-800 rounded-2xl overflow-hidden shadow-xl aspect-video flex items-center justify-center border border-slate-700 hover:border-green-500 transition-all">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-3 mx-auto">
                    <Play size={24} className="text-white ml-1" />
                  </div>
                  <p className="text-white font-semibold">Device Control</p>
                  <p className="text-green-200 text-sm">1.5 min</p>
                </div>
              </div>
            </div>

            {/* AI Coach Demo */}
            <div className="relative group cursor-pointer animate-in fade-in slide-in-from-left duration-1000 delay-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-slate-800 rounded-2xl overflow-hidden shadow-xl aspect-video flex items-center justify-center border border-slate-700 hover:border-green-500 transition-all">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-3 mx-auto">
                    <Play size={24} className="text-white ml-1" />
                  </div>
                  <p className="text-white font-semibold">AI Coach</p>
                  <p className="text-green-200 text-sm">1 min</p>
                </div>
              </div>
            </div>

            {/* P2P Trading Demo */}
            <div className="relative group cursor-pointer animate-in fade-in slide-in-from-right duration-1000 delay-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-slate-800 rounded-2xl overflow-hidden shadow-xl aspect-video flex items-center justify-center border border-slate-700 hover:border-green-500 transition-all">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-3 mx-auto">
                    <Play size={24} className="text-white ml-1" />
                  </div>
                  <p className="text-white font-semibold">P2P Trading</p>
                  <p className="text-green-200 text-sm">2 min</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features Showcase */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              What You'll See in the Demo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "✅ Real-time energy monitoring dashboard",
                "✅ AI-powered savings recommendations",
                "✅ Smart device control interface",
                "✅ Energy price forecasting",
                "✅ P2P energy trading marketplace",
                "✅ Carbon offset tracking",
                "✅ ESG reporting generation",
                "✅ VPP pool participation",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300"
                >
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center animate-in fade-in duration-1000 delay-500">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Join the pilot program and start saving today
            </p>
            <Button variant="gradient" size="xl">
              Join Pilot Program
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;

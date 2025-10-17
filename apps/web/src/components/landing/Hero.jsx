import React from "react";
import { ArrowRight, Play, Zap, TrendingDown, Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ add this line
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import SmartHeadline from "./SmartHeadline";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ access logged-in user

  const handleJoinPilot = () => {
    if (user) {
      navigate("/dashboard"); // if logged in → go to dashboard
    } else {
      navigate("/auth/login"); // if not logged in → go to login
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-green-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-8 animate-in fade-in slide-in-from-top duration-1000">
            <Badge variant="success" className="text-sm px-4 py-2">
              <Zap size={14} className="mr-1" />
              Now Live in Vancouver, BC 🇨🇦
            </Badge>
          </div>

          {/* Smart AI-Powered Headline */}
          <div className="mb-8">
            <SmartHeadline />
          </div>

          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-6 my-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <TrendingDown className="text-green-600" size={20} />
              <span className="font-semibold">Save up to 40%</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Leaf className="text-green-600" size={20} />
              <span className="font-semibold">Reduce CO₂ emissions</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Zap className="text-green-600" size={20} />
              <span className="font-semibold">Real-time optimization</span>
            </div>
          </div>

          {/* ✅ CTA Buttons (fixed) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <Button
              variant="gradient"
              size="xl"
              className="group"
              onClick={handleJoinPilot}
            >
              Join the Pilot Program
              <ArrowRight
                size={20}
                className="ml-2 inline-block group-hover:translate-x-1 transition-transform"
              />
            </Button>

            <Link to="/demo">
              <Button variant="outline" size="xl" className="group">
                <Play
                  size={20}
                  className="mr-2 inline-block group-hover:scale-110 transition-transform"
                />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="text-sm text-slate-600 dark:text-slate-400 animate-in fade-in duration-1000 delay-700">
            <p>Supported by BC Hydro • Innovate BC • Startup Visa Program</p>
          </div>

          {/* Video Placeholder */}
          <div className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-slate-800 rounded-3xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center border-2 border-slate-700 hover:border-green-500 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
                <div className="relative text-center">
                  <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={32} className="text-white ml-1" />
                  </div>
                  <p className="text-white mt-4 font-semibold">
                    Watch 30-second demo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-slate-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Hero;

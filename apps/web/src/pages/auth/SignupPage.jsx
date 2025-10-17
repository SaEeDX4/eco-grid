import React from "react";
import { Link } from "react-router-dom";
import { Zap, DollarSign, Battery, Sun, ArrowLeft } from "lucide-react";
import SignupForm from "../../components/auth/SignupForm";

const SignupPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-900 relative overflow-y-auto">
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

        <div className="w-full max-w-md py-20">
          <SignupForm />
        </div>
      </div>

      {/* Right Side - Benefits & Social Proof */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-12 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full max-w-xl mx-auto">
          {/* Logo & Message */}
          <div className="animate-in fade-in slide-in-from-right duration-700">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Zap className="text-white" size={32} />
              </div>
              <span className="text-3xl font-bold text-white">Eco-Grid</span>
            </Link>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Start Saving Today
            </h2>
            <p className="text-xl text-green-100 leading-relaxed mb-8">
              Join Vancouver's smart energy revolution. Free during pilot
              program with limited spots available.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-3xl font-bold text-white mb-1">$2.8M+</p>
                <p className="text-green-100">Total Saved</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-3xl font-bold text-white mb-1">1,254</p>
                <p className="text-green-100">Tons CO₂ Reduced</p>
              </div>
            </div>
          </div>

          {/* What You Get */}
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-700 delay-300">
            <p className="text-white font-bold text-lg mb-4">What you get:</p>
            {[
              {
                icon: DollarSign,
                text: "Save up to 40% on energy bills with AI optimization",
              },
              {
                icon: Battery,
                text: "Smart device control and automated scheduling",
              },
              { icon: Sun, text: "Solar & battery storage integration" },
              { icon: Zap, text: "P2P energy trading and carbon credits" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 hover:translate-x-2"
              >
                <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                  <item.icon className="text-white" size={24} />
                </div>
                <p className="text-white leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 animate-in fade-in duration-700 delay-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                SC
              </div>
              <div>
                <p className="text-white font-semibold">Sarah Chen</p>
                <p className="text-green-100 text-sm">Vancouver Homeowner</p>
              </div>
            </div>
            <p className="text-white leading-relaxed italic">
              "Eco-Grid cut my electricity bill by 42% in the first month! The
              setup was incredibly easy."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

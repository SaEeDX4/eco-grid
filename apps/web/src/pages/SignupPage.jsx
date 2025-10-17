import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import SSOButtons from "../components/auth/SSOButtons";
import Button from "../components/ui/Button";

const SignupPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full mb-4">
            <UserPlus size={20} />
            <span className="font-semibold">Join Eco-Grid</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Create Your Account
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Start optimizing your energy usage today
          </p>
        </div>

        {/* Signup Card */}
        <Card
          className="animate-in fade-in slide-in-from-bottom duration-700"
          style={{ animationDelay: "100ms" }}
        >
          <div className="p-8">
            {/* SSO Options */}
            <SSOButtons />

            {/* Email Signup Form */}
            <form className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Minimum 8 characters with at least one number
                </p>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-slate-600 dark:text-slate-400"
                >
                  I agree to Eco-Grid's{" "}
                  <a
                    href="/terms"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
              >
                Create Account
                <ArrowRight size={20} />
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Benefits */}
        <div
          className="mt-8 grid grid-cols-3 gap-4 text-center animate-in fade-in slide-in-from-bottom duration-700"
          style={{ animationDelay: "200ms" }}
        >
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              20-40%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Energy Savings
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              24/7
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              AI Optimization
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              50+
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Device Types
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import SocialAuth from "./SocialAuth";
import { useToast } from "../../hooks/useToast";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 added
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE || "http://localhost:3000"}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            rememberMe,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Invalid credentials");

      // ✅ Save token if present
      if (data.token) {
        localStorage.setItem("token", data.token);
        // 👇 Notify AuthContext immediately (no reload required)
        window.dispatchEvent(new Event("storage"));
      }

      // ✅ smart redirect to the page the user wanted
      const fromPath = location.state?.from?.pathname || "/dashboard"; // default fallback
      const blocked = [
        "/auth/login",
        "/auth/signup",
        "/auth/forgot-password",
        "/auth/verify-email",
      ];
      const target = blocked.includes(fromPath) ? "/dashboard" : fromPath;

      success("Welcome back! Redirecting...");
      setTimeout(() => navigate(target, { replace: true }), 300);
    } catch (err) {
      console.error("Login error:", err);
      error(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-green-500/30 animate-in zoom-in duration-500">
          <Lock className="text-white" size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome Back
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Sign in to continue to your dashboard
        </p>
      </div>

      {/* Social Auth */}
      <div className="mb-6">
        <SocialAuth />
      </div>

      {/* Login Form */}
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
        <Input
          type="email"
          name="email"
          label="Email Address"
          placeholder="you@example.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          disabled={loading}
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
          disabled={loading}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all cursor-pointer"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-green-600 transition-colors">
              Remember me
            </span>
          </label>

          <Link
            to="/auth/forgot-password"
            className="text-sm font-semibold text-green-600 hover:text-green-700 dark:hover:text-green-400 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full group"
          loading={loading}
          disabled={loading}
        >
          {!loading && (
            <>
              Sign In
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </Button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            className="font-semibold text-green-600 hover:text-green-700 dark:hover:text-green-400 transition-colors"
          >
            Sign up for free
          </Link>
        </p>
      </div>

      {/* Demo Credentials */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl animate-in fade-in duration-1000 delay-300">
        <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
          <strong>Demo:</strong> demo@ecogrid.ca / demo123
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

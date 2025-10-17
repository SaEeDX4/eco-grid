import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Building2 } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import SocialAuth from "./SocialAuth";
import PasswordStrength from "./PasswordStrength";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const SignupForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "household",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Show password strength when user starts typing password
    if (name === "password" && value) {
      setShowPasswordStrength(true);
    } else if (name === "password" && !value) {
      setShowPasswordStrength(false);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        accountType: formData.accountType,
      });
      success("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/auth/verify-email");
      }, 1000);
    } catch (err) {
      error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-green-500/30 animate-in zoom-in duration-500">
          <User className="text-white" size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Create Account
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Join the pilot program and start saving today
        </p>
      </div>

      {/* Social Auth */}
      <div className="mb-6">
        <SocialAuth />
      </div>

      {/* Account Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Account Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, accountType: "household" }))
            }
            className={`
              p-4 rounded-xl border-2 transition-all duration-300
              ${
                formData.accountType === "household"
                  ? "border-green-500 bg-green-50 dark:bg-green-950/30 shadow-lg shadow-green-500/20 scale-105"
                  : "border-slate-300 dark:border-slate-600 hover:border-green-400 hover:scale-102"
              }
            `}
          >
            <User
              size={24}
              className={`mx-auto mb-2 ${
                formData.accountType === "household"
                  ? "text-green-600"
                  : "text-slate-400"
              }`}
            />
            <p
              className={`font-semibold ${
                formData.accountType === "household"
                  ? "text-green-600"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              Household
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, accountType: "business" }))
            }
            className={`
              p-4 rounded-xl border-2 transition-all duration-300
              ${
                formData.accountType === "business"
                  ? "border-green-500 bg-green-50 dark:bg-green-950/30 shadow-lg shadow-green-500/20 scale-105"
                  : "border-slate-300 dark:border-slate-600 hover:border-green-400 hover:scale-102"
              }
            `}
          >
            <Building2
              size={24}
              className={`mx-auto mb-2 ${
                formData.accountType === "business"
                  ? "text-green-600"
                  : "text-slate-400"
              }`}
            />
            <p
              className={`font-semibold ${
                formData.accountType === "business"
                  ? "text-green-600"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              Business
            </p>
          </button>
        </div>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="text"
          name="name"
          label="Full Name"
          placeholder="John Doe"
          icon={User}
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
          disabled={loading}
        />

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
          placeholder="Create a strong password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
          disabled={loading}
        />

        {/* Password Strength Indicator */}
        {showPasswordStrength && (
          <PasswordStrength password={formData.password} />
        )}

        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          success={
            formData.confirmPassword &&
            formData.password === formData.confirmPassword
              ? "Passwords match!"
              : ""
          }
          autoComplete="new-password"
          disabled={loading}
        />

        {/* Terms & Conditions */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (e.target.checked && errors.terms) {
                  setErrors((prev) => ({ ...prev, terms: "" }));
                }
              }}
              className="mt-1 w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all cursor-pointer"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-2 duration-300">
              {errors.terms}
            </p>
          )}
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
              Create Account
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-green-600 hover:text-green-700 dark:hover:text-green-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Pilot Program Badge */}
      <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-xl animate-in fade-in duration-1000 delay-300">
        <p className="text-sm text-green-800 dark:text-green-300 text-center">
          <strong>🎉 Pilot Program:</strong> Free during pilot phase • Limited
          spots in Vancouver, BC
        </p>
      </div>
    </div>
  );
};

export default SignupForm;

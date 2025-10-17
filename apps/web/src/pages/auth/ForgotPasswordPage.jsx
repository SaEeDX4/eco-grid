import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useToast } from "../../hooks/useToast";

const ForgotPasswordPage = () => {
  const { success, error } = useToast();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      // TODO: Call API to send reset email
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setEmailSent(true);
      success("Password reset email sent!");
    } catch (err) {
      error("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-green-950 dark:to-slate-900">
        <div className="w-full max-w-md text-center animate-in fade-in zoom-in duration-700">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-lg shadow-green-500/30 animate-in zoom-in duration-500">
            <CheckCircle className="text-white" size={40} />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Check Your Email
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            We've sent password reset instructions to:
          </p>
          <p className="text-xl font-semibold text-green-600 dark:text-green-400 mb-8">
            {email}
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Click the link in the email to reset your password. If you don't see
            it, check your spam folder.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link to="/auth/login">
              <Button variant="gradient" size="lg" className="w-full">
                Back to Login
              </Button>
            </Link>
            <button
              onClick={() => setEmailSent(false)}
              className="w-full text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              Try another email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-green-950 dark:to-slate-900">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Back Button */}
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400 transition-colors group mb-8"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium">Back to Login</span>
        </Link>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-green-500/30">
              <Mail className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              No worries! Enter your email and we'll send you reset
              instructions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              error={emailError}
              autoComplete="email"
              disabled={loading}
            />

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Send Reset Instructions
            </Button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
              Remember your password?{" "}
              <Link to="/auth/login" className="font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

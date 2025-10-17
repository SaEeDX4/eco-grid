import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import { useToast } from "../../hooks/useToast";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    setResending(true);
    try {
      // TODO: Call API to resend verification email
      await new Promise((resolve) => setTimeout(resolve, 1500));
      success("Verification email sent!");
      setCountdown(60);
    } catch (err) {
      error("Failed to resend email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-green-950 dark:to-slate-900">
      <div className="w-full max-w-md text-center animate-in fade-in zoom-in duration-700">
        {/* Animated Email Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-30 animate-pulse" />
          <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl shadow-green-500/30 animate-in zoom-in duration-500">
            <Mail className="text-white" size={48} />
          </div>
          {/* Animated Checkmark */}
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-500 delay-300">
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Verify Your Email
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          We've sent a verification link to your email address. Click the link
          to activate your account and start saving energy!
        </p>

        {/* Steps */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">
            Next steps:
          </h3>
          <ol className="space-y-3">
            {[
              "Check your email inbox",
              "Click the verification link",
              "Complete your profile setup",
              "Start saving energy!",
            ].map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {index + 1}
                </div>
                <span className="text-slate-700 dark:text-slate-300">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={handleResend}
            variant="outline"
            size="lg"
            className="w-full"
            disabled={countdown > 0 || resending}
            loading={resending}
          >
            {resending
              ? "Sending..."
              : countdown > 0
                ? `Resend Email (${countdown}s)`
                : "Resend Verification Email"}
          </Button>

          <Button
            onClick={() => navigate("/auth/login")}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            Back to Login
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Didn't receive the email? Check your spam folder or{" "}
            <Link to="/contact" className="font-semibold hover:underline">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

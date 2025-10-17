import React, { useState } from "react";
import { Chrome, Box } from "lucide-react";
import Button from "../ui/Button";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

const SSOButtons = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [microsoftLoading, setMicrosoftLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useToast();

  const handleGoogleSSO = async () => {
    setGoogleLoading(true);
    try {
      // Stub endpoint - simulates OAuth flow
      const response = await api.post("/auth/sso/google/stub");

      if (response.data.success) {
        // Store token and update auth context
        localStorage.setItem("token", response.data.token);
        await login(response.data.token);
        success("Signed in with Google successfully!");
      }
    } catch (err) {
      console.error("Google SSO error:", err);
      error("Failed to sign in with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleMicrosoftSSO = async () => {
    setMicrosoftLoading(true);
    try {
      // Stub endpoint - simulates OAuth flow
      const response = await api.post("/auth/sso/microsoft/stub");

      if (response.data.success) {
        // Store token and update auth context
        localStorage.setItem("token", response.data.token);
        await login(response.data.token);
        success("Signed in with Microsoft successfully!");
      }
    } catch (err) {
      console.error("Microsoft SSO error:", err);
      error("Failed to sign in with Microsoft. Please try again.");
    } finally {
      setMicrosoftLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Google SSO */}
      <button
        onClick={handleGoogleSSO}
        disabled={googleLoading || microsoftLoading}
        className={`
          w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl
          bg-white dark:bg-slate-800
          border-2 border-slate-200 dark:border-slate-700
          hover:border-slate-300 dark:hover:border-slate-600
          hover:shadow-lg
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          group
        `}
      >
        {googleLoading ? (
          <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
        ) : (
          <Chrome
            className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            size={20}
          />
        )}
        <span className="font-semibold text-slate-900 dark:text-white">
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </span>
      </button>

      {/* Microsoft SSO */}
      <button
        onClick={handleMicrosoftSSO}
        disabled={googleLoading || microsoftLoading}
        className={`
          w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl
          bg-white dark:bg-slate-800
          border-2 border-slate-200 dark:border-slate-700
          hover:border-slate-300 dark:hover:border-slate-600
          hover:shadow-lg
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          group
        `}
      >
        {microsoftLoading ? (
          <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
        ) : (
          <Box
            className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            size={20}
          />
        )}
        <span className="font-semibold text-slate-900 dark:text-white">
          {microsoftLoading ? "Connecting..." : "Continue with Microsoft"}
        </span>
      </button>

      {/* Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 text-sm text-slate-500 dark:text-slate-500 bg-white dark:bg-slate-900">
            Or continue with email
          </span>
        </div>
      </div>
    </div>
  );
};

export default SSOButtons;

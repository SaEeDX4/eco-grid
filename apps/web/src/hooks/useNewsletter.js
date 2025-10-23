import { useState } from "react";
import api from "../lib/api";

export const useNewsletter = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const subscribe = async (email) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response = await api.post("/newsletter/subscribe", { email });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Newsletter subscribe error:", err);
      setError(err.response?.data?.message || "Failed to subscribe");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (token) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response = await api.post("/newsletter/unsubscribe", { token });

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Newsletter unsubscribe error:", err);
      setError(err.response?.data?.message || "Failed to unsubscribe");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (token) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response = await api.post("/newsletter/verify", { token });

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Newsletter verify error:", err);
      setError(err.response?.data?.message || "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  return {
    subscribe,
    unsubscribe,
    verify,
    loading,
    success,
    error,
  };
};

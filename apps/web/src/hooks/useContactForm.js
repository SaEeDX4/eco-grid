import { useState } from "react";
import api from "../lib/api";

export const useContactForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitForm = async (formData) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await api.post("/contact", {
        fullName: formData.fullName,
        email: formData.email,
        company: formData.company || undefined,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
        captchaAnswer: formData.captchaAnswer,
      });

      if (response.data.success) {
        return {
          success: true,
          referenceId: response.data.referenceId,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to send message",
        };
      }
    } catch (err) {
      console.error("Contact form submission error:", err);

      const message =
        err.response?.data?.message ||
        "Failed to send message. Please try again or email us directly at support@ecogrid.ca";

      setError(message);
      return {
        success: false,
        message,
      };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitForm,
    submitting,
    error,
  };
};

import { useState, useEffect } from "react";
import api from "../lib/api";

export const useFAQs = (initialCategory = null) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(initialCategory);

  const fetchFAQs = async (cat = category, searchQuery = "") => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (cat) {
        params.append("category", cat);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await api.get(`/faq?${params}`);

      if (response.data.success) {
        setFaqs(response.data.faqs);
      }
    } catch (err) {
      console.error("Fetch FAQs error:", err);
      setError(err.response?.data?.message || "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const getFAQById = async (id) => {
    try {
      const response = await api.get(`/faq/${id}`);

      if (response.data.success) {
        return response.data.faq;
      }

      return null;
    } catch (err) {
      console.error("Fetch FAQ error:", err);
      return null;
    }
  };

  const recordFeedback = async (id, helpful) => {
    try {
      const response = await api.post(`/faq/${id}/feedback`, { helpful });

      return response.data.success;
    } catch (err) {
      console.error("Record feedback error:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [category]);

  return {
    faqs,
    loading,
    error,
    category,
    setCategory,
    fetchFAQs,
    getFAQById,
    recordFeedback,
  };
};

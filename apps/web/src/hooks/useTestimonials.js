import { useState, useEffect } from "react";
import api from "../lib/api";

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTestimonials = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        ...filters,
        industries: filters.industries?.join(",") || "",
        categories: filters.categories?.join(",") || "",
        sizes: filters.sizes?.join(",") || "",
      });

      const response = await api.get(`/testimonials?${params}`);

      if (response.data.success) {
        setTestimonials(response.data.testimonials);
      }
    } catch (err) {
      console.error("Fetch testimonials error:", err);
      setError(err.response?.data?.message || "Failed to load testimonials");

      // Use placeholder data on error
      const { placeholderTestimonials } = await import(
        "../lib/testimonialsData"
      );
      setTestimonials(placeholderTestimonials);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    loading,
    error,
    fetchTestimonials,
  };
};

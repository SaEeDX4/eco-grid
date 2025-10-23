import { useState, useEffect } from "react";
import api from "../lib/api";

export const useCaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCaseStudies = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/case-studies?${params}`);

      if (response.data.success) {
        setCaseStudies(response.data.caseStudies);
      }
    } catch (err) {
      console.error("Fetch case studies error:", err);
      setError(err.response?.data?.message || "Failed to load case studies");
    } finally {
      setLoading(false);
    }
  };

  const fetchCaseStudyBySlug = async (slug) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/case-studies/${slug}`);

      if (response.data.success) {
        return response.data.caseStudy;
      }
    } catch (err) {
      console.error("Fetch case study error:", err);
      setError(err.response?.data?.message || "Failed to load case study");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  return {
    caseStudies,
    loading,
    error,
    fetchCaseStudies,
    fetchCaseStudyBySlug,
  };
};

import { useState } from "react";
import api from "../lib/api";

export const useAIWriter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateOutline = async (prompt, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/ai-writer/generate-outline", {
        prompt,
        ...options,
      });

      if (response.data.success) {
        return response.data.outline;
      }
    } catch (err) {
      console.error("Generate outline error:", err);
      setError(err.response?.data?.message || "Failed to generate outline");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateArticle = async (outline) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/ai-writer/generate-article", {
        outline,
      });

      if (response.data.success) {
        return response.data.article;
      }
    } catch (err) {
      console.error("Generate article error:", err);
      setError(err.response?.data?.message || "Failed to generate article");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveArticle = async (article, status = "draft") => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/articles", {
        ...article,
        status,
      });

      if (response.data.success) {
        return response.data.article;
      }
    } catch (err) {
      console.error("Save article error:", err);
      setError(err.response?.data?.message || "Failed to save article");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publishArticle = async (article) => {
    return await saveArticle(article, "published");
  };

  return {
    generateOutline,
    generateArticle,
    saveArticle,
    publishArticle,
    loading,
    error,
  };
};

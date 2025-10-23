import { useState } from "react";
import api from "../lib/api";

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const fetchArticles = async (filters = {}, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page,
        limit: pagination.limit,
        ...filters,
        categories: filters.categories?.join(",") || "",
        tags: filters.tags?.join(",") || "",
      });

      const response = await api.get(`/articles?${params}`);

      if (response.data.success) {
        setArticles(response.data.articles);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Fetch articles error:", err);
      setError(err.response?.data?.message || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  return {
    articles,
    loading,
    error,
    pagination,
    fetchArticles,
  };
};

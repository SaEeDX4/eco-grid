// apps/web/src/hooks/useArticleDetail.js
import { useState, useEffect } from "react";
import api from "../lib/api";

export const useArticleDetail = (slug) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${slug}`);
        if (response.data.success) {
          setArticle(response.data.article);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to fetch article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  return { article, loading, error };
};

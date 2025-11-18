import { useState } from "react";
import api from "../lib/api";

export const useFAQSearch = () => {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  const semanticSearch = async (query) => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      setAnalysis(null);
      return;
    }

    setSearching(true);

    try {
      const response = await api.post("/faq/search", { query, limit: 10 });

      if (response.data.success) {
        setResults(response.data.results);
        setAnalysis(response.data.analysis);
      }
    } catch (error) {
      console.error("Semantic search error:", error);
    } finally {
      // ✅ Fixed broken line here (removed Claude fragment)
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setResults([]);
    setAnalysis(null);
  };

  return {
    searching,
    results,
    analysis,
    semanticSearch,
    clearSearch,
  };
};

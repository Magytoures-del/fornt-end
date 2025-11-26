import { useState, useEffect, useCallback } from "react";

export default function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = useCallback(async (query, filters = {}) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Search API call will be implemented here
      // const results = await searchAPI(query, filters);
      // setSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    error,
    performSearch,
    clearSearch,
  };
}

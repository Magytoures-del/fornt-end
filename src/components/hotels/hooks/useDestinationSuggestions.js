import { useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  MIN_SEARCH_CHARACTERS,
  SEARCH_DEBOUNCE_DELAY,
} from "../constants/hotelSearch";
import { parseSuggestionsResponse } from "../utils/hotelSearchUtils";

export const useDestinationSuggestions = (t, addToast) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState(null);
  const debounceTimerRef = useRef(null);

  const fetchSuggestions = useCallback(
    async (term) => {
      if (!term || term.trim().length < MIN_SEARCH_CHARACTERS) {
        setSuggestions([]);
        setIsSuggestLoading(false);
        setSuggestError(null);
        return;
      }

      setIsSuggestLoading(true);
      setSuggestError(null);

      try {
        const response = await axios.get("/api/hotels/autosuggest", {
          params: { term: term.trim() },
        });

        const suggestionsData = parseSuggestionsResponse(response);

        if (suggestionsData.length > 0) {
          setSuggestions(suggestionsData);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        const message =
          error?.response?.data?.message ||
          error?.message ||
          t("hotels.errors.suggest_failed");
        setSuggestError(message);
        addToast(message, "error");
      } finally {
        setIsSuggestLoading(false);
      }
    },
    [t, addToast]
  );

  const debouncedFetchSuggestions = useCallback(
    (term) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(term);
      }, SEARCH_DEBOUNCE_DELAY);
    },
    [fetchSuggestions]
  );

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setSuggestError(null);
  }, []);

  return {
    suggestions,
    isSuggestLoading,
    suggestError,
    setSuggestError,
    fetchSuggestions: debouncedFetchSuggestions,
    clearSuggestions,
  };
};


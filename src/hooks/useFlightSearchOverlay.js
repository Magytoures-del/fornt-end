/**
 * Custom hook for managing flight search overlay state
 */

import { useState, useEffect } from "react";

const OVERLAY_STORAGE_KEY = "flight_search_overlay";
const PROGRESS_UPDATE_INTERVAL = 450;
const MAX_PROGRESS = 92;
const INITIAL_PROGRESS = 8;
const PROGRESS_INCREMENT = 8;

/**
 * Hook to manage search overlay visibility and progress
 * @param {Array} results - Flight search results
 * @param {boolean} isSearching - Whether search is in progress
 * @param {boolean} isInitialLoad - Whether this is the initial load
 * @returns {Object} Overlay state and progress
 */
export const useFlightSearchOverlay = (results, isSearching, isInitialLoad) => {
  const [searchProgress, setSearchProgress] = useState(0);
  const [shouldShowOverlay, setShouldShowOverlay] = useState(false);

  // Check sessionStorage on mount to see if overlay should be shown
  useEffect(() => {
    const showOverlay = sessionStorage.getItem(OVERLAY_STORAGE_KEY) === "true";
    setShouldShowOverlay(showOverlay);
  }, []);

  // Hide overlay immediately when results are received
  useEffect(() => {
    if (results && results.length > 0) {
      setShouldShowOverlay(false);
      sessionStorage.removeItem(OVERLAY_STORAGE_KEY);
    }
  }, [results]);

  // Also hide when search completes
  useEffect(() => {
    if (!isSearching && !isInitialLoad && results && results.length > 0) {
      setShouldShowOverlay(false);
      sessionStorage.removeItem(OVERLAY_STORAGE_KEY);
    }
  }, [isSearching, isInitialLoad, results]);

  // Animate progress bar
  useEffect(() => {
    if (!shouldShowOverlay) {
      setSearchProgress(0);
      return;
    }

    setSearchProgress(INITIAL_PROGRESS);
    const interval = setInterval(() => {
      setSearchProgress((prev) => {
        const next = prev + Math.random() * PROGRESS_INCREMENT;
        return next >= MAX_PROGRESS ? MAX_PROGRESS : next;
      });
    }, PROGRESS_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [shouldShowOverlay]);

  return {
    searchProgress,
    shouldShowOverlay,
  };
};




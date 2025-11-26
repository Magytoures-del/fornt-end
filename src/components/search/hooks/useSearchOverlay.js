/**
 * Custom hook for managing search overlay state and progress animation
 */

import { useState, useEffect } from "react";
import {
  PROGRESS_ANIMATION,
  OVERLAY_STORAGE_KEY,
} from "../constants/searchFormConstants";

/**
 * Hook to manage search overlay visibility and progress animation
 * @returns {Object} Overlay state and control functions
 */
export const useSearchOverlay = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);

  // Progress animation when overlay is shown
  useEffect(() => {
    if (showOverlay) {
      setSearchProgress(PROGRESS_ANIMATION.INITIAL);
      const interval = setInterval(() => {
        setSearchProgress((prev) => {
          const next = prev + Math.random() * PROGRESS_ANIMATION.INCREMENT_MAX;
          return next >= PROGRESS_ANIMATION.MAX ? PROGRESS_ANIMATION.MAX : next;
        });
      }, PROGRESS_ANIMATION.INTERVAL);
      return () => clearInterval(interval);
    } else {
      setSearchProgress(0);
    }
  }, [showOverlay]);

  /**
   * Shows the overlay and stores state in sessionStorage
   */
  const showOverlayHandler = () => {
    setShowOverlay(true);
    sessionStorage.setItem(OVERLAY_STORAGE_KEY, "true");
  };

  /**
   * Hides the overlay and clears sessionStorage
   */
  const hideOverlayHandler = () => {
    setShowOverlay(false);
    sessionStorage.removeItem(OVERLAY_STORAGE_KEY);
  };

  return {
    showOverlay,
    searchProgress,
    showOverlayHandler,
    hideOverlayHandler,
  };
};


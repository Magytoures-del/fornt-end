import { useState, useEffect, useCallback } from "react";

const SCROLL_THRESHOLD = 400;

/**
 * Custom hook to manage scroll-to-top functionality
 * @returns {Object} - showScrollTop state and scrollToTop function
 */
export const useScrollToTop = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return {
    showScrollTop,
    scrollToTop,
  };
};


















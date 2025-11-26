import { useState, useEffect } from "react";

/**
 * Custom hook to detect mobile screen size
 * @param {number} breakpoint - Breakpoint in pixels (default: 768)
 * @returns {boolean} - True if screen width is less than or equal to breakpoint
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // Check on mount
    checkIsMobile();

    // Add event listener for window resize with debounce
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 100);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [breakpoint]);

  return isMobile;
};



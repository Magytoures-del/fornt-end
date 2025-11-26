"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SCROLL_THRESHOLD, SCROLLED_HEADER_PATHS } from "./Header.constants";

/**
 * Custom hook for header scroll detection and scrolled state
 * @returns {boolean} - Whether header should show scrolled style
 */
export function useHeaderScroll() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if current path should always show scrolled header
  const shouldShowScrolledHeader =
    isScrolled ||
    SCROLLED_HEADER_PATHS.some((path) => {
      if (path === "/") {
        return pathname === "/";
      }
      return pathname === path || pathname.startsWith(path);
    });

  return shouldShowScrolledHeader;
}


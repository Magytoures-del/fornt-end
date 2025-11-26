import { useState, useEffect, useRef, useCallback } from "react";
import { SEARCH_CONSTANTS } from "@/constants/hotelSearch";

/**
 * Custom hook to handle infinite scroll pagination
 */
export const useInfiniteScroll = (allHotels, displayLimit = SEARCH_CONSTANTS.DISPLAY_LIMIT) => {
  const [displayedHotels, setDisplayedHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  const previousAllHotelsLength = useRef(0);

  // Load more hotels from allHotels array
  const loadMoreHotels = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * displayLimit;
      
      const newDisplayedHotels = allHotels.slice(startIndex, endIndex);
      
      setDisplayedHotels(newDisplayedHotels);
      setCurrentPage(nextPage);
      setHasMore(endIndex < allHotels.length);
      setIsLoadingMore(false);
    }, SEARCH_CONSTANTS.LOAD_MORE_DELAY);
  }, [allHotels, currentPage, displayLimit, hasMore, isLoadingMore]);

  // Update displayed hotels when allHotels changes
  useEffect(() => {
    if (allHotels.length > 0) {
      // Only reset to first page if:
      // 1. We have no displayed hotels (initial load)
      // 2. The total number of hotels significantly changed (different search)
      const shouldReset = displayedHotels.length === 0 || 
                          Math.abs(previousAllHotelsLength.current - allHotels.length) > allHotels.length * 0.5;
      
      if (shouldReset) {
        // Initial load or completely new search - show first page
        const firstPage = allHotels.slice(0, displayLimit);
        setDisplayedHotels(firstPage);
        setCurrentPage(1);
        setHasMore(allHotels.length > displayLimit);
      } else {
        // Rate API update - maintain current scroll position
        // Update the existing displayed hotels with new data (e.g., prices)
        const currentEndIndex = currentPage * displayLimit;
        const updatedDisplayedHotels = allHotels.slice(0, currentEndIndex);
        setDisplayedHotels(updatedDisplayedHotels);
        setHasMore(currentEndIndex < allHotels.length);
      }
      
      previousAllHotelsLength.current = allHotels.length;
    }
  }, [allHotels, displayLimit, displayedHotels.length, currentPage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreHotels();
        }
      },
      { threshold: SEARCH_CONSTANTS.INTERSECTION_THRESHOLD }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, loadMoreHotels]);

  // Reset pagination
  const resetPagination = useCallback(() => {
    setDisplayedHotels([]);
    setCurrentPage(1);
    setHasMore(true);
  }, []);

  return {
    displayedHotels,
    setDisplayedHotels,
    hasMore,
    setHasMore,
    isLoadingMore,
    loadMoreHotels,
    observerTarget,
    resetPagination,
  };
};


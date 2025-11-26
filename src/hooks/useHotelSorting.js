import { useState, useEffect, useRef, useCallback } from "react";
import { sortHotels } from "@/utils/hotelSortUtils";
import { SORT_OPTIONS } from "@/constants/hotelSearch";

/**
 * Custom hook to handle hotel sorting logic
 */
export const useHotelSorting = (allHotels, displayLimit) => {
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.RECOMMENDED);
  const previousSortBy = useRef(sortBy);

  // Apply sorting and return sorted hotels
  const applySorting = useCallback(
    (hotels, sortOption) => {
      return sortHotels(hotels, sortOption);
    },
    []
  );

  // Track if sorting changed
  const hasSortingChanged = previousSortBy.current !== sortBy;

  // Update ref after sorting is applied
  useEffect(() => {
    previousSortBy.current = sortBy;
  }, [sortBy]);

  return {
    sortBy,
    setSortBy,
    applySorting,
    hasSortingChanged,
  };
};


/**
 * Constants for hotel search functionality
 */

export const SEARCH_CONSTANTS = {
  DISPLAY_LIMIT: 20,
  FETCH_LIMIT: 1000,
  INITIAL_FETCH_LIMIT: 50,
  MAX_FETCH_LIMIT: 2500,
  MAX_POLLS: 60,
  POLL_INTERVAL: 2000,
  POLL_RETRY_INTERVAL: 3000,
  LOAD_MORE_DELAY: 150,
  INTERSECTION_THRESHOLD: 0.1,
};

export const SORT_OPTIONS = {
  RECOMMENDED: "recommended",
  PRICE_LOW: "price-low",
  PRICE_HIGH: "price-high",
  RATING: "rating",
  REVIEW: "review",
  DISTANCE: "distance",
};

export const SEARCH_STATUS = {
  IN_PROGRESS: "inProgress",
  COMPLETE: "complete",
};

export const DEFAULT_FILTERS = {
  priceRange: [50, 10000], // Set to max to not filter by price by default
  rating: null,
  freebies: [],
  amenities: [],
};


// Search-related type definitions

export const SearchTypes = {
  FLIGHTS: "flights",
  HOTELS: "hotels",
  PLACES: "places",
  ALL: "all",
};

export const SortOptions = {
  RELEVANCE: "relevance",
  PRICE_LOW: "price_low",
  PRICE_HIGH: "price_high",
  RATING: "rating",
  DISTANCE: "distance",
};

export const FilterCategories = {
  PRICE_RANGE: "priceRange",
  RATING: "rating",
  LOCATION: "location",
  DATE: "date",
  CATEGORY: "category",
};

// Search result structure
export const SearchResult = {
  id: "",
  title: "",
  description: "",
  type: "",
  price: 0,
  rating: 0,
  location: "",
  image: "",
  url: "",
};

// Search filter structure
export const SearchFilters = {
  category: "all",
  sortBy: "relevance",
  priceRange: "all",
  rating: 0,
  location: "",
  date: "",
};

// Search suggestion structure
export const SearchSuggestion = {
  id: "",
  text: "",
  type: "",
  category: "",
};

"use client";

import React from "react";
import LocationInput from "./LocationInput";
import { LuPlaneTakeoff } from "react-icons/lu";

export default function SearchSuggestions({ query, onSuggestionSelect }) {
  const handleLocationChange = (location) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(location);
    }
  };

  const handleRemove = () => {
    // Handle removal logic if needed
  };

  return (
    <div className="search-suggestions">
      <LocationInput
        label="From"
        title="Where from?"
        icon={<LuPlaneTakeoff />}
        location={query}
        onChange={handleLocationChange}
        onRemove={handleRemove}
      />
    </div>
  );
}

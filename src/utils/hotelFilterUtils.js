/**
 * Hotel filtering utility functions
 */

/**
 * Filter hotels based on filter criteria
 * @param {Array} hotels - Array of hotel objects
 * @param {Object} filters - Filter object with priceRange, rating, freebies, amenities
 * @param {string} searchQuery - Search query string for hotel name
 * @returns {Array} Filtered array of hotels
 */
export const filterHotels = (hotels, filters, searchQuery = "") => {
  if (!hotels || hotels.length === 0) return hotels;

  let filtered = [...hotels];

  // Filter by search query (hotel name, location, address)
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((hotel) => {
      const name = (hotel.name || "").toLowerCase();
      const address = (hotel.address || "").toLowerCase();
      const locationName = (hotel.locationName || "").toLowerCase();
      const chainName = (hotel.chainName || "").toLowerCase();
      const propertyType = (hotel.propertyType || "").toLowerCase();
      
      return (
        name.includes(query) || 
        address.includes(query) || 
        locationName.includes(query) ||
        chainName.includes(query) ||
        propertyType.includes(query)
      );
    });
  }

  // Filter by price range (only if maxPrice is less than 10000 - meaning user has set a specific filter)
  if (filters?.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
    const [minPrice, maxPrice] = filters.priceRange;
    // Only apply price filtering if maxPrice is less than 10000 (user has set a specific price filter)
    if (maxPrice < 10000) {
      filtered = filtered.filter((hotel) => {
        // Get price from rate object
        const price =
          hotel.rate?.ratePerNight ||
          hotel.rate?.total ||
          hotel.rate?.amount ||
          null;
        
        // If no price (rate is null), exclude the hotel when price filter is active
        if (price === null || price === undefined) {
          return false;
        }
        
        return price >= minPrice && price <= maxPrice;
      });
    }
    // If maxPrice >= 10000, don't filter by price (show all hotels regardless of price)
  }

  // Filter by rating (star rating)
  if (filters?.rating !== null && filters?.rating !== undefined) {
    filtered = filtered.filter((hotel) => {
      const starRating = hotel.starRating || 0;
      return starRating >= filters.rating;
    });
  }

  // Filter by freebies
  if (filters?.freebies && Array.isArray(filters.freebies) && filters.freebies.length > 0) {
    filtered = filtered.filter((hotel) => {
      // Check if hotel has any of the selected freebies
      return filters.freebies.some((freebie) => {
        // Helper function to get facility name (handles both string and object formats)
        const getFacilityName = (facility) => {
          if (typeof facility === 'string') return facility.toLowerCase();
          if (facility && typeof facility === 'object' && facility.name) {
            return facility.name.toLowerCase();
          }
          return '';
        };

        switch (freebie) {
          case "breakfast":
            // Check freeBreakfast flag or facilities
            if (hotel.freeBreakfast === true) return true;
            return hotel.facilities?.some((facility) => {
              const name = getFacilityName(facility);
              return name.includes("breakfast") || name.includes("morning meal");
            });
          
          case "parking":
            // Check facilities for parking
            return hotel.facilities?.some((facility) => {
              const name = getFacilityName(facility);
              return name.includes("parking") || name.includes("garage") || name.includes("valet");
            });
          
          case "internet":
            // Check facilities for internet/wifi
            return hotel.facilities?.some((facility) => {
              const name = getFacilityName(facility);
              return name.includes("wifi") || 
                     name.includes("internet") || 
                     name.includes("wi-fi") ||
                     name.includes("wireless");
            });
          
          case "shuttle":
            // Check facilities for airport shuttle
            return hotel.facilities?.some((facility) => {
              const name = getFacilityName(facility);
              return name.includes("shuttle") || 
                     name.includes("airport") || 
                     name.includes("transfer");
            });
          
          case "cancellation":
            return hotel.freeCancellation === true;
          
          default:
            return false;
        }
      });
    });
  }

  // Filter by amenities
  if (filters?.amenities && Array.isArray(filters.amenities) && filters.amenities.length > 0) {
    filtered = filtered.filter((hotel) => {
      const facilities = hotel.facilities || [];
      
      // Helper function to get facility name (handles both string and object formats)
      const getFacilityName = (facility) => {
        if (typeof facility === 'string') return facility.toLowerCase();
        if (facility && typeof facility === 'object' && facility.name) {
          return facility.name.toLowerCase();
        }
        return '';
      };

      const facilitiesLower = facilities.map(getFacilityName);

      // Check if hotel has all selected amenities
      return filters.amenities.every((amenity) => {
        switch (amenity) {
          case "front_desk":
            return facilitiesLower.some((f) => 
              f.includes("front desk") || 
              f.includes("reception") || 
              f.includes("24") ||
              f.includes("24-hour")
            );
          
          case "air_conditioned":
            return facilitiesLower.some((f) => 
              f.includes("air condition") || 
              f.includes("ac") ||
              f.includes("climate") ||
              f.includes("cooling")
            );
          
          case "fitness":
            return facilitiesLower.some((f) => 
              f.includes("fitness") || 
              f.includes("gym") || 
              f.includes("workout") ||
              f.includes("exercise") ||
              f.includes("health club")
            );
          
          case "pool":
            return facilitiesLower.some((f) => 
              f.includes("pool") || 
              f.includes("swimming") ||
              f.includes("swim")
            );
          
          default:
            return false;
        }
      });
    });
  }

  return filtered;
};

/**
 * Get active filter count
 * @param {Object} filters - Filter object
 * @param {string} searchQuery - Optional search query
 * @returns {number} Number of active filters
 */
export const getActiveFilterCount = (filters, searchQuery = "") => {
  if (!filters) return 0;
  
  let count = 0;
  
  // Check search query
  if (searchQuery && searchQuery.trim()) count++;
  
  // Check if price range is not default
  if (filters.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
    if (filters.priceRange[1] < 10000) count++;
  }
  
  // Check rating
  if (filters.rating !== null && filters.rating !== undefined) count++;
  
  // Check freebies
  if (filters.freebies && filters.freebies.length > 0) count += filters.freebies.length;
  
  // Check amenities
  if (filters.amenities && filters.amenities.length > 0) count += filters.amenities.length;
  
  return count;
};


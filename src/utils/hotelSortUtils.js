/**
 * Hotel sorting utility functions
 */

/**
 * Sort hotels based on selected option
 * @param {Array} hotels - Array of hotel objects
 * @param {string} sortOption - Sort option
 * @returns {Array} Sorted array of hotels
 */
export const sortHotels = (hotels, sortOption) => {
  if (!hotels || hotels.length === 0) return hotels;
  
  const sorted = [...hotels];
  
  switch (sortOption) {
    case "price-low":
      return sorted.sort((a, b) => {
        const priceA = a.rate?.ratePerNight || a.rate?.total || a.rate?.amount || Infinity;
        const priceB = b.rate?.ratePerNight || b.rate?.total || b.rate?.amount || Infinity;
        return priceA - priceB;
      });
    
    case "price-high":
      return sorted.sort((a, b) => {
        const priceA = a.rate?.ratePerNight || a.rate?.total || a.rate?.amount || 0;
        const priceB = b.rate?.ratePerNight || b.rate?.total || b.rate?.amount || 0;
        return priceB - priceA;
      });
    
    case "rating":
      return sorted.sort((a, b) => {
        const ratingA = a.starRating || 0;
        const ratingB = b.starRating || 0;
        if (ratingB !== ratingA) return ratingB - ratingA;
        // If same star rating, sort by user review rating
        const reviewA = a.userReview?.rating || 0;
        const reviewB = b.userReview?.rating || 0;
        return reviewB - reviewA;
      });
    
    case "distance":
      return sorted.sort((a, b) => {
        const distA = a.distance || Infinity;
        const distB = b.distance || Infinity;
        return distA - distB;
      });
    
    case "review":
      return sorted.sort((a, b) => {
        const reviewA = a.userReview?.rating || 0;
        const reviewB = b.userReview?.rating || 0;
        if (reviewB !== reviewA) return reviewB - reviewA;
        // If same review rating, sort by review count
        const countA = a.userReview?.count || 0;
        const countB = b.userReview?.count || 0;
        return countB - countA;
      });
    
    case "recommended":
    default:
      return sorted.sort((a, b) => {
        // Recommended first
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        // Then by relevance score
        const scoreA = a.relevanceScore || 0;
        const scoreB = b.relevanceScore || 0;
        return scoreB - scoreA;
      });
  }
};


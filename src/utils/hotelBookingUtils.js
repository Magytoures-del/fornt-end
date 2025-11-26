/**
 * Hotel Booking Utility Functions
 * Pure functions for data transformation and calculations
 */

/**
 * Extracts hotel data from nested API response
 * Handles various response structures
 */
export const extractHotelData = (responseData) => {
  if (!responseData) return null;

  // Handle nested structure: response.data.success -> response.data.data -> response.data.data.data.hotel
  if (responseData?.success && responseData?.data?.hotel) {
    return responseData.data.hotel;
  }
  if (responseData?.data?.hotel) {
    return responseData.data.hotel;
  }
  if (responseData?.hotel) {
    return responseData.hotel;
  }
  if (responseData?.success && responseData?.data) {
    return responseData.data;
  }
  if (responseData?.data) {
    return responseData.data;
  }
  return responseData;
};

/**
 * Extracts price data from nested API response
 */
export const extractPriceData = (priceData) => {
  if (!priceData) return null;

  let actualData = null;
  let stayPeriod = null;
  let roomGroups = null;

  if (priceData?.success && priceData?.data) {
    actualData = priceData.data;
    stayPeriod = priceData.data.stayPeriod;
    roomGroups = priceData.data.roomGroup;
  } else if (priceData?.data) {
    actualData = priceData.data;
    stayPeriod = priceData.data.stayPeriod;
    roomGroups = priceData.data.roomGroup;
  } else if (priceData?.roomGroup) {
    actualData = priceData;
    stayPeriod = priceData.stayPeriod;
    roomGroups = priceData.roomGroup;
  }

  return { actualData, stayPeriod, roomGroups };
};

/**
 * Calculates number of nights from stay period
 */
export const calculateNights = (stayPeriod) => {
  if (!stayPeriod?.start || !stayPeriod?.end) return 1;

  try {
    const startDate = new Date(stayPeriod.start);
    const endDate = new Date(stayPeriod.end);
    const diffTime = Math.abs(endDate - startDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return nights < 1 ? 1 : nights;
  } catch (e) {
    console.warn("Could not parse stayPeriod dates", e);
    return 1;
  }
};

/**
 * Parses dates from stay period
 * Returns both ISO and formatted dates
 */
export const parseStayDates = (stayPeriod) => {
  if (!stayPeriod?.start || !stayPeriod?.end) {
    return { checkIn: null, checkOut: null };
  }

  try {
    const startDateStr = stayPeriod.start;
    const endDateStr = stayPeriod.end;

    let startDate, endDate;
    if (startDateStr.includes("/")) {
      startDate = new Date(startDateStr);
      endDate = new Date(endDateStr);

      const startParts = startDateStr.split(" ")[0].split("/");
      const endParts = endDateStr.split(" ")[0].split("/");

      const formattedStartDate = `${startParts[2]}-${startParts[0].padStart(2, "0")}-${startParts[1].padStart(2, "0")}`;
      const formattedEndDate = `${endParts[2]}-${endParts[0].padStart(2, "0")}-${endParts[1].padStart(2, "0")}`;

      return {
        checkIn: {
          iso: startDate.toISOString().split("T")[0],
          formatted: formattedStartDate,
        },
        checkOut: {
          iso: endDate.toISOString().split("T")[0],
          formatted: formattedEndDate,
        },
      };
    } else {
      startDate = new Date(startDateStr);
      endDate = new Date(endDateStr);

      return {
        checkIn: {
          iso: startDate.toISOString().split("T")[0],
          formatted: startDate.toISOString().split("T")[0],
        },
        checkOut: {
          iso: endDate.toISOString().split("T")[0],
          formatted: endDate.toISOString().split("T")[0],
        },
      };
    }
  } catch (e) {
    console.warn("Could not parse stayPeriod dates for display", e);
    return { checkIn: null, checkOut: null };
  }
};

/**
 * Calculates price information from room group
 */
export const calculateRoomPricing = (roomGroup, numberOfNights) => {
  let totalPrice = 0;
  let pricePerNight = 0;
  let originalPrice = null;

  // Use totalRate if available
  if (roomGroup.totalRate && roomGroup.totalRate > 0) {
    totalPrice = roomGroup.totalRate;
  } else if (roomGroup.baseRate && roomGroup.baseRate > 0) {
    totalPrice = roomGroup.baseRate;
  }

  // Calculate price per night from daily rates
  if (roomGroup.dailyRates && Array.isArray(roomGroup.dailyRates) && roomGroup.dailyRates.length > 0) {
    const dailyRatesSum = roomGroup.dailyRates.reduce((sum, rate) => sum + (rate.amount || 0), 0);
    const avgDailyRate = dailyRatesSum / roomGroup.dailyRates.length;
    pricePerNight = Math.round(avgDailyRate * 100) / 100;

    if (!totalPrice || totalPrice === 0) {
      totalPrice = dailyRatesSum;
    }
  } else if (roomGroup.ratePerNight && roomGroup.ratePerNight > 0) {
    pricePerNight = Math.round(roomGroup.ratePerNight * 100) / 100;
  } else if (totalPrice > 0 && numberOfNights > 0) {
    pricePerNight = Math.round((totalPrice / numberOfNights) * 100) / 100;
  }

  // Calculate original price (published rate)
  if (roomGroup.publishedRate && roomGroup.publishedRate > totalPrice) {
    originalPrice = Math.round((roomGroup.publishedRate / numberOfNights) * 100) / 100;
  } else if (roomGroup.minSellingRate && roomGroup.minSellingRate > totalPrice) {
    originalPrice = Math.round((roomGroup.minSellingRate / numberOfNights) * 100) / 100;
  }

  return { totalPrice, pricePerNight, originalPrice };
};

/**
 * Extracts hotel location from contact/address data
 */
export const extractHotelLocation = (hotelData, prevLocation) => {
  const address = hotelData.contact?.address || hotelData.address;
  if (!address) return prevLocation;

  return (
    address?.city ||
    address?.line1 ||
    (address?.line1 && address?.city ? `${address.line1}, ${address.city}` : null) ||
    prevLocation
  );
};

/**
 * Extracts hotel image from various sources
 */
export const extractHotelImage = (hotelData, prevImage) => {
  if (hotelData.heroImage) {
    return hotelData.heroImage;
  }

  if (hotelData.images && Array.isArray(hotelData.images) && hotelData.images.length > 0) {
    const primaryImage = hotelData.images.find((img) => img.caption === "Primary image") || hotelData.images[0];
    return primaryImage.url || primaryImage;
  }

  return prevImage;
};

/**
 * Extracts hotel description from descriptions array
 */
export const extractHotelDescription = (hotelData, prevDescription) => {
  if (!hotelData.descriptions || !Array.isArray(hotelData.descriptions)) {
    return prevDescription;
  }

  const headlineDesc = hotelData.descriptions.find((desc) => desc.type === "headline");
  const locationDesc = hotelData.descriptions.find((desc) => desc.type === "location");

  return headlineDesc?.text || locationDesc?.text || hotelData.descriptions[0]?.text || prevDescription;
};

/**
 * Extracts hotel rating from various sources
 */
export const extractHotelRating = (hotelData, prevRating) => {
  let rating = hotelData.starRating || prevRating;

  if (!rating || rating === 0) {
    if (hotelData.reviews && Array.isArray(hotelData.reviews) && hotelData.reviews.length > 0) {
      const reviewRating = hotelData.reviews[0]?.rating;
      if (reviewRating && reviewRating > 0) {
        rating = Math.round(reviewRating);
      }
    }
  }

  return rating;
};

/**
 * Calculates max guests from occupancies
 */
export const calculateMaxGuests = (occupancies) => {
  if (!occupancies || !Array.isArray(occupancies) || occupancies.length === 0) {
    return 2;
  }

  const occupancy = occupancies[0];
  return (occupancy.numOfAdults || 1) + (occupancy.numOfChildren || 0);
};


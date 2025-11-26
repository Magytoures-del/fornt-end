import { useState, useEffect } from "react";
import axios from "axios";
import i18n from "@/config/i18n";

/**
 * Utility function to extract hotel data from nested API response
 * @param {Object} responseData - The API response data
 * @returns {Object|null} - Extracted hotel data or null
 */
const extractHotelData = (responseData) => {
  const paths = [
    () => responseData?.data?.hotel,
    () => responseData?.hotel,
    () => responseData?.data,
    () => responseData,
  ];

  for (const path of paths) {
    try {
      const data = path();
      if (data && (data.name || data.hotelName || data.id)) {
        return data;
      }
    } catch (e) {
      continue;
    }
  }

  return null;
};

/**
 * Custom hook to fetch and manage hotel details
 * @param {string} hotelId - The hotel ID
 * @param {string} searchId - The search ID
 * @returns {Object} - Hotel data, loading state, error, and retry function
 */
export const useHotelDetails = (hotelId, searchId) => {
  const [hotelData, setHotelData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHotelDetails = async () => {
    if (!hotelId || !searchId) {
      setError(i18n.t("hotels.details.messages.missing_ids"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `/api/hotels/details/${searchId}/${hotelId}/content`
      );

      if (response.data.success) {
        const responseData = response.data.data;
        const hotelData = extractHotelData(responseData);

        if (hotelData) {
          setHotelData(hotelData);
        } else {
          setError(i18n.t("hotels.details.messages.invalid_structure"));
        }
      } else {
        setError(response.data.error || i18n.t("hotels.details.messages.fetch_failed"));
      }
    } catch (err) {
      console.error("Error fetching hotel details:", err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          i18n.t("hotels.details.messages.fetch_failed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId, searchId]);

  const retry = () => {
    fetchHotelDetails();
  };

  return {
    hotelData,
    isLoading,
    error,
    retry,
  };
};


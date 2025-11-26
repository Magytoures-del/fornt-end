import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  HOTEL_SEARCH_STORAGE_KEY,
  SEARCH_CONFIG,
} from "../constants/hotelSearch";
import {
  formatDateToMMDDYYYY,
  extractCountryCode,
  buildRoomsArray,
  extractSearchId,
  extractSearchTracingKey,
} from "../utils/hotelSearchUtils";

export const useHotelSearch = (
  selectedLocation,
  checkIn,
  checkOut,
  rooms,
  nationality,
  t,
  addToast
) => {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchProgress, setSearchProgress] = useState(0);

  // Progress animation
  useEffect(() => {
    if (isSearching) {
      setSearchProgress(8);
      const id = setInterval(() => {
        setSearchProgress((p) => {
          const next = p + Math.random() * 8;
          return next >= 92 ? 92 : next; // cap while waiting
        });
      }, 450);
      return () => clearInterval(id);
    } else {
      setSearchProgress(0);
    }
  }, [isSearching]);

  const handleSearch = useCallback(async () => {
    setSearchError(null);

    // Validation
    if (!selectedLocation) {
      const msg = t("hotels.errors.select_destination");
      setSearchError(msg);
      addToast(msg, "error");
      return;
    }

    if (!checkIn || !checkOut) {
      const msg = t("hotels.errors.select_dates");
      setSearchError(msg);
      addToast(msg, "error");
      return;
    }

    // Build search payload
    const payload = {
      geoCode: { ...selectedLocation.coordinates },
      locationId: selectedLocation.id,
      currency: SEARCH_CONFIG.currency,
      culture: SEARCH_CONFIG.culture,
      checkIn: formatDateToMMDDYYYY(checkIn),
      checkOut: formatDateToMMDDYYYY(checkOut),
      rooms: rooms.map((room) => ({
        adults: String(room.adults),
        children: String(room.children),
        childAges: room.childAges.map((age) => String(age)),
      })),
      agentCode: "03793",
      destinationCountryCode: extractCountryCode(
        selectedLocation,
        SEARCH_CONFIG.defaultCountryCode
      ),
      nationality: nationality || SEARCH_CONFIG.defaultNationality,
      countryOfResidence: nationality || SEARCH_CONFIG.defaultNationality,
      channelId: SEARCH_CONFIG.channelId,
      affiliateRegion: SEARCH_CONFIG.affiliateRegion,
      segmentId: SEARCH_CONFIG.segmentId,
      companyId: SEARCH_CONFIG.companyId,
      gstPercentage: SEARCH_CONFIG.gstPercentage,
      tdsPercentage: SEARCH_CONFIG.tdsPercentage,
    };

    console.log("Search payload:", payload);

    try {
      setIsSearching(true);
      const response = await axios.post("/api/hotels/search/init", payload);

      if (response.data.success) {
        console.log("Search initialized successfully:", response.data.data);

        const searchId = extractSearchId(response);
        const searchTracingKey = extractSearchTracingKey(response);
        console.log("searchTracingKey", searchTracingKey);
        if (searchId) {
          const queryParams = new URLSearchParams({ searchId });
          if (searchTracingKey) {
            queryParams.set("searchTracingKey", searchTracingKey);
          }
          router.push(`/hotels/results?${queryParams.toString()}`);
        } else {
          const msg = t("hotels.errors.search_id_missing");
          setSearchError(msg);
          addToast(msg, "error");
        }
      } else {
        const msg = response?.data?.error || t("hotels.errors.search_failed");
        setSearchError(msg);
        addToast(msg, "error");
      }
    } catch (error) {
      console.error("Error initializing search:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        t("hotels.errors.search_exception");
      setSearchError(message);
      addToast(message, "error");
    } finally {
      setIsSearching(false);
    }
  }, [
    selectedLocation,
    checkIn,
    checkOut,
    rooms,
    nationality,
    t,
    addToast,
    router,
  ]);

  return {
    handleSearch,
    isSearching,
    searchError,
    searchProgress,
    setSearchError,
  };
};

import { useState, useCallback, useRef } from "react";
import axios from "axios";
import { SEARCH_CONSTANTS, SEARCH_STATUS } from "@/constants/hotelSearch";
import { sortHotels } from "@/utils/hotelSortUtils";

/**
 * Custom hook to handle hotel search API calls and rate polling
 */
export const useHotelSearch = () => {
  const [allHotels, setAllHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchStatus, setSearchStatus] = useState(SEARCH_STATUS.IN_PROGRESS);
  const [totalResults, setTotalResults] = useState(0);

  const previousResultsRef = useRef(null);
  const allHotelIdsWithRatesRef = useRef(new Set());

  // Fetch prices from Rate API
  const fetchPrices = useCallback(async (searchId) => {
    if (!searchId) return null;
    
    try {
      const rateResponse = await axios.get(
        `/api/hotels/search/result/${searchId}/rate`
      );
      
      if (rateResponse.data.success) {
        const responseData = rateResponse.data.data;
        let rateData = null;
        
        if (responseData?.success && responseData?.data) {
          rateData = responseData.data;
        } else if (responseData?.data) {
          rateData = responseData.data;
        } else {
          rateData = responseData;
        }
        
        return rateData;
      }
      
      return null;
    } catch (err) {
      console.error("Error fetching prices:", err);
      return null;
    }
  }, []);

  // Poll Rate API until searchStatus is complete
  const pollRatesUntilComplete = useCallback(
    async (searchId, onRateUpdate) => {
      let pollCount = 0;
      
      const poll = async () => {
        if (pollCount >= SEARCH_CONSTANTS.MAX_POLLS) {
          console.warn(`⚠️ Max polling attempts reached (${SEARCH_CONSTANTS.MAX_POLLS} polls)`);
          setSearchStatus(SEARCH_STATUS.COMPLETE);
          setIsPriceLoading(false);
          
          if (onRateUpdate) {
            onRateUpdate({ hotels: [] }, true);
          }
          return;
        }
        
        pollCount++;
        console.log(`📡 Rate API Poll #${pollCount}: Fetching latest prices...`);
        const rateData = await fetchPrices(searchId);
        
        if (rateData) {
          const status = rateData.searchStatus || SEARCH_STATUS.COMPLETE;
          const hotelsWithRates = rateData.hotels?.length || 0;
          const isComplete = status === SEARCH_STATUS.COMPLETE;
          
          console.log(`  ├─ Status: ${status}`);
          console.log(`  └─ Hotels with rates: ${hotelsWithRates}`);
          
          setSearchStatus(status);
          
          if (onRateUpdate) {
            if (rateData.hotels && rateData.hotels.length > 0) {
              console.log(`🔔 Calling onRateUpdate with ${rateData.hotels.length} hotels, isComplete=${isComplete}`);
              onRateUpdate(rateData, isComplete);
            } else if (isComplete) {
              console.log(`🔔 Calling onRateUpdate with 0 hotels, isComplete=true (triggering final filter)`);
              onRateUpdate(rateData, true);
            }
          }
          
          if (status === SEARCH_STATUS.IN_PROGRESS) {
            console.log(`⏳ Search still in progress, will poll again in ${SEARCH_CONSTANTS.POLL_INTERVAL / 1000} seconds...`);
            setTimeout(() => poll(), SEARCH_CONSTANTS.POLL_INTERVAL);
          } else {
            console.log("✅ Rate search completed! All prices loaded.");
            setIsPriceLoading(false);
          }
        } else {
          console.warn(`⚠️ Rate fetch failed on poll #${pollCount}, retrying in ${SEARCH_CONSTANTS.POLL_RETRY_INTERVAL / 1000} seconds...`);
          
          if (pollCount < SEARCH_CONSTANTS.MAX_POLLS) {
            setTimeout(() => poll(), SEARCH_CONSTANTS.POLL_RETRY_INTERVAL);
          } else {
            setIsPriceLoading(false);
          }
        }
      };
      
      setIsPriceLoading(true);
      poll();
    },
    [fetchPrices]
  );

  // Merge content data with rate data
  const mergeHotelData = useCallback((contentHotels, rateData) => {
    const contentHotelMap = new Map();
    contentHotels.forEach((hotel) => {
      if (hotel.id) {
        contentHotelMap.set(hotel.id.toString(), hotel);
      }
    });
    
    const hotelsFromRate = [];
    
    if (rateData?.hotels && Array.isArray(rateData.hotels)) {
      rateData.hotels.forEach((rateHotel) => {
        if (rateHotel.id && rateHotel.rate) {
          const hotelIdStr = rateHotel.id.toString();
          const contentHotel = contentHotelMap.get(hotelIdStr);
          
          if (contentHotel) {
            const mergedHotel = {
              ...contentHotel,
              rate: rateHotel.rate,
              isRecommended: rateHotel.isRecommended || false,
              moreRatesExpected: rateHotel.moreRatesExpected || false,
              isRefundable: rateHotel.isRefundable || false,
              freeBreakfast: rateHotel.freeBreakfast || false,
              payAtHotel: rateHotel.payAtHotel || false,
              freeCancellation: rateHotel.freeCancellation || false,
              akbarChoice: rateHotel.akbarChoice || false,
              availableSuppliers: rateHotel.availableSuppliers || [],
              isGSTInvoiceAvailable: rateHotel.isGSTInvoiceAvailable || false,
              isPANRequired: rateHotel.isPANRequired || false,
            };
            hotelsFromRate.push(mergedHotel);
            allHotelIdsWithRatesRef.current.add(hotelIdStr);
          } else {
            console.warn(`⚠️ Hotel ID ${hotelIdStr} in rate but not in content`);
          }
        }
      });
    }
    
    return hotelsFromRate;
  }, []);

  // Fetch search results (content only) - optimized for fast initial display
  const fetchSearchResults = useCallback(
    async (searchId, filterdata, sortBy, displayLimit, onInitialData) => {
      if (!searchId || allHotels.length > 0) {
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Step 1: Get first 50 results and total count
        const initialParams = {
          limit: SEARCH_CONSTANTS.INITIAL_FETCH_LIMIT.toString(),
          offset: "-1",
          filterdata: filterdata,
        };
        const initialQueryString = new URLSearchParams(initialParams).toString();
        
        console.log("Step 1: Fetching first 50 results to get total count...");
        const initialResponse = await axios.get(
          `/api/hotels/search/result/${searchId}/content?${initialQueryString}`
        );
        
        let totalCount = SEARCH_CONSTANTS.INITIAL_FETCH_LIMIT;
        let initialContentData = null;
        
        if (initialResponse.data.success) {
          const responseData = initialResponse.data.data;
          if (responseData?.success && responseData?.data) {
            initialContentData = responseData.data;
          } else if (responseData?.data) {
            initialContentData = responseData.data;
          } else {
            initialContentData = responseData;
          }
          totalCount = initialContentData?.total || SEARCH_CONSTANTS.INITIAL_FETCH_LIMIT;
          setTotalResults(totalCount);
          console.log(`✅ Total results available: ${totalCount}`);
          
          // IMMEDIATELY provide first 50 hotels for display
          if (initialContentData && onInitialData) {
            console.log(`🚀 FAST PATH: Providing first ${initialContentData.hotels?.length || 0} hotels for immediate display`);
            previousResultsRef.current = initialContentData;
            onInitialData(initialContentData);
          }
        }

        // Step 2: Fetch remaining results in background (if needed)
        if (totalCount > SEARCH_CONSTANTS.INITIAL_FETCH_LIMIT) {
          const finalLimit = Math.max(
            totalCount + 100,
            SEARCH_CONSTANTS.MAX_FETCH_LIMIT
          );
          const params = {
            limit: finalLimit.toString(),
            offset: "-1",
            filterdata: filterdata,
          };
          const queryString = new URLSearchParams(params).toString();

          console.log(`Step 2: Fetching remaining ${totalCount - SEARCH_CONSTANTS.INITIAL_FETCH_LIMIT} results in background (using limit: ${finalLimit})...`);
          
          // Fetch in background - don't wait for this to complete
          axios.get(
            `/api/hotels/search/result/${searchId}/content?${queryString}`
          ).then((contentResponse) => {
            // Extract content data
            let contentData = null;
            if (contentResponse.data.success) {
              const responseData = contentResponse.data.data;
              if (responseData?.success && responseData?.data) {
                contentData = responseData.data;
              } else if (responseData?.data) {
                contentData = responseData.data;
              } else {
                contentData = responseData;
              }
            }

            if (contentData) {
              let contentHotels = contentData.hotels || [];
              console.log(`✅ Background fetch complete! Loaded ${contentHotels.length} total hotels from content API`);
              previousResultsRef.current = contentData;
            }
          }).catch((err) => {
            console.error("Error fetching remaining results:", err);
          });
        }

        // Return initial data immediately
        setIsLoading(false);
        return {
          contentData: initialContentData,
          contentHotels: initialContentData?.hotels || [],
        };
        
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to fetch search results"
        );
        setIsLoading(false);
        return null;
      }
    },
    [allHotels.length]
  );

  // Reset search state
  const resetSearch = useCallback(() => {
    setAllHotels([]);
    previousResultsRef.current = null;
    setSearchStatus(SEARCH_STATUS.IN_PROGRESS);
    setTotalResults(0);
    allHotelIdsWithRatesRef.current.clear();
  }, []);

  return {
    allHotels,
    setAllHotels,
    isLoading,
    isPriceLoading,
    error,
    searchStatus,
    totalResults,
    setTotalResults,
    fetchSearchResults,
    pollRatesUntilComplete,
    mergeHotelData,
    resetSearch,
    previousResultsRef,
  };
};


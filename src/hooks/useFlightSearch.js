"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

export function useFlightSearch(params) {
  const {
    origin,
    destination,
    date,
    direct,
    adults,
    children,
    infants,
    cabinClass,
  } = params;

  const [results, setResults] = useState([]); // visible (filtered + paginated)
  const [allFlights, setAllFlights] = useState([]); // master list (deduped by id)
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load vs ongoing updates
  const [isFiltering, setIsFiltering] = useState(false); // Track if filtering is in progress
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [totalFlightsFound, setTotalFlightsFound] = useState(0); // Track total flights found
  const [isSearching, setIsSearching] = useState(false); // Track if search is still ongoing
  const [filters, setFilters] = useState({
    priceRange: "all",
    airlines: [],
    stops: "all",
  });
  const [sortBy, setSortBy] = useState("price_asc"); // Default sort by lowest price
  const [airlineOptions, setAirlineOptions] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const isCancelledRef = useRef(false);
  const recomputeVisibleRef = useRef();
  const hasZeroPriceRef = useRef(false);
  const retryCountRef = useRef(0);
  const [refreshToken, setRefreshToken] = useState(0);
  const retryScheduledRef = useRef(false);

  const mapTripsToFlights = (trips) => {
    if (!Array.isArray(trips)) return [];
    return trips.map((t) => {
      // Support both segmented shape (t.trip[0]) and flat shape (fields on t)
      const seg = (t && Array.isArray(t.trip) && t.trip[0]) || t || {};
      const segments = (t && Array.isArray(t.trip) && t.trip) || [];
      const cabin = (seg.cabin || "").toString().toLowerCase();
      const cabinCode = cabin.startsWith("eco")
        ? "E"
        : cabin.startsWith("bus")
        ? "B"
        : cabin
        ? "F"
        : "E";

      const normalizedIsRoundTrip =
        t.isRoundTrip === true ||
        t.isRoundTrip === 1 ||
        t.isRoundTrip === "1" ||
        t.isRoundTrip === "true" ||
        t.isRoundTrip === "True";

      // For round trip flights, also get return segment information
      const returnSeg =
        normalizedIsRoundTrip && Array.isArray(t.trip) && t.trip.length > 1
          ? t.trip[1]
          : null;

      // Build a rich flight object that preserves all original trip data
      // and adds convenient fields for the UI.
      const base = {
        // Preserve original top-level trip fields
        ...t,
        // Ensure key fields exist with consistent naming/types
        id: seg.id || t.booking_id || t.id,
        booking_id: t.booking_id,
        currency: t.currency || seg.currency || "USD",
        // Prefer actualFare, then price, then any grossFare/seg.price
        grossFare:
          (typeof t.actualFare === "number" ? t.actualFare : undefined) ??
          (typeof t.price === "number" ? t.price : undefined) ??
          (typeof seg.price === "number" ? seg.price : undefined) ??
          (typeof t.grossFare === "number" ? t.grossFare : undefined) ??
          0,
        isRoundTrip: normalizedIsRoundTrip,
        trip: Array.isArray(t.trip) ? t.trip : [],
        // Raw ISO times for stronger uniqueness where available
        departureTimeISO: seg.departureTime || "",
        arrivalTimeISO: seg.arrivalTime || "",
        // Signature across all segments to improve dedupe robustness
        segmentSignature:
          segments
            .map(
              (s) =>
                `${(s.flightNo || "").toString().trim()}@${(
                  s.departureTime || ""
                )
                  .toString()
                  .trim()}@${(s.fromAirport || "").toString().trim()}@${(
                  s.toAirport || ""
                )
                  .toString()
                  .trim()}`
            )
            .join("|") || "",
      };

      return {
        ...base,
        // Derived/normalized fields for display (outbound segment)
        airline: seg.airlineName || seg.airline || base.airline || "",
        price: base.grossFare,
        departure: seg.departureTime
          ? new Date(seg.departureTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        arrival: seg.arrivalTime
          ? new Date(seg.arrivalTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        duration: (seg.duration || "").trim(),
        stops: typeof seg.stops === "number" ? seg.stops : 0,
        flightNumber: (seg.flightNo || "").toString().trim(),
        cabinClass: cabinCode,

        // Return segment information for round trips
        returnFlight: returnSeg
          ? {
              airline: returnSeg.airlineName || returnSeg.airline || "",
              departure: returnSeg.departureTime
                ? new Date(returnSeg.departureTime).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "",
              arrival: returnSeg.arrivalTime
                ? new Date(returnSeg.arrivalTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
              duration: (returnSeg.duration || "").trim(),
              stops: typeof returnSeg.stops === "number" ? returnSeg.stops : 0,
              flightNumber: (returnSeg.flightNo || "").toString().trim(),
              departureDate: returnSeg.departureTime
                ? new Date(returnSeg.departureTime).toLocaleDateString("en-US")
                : "",
              arrivalDate: returnSeg.arrivalTime
                ? new Date(returnSeg.arrivalTime).toLocaleDateString("en-US")
                : "",
              fromCity: returnSeg.fromCity || "",
              toCity: returnSeg.toCity || "",
              fromAirport: returnSeg.fromAirport || "",
              toAirport: returnSeg.toAirport || "",
            }
          : null,

        // Additional outbound segment details
        departureDate: seg.departureTime
          ? new Date(seg.departureTime).toLocaleDateString("en-US")
          : "",
        arrivalDate: seg.arrivalTime
          ? new Date(seg.arrivalTime).toLocaleDateString("en-US")
          : "",
        fromCity: seg.fromCity || "",
        toCity: seg.toCity || "",
        fromAirport: seg.fromAirport || "",
        toAirport: seg.toAirport || "",
      };
    });
  };

  const dedupeById = (flights) => {
    const map = new Map();
    const duplicates = [];

    for (const f of flights) {
      // Create a unique key that combines multiple fields for better uniqueness
      const uniqueKey =
        f.id ||
        [
          f.booking_id || "",
          (f.segmentSignature || "").toString(),
          (f.fromAirport || "").toString().trim(),
          (f.toAirport || "").toString().trim(),
          (f.departureTimeISO || "").toString().trim(),
          (f.arrivalTimeISO || "").toString().trim(),
          (f.cabinClass || "").toString(),
        ].join("|$");
      if (uniqueKey && !map.has(uniqueKey)) {
        map.set(uniqueKey, f);
      } else if (uniqueKey) {
        duplicates.push(uniqueKey);
      }
    }

    let result = Array.from(map.values());

    // Second-stage dedupe: remove repeats where flightNumber + fareClass + price are identical
    try {
      const compositeSeen = new Set();
      const uniqueByFareBundle = [];
      for (const f of result) {
        const flightNumber = (
          f.flightNumber ||
          (f.trip && f.trip[0] && f.trip[0].flightNo) ||
          ""
        )
          .toString()
          .trim();
        const fareClass = (
          f.fareClass ||
          (f.trip && f.trip[0] && f.trip[0].fareClass) ||
          ""
        )
          .toString()
          .trim();
        const priceValue = Number(f.price ?? f.grossFare ?? 0);
        const hasKey = flightNumber && fareClass && priceValue > 0;
        const key = hasKey
          ? `${flightNumber}|${fareClass}|${priceValue}`
          : null;
        if (!key || !compositeSeen.has(key)) {
          if (key) compositeSeen.add(key);
          uniqueByFareBundle.push(f);
        }
      }
      result = uniqueByFareBundle;
    } catch (e) {
      // noop – fallback to previous result if anything goes wrong
    }

    // Log deduplication info for debugging
    if (duplicates.length > 0) {
      console.log(
        `Removed ${duplicates.length} duplicate flights. Total unique flights: ${result.length}`
      );
    }

    return result;
  };

  // Helper function to get combined price for round-trip flights
  const getCombinedPrice = useCallback((flight) => {
    if (!flight) return 0;
    
    // For round-trip flights, always combine outbound and return prices
    if (flight.isRoundTrip) {
      let outboundPrice = 0;
      let returnPrice = 0;
      
      // Method 1: Try to get prices from trip segments array
      if (Array.isArray(flight.trip) && flight.trip.length >= 2) {
        // Check segment 0 (outbound)
        outboundPrice = Number(
          flight.trip[0]?.price ?? 
          flight.trip[0]?.grossFare ?? 
          flight.trip[0]?.actualFare ??
          flight.trip[0]?.fare ??
          0
        );
        
        // Check segment 1 (return)
        returnPrice = Number(
          flight.trip[1]?.price ?? 
          flight.trip[1]?.grossFare ?? 
          flight.trip[1]?.actualFare ??
          flight.trip[1]?.fare ??
          0
        );
      }
      
      // Method 2: Check for separate price fields in original trip data
      // The flight object preserves original data via spread operator (...t)
      if (outboundPrice === 0 || returnPrice === 0) {
        // Check for common field names for separate prices
        outboundPrice = outboundPrice || Number(
          flight.outboundPrice ??
          flight.outboundFare ??
          flight.outboundGrossFare ??
          flight.departurePrice ??
          flight.departureFare ??
          0
        );
        
        returnPrice = returnPrice || Number(
          flight.returnPrice ??
          flight.returnFare ??
          flight.returnGrossFare ??
          flight.inboundPrice ??
          flight.inboundFare ??
          0
        );
      }
      
      // Method 3: If segments don't have prices, check nested trip segment data
      if ((outboundPrice === 0 || returnPrice === 0) && flight.trip && Array.isArray(flight.trip)) {
        // Try accessing nested price fields in segments
        if (flight.trip[0]) {
          const outbound = flight.trip[0];
          outboundPrice = outboundPrice || Number(
            outbound.price ?? 
            outbound.grossFare ?? 
            outbound.actualFare ??
            outbound.fare ??
            (outbound.pricing?.totalFare) ??
            (outbound.pricing?.grossFare) ??
            (outbound.pricing?.baseFare) ??
            0
          );
        }
        
        if (flight.trip[1]) {
          const returnSeg = flight.trip[1];
          returnPrice = returnPrice || Number(
            returnSeg.price ?? 
            returnSeg.grossFare ?? 
            returnSeg.actualFare ??
            returnSeg.fare ??
            (returnSeg.pricing?.totalFare) ??
            (returnSeg.pricing?.grossFare) ??
            (returnSeg.pricing?.baseFare) ??
            0
          );
        }
      }
      
      // If we have both prices, combine them (this is what we want for round trips)
      if (outboundPrice > 0 && returnPrice > 0) {
        return outboundPrice + returnPrice;
      }
      
      // If we have at least one segment price, use it (partial data)
      if (outboundPrice > 0 || returnPrice > 0) {
        return outboundPrice + returnPrice; // Will be > 0 if at least one exists
      }
      
      // Method 4: Fallback to top-level price (should already be combined)
      const topLevelPrice = Number(
        flight.price ?? 
        flight.grossFare ?? 
        flight.actualFare ??
        flight.fare ??
        0
      );
      
      if (topLevelPrice > 0) {
        return topLevelPrice;
      }
      
      return 0;
    }
    
    // For one-way flights, just return the price
    return Number(
      flight.price ?? 
      flight.grossFare ?? 
      flight.actualFare ??
      flight.fare ??
      (Array.isArray(flight.trip) && flight.trip.length > 0 
        ? Number(
            flight.trip[0]?.price ?? 
            flight.trip[0]?.grossFare ?? 
            flight.trip[0]?.actualFare ??
            flight.trip[0]?.fare ??
            (flight.trip[0]?.pricing?.totalFare) ??
            (flight.trip[0]?.pricing?.grossFare) ??
            0
          )
        : 0)
    );
  }, []);

  const applyFilters = useCallback(
    (flights) => {
      let filtered = [...flights];
      if (filters.airlines && filters.airlines.length > 0) {
        const setA = new Set(filters.airlines);
        filtered = filtered.filter((f) => setA.has(f.airline));
      }
      if (filters.priceRange && filters.priceRange !== "all") {
        const [minStr, maxStr] = filters.priceRange.split("-");
        const min = Number(minStr) || 0;
        const max = maxStr ? Number(maxStr) : Infinity;
        filtered = filtered.filter((f) => {
          const combinedPrice = getCombinedPrice(f);
          return combinedPrice >= min && combinedPrice <= max;
        });
      }
      if (filters.stops && filters.stops !== "all") {
        if (filters.stops === "2+") {
          filtered = filtered.filter((f) => (f.stops || 0) >= 2);
        } else {
          const stopsNum = Number(filters.stops);
          filtered = filtered.filter((f) => (f.stops || 0) === stopsNum);
        }
      }
      return filtered;
    },
    [filters, getCombinedPrice]
  );

  const applySorting = useCallback(
    (flights) => {
      const sorted = [...flights];

      switch (sortBy) {
        case "price_asc":
          return sorted.sort((a, b) => {
            const priceA = getCombinedPrice(a);
            const priceB = getCombinedPrice(b);
            return priceA - priceB;
          });
        case "price_desc":
          return sorted.sort((a, b) => {
            const priceA = getCombinedPrice(a);
            const priceB = getCombinedPrice(b);
            return priceB - priceA;
          });
        case "duration_asc":
          return sorted.sort((a, b) => {
            const durationA = parseDuration(a.duration);
            const durationB = parseDuration(b.duration);
            return durationA - durationB;
          });
        case "duration_desc":
          return sorted.sort((a, b) => {
            const durationA = parseDuration(a.duration);
            const durationB = parseDuration(b.duration);
            return durationB - durationA;
          });
        case "departure_asc":
          return sorted.sort((a, b) => {
            const timeA = parseTime(a.departure);
            const timeB = parseTime(b.departure);
            return timeA - timeB;
          });
        case "departure_desc":
          return sorted.sort((a, b) => {
            const timeA = parseTime(a.departure);
            const timeB = parseTime(b.departure);
            return timeB - timeA;
          });
        case "stops_asc":
          return sorted.sort((a, b) => (a.stops || 0) - (b.stops || 0));
        case "stops_desc":
          return sorted.sort((a, b) => (b.stops || 0) - (a.stops || 0));
        default:
          return sorted.sort((a, b) => {
            const priceA = getCombinedPrice(a);
            const priceB = getCombinedPrice(b);
            return priceA - priceB;
          }); // Default to price ascending
      }
    },
    [sortBy, getCombinedPrice]
  );

  // Helper function to parse duration string (e.g., "2h 30m" to minutes)
  const parseDuration = (duration) => {
    if (!duration) return 0;
    const match = duration.match(/(\d+)h\s*(\d+)?m?/);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return hours * 60 + minutes;
    }
    return 0;
  };

  // Helper function to parse time string (e.g., "10:30 AM" to minutes since midnight)
  const parseTime = (time) => {
    if (!time) return 0;
    const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const isPM = match[3].toUpperCase() === "PM";

      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;

      return hours * 60 + minutes;
    }
    return 0;
  };

  const recomputeVisible = useCallback(
    (
      nextAllFlights,
      nextPage = page,
      nextPageSize = pageSize,
      isFilterOperation = false
    ) => {
      if (isFilterOperation) {
        setIsFiltering(true);
      }

      // Use setTimeout to allow the UI to update the loading state
      setTimeout(() => {
        const deduped = dedupeById(nextAllFlights);
        // Remove flights with zero or invalid price from visibility (using combined price for round trips)
        const nonZeroPriced = deduped.filter(
          (f) => getCombinedPrice(f) > 0
        );
        const filtered = applyFilters(nonZeroPriced);
        const sorted = applySorting(filtered);
        const start = 0;
        const end = nextPage * nextPageSize;
        setResults(sorted.slice(start, end));

        // Update total flights count
        setTotalFlightsFound(nonZeroPriced.length);

        const airlineSet = new Set(
          nonZeroPriced.map((f) => f.airline).filter(Boolean)
        );
        setAirlineOptions(Array.from(airlineSet));

        // Detect zero-price presence in the current dataset (using combined price for round trips)
        try {
          hasZeroPriceRef.current = deduped.some(
            (f) => getCombinedPrice(f) === 0
          );
        } catch (e) {
          hasZeroPriceRef.current = false;
        }

        // If zero-priced items exist, trigger a one-time full re-fetch immediately
        // Only do this for data updates (not filter-only recomputes)
        if (
          hasZeroPriceRef.current &&
          !isFilterOperation &&
          retryCountRef.current < 1 &&
          !retryScheduledRef.current
        ) {
          retryScheduledRef.current = true;
          retryCountRef.current += 1;
          // Stop any ongoing polling and trigger a fresh fetch cycle
          isCancelledRef.current = true;
          setTimeout(() => {
            setRefreshToken((x) => x + 1);
            retryScheduledRef.current = false;
          }, 0);
        }

        if (isFilterOperation) {
          setIsFiltering(false);
        }
      }, 0);
    },
    [page, pageSize, applyFilters, applySorting, getCombinedPrice]
  );

  // Store the latest recomputeVisible function in ref
  recomputeVisibleRef.current = recomputeVisible;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const pollForCompletion = useCallback(async (id) => {
    const maxAttempts = 30; // ~60s with 2s interval
    const intervalMs = 2000;
    for (
      let attempt = 0;
      attempt < maxAttempts && !isCancelledRef.current;
      attempt++
    ) {
      try {
        const res = await axios.post(`/api/flights/results`, {
          search_id: id,
        });
        const trips = res && res.data && res.data.data && res.data.data.trips;
        const flights = trips ? mapTripsToFlights(trips) : [];

        if (flights.length) {
          setAllFlights((prev) => {
            const merged = [...prev, ...flights];
            const deduped = dedupeById(merged);
            if (recomputeVisibleRef.current) {
              recomputeVisibleRef.current(deduped);
            }
            return deduped;
          });
        }

        const isComplete = res && res.data && res.data.complete_data === "True";
        if (isComplete) {
          // Immediately stop polling when complete_data is 'True'
          console.log("Polling completed - complete_data: 'True' received");
          setIsSearching(false);
          // If zero-priced results remain, trigger a one-time retry
          if (hasZeroPriceRef.current && retryCountRef.current < 1) {
            retryCountRef.current += 1;
            isCancelledRef.current = true;
            setTimeout(() => setRefreshToken((x) => x + 1), 0);
          }
          return true;
        }
      } catch (e) {
        console.error("Polling error:", e);
      }

      // Only sleep if we haven't found completion yet
      if (!isCancelledRef.current) {
        await sleep(intervalMs);
      }
    }
    setIsSearching(false);
    return false;
  }, []);

  useEffect(() => {
    isCancelledRef.current = false;

    const fetchResults = async () => {
      try {
        console.log("🚀 API call - Initial search started", {
          origin,
          destination,
          date,
        });
        setIsLoading(true);
        setIsInitialLoad(true);
        setIsSearching(true);
        setTotalFlightsFound(0);
        // Reset zero-price detection at the beginning of a fresh fetch
        hasZeroPriceRef.current = false;
        retryScheduledRef.current = false;

        // Parse date parameter - handle both single date and date range (startDate_endDate)
        let startDate, endDate, isRoundTrip;
        if (date.includes("_")) {
          // Date range format: startDate_endDate
          const [start, end] = date.split("_");
          startDate = new Date(start).toISOString().split("T")[0];
          endDate = new Date(end).toISOString().split("T")[0];
          isRoundTrip = true;
        } else {
          // Single date format
          startDate = new Date(date).toISOString().split("T")[0];
          endDate = "";
          isRoundTrip = false;
        }

        console.log(direct);
        console.log(
          "Parsed dates - Start:",
          startDate,
          "End:",
          endDate,
          "Round Trip:",
          isRoundTrip
        );

        const response = await axios.post("/api/flights/search", {
          adults: parseInt(adults),
          children: parseInt(children),
          infants: parseInt(infants),
          cabinClass,
          origin,
          destination,
          outboundDate: startDate,
          inboundDate: endDate,
          isDirect: direct,
        });

        if (!response.data || !response.data.success) {
          throw new Error(response.data?.error || "Failed to fetch results");
        }

        const id = response.data.data && response.data.data.search_id;
        setSearchId(id);

        // Get initial results immediately
        const initial = await axios.post(`/api/flights/results`, {
          search_id: id,
        });

        const initialTrips =
          initial &&
          initial.data &&
          initial.data.data &&
          initial.data.data.trips;
        const initialFlights = initialTrips
          ? mapTripsToFlights(initialTrips)
          : [];

        const dedupedInitialFlights = dedupeById(initialFlights);
        setAllFlights(dedupedInitialFlights);
        if (recomputeVisibleRef.current) {
          recomputeVisibleRef.current(dedupedInitialFlights, 1, pageSize);
        }

        // Stop initial loading and show results immediately
        setIsLoading(false);
        setIsInitialLoad(false);

        const initialComplete =
          initial && initial.data && initial.data.complete_data === "True";
        if (initialComplete) {
          // Immediately stop searching if initial data is complete
          console.log(
            "Initial search completed - complete_data: 'True' received"
          );
          setIsSearching(false);
          // If zero-priced results remain, trigger a one-time retry
          if (hasZeroPriceRef.current && retryCountRef.current < 1) {
            retryCountRef.current += 1;
            setTimeout(() => setRefreshToken((x) => x + 1), 0);
            return;
          }
          return;
        }

        // Continue polling in background for more results
        pollForCompletion(id);
      } catch (err) {
        setError("Failed to fetch flight results");
        console.error("Error fetching results:", err);
        setIsLoading(false);
        setIsInitialLoad(false);
        setIsSearching(false);
      }
    };

    fetchResults();

    return () => {
      isCancelledRef.current = true;
    };
  }, [
    origin,
    destination,
    date,
    direct,
    adults,
    children,
    infants,
    cabinClass,
    pageSize,
    pollForCompletion,
    refreshToken,
  ]);

  useEffect(() => {
    // Recompute visible results when data, filters, sort, or pagination changes
    if (allFlights.length > 0) {
      // Check if this is a filter/sort change (not initial data load)
      const isFilterChange = filters || sortBy || page > 1;
      recomputeVisible(allFlights, page, pageSize, isFilterChange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFlights, filters, sortBy, page, pageSize]);

  const handleFilterChange = (f) => {
    console.log("🔍 Filter change - no API call, local filtering only", f);
    setPage(1);
    setFilters((prev) => ({ ...prev, ...f }));
  };

  const handleSortChange = (newSortBy) => {
    console.log("🔄 Sort change - no API call, local sorting only", newSortBy);
    setPage(1);
    setSortBy(newSortBy);
  };

  const handleLoadMore = () => {
    console.log("📄 Load more - no API call, local pagination only");
    setPage((p) => p + 1);
  };

  const canLoadMore = useMemo(() => {
    const deduped = dedupeById(allFlights);
    // Filter out zero-priced flights (using combined price for round trips)
    const nonZeroPriced = deduped.filter((f) => getCombinedPrice(f) > 0);
    const filtered = applyFilters(nonZeroPriced);
    return filtered.length > results.length;
  }, [allFlights, results, applyFilters, getCombinedPrice]);

  return {
    results,
    isLoading,
    isInitialLoad,
    isSearching,
    isFiltering,
    error,
    filters,
    sortBy,
    airlineOptions,
    currency: (allFlights[0] && allFlights[0].currency) || "USD",
    totalFlightsFound,
    onFilterChange: handleFilterChange,
    onSortChange: handleSortChange,
    onLoadMore: handleLoadMore,
    canLoadMore,
  };
}

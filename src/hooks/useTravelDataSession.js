/**
 * Custom hook for managing travel data in session storage
 * Provides reactive state management with session storage persistence
 */

import { useState, useEffect, useCallback } from "react";
import {
  travelDataStorage,
  bookingDataStorage,
  passengerDataStorage,
  pricingDataStorage,
  flightDetailsStorage,
  searchParamsStorage,
  clearAllTravelData,
  getAllTravelData,
} from "@/utils/sessionStorage";

/**
 * Custom hook for travel data session management
 * @returns {Object} Travel data state and management functions
 */
export const useTravelDataSession = () => {
  // State for all travel data
  const [travelData, setTravelData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [passengerData, setPassengerData] = useState(null);
  const [pricingData, setPricingData] = useState(null);
  const [flightDetails, setFlightDetails] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from session storage on mount
  useEffect(() => {
    const loadSessionData = () => {
      try {
        setTravelData(travelDataStorage.get());
        setBookingData(bookingDataStorage.get());
        setPassengerData(passengerDataStorage.get());
        setPricingData(pricingDataStorage.get());
        setFlightDetails(flightDetailsStorage.get());
        setSearchParams(searchParamsStorage.get());
      } catch (error) {
        console.error("Failed to load session data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, []);

  // Travel data management
  const updateTravelData = useCallback((data) => {
    if (travelDataStorage.set(data)) {
      setTravelData(data);
      return true;
    }
    return false;
  }, []);

  const mergeTravelData = useCallback((updates) => {
    const currentData = travelDataStorage.get() || {};
    const mergedData = { ...currentData, ...updates };
    if (travelDataStorage.set(mergedData)) {
      setTravelData(mergedData);
      return true;
    }
    return false;
  }, []);

  // Booking data management
  const updateBookingData = useCallback((data) => {
    if (bookingDataStorage.set(data)) {
      setBookingData(data);
      return true;
    }
    return false;
  }, []);

  // Passenger data management
  const updatePassengerData = useCallback((data) => {
    if (passengerDataStorage.set(data)) {
      setPassengerData(data);
      return true;
    }
    return false;
  }, []);

  // Pricing data management
  const updatePricingData = useCallback((data) => {
    if (pricingDataStorage.set(data)) {
      setPricingData(data);
      return true;
    }
    return false;
  }, []);

  // Flight details management
  const updateFlightDetails = useCallback((data) => {
    if (flightDetailsStorage.set(data)) {
      setFlightDetails(data);
      return true;
    }
    return false;
  }, []);

  // Search parameters management
  const updateSearchParams = useCallback((data) => {
    if (searchParamsStorage.set(data)) {
      setSearchParams(data);
      return true;
    }
    return false;
  }, []);

  // Clear specific data
  const clearTravelData = useCallback(() => {
    travelDataStorage.clear();
    setTravelData(null);
  }, []);

  const clearBookingData = useCallback(() => {
    bookingDataStorage.clear();
    setBookingData(null);
  }, []);

  const clearPassengerData = useCallback(() => {
    passengerDataStorage.clear();
    setPassengerData(null);
  }, []);

  const clearPricingData = useCallback(() => {
    pricingDataStorage.clear();
    setPricingData(null);
  }, []);

  const clearFlightDetails = useCallback(() => {
    flightDetailsStorage.clear();
    setFlightDetails(null);
  }, []);

  const clearSearchParams = useCallback(() => {
    searchParamsStorage.clear();
    setSearchParams(null);
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    clearAllTravelData();
    setTravelData(null);
    setBookingData(null);
    setPassengerData(null);
    setPricingData(null);
    setFlightDetails(null);
    setSearchParams(null);
  }, []);

  // Bulk operations
  const saveCompleteBookingFlow = useCallback(
    (data) => {
      const {
        travelData: travel,
        bookingData: booking,
        passengerData: passenger,
        pricingData: pricing,
        flightDetails: flight,
        searchParams: search,
      } = data;

      const results = {
        travelData: travel ? updateTravelData(travel) : true,
        bookingData: booking ? updateBookingData(booking) : true,
        passengerData: passenger ? updatePassengerData(passenger) : true,
        pricingData: pricing ? updatePricingData(pricing) : true,
        flightDetails: flight ? updateFlightDetails(flight) : true,
        searchParams: search ? updateSearchParams(search) : true,
      };

      return Object.values(results).every((result) => result === true);
    },
    [
      updateTravelData,
      updateBookingData,
      updatePassengerData,
      updatePricingData,
      updateFlightDetails,
      updateSearchParams,
    ]
  );

  // Get all data
  const getAllData = useCallback(() => {
    return {
      travelData,
      bookingData,
      passengerData,
      pricingData,
      flightDetails,
      searchParams,
    };
  }, [
    travelData,
    bookingData,
    passengerData,
    pricingData,
    flightDetails,
    searchParams,
  ]);

  // Validation helpers
  const hasValidTravelData = useCallback(() => {
    return travelDataStorage.isValid();
  }, []);

  const hasAnyData = useCallback(() => {
    return !!(
      travelData ||
      bookingData ||
      passengerData ||
      pricingData ||
      flightDetails ||
      searchParams
    );
  }, [
    travelData,
    bookingData,
    passengerData,
    pricingData,
    flightDetails,
    searchParams,
  ]);

  // Data preparation for payment step
  const preparePaymentData = useCallback(() => {
    return {
      booking: bookingData,
      passengers: passengerData,
      pricing: pricingData,
      flight: flightDetails,
      search: searchParams,
      travel: travelData,
    };
  }, [
    bookingData,
    passengerData,
    pricingData,
    flightDetails,
    searchParams,
    travelData,
  ]);

  return {
    // State
    travelData,
    bookingData,
    passengerData,
    pricingData,
    flightDetails,
    searchParams,
    isLoading,

    // Update functions
    updateTravelData,
    mergeTravelData,
    updateBookingData,
    updatePassengerData,
    updatePricingData,
    updateFlightDetails,
    updateSearchParams,

    // Clear functions
    clearTravelData,
    clearBookingData,
    clearPassengerData,
    clearPricingData,
    clearFlightDetails,
    clearSearchParams,
    clearAllData,

    // Bulk operations
    saveCompleteBookingFlow,
    getAllData,

    // Validation
    hasValidTravelData,
    hasAnyData,

    // Payment preparation
    preparePaymentData,
  };
};

/**
 * Hook specifically for payment step data management
 */
export const usePaymentDataSession = () => {
  const {
    bookingData,
    passengerData,
    pricingData,
    flightDetails,
    updateBookingData,
    clearAllData,
    preparePaymentData,
  } = useTravelDataSession();

  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const data = preparePaymentData();
    setPaymentData(data);
  }, [preparePaymentData]);

  const savePaymentResponse = useCallback(
    (response) => {
      const paymentInfo = {
        ...bookingData,
        paymentResponse: response,
        paymentStatus: "completed",
        paymentTimestamp: Date.now(),
      };
      return updateBookingData(paymentInfo);
    },
    [bookingData, updateBookingData]
  );

  const completeBooking = useCallback(() => {
    // Clear session data after successful booking completion
    clearAllData();
  }, [clearAllData]);

  return {
    paymentData,
    bookingData,
    passengerData,
    pricingData,
    flightDetails,
    savePaymentResponse,
    completeBooking,
  };
};

export default useTravelDataSession;


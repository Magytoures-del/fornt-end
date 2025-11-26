"use client";

import { useMemo } from "react";
import useFlightPriceCheck from "./useFlightPriceCheck";
import {
  extractPricingData,
  getSSRBaggageData,
} from "@/domain/flights/transform";

/**
 * Custom hook for managing flight pricing data
 * Combines price checking with data extraction and transformation
 */
export const useFlightPricing = (pricingId) => {
  const {
    results: priceResults,
    loading: priceLoading,
    error: priceError,
    refetch: priceRefetch,
  } = useFlightPriceCheck(pricingId);

  // Extract and memoize pricing data
  const pricingData = useMemo(() => {
    try {
      return extractPricingData(priceResults);
    } catch (err) {
      console.error("Error extracting pricing data:", err);
      return {
        baseFare: 0,
        taxes: 0,
        fees: 0,
        total: 0,
        currency: "SAR",
        baggage: "Not specified",
        seatSelection: "Standard",
        meal: "Not included",
        netAmount: 0,
        grossAmount: 0,
        discounts: 0,
        transactionFee: 0,
        vatOnTransactionFee: 0,
      };
    }
  }, [priceResults]);

  // Extract and memoize baggage data
  const baggageData = useMemo(() => {
    try {
      return getSSRBaggageData(priceResults, priceLoading);
    } catch (err) {
      console.error("Error extracting baggage data:", err);
      return {
        checkedBaggage: "23kg",
        cabinBaggage: "7kg",
        isLoading: false,
      };
    }
  }, [priceResults, priceLoading]);

  return {
    priceResults,
    pricingData,
    baggageData,
    isLoading: priceLoading,
    error: priceError,
    refetch: priceRefetch,
  };
};

export default useFlightPricing;


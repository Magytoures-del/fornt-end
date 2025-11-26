"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const useFlightPriceCheck = (PricingId) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkPrice = useCallback(async (PricingId) => {
    if (!PricingId) {
      setError("Pricing ID is required");
      return;
    }

    setLoading(true);
    setError(null);
    setPriceData(null);

    try {
      const response = await axios.post(
        "http://localhost:3300/api/flights/check_price",
        {
          bookingID: PricingId,
        }
      );

      console.log("Price check response:", response.data);

      // Store the API response
      return response.data;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to check flight price";

      setError(errorMsg);
      console.error("Price check error:", err);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const checkPrice = async (PricingId) => {
      if (!PricingId) {
        setError("Pricing ID is required");
        return;
      }

      setLoading(true);
      setError(null);
      setPriceData(null);

      try {
        const response = await axios.post(
          "https://apib2c.flymoonsa.com/api/flights/check_price",
          {
            bookingID: PricingId,
          }
        );

        console.log("Price check response:", response.data);

        // Store the API response
        setPriceData(response.data);
      } catch (err) {
        const errorMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to check flight price";

        setError(errorMsg);
        console.error("Price check error:", err);

        throw err;
      } finally {
        setLoading(false);
      }
    };

    checkPrice(PricingId);
  }, [PricingId, checkPrice]);
  const reset = useCallback(() => {
    setPriceData(null);
    setError(null);
    setLoading(false);
  }, []);
  console.log(priceData);
  return {
    results: priceData,
    loading,
    error,
    refetch: checkPrice,
    reset,
  };
};

export default useFlightPriceCheck;

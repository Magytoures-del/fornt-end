"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const useTravelCheckList = (bookingID) => {
  const [checkListData, setCheckListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTravelCheckList = useCallback(async (bookingID) => {
    if (!bookingID) {
      setError("Booking ID is required");
      return;
    }

    setLoading(true);
    setError(null);
    setCheckListData(null);

    try {
      const response = await axios.post(
        "https://apib2c.flymoonsa.com/api/flights/get-travel-checklist",
        {
          bookingID: bookingID,
        }
      );

      console.log("Travel checklist response:", response.data);

      // Extract the actual data from the nested response structure

      setCheckListData(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch travel checklist";

      setError(errorMsg);
      console.error("Travel checklist error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch travel checklist when bookingID is provided
  useEffect(() => {
    if (bookingID) {
      fetchTravelCheckList(bookingID);
    }
  }, [bookingID, fetchTravelCheckList]);

  const reset = useCallback(() => {
    setCheckListData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    results: checkListData,
    loading,
    error,
    fetchTravelCheckList,
    reset,
  };
};

export default useTravelCheckList;

"use client";
import { useState, useEffect } from "react";

const useFlightCheckList = ({ bookingID }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckList = async () => {
      if (!bookingID) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // API call to get travel checklist
        const response = await fetch(
          `http://localhost:3300/api/flights/get-travel-checklist`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ bookingID }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching flight checklist:", err);
        setError(err.message);

        // Fallback to mock data if API fails
        setResults({
          travellerRequirements: {
            nationality: { required: true },
            dateOfBirth: { required: true },
            passportNumber: { required: true },
            passportExpiry: { required: true },
            passportIssue: { required: true },
            passportIssueDate: { required: true },
            country: { required: true },
            panNumber: { required: false },
            emigrationCheck: { required: false },
          },
          specialServiceRequirements: {
            mealPreference: { required: true },
            seatSelection: { required: true },
            baggageAllowance: { required: true },
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCheckList();
  }, [bookingID]);

  return {
    results,
    loading,
    error,
  };
};

export default useFlightCheckList;

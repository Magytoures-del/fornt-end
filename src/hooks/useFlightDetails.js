"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
const mockResults = [
  {
    id: "FL001",
    status: "Confirmed",
    airlineName: "Emirates Airlines",
    flightNo: "EK123",
    origin: "Dubai (DXB)",
    destination: "London (LHR)",
    departureTime: "2024-01-15T10:30:00Z",
    arrivalTime: "2024-01-15T15:45:00Z",
    duration: "7h 15m",
    trip: [
      {
        origin: "Dubai (DXB)",
        destination: "London (LHR)",
        departureTime: "2024-01-15T10:30:00Z",
        arrivalTime: "2024-01-15T15:45:00Z",
        flightNo: "EK123",
        airlineName: "Emirates Airlines",
      },
    ],
  },
  {
    id: "FL002",
    status: "Pending",
    airlineName: "Qatar Airways",
    flightNo: "QR456",
    origin: "Doha (DOH)",
    destination: "Paris (CDG)",
    departureTime: "2024-01-16T08:15:00Z",
    arrivalTime: "2024-01-16T13:30:00Z",
    duration: "7h 15m",
    trip: [
      {
        origin: "Doha (DOH)",
        destination: "Istanbul (IST)",
        departureTime: "2024-01-16T08:15:00Z",
        arrivalTime: "2024-01-16T11:45:00Z",
        flightNo: "QR456",
        airlineName: "Qatar Airways",
      },
      {
        origin: "Istanbul (IST)",
        destination: "Paris (CDG)",
        departureTime: "2024-01-16T13:00:00Z",
        arrivalTime: "2024-01-16T13:30:00Z",
        flightNo: "QR789",
        airlineName: "Qatar Airways",
      },
    ],
  },
];
// Next.js app router passes params to the page. For hooks, accept bookId as arg.
const useFlightDetails = (bookId, tripType) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFlightVerification = useCallback(async () => {
    if (!bookId || !tripType) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://apib2c.flymoonsa.com/api/flights/check_flights",
        {
          booking_id: bookId,
          trip_type: tripType,
        }
      );
      console.log(response.data);
      // Store raw API response so consumers can parse required fields
      setResults(response.data || []);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "An unexpected error occurred.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [bookId, tripType]);

  useEffect(() => {
    fetchFlightVerification();
  }, [fetchFlightVerification]);

  return { results, loading, error, refetch: fetchFlightVerification };
};

export default useFlightDetails;

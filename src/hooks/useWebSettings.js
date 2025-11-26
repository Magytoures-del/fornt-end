"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export function useWebSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          "https://apib2c.flymoonsa.com/api/flights/utils/web-settings"
        );

        if (response.data) {
          // Save the web-settings data in session storage
          sessionStorage.setItem("webSettings", JSON.stringify(response.data));
          console.log("Web settings saved to session storage:", response.data);
        } else {
          throw new Error("No data received from web-settings API");
        }
      } catch (err) {
        console.error("Error fetching web-settings:", err);
        setError(err.message || "Failed to fetch web-settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebSettings();
  }, []);

  return {
    isLoading,
    error,
  };
}

import { useState, useEffect, useRef } from "react";

/**
 * Custom hook for session timer
 * @param {number} maxDuration - Maximum duration in minutes (default: 20)
 * @param {Function} onTimeout - Callback when timer expires
 * @returns {Object} - { timeRemaining, isExpired, resetTimer }
 */
export const useSessionTimer = (maxDuration = 20, onTimeout) => {
  const [timeRemaining, setTimeRemaining] = useState(maxDuration * 60); // Convert to seconds
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    // Reset timer on page load - always start fresh
    startTimeRef.current = Date.now();
    setTimeRemaining(maxDuration * 60);
    setIsExpired(false);

    // Set up interval to update timer every second
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, maxDuration * 60 - elapsed);

      if (remaining <= 0) {
        setIsExpired(true);
        setTimeRemaining(0);
        clearInterval(intervalRef.current);
        if (onTimeout) onTimeout();
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [maxDuration, onTimeout]);

  const resetTimer = () => {
    startTimeRef.current = Date.now();
    setTimeRemaining(maxDuration * 60);
    setIsExpired(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, maxDuration * 60 - elapsed);

      if (remaining <= 0) {
        setIsExpired(true);
        setTimeRemaining(0);
        clearInterval(intervalRef.current);
        if (onTimeout) onTimeout();
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);
  };

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    timeRemaining,
    isExpired,
    resetTimer,
    clearTimer,
    formattedTime: formatTime(timeRemaining),
  };
};


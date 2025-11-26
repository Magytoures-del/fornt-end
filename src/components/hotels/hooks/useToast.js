import { useState, useCallback } from "react";
import { TOAST_DURATION } from "../constants/hotelSearch";

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "error", durationMs = TOAST_DURATION) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  }, []);

  return { toasts, addToast };
};


import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "favoriteHotels";

/**
 * Get favorites from localStorage safely
 * @returns {Array} - Array of favorite hotel IDs
 */
const getFavorites = () => {
  try {
    if (typeof window === "undefined") return [];
    const favorites = localStorage.getItem(STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error);
    return [];
  }
};

/**
 * Save favorites to localStorage safely
 * @param {Array} favorites - Array of favorite hotel IDs
 */
const saveFavorites = (favorites) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
  }
};

/**
 * Custom hook to manage hotel favorites
 * @param {string} hotelId - The hotel ID to check/toggle
 * @returns {Object} - isFavorite state and toggle function
 */
export const useFavorites = (hotelId) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (hotelId) {
      const favorites = getFavorites();
      setIsFavorite(favorites.includes(hotelId));
    }
  }, [hotelId]);

  const toggleFavorite = useCallback(() => {
    if (!hotelId) return;

    const favorites = getFavorites();
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((id) => id !== hotelId);
    } else {
      newFavorites = [...favorites, hotelId];
    }

    saveFavorites(newFavorites);
    setIsFavorite(!isFavorite);
  }, [hotelId, isFavorite]);

  return {
    isFavorite,
    toggleFavorite,
  };
};


















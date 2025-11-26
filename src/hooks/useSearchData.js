import { useState, useEffect } from "react";

/**
 * Custom hook to manage search data from localStorage
 */
export const useSearchData = () => {
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("flymoon_hotel_search_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setSearchData(parsed);
      }
    } catch (error) {
      console.error("Error loading search data:", error);
    }
  }, []);

  // Get guests information from search data
  const getGuestsInfo = () => {
    if (!searchData) return null;
    
    // Handle both old format (adults, children, rooms as number) and new format (rooms as array)
    let adults = searchData.adults || 1;
    let children = searchData.children || 0;
    let rooms = 1;
    
    // If rooms is an array, calculate totals from rooms
    if (Array.isArray(searchData.rooms) && searchData.rooms.length > 0) {
      rooms = searchData.rooms.length;
      adults = searchData.rooms.reduce((sum, room) => sum + (parseInt(room.adults) || 0), 0);
      children = searchData.rooms.reduce((sum, room) => sum + (parseInt(room.children) || 0), 0);
    } else if (typeof searchData.rooms === 'number') {
      rooms = searchData.rooms;
    } else if (searchData.roomCount) {
      rooms = searchData.roomCount;
    }
    
    return { adults, children, rooms };
  };

  return {
    searchData,
    getGuestsInfo,
  };
};


import { useEffect } from "react";
import { HOTEL_SEARCH_STORAGE_KEY } from "../constants/hotelSearch";

/**
 * Hook to persist and restore hotel search data from localStorage
 */
export const useLocalStoragePersistence = ({
  setDestination,
  setSearchTerm,
  setSelectedLocation,
  setCheckIn,
  setCheckOut,
  setRoomsData,
  destination,
  selectedLocation,
  checkIn,
  checkOut,
  rooms,
}) => {
  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(HOTEL_SEARCH_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);

        // Restore destination and location
        if (parsed.destination) {
          setDestination(parsed.destination);
          setSearchTerm(parsed.destination);
        }

        if (parsed.selectedLocation) {
          setSelectedLocation(parsed.selectedLocation);
        }

        // Restore dates - check-in first, then check-out
        if (parsed.checkIn) {
          setCheckIn(parsed.checkIn);

          // Only restore check-out if check-in exists and check-out is valid
          if (parsed.checkOut && parsed.checkOut > parsed.checkIn) {
            setCheckOut(parsed.checkOut);
          }
        }

        // Restore rooms data (new format)
        if (parsed.rooms && Array.isArray(parsed.rooms)) {
          setRoomsData(parsed.rooms);
        } 
        // Backward compatibility: convert old format to new format
        else if (parsed.adults || parsed.children || parsed.roomCount) {
          const roomCount = parsed.roomCount || parsed.rooms || 1;
          const totalAdults = parsed.adults || 1;
          const totalChildren = parsed.children || 0;
          const childrenAges = parsed.childrenAges || [];

          // Distribute guests across rooms
          const adultsPerRoom = Math.floor(totalAdults / roomCount);
          const childrenPerRoom = Math.floor(totalChildren / roomCount);
          const remainingAdults = totalAdults % roomCount;
          const remainingChildren = totalChildren % roomCount;

          const convertedRooms = [];
          let childAgeIndex = 0;

          for (let i = 0; i < roomCount; i++) {
            const roomAdults = adultsPerRoom + (i === 0 ? remainingAdults : 0);
            const roomChildren = childrenPerRoom + (i === 0 ? remainingChildren : 0);
            
            const roomChildAges = [];
            for (let j = 0; j < roomChildren; j++) {
              if (childAgeIndex < childrenAges.length) {
                roomChildAges.push(childrenAges[childAgeIndex]);
                childAgeIndex++;
              } else {
                roomChildAges.push(1);
              }
            }

            convertedRooms.push({
              adults: roomAdults,
              children: roomChildren,
              childAges: roomChildAges,
            });
          }

          setRoomsData(convertedRooms);
        }
      }
    } catch (error) {
      console.error(
        "Error loading hotel search data from localStorage:",
        error
      );
      // Clear corrupted data
      try {
        localStorage.removeItem(HOTEL_SEARCH_STORAGE_KEY);
      } catch (clearError) {
        // Ignore clear errors
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      const dataToSave = {
        destination: destination || "",
        selectedLocation: selectedLocation || null,
        checkIn: checkIn || "",
        checkOut: checkOut || "",
        rooms: rooms || [],
      };

      // Only save if there's meaningful data
      if (
        dataToSave.destination ||
        dataToSave.checkIn ||
        dataToSave.checkOut
      ) {
        localStorage.setItem(
          HOTEL_SEARCH_STORAGE_KEY,
          JSON.stringify(dataToSave)
        );
      }
    } catch (error) {
      console.error("Error saving hotel search data to localStorage:", error);
    }
  }, [destination, selectedLocation, checkIn, checkOut, rooms]);
};


import { useState, useCallback } from "react";
import { MAX_ROOMS } from "../constants/hotelSearch";

// Default room structure
const createDefaultRoom = () => ({
  adults: 1,
  children: 0,
  childAges: [],
});

export const useGuestManagement = () => {
  // Initialize with one room
  const [rooms, setRooms] = useState([createDefaultRoom()]);

  // Add a new room
  const addRoom = useCallback(() => {
    setRooms((prev) => {
      if (prev.length >= MAX_ROOMS) return prev;
      return [...prev, createDefaultRoom()];
    });
  }, []);

  // Remove a room by index
  const removeRoom = useCallback((roomIndex) => {
    setRooms((prev) => {
      if (prev.length <= 1) return prev; // Keep at least one room
      return prev.filter((_, index) => index !== roomIndex);
    });
  }, []);

  // Update guests in a specific room
  const updateRoomGuests = useCallback((roomIndex, type, operation) => {
    setRooms((prev) => {
      const newRooms = [...prev];
      const room = newRooms[roomIndex];
      
      const newValue = operation === "increment" ? room[type] + 1 : room[type] - 1;
      const finalValue = Math.max(type === "adults" ? 1 : 0, newValue);

      newRooms[roomIndex] = {
        ...room,
        [type]: finalValue,
      };

      // Handle children ages when children count changes
      if (type === "children") {
        if (operation === "increment") {
          newRooms[roomIndex].childAges = [...room.childAges, 1];
        } else if (finalValue < room[type]) {
          newRooms[roomIndex].childAges = room.childAges.slice(0, -1);
        }
      }

      return newRooms;
    });
  }, []);

  // Update child age in a specific room
  const updateRoomChildAge = useCallback((roomIndex, childIndex, age) => {
    setRooms((prev) => {
      const newRooms = [...prev];
      const room = newRooms[roomIndex];
      const newChildAges = [...room.childAges];
      newChildAges[childIndex] = parseInt(age, 10);
      
      newRooms[roomIndex] = {
        ...room,
        childAges: newChildAges,
      };
      
      return newRooms;
    });
  }, []);

  // Set rooms data (for localStorage restoration)
  const setRoomsData = useCallback((roomsData) => {
    setRooms(roomsData);
  }, []);

  // Calculate total guests
  const totalGuests = rooms.reduce((sum, room) => sum + room.adults + room.children, 0);
  
  // Calculate total adults
  const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
  
  // Calculate total children
  const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0);

  // Legacy format for compatibility (for display)
  const guests = {
    adults: totalAdults,
    children: totalChildren,
    rooms: rooms.length,
  };

  // Get all children ages in a flat array (for legacy compatibility)
  const childrenAges = rooms.flatMap(room => room.childAges);

  return {
    rooms,
    guests,
    childrenAges,
    totalGuests,
    addRoom,
    removeRoom,
    updateRoomGuests,
    updateRoomChildAge,
    setRoomsData,
  };
};


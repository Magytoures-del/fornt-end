"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import i18n from "../config/i18n";

// Initial state
const initialState = {
  departure: "",
  arrival: "",
  startDate: "",
  endDate: "",
  tripType: "oneway",
  directFlight: false,
  cabinClass: "economy",
  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
  },
  showCalendar: false,
  isLoading: false,
};

// Action types
const ActionTypes = {
  SET_DEPARTURE: "SET_DEPARTURE",
  SET_ARRIVAL: "SET_ARRIVAL",
  SET_START_DATE: "SET_START_DATE",
  SET_END_DATE: "SET_END_DATE",
  SET_TRIP_TYPE: "SET_TRIP_TYPE",
  SET_DIRECT_FLIGHT: "SET_DIRECT_FLIGHT",
  SET_CABIN_CLASS: "SET_CABIN_CLASS",
  SET_PASSENGERS: "SET_PASSENGERS",
  SET_SHOW_CALENDAR: "SET_SHOW_CALENDAR",
  SET_LOADING: "SET_LOADING",
  RESET_FORM: "RESET_FORM",
  LOAD_FROM_STORAGE: "LOAD_FROM_STORAGE",
};

// Reducer function
function searchFormReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_DEPARTURE:
      return { ...state, departure: action.payload };
    case ActionTypes.SET_ARRIVAL:
      return { ...state, arrival: action.payload };
    case ActionTypes.SET_START_DATE:
      return { ...state, startDate: action.payload };
    case ActionTypes.SET_END_DATE:
      return { ...state, endDate: action.payload };
    case ActionTypes.SET_TRIP_TYPE:
      // Clear endDate when switching to oneway
      if (action.payload === "oneway") {
        return { ...state, tripType: action.payload, endDate: "" };
      }
      return { ...state, tripType: action.payload };
    case ActionTypes.SET_DIRECT_FLIGHT:
      return { ...state, directFlight: action.payload };
    case ActionTypes.SET_CABIN_CLASS:
      return { ...state, cabinClass: action.payload };
    case ActionTypes.SET_PASSENGERS:
      return { ...state, passengers: action.payload };
    case ActionTypes.SET_SHOW_CALENDAR:
      return { ...state, showCalendar: action.payload };
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionTypes.RESET_FORM:
      return { ...initialState };
    case ActionTypes.LOAD_FROM_STORAGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Create context
const SearchFormContext = createContext();

// Local storage helper functions
const LOCAL_STORAGE_KEY = "flymoon_search_form";

const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};

// Provider component
export function SearchFormProvider({ children, onSubmit }) {
  const [state, dispatch] = useReducer(searchFormReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      dispatch({ type: ActionTypes.LOAD_FROM_STORAGE, payload: savedData });
    }
  }, []);

  // Save to localStorage whenever form data changes
  useEffect(() => {
    const dataToSave = {
      departure: state.departure,
      arrival: state.arrival,
      startDate: state.startDate,
      endDate: state.endDate,
      tripType: state.tripType,
      directFlight: state.directFlight,
      cabinClass: state.cabinClass,
      passengers: state.passengers,
    };

    // Only save if there's meaningful data
    if (state.departure || state.arrival || state.startDate) {
      saveToLocalStorage(dataToSave);
    }
  }, [
    state.departure,
    state.arrival,
    state.startDate,
    state.endDate,
    state.tripType,
    state.directFlight,
    state.cabinClass,
    state.passengers,
  ]);

  // Action creators
  const actions = {
    setDeparture: (departure) =>
      dispatch({ type: ActionTypes.SET_DEPARTURE, payload: departure }),
    setArrival: (arrival) =>
      dispatch({ type: ActionTypes.SET_ARRIVAL, payload: arrival }),
    setStartDate: (date) =>
      dispatch({ type: ActionTypes.SET_START_DATE, payload: date }),
    setEndDate: (date) =>
      dispatch({ type: ActionTypes.SET_END_DATE, payload: date }),
    setTripType: (type) =>
      dispatch({ type: ActionTypes.SET_TRIP_TYPE, payload: type }),
    setDirectFlight: (direct) =>
      dispatch({ type: ActionTypes.SET_DIRECT_FLIGHT, payload: direct }),
    setCabinClass: (cabin) =>
      dispatch({ type: ActionTypes.SET_CABIN_CLASS, payload: cabin }),
    setPassengers: (passengers) =>
      dispatch({ type: ActionTypes.SET_PASSENGERS, payload: passengers }),
    setShowCalendar: (show) =>
      dispatch({ type: ActionTypes.SET_SHOW_CALENDAR, payload: show }),
    setLoading: (loading) =>
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    resetForm: () => dispatch({ type: ActionTypes.RESET_FORM }),

    // Utility functions
    swapLocations: () => {
      const temp = state.departure;
      dispatch({ type: ActionTypes.SET_DEPARTURE, payload: state.arrival });
      dispatch({ type: ActionTypes.SET_ARRIVAL, payload: temp });
    },

    // Form validation
    isFormValid: () => {
      return state.departure && state.arrival && state.startDate;
    },

    // Get passenger count text
    getPassengerText: () => {
      const { adults, children, infants } = state.passengers;
      const total = adults + children + infants;

      if (total === 1) {
        return i18n.t("flights.passengers.count_one");
      } else if (total === 2) {
        return i18n.t("flights.passengers.count_two");
      } else if (total <= 10) {
        return i18n.t("flights.passengers.count_few", { count: total });
      } else {
        return i18n.t("flights.passengers.count_many", { count: total });
      }
    },

    // Clear localStorage
    clearStorage: () => {
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    },

    // Handle form submission
    handleSubmit: () => {
      // If no submit handler provided, indicate not handled
      if (!onSubmit) return false;

      if (state.departure && state.arrival && state.startDate) {
        // Extract IATA code from a label like "Cairo (CAI)"; fallback to raw value
        const extractAirportCode = (val) => {
          if (!val) return "";
          const match = val.match(/\(([A-Z]{3})\)/);
          return match ? match[1] : val;
        };

        // Format date - handle both single date and date range for round trips
        let formattedDate = "";
        if (state.startDate) {
          const startDateFormatted = new Date(state.startDate)
            .toISOString()
            .split("T")[0];
          if (state.tripType === "roundtrip" && state.endDate) {
            // Round trip with return date - use startDate_endDate format
            const endDateFormatted = new Date(state.endDate)
              .toISOString()
              .split("T")[0];
            formattedDate = `${startDateFormatted}_${endDateFormatted}`;
          } else {
            // One way or round trip without return date
            formattedDate = startDateFormatted;
          }
        }

        const searchData = {
          origin: extractAirportCode(state.departure),
          destination: extractAirportCode(state.arrival),
          date: formattedDate,
          direct: state.directFlight ? "true" : "false",
          adults: state.passengers.adults.toString(),
          children: state.passengers.children.toString(),
          infants: state.passengers.infants.toString(),
          cabinClass:
            state.cabinClass === "economy"
              ? "E"
              : state.cabinClass === "business"
              ? "B"
              : "F",
        };
        onSubmit(searchData);
        return true;
      }
      return false;
    },
  };

  return (
    <SearchFormContext.Provider value={{ state, actions }}>
      {children}
    </SearchFormContext.Provider>
  );
}

// Custom hook to use the context
export function useSearchForm() {
  const context = useContext(SearchFormContext);
  if (!context) {
    throw new Error("useSearchForm must be used within a SearchFormProvider");
  }
  return context;
}

export default SearchFormContext;

/**
 * Booking Response Utilities
 * Helper functions to extract and format booking response data
 */

/**
 * Extract booking summary from API response
 */
export const extractBookingSummary = (bookingResponse) => {
  const data = bookingResponse?.data?.data;
  if (!data) return null;

  return {
    tui: data.TUI,
    transactionId: data.TransactionID,
    currency: data.CurrencyCode,
    netAmount: data.NetAmount,
    grossAmount: data.GrossAmount,
    passengers: {
      adults: data.ADT || 0,
      children: data.CHD || 0,
      infants: data.INF || 0,
      youth: data.YTH || 0,
    },
    hold: data.Hold,
    mode: data.Mode,
    tripId: data.TripID,
  };
};

/**
 * Extract flight details from booking response
 */
export const extractBookingFlights = (bookingResponse) => {
  const trips = bookingResponse?.data?.data?.Trips;
  if (!Array.isArray(trips) || trips.length === 0) return [];

  return trips.flatMap((trip) =>
    trip.Journey.map((journey) => ({
      provider: journey.Provider,
      stops: journey.Stops,
      grossFare: journey.GrossFare,
      netFare: journey.NetFare,
      segments: journey.Segments.map((segment) => ({
        flightNumber: segment.Flight.FlightNo,
        airline: segment.Flight.Airline.split("|")[0],
        aircraft: segment.Flight.Aircraft,
        departure: {
          code: segment.Flight.DepartureCode,
          airport: segment.Flight.DepAirportName,
          terminal: segment.Flight.DepartureTerminal,
          time: segment.Flight.DepartureTime,
        },
        arrival: {
          code: segment.Flight.ArrivalCode,
          airport: segment.Flight.ArrAirportName,
          terminal: segment.Flight.ArrivalTerminal,
          time: segment.Flight.ArrivalTime,
        },
        duration: segment.Flight.Duration,
        cabin: segment.Flight.Cabin,
        refundable: segment.Flight.Refundable === "Y",
      })),
    }))
  );
};

/**
 * Extract baggage allowance from booking response
 */
export const extractBookingBaggage = (bookingResponse) => {
  const ssr = bookingResponse?.data?.data?.SSR;
  if (!Array.isArray(ssr) || ssr.length === 0) return {};

  const baggageItems = ssr.filter((item) => item.Code === "BAG");

  return baggageItems.map((item) => ({
    passengerType: item.PTC,
    passengerId: item.PaxId,
    description: item.Description,
    pieceDescription: item.PieceDescription,
    charge: item.Charge,
  }));
};

/**
 * Extract fare rules from booking response
 */
export const extractFareRules = (bookingResponse) => {
  const rules = bookingResponse?.data?.data?.Rules;
  if (!Array.isArray(rules) || rules.length === 0) return [];

  return rules.map((rule) => ({
    route: rule.OrginDestination,
    provider: rule.Provider,
    fareRuleText: rule.FareRuleText,
  }));
};

/**
 * Check if booking is on hold
 */
export const isBookingOnHold = (bookingResponse) => {
  return bookingResponse?.data?.data?.Hold === true;
};

/**
 * Get booking confirmation message
 */
export const getBookingMessage = (bookingResponse) => {
  return (
    bookingResponse?.data?.message ||
    bookingResponse?.message ||
    "Booking processed"
  );
};

/**
 * Format booking data for display
 */
export const formatBookingForDisplay = (bookingResponse) => {
  if (!bookingResponse?.data?.data) return null;

  const summary = extractBookingSummary(bookingResponse);
  const flights = extractBookingFlights(bookingResponse);
  const baggage = extractBookingBaggage(bookingResponse);
  const rules = extractFareRules(bookingResponse);

  return {
    summary,
    flights,
    baggage,
    rules,
    isOnHold: isBookingOnHold(bookingResponse),
    message: getBookingMessage(bookingResponse),
    timestamp: bookingResponse?.data?.timestamp || new Date().toISOString(),
  };
};


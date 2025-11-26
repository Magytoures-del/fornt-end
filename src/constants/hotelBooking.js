/**
 * Hotel Booking Constants
 * Centralized constants for hotel booking flow
 */

// Booking steps
export const HOTEL_BOOKING_STEPS = {
  GUEST_DETAILS: 1,
  PAYMENT: 2,
  CONFIRMATION: 3,
};

// Booking status
export const HOTEL_BOOKING_STATUS = {
  PENDING: "pending",
  CREATED: "created",
  CONFIRMED: "confirmed",
  FAILED: "failed",
  CANCELLED: "cancelled",
};

// API endpoints
export const HOTEL_BOOKING_API = {
  PRICE: (searchId, hotelId, providerName, recommendationId) =>
    `/api/hotels/details/${searchId}/${hotelId}/price/${providerName}/${recommendationId}`,
  CONTENT: (searchId, hotelId, priceProvider) =>
    `/api/hotels/details/${searchId}/${hotelId}/content?priceProvider=${encodeURIComponent(priceProvider)}`,
  CREATE_ITINERARY: "/api/hotels/itinerary/create",
  START_PAYMENT: "/api/hotels/payment/start",
  PAYTABS_INITIATE: "/api/hotels/payment/paytabs/initiate",
  RETRIEVE_BOOKING: "/api/hotels/booking/retrieve",
};

// Default booking data structure
export const DEFAULT_BOOKING_DATA = {
  hotel: {
    name: undefined,
    location: undefined,
    rating: undefined,
    image: undefined,
    description: undefined,
    amenities: undefined,
    address: undefined,
    hotelId: undefined,
    providerName: undefined,
    geoCode: undefined,
    contact: undefined,
    checkinInfo: undefined,
    checkoutInfo: undefined,
    reviews: undefined,
    policies: undefined,
    fees: undefined,
    images: undefined,
  },
  room: {
    price: undefined,
    totalPrice: undefined,
    originalPrice: undefined,
    nights: undefined,
    guests: undefined,
    name: undefined,
    roomGroupId: undefined,
    roomId: undefined,
    providerName: undefined,
    providerId: undefined,
    refundable: undefined,
    refundability: undefined,
    boardBasis: undefined,
    policies: undefined,
    priceId: undefined,
    hotelId: undefined,
    conversionRate: undefined,
    currency: undefined,
    occupancies: [],
  },
  dates: {
    checkIn: undefined,
    checkOut: undefined,
    checkInFormatted: undefined,
    checkOutFormatted: undefined,
  },
  guest: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneCode: "+966",
    nationality: "",
    specialRequests: "",
  },
  payment: {
    method: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  },
};

// Default contact info (should be moved to config/env)
export const DEFAULT_CONTACT_INFO = {
  Title: "Ms",
  FName: "REXY",
  LName: "RAJU",
  Mobile: "1234123412",
  Email: "booking@flymoonsa.com",
  Address: "AKBAR ONLINE BOOKING COMPANY PVT LTD",
  State: "Maharashtra",
  City: "Near Crawford market Mumbai",
  PIN: "400003",
  GSTCompanyName: "",
  GSTTIN: "",
  GSTMobile: "",
  GSTEmail: "",
  UpdateProfile: true,
  IsGuest: false,
  CountryCode: "IN",
  MobileCountryCode: "+91",
  NetAmount: "",
};

/**
 * Builds retrieve booking request payload
 * @param {Object} params - Parameters for retrieve booking
 * @param {string} params.referenceNumber - Reference number or TransactionID
 * @param {string} [params.referenceType="T"] - Reference type (default: "T")
 * @param {string} [params.clientID] - Client ID
 * @param {string} [params.tui] - TUI value
 * @param {string} [params.serviceType] - Service type
 * @param {string} [params.requestMode="RB"] - Request mode (default: "RB")
 * @param {Object} [params.contact] - Contact information
 * @param {string} [params.name] - Name
 * @returns {Object} Retrieve booking request body
 */
export const buildRetrieveBookingPayload = ({
  referenceNumber,
  referenceType = "T",
  clientID = null,
  tui = null,
  serviceType = null,
  requestMode = "RB",
  contact = null,
  name = null,
}) => {
  return {
    TUI: tui,
    ReferenceType: referenceType,
    ReferenceNumber: referenceNumber,
    ServiceType: serviceType,
    ClientID: clientID,
    RequestMode: requestMode,
    Contact: contact,
    Name: name,
  };
};


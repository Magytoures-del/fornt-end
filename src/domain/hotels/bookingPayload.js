/**
 * Hotel Booking Payload Builder
 * Constructs booking request payloads from booking data
 */

import { DEFAULT_CONTACT_INFO } from "@/constants/hotelBooking";

/**
 * Builds guests array from occupancies and guest data
 */
export const buildGuestsArray = (occupancies, guestData) => {
  const guests = [];

  if (occupancies && Array.isArray(occupancies) && occupancies.length > 0) {
    occupancies.forEach((occupancy, index) => {
      // For adults
      for (let i = 0; i < (occupancy.numOfAdults || 1); i++) {
        guests.push({
          GuestID: `YGV${index}${i}` || "",
          Operation: "U",
          Title: "Mr",
          FirstName: index === 0 && i === 0 ? guestData.firstName : "",
          MiddleName: "",
          LastName: index === 0 && i === 0 ? guestData.lastName : "",
          MobileNo: index === 0 && i === 0 ? guestData.phone : "",
          PaxType: "A",
          Age: "",
          Email: index === 0 && i === 0 ? guestData.email : "",
          Pan: "",
        });
      }

      // For children
      if (occupancy.numOfChildren > 0) {
        for (let i = 0; i < occupancy.numOfChildren; i++) {
          guests.push({
            GuestID: `YGV${index}C${i}` || "",
            Operation: "U",
            Title: "Mr",
            FirstName: "",
            MiddleName: "",
            LastName: "",
            MobileNo: "",
            PaxType: "C",
            Age: occupancy.childAges?.[i] || "",
            Email: "",
            Pan: "",
          });
        }
      }
    });
  } else {
    // Default guest if no occupancies
    guests.push({
      GuestID: "YGVj",
      Operation: "U",
      Title: "Mr",
      FirstName: guestData.firstName || "",
      MiddleName: "",
      LastName: guestData.lastName || "",
      MobileNo: guestData.phone || "",
      PaxType: "A",
      Age: "",
      Email: guestData.email || "",
      Pan: "",
    });
  }

  return guests;
};

/**
 * Builds guest code from occupancies
 */
export const buildGuestCode = (occupancies) => {
  const firstOccupancy = occupancies?.[0];
  const numAdults = firstOccupancy?.numOfAdults || 1;
  const adultAge = firstOccupancy?.adultAge || "25";
  return `|${numAdults}|${numAdults}:A:${adultAge}|`;
};

/**
 * Builds rooms array for booking request
 */
export const buildRoomsArray = (roomData, guests, guestCode) => {
  return [
    {
      RoomId: roomData.roomId || "",
      GuestCode: guestCode,
      SupplierName: roomData.providerName || "",
      RoomGroupId: roomData.roomGroupId || "",
      Guests: guests,
    },
  ];
};

/**
 * Builds complete booking request payload
 */
export const buildHotelBookingPayload = ({
  searchId,
  hotelId,
  recommendationId,
  bookingData,
  priceId = null,
  searchTracingKey = null,
}) => {
  const { guest, room, dates } = bookingData;

  // Build contact info (using default for now, should be configurable)
  const contactInfo = { ...DEFAULT_CONTACT_INFO };

  // Build guests array
  const guests = buildGuestsArray(room.occupancies, guest);

  // Build guest code
  const guestCode = buildGuestCode(room.occupancies);

  // Build rooms array
  const rooms = buildRoomsArray(room, guests, guestCode);

  // Format dates
  const checkInDate =
    dates.checkInFormatted ||
    (dates.checkIn ? new Date(dates.checkIn).toISOString().split("T")[0] : "");
  const checkOutDate =
    dates.checkOutFormatted ||
    (dates.checkOut ? new Date(dates.checkOut).toISOString().split("T")[0] : "");

  // Build request body
  return {
    TUI: searchTracingKey || priceId || "c4af3c53-d3e3-4f60-b31d-a1f968ca62ad" || "",
    ServiceEnquiry: guest.specialRequests || "",
    ContactInfo: contactInfo,
    Auxiliaries: [
      {
        Code: "PROMO",
        Parameters: [
          { Type: "Code", Value: "" },
          { Type: "ID", Value: "" },
          { Type: "Amount", Value: "" },
        ],
      },
    ],
    Rooms: rooms,
    NetAmount: room.totalPrice?.toString() || "",
    ClientID: "",
    DeviceID: "",
    AppVersion: "",
    SearchId: searchId,
    RecommendationId: recommendationId,
    LocationName: null,
    HotelCode: hotelId,
    CheckInDate: checkInDate,
    CheckOutDate: checkOutDate,
    TravelingFor: "NTF",
  };
};


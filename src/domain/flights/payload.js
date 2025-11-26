/**
 * Flight Booking Payload Builder
 * Pure functions for constructing API request payloads
 */

import { FALLBACK_VALUES } from "@/constants/booking";

/**
 * Build the complete booking payload for create-itinerary API
 */
export const buildBookingPayload = ({
  pricingId,
  formData,
  travellers,
  netAmount,
}) => {
  return {
    TUI: pricingId,
    ServiceEnquiry: "",
    ContactInfo: buildContactInfo(formData),
    DestinationContactInfo: buildDestinationContactInfo(),
    Travellers: travellers,
    PLP: [],
    SSR: null,
    CrossSell: [],
    CrossSellAmount: 0,
    EnableFareMasking: false,
    SSRAmount: 0,
    DeviceID: "",
    AppVersion: "",
    AgentTourCode: "",
    NetAmount: netAmount,
    BRulesAccepted: "",
  };
};

/**
 * Build contact information from form data
 */
const buildContactInfo = (data) => {
  return {
    Title: data.title || "",
    FName: data.firstName || "",
    LName: data.lastName || "",
    Mobile: data.phoneNumber || FALLBACK_VALUES.MOBILE,
    DestMob: data.phoneNumber || FALLBACK_VALUES.MOBILE,
    Phone: "",
    Email: data.email || FALLBACK_VALUES.EMAIL,
    Language: "",
    Address: data.address || FALLBACK_VALUES.ADDRESS,
    CountryCode: data.countryCode || "IN",
    MobileCountryCode: data.mobileCountryCode || "+91",
    DestMobCountryCode: data.mobileCountryCode || "+91",
    State: data.state || FALLBACK_VALUES.STATE,
    City: data.city || FALLBACK_VALUES.CITY,
    PIN: data.pinCode || FALLBACK_VALUES.PIN,
    GSTCompanyName: "",
    GSTTIN: "",
    GstMobile: "",
    GSTEmail: "",
    UpdateProfile: false,
    IsGuest: false,
    SaveGST: false,
  };
};

/**
 * Build destination contact information (currently empty/defaults)
 */
const buildDestinationContactInfo = () => {
  return {
    Address1: "",
    Address2: "",
    City: "",
    Mobile: "",
    Phone: "",
    Email: "",
    CountryCode: "",
    MobileCountryCode: "+91",
    State: "",
    PIN: "",
  };
};


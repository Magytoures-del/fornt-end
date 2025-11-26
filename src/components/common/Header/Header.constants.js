/**
 * Header component constants
 * Centralized configuration for header behavior and styling
 */

// Paths that should always show scrolled header style
export const SCROLLED_HEADER_PATHS = [
  "/",
  "/flights",
  "/profile",
  "/hotels/results",
  "/hotels",
  "/hotels/booking",
  "/terms-and-conditions",
  "/privacy-policy",
];

// Language flag mappings
export const LANGUAGE_FLAGS = {
  ar: "/flags/sa.svg",
  en: "/flags/us.svg",
};

// Icon mappings for navigation items
export const NAV_ICON_MAP = {
  HiOutlineHome: "HiOutlineHome",
  HiOutlineGift: "HiOutlineGift",
  HiOutlineInformationCircle: "HiOutlineInformationCircle",
  HiOutlinePhone: "HiOutlinePhone",
  HiOutlinePaperAirplane: "HiOutlinePaperAirplane",
  HiOutlineBuildingOffice2: "HiOutlineBuildingOffice2",
  BiSolidPlaneAlt: "BiSolidPlaneAlt",
};

// Scroll threshold for header style change
export const SCROLL_THRESHOLD = 50;


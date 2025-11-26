/**
 * PDF Configuration for Flight Tickets
 * Flymoon Travel - Professional Ticket Layout
 */

import { rgb } from "pdf-lib";

// Page settings (A4 size)
export const PAGE = {
  WIDTH: 595.28,
  HEIGHT: 841.89,
  MARGIN: 40,
  INNER_WIDTH: 515.28, // WIDTH - 2 * MARGIN
};

// Brand colors
export const COLORS = {
  // Primary brand colors
  PRIMARY: rgb(0.0, 0.6, 0.3), // Green
  PRIMARY_LIGHT: rgb(0.85, 0.95, 0.9),
  PRIMARY_DARK: rgb(0.0, 0.4, 0.2),

  // Text colors
  TEXT_PRIMARY: rgb(0.1, 0.1, 0.1),
  TEXT_SECONDARY: rgb(0.3, 0.3, 0.3),
  TEXT_LIGHT: rgb(0.5, 0.5, 0.5),
  TEXT_WHITE: rgb(1, 1, 1),

  // Background colors
  BG_LIGHT: rgb(0.98, 0.98, 0.98),
  BG_GRAY: rgb(0.94, 0.94, 0.94),
  BG_WHITE: rgb(1, 1, 1),
  BG_WARNING: rgb(1, 0.98, 0.9),

  // Border colors
  BORDER_LIGHT: rgb(0.85, 0.85, 0.85),
  BORDER_MEDIUM: rgb(0.7, 0.7, 0.7),

  // Status colors
  STATUS_CONFIRMED: rgb(0.13, 0.7, 0.32),
  STATUS_PENDING: rgb(0.95, 0.61, 0.07),
  STATUS_CANCELLED: rgb(0.86, 0.12, 0.13),
};

// Font sizes
export const FONT_SIZE = {
  HEADING: 16,
  TITLE: 14,
  SUBTITLE: 12,
  BODY: 10,
  SMALL: 9,
  TINY: 8,
};

// Spacing
export const SPACING = {
  SECTION: 25,
  BLOCK: 15,
  LINE: 12,
  SMALL: 8,
};

// Company information
export const COMPANY_INFO = {
  name: "FLYING MOON TRAVELS",
  address: "MAKKAH AZEEZIYA_AZEEZIYA A42",
  phone: "+966 560 629 072",
  email: "najah@ducvago.com",
  logoPath: "public/light-logo.png",
};

// Status configuration
export const STATUS_CONFIG = {
  CONFIRMED: {
    color: COLORS.STATUS_CONFIRMED,
    label: "CONFIRMED",
  },
  PENDING: {
    color: COLORS.STATUS_PENDING,
    label: "PENDING",
  },
  CANCELLED: {
    color: COLORS.STATUS_CANCELLED,
    label: "CANCELLED",
  },
  TICKETED: {
    color: COLORS.STATUS_CONFIRMED,
    label: "TICKETED",
  },
};

export const getStatusConfig = (status) => {
  const statusUpper = String(status || "CONFIRMED").toUpperCase();
  return STATUS_CONFIG[statusUpper] || STATUS_CONFIG.CONFIRMED;
};

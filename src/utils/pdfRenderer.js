/**
 * PDF Renderer Functions
 * Modular rendering components for flight tickets
 */

import { readFile } from "fs/promises";
import path from "path";
import {
  PAGE,
  COLORS,
  FONT_SIZE,
  SPACING,
  COMPANY_INFO,
  getStatusConfig,
} from "../config/pdf.config.js";
import {
  safeText,
  formatDate,
  formatDateTime,
  formatTime,
  calculateDuration,
  formatCurrency,
  truncate,
  wrapText,
  formatStops,
  getCabinClass,
} from "./pdfHelpers.js";

/**
 * Render document header with company logo and info
 */
export const renderHeader = async (page, fonts, companyData, pdfDoc) => {
  const { regular, bold } = fonts;
  const company = { ...COMPANY_INFO, ...companyData };

  let y = PAGE.HEIGHT - PAGE.MARGIN;

  // Header background
  page.drawRectangle({
    x: PAGE.MARGIN,
    y: y - 70,
    width: PAGE.INNER_WIDTH,
    height: 70,
    color: COLORS.BG_LIGHT,
    borderColor: COLORS.BORDER_LIGHT,
    borderWidth: 1,
  });

  // Try to load and embed logo
  try {
    const logoPath = path.join(process.cwd(), company.logoPath);
    const logoBytes = await readFile(logoPath);

    let logoImage;
    try {
      logoImage = await pdfDoc.embedPng(logoBytes);
    } catch {
      try {
        logoImage = await pdfDoc.embedJpg(logoBytes);
      } catch {
        console.warn("Logo format not supported");
      }
    }

    if (logoImage) {
      const logoMaxWidth = 110;
      const logoMaxHeight = 50;
      const scale = Math.min(
        logoMaxWidth / logoImage.width,
        logoMaxHeight / logoImage.height
      );

      page.drawImage(logoImage, {
        x: PAGE.MARGIN + 15,
        y: y - 60,
        width: logoImage.width * scale,
        height: logoImage.height * scale,
      });
    }
  } catch (error) {
    // Draw placeholder if logo not found
    page.drawRectangle({
      x: PAGE.MARGIN + 15,
      y: y - 60,
      width: 110,
      height: 50,
      borderColor: COLORS.BORDER_MEDIUM,
      borderWidth: 1,
    });

    page.drawText("LOGO", {
      x: PAGE.MARGIN + 50,
      y: y - 40,
      size: FONT_SIZE.SMALL,
      font: regular,
      color: COLORS.TEXT_LIGHT,
    });
  }

  // Company information (right side)
  const infoX = PAGE.WIDTH - PAGE.MARGIN - 210;
  let infoY = y - 18;

  const infoItems = [
    { label: "Company", value: company.name },
    { label: "Address", value: truncate(company.address, 40) },
    { label: "Phone", value: company.phone },
    { label: "Email", value: company.email },
  ];

  infoItems.forEach((item) => {
    page.drawText(`${item.label}:`, {
      x: infoX,
      y: infoY,
      size: FONT_SIZE.SMALL,
      font: regular,
      color: COLORS.TEXT_SECONDARY,
    });

    page.drawText(item.value, {
      x: infoX + 60,
      y: infoY,
      size: FONT_SIZE.SMALL,
      font: bold,
      color: COLORS.TEXT_PRIMARY,
    });

    infoY -= SPACING.LINE;
  });

  return y - 70;
};

/**
 * Render booking reference section
 */
export const renderBookingInfo = (page, fonts, booking) => {
  const { regular, bold } = fonts;
  let y = PAGE.HEIGHT - PAGE.MARGIN - 80;

  // Background
  page.drawRectangle({
    x: PAGE.MARGIN,
    y: y - 50,
    width: PAGE.INNER_WIDTH,
    height: 50,
    color: COLORS.BG_GRAY,
    borderColor: COLORS.BORDER_LIGHT,
    borderWidth: 1,
  });

  // Booking Reference
  const refX = PAGE.MARGIN + 15;
  page.drawText("Booking Reference:", {
    x: refX,
    y: y - 20,
    size: FONT_SIZE.SMALL,
    font: regular,
    color: COLORS.TEXT_SECONDARY,
  });

  page.drawText(safeText(booking.bookingId), {
    x: refX + 120,
    y: y - 20,
    size: FONT_SIZE.TITLE,
    font: bold,
    color: COLORS.TEXT_PRIMARY,
  });

  // Booking Date
  page.drawText("Booking Date:", {
    x: refX,
    y: y - 38,
    size: FONT_SIZE.SMALL,
    font: regular,
    color: COLORS.TEXT_SECONDARY,
  });

  page.drawText(formatDate(booking.bookingDate || booking.createdAt), {
    x: refX + 120,
    y: y - 38,
    size: FONT_SIZE.BODY,
    font: bold,
    color: COLORS.TEXT_PRIMARY,
  });

  // Status badge (right side)
  const statusConfig = getStatusConfig(booking.status);
  const statusText = statusConfig.label;
  const statusWidth = statusText.length * 8 + 20;
  const statusX = PAGE.WIDTH - PAGE.MARGIN - statusWidth - 15;

  page.drawRectangle({
    x: statusX,
    y: y - 35,
    width: statusWidth,
    height: 24,
    color: statusConfig.color,
    borderWidth: 0,
  });

  page.drawText(statusText, {
    x: statusX + 10,
    y: y - 28,
    size: FONT_SIZE.SUBTITLE,
    font: bold,
    color: COLORS.TEXT_WHITE,
  });

  return y - 50;
};

/**
 * Render flight section header
 */
export const renderFlightHeader = (page, fonts, flight, direction, yPos) => {
  const { regular, bold } = fonts;
  let y = yPos - SPACING.SECTION;

  // Direction and route
  const fromCity = safeText(flight.fromCity || flight.from, "");
  const toCity = safeText(flight.toCity || flight.to, "");
  const routeText = `${direction}: ${fromCity} to ${toCity}`;

  page.drawText(routeText, {
    x: PAGE.MARGIN + 10,
    y,
    size: FONT_SIZE.HEADING,
    font: bold,
    color: COLORS.PRIMARY,
  });

  y -= SPACING.BLOCK;

  // Flight details line
  const flightDate = formatDate(flight.departureTime);
  const stops = formatStops(flight.stops);
  const duration = calculateDuration(flight.departureTime, flight.arrivalTime);
  const detailsText = `${flightDate} | ${stops} | ${duration}`;

  page.drawText(detailsText, {
    x: PAGE.MARGIN + 10,
    y,
    size: FONT_SIZE.BODY,
    font: regular,
    color: COLORS.TEXT_SECONDARY,
  });

  return y;
};

/**
 * Render airline and reference numbers
 */
export const renderAirlineInfo = (page, fonts, flight, yPos) => {
  const { regular, bold } = fonts;
  let y = yPos - SPACING.BLOCK;

  const x = PAGE.MARGIN + 10;

  // Airline name
  const airlineName = safeText(flight.airlineName || flight.airline, "Airline");

  page.drawText(airlineName, {
    x,
    y,
    size: FONT_SIZE.SUBTITLE,
    font: bold,
    color: COLORS.TEXT_PRIMARY,
  });

  // PNR / Airline Reference
  const refX = x + 200;

  page.drawText("PNR:", {
    x: refX,
    y,
    size: FONT_SIZE.SMALL,
    font: regular,
    color: COLORS.TEXT_SECONDARY,
  });

  const pnrValue = safeText(flight.pnr || flight.airlineRef, "N/A");

  page.drawRectangle({
    x: refX + 32,
    y: y - 4,
    width: 85,
    height: 18,
    color: COLORS.PRIMARY,
  });

  page.drawText(pnrValue, {
    x: refX + 38,
    y: y + 1,
    size: FONT_SIZE.BODY,
    font: bold,
    color: COLORS.TEXT_WHITE,
  });

  // CRS Reference
  const crsX = refX + 130;

  page.drawText("CRS:", {
    x: crsX,
    y,
    size: FONT_SIZE.SMALL,
    font: regular,
    color: COLORS.TEXT_SECONDARY,
  });

  const crsValue = safeText(flight.crsRef || flight.pnr, "N/A");

  page.drawRectangle({
    x: crsX + 32,
    y: y - 4,
    width: 85,
    height: 18,
    color: COLORS.PRIMARY,
  });

  page.drawText(crsValue, {
    x: crsX + 38,
    y: y + 1,
    size: FONT_SIZE.BODY,
    font: bold,
    color: COLORS.TEXT_WHITE,
  });

  return y;
};

/**
 * Render baggage info boxes
 */
export const renderBaggageInfo = (page, fonts, flight, yPos) => {
  const { regular, bold } = fonts;
  let y = yPos - SPACING.BLOCK;

  const boxWidth = 150;
  const boxHeight = 35;
  const spacing = 10;
  const startX = PAGE.MARGIN + 10;

  const baggageItems = [
    {
      label: "Travel Class",
      value: getCabinClass(flight.cabinClass || flight.travelClass),
    },
    {
      label: "Check-In Baggage",
      value: safeText(flight.checkedBaggage, "20 KG"),
    },
    {
      label: "Cabin Baggage",
      value: safeText(flight.cabinBaggage, "7 KG"),
    },
  ];

  baggageItems.forEach((item, index) => {
    const x = startX + (boxWidth + spacing) * index;

    // Box background
    page.drawRectangle({
      x,
      y: y - boxHeight,
      width: boxWidth,
      height: boxHeight,
      color: COLORS.PRIMARY_LIGHT,
      borderColor: COLORS.BORDER_LIGHT,
      borderWidth: 1,
    });

    // Label
    page.drawText(item.label, {
      x: x + 8,
      y: y - 12,
      size: FONT_SIZE.TINY,
      font: regular,
      color: COLORS.TEXT_SECONDARY,
    });

    // Value
    page.drawText(truncate(item.value, 20), {
      x: x + 8,
      y: y - 26,
      size: FONT_SIZE.BODY,
      font: bold,
      color: COLORS.TEXT_PRIMARY,
    });
  });

  return y - boxHeight;
};

/**
 * Render flight details table
 */
export const renderFlightTable = (page, fonts, flight, yPos) => {
  const { regular, bold } = fonts;
  let y = yPos - SPACING.BLOCK;

  const tableX = PAGE.MARGIN + 10;
  const tableWidth = PAGE.INNER_WIDTH - 20;
  const rowHeight = 28;
  const headerHeight = 24;

  // Table headers
  const columns = [
    { label: "Flight No.", width: 80 },
    { label: "From (Terminal)", width: 135 },
    { label: "Departure", width: 90 },
    { label: "To (Terminal)", width: 135 },
    { label: "Arrival", width: 90 },
  ];

  // Header background
  page.drawRectangle({
    x: tableX,
    y: y - headerHeight,
    width: tableWidth,
    height: headerHeight,
    color: COLORS.BG_GRAY,
    borderColor: COLORS.BORDER_LIGHT,
    borderWidth: 1,
  });

  // Header text
  let colX = tableX + 8;
  columns.forEach((col) => {
    page.drawText(col.label, {
      x: colX,
      y: y - 15,
      size: FONT_SIZE.SMALL,
      font: bold,
      color: COLORS.TEXT_PRIMARY,
    });
    colX += col.width;
  });

  y -= headerHeight;

  // Row data
  const fromCode = safeText(flight.fromCode || flight.from, "");
  const toCode = safeText(flight.toCode || flight.to, "");
  const fromTerminal = safeText(flight.fromTerminal, "1");
  const toTerminal = safeText(flight.toTerminal, "1");

  const rowData = [
    `${safeText(flight.flightNumber || flight.flightNo, "N/A")}`,
    `${fromCode} (T${fromTerminal})`,
    formatDateTime(flight.departureTime),
    `${toCode} (T${toTerminal})`,
    formatDateTime(flight.arrivalTime),
  ];

  // Row background
  page.drawRectangle({
    x: tableX,
    y: y - rowHeight,
    width: tableWidth,
    height: rowHeight,
    color: COLORS.BG_WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderWidth: 1,
  });

  // Row text
  colX = tableX + 8;
  rowData.forEach((data, index) => {
    page.drawText(truncate(data, 18), {
      x: colX,
      y: y - 18,
      size: FONT_SIZE.SMALL,
      font: regular,
      color: COLORS.TEXT_PRIMARY,
    });
    colX += columns[index].width;
  });

  // Draw vertical lines
  colX = tableX;
  columns.forEach((col) => {
    colX += col.width;
    page.drawLine({
      start: { x: colX, y: y + headerHeight },
      end: { x: colX, y: y - rowHeight },
      color: COLORS.BORDER_LIGHT,
      thickness: 1,
    });
  });

  return y - rowHeight;
};

/**
 * Render passenger information
 */
export const renderPassengers = (page, fonts, passengers, yPos) => {
  const { regular, bold } = fonts;
  let y = yPos - SPACING.SECTION;

  // Section title
  page.drawText("Passenger Information", {
    x: PAGE.MARGIN + 10,
    y,
    size: FONT_SIZE.HEADING,
    font: bold,
    color: COLORS.TEXT_PRIMARY,
  });

  y -= SPACING.BLOCK + 5;

  const tableX = PAGE.MARGIN + 10;
  const tableWidth = PAGE.INNER_WIDTH - 20;
  const rowHeight = 26;
  const headerHeight = 24;

  // Table headers
  const columns = [
    { label: "No.", width: 50 },
    { label: "Name", width: 200 },
    { label: "Type", width: 80 },
    { label: "Ticket Number", width: 180 },
  ];

  // Header background
  page.drawRectangle({
    x: tableX,
    y: y - headerHeight,
    width: tableWidth,
    height: headerHeight,
    color: COLORS.BG_GRAY,
    borderColor: COLORS.BORDER_LIGHT,
    borderWidth: 1,
  });

  // Header text
  let colX = tableX + 8;
  columns.forEach((col) => {
    page.drawText(col.label, {
      x: colX,
      y: y - 15,
      size: FONT_SIZE.SMALL,
      font: bold,
      color: COLORS.TEXT_PRIMARY,
    });
    colX += col.width;
  });

  y -= headerHeight;

  // Passenger rows
  passengers.forEach((passenger, index) => {
    const isEven = index % 2 === 0;
    const bgColor = isEven ? COLORS.BG_WHITE : COLORS.BG_LIGHT;

    // Row background
    page.drawRectangle({
      x: tableX,
      y: y - rowHeight,
      width: tableWidth,
      height: rowHeight,
      color: bgColor,
      borderColor: COLORS.BORDER_LIGHT,
      borderWidth: 1,
    });

    // Row data
    const fullName =
      passenger.fullName ||
      `${passenger.title || ""} ${passenger.firstName || ""} ${
        passenger.lastName || ""
      }`.trim() ||
      passenger.name ||
      "N/A";

    const rowData = [
      String(index + 1),
      truncate(fullName, 28),
      safeText(passenger.type, "Adult"),
      safeText(passenger.ticketNumber || passenger.ticketNo, "Pending"),
    ];

    colX = tableX + 8;
    rowData.forEach((data, colIndex) => {
      page.drawText(data, {
        x: colX,
        y: y - 17,
        size: FONT_SIZE.SMALL,
        font: regular,
        color: COLORS.TEXT_PRIMARY,
      });
      colX += columns[colIndex].width;
    });

    y -= rowHeight;
  });

  // Draw vertical lines
  colX = tableX;
  const totalHeight = headerHeight + rowHeight * passengers.length;
  columns.forEach((col) => {
    colX += col.width;
    page.drawLine({
      start: { x: colX, y: y + totalHeight },
      end: { x: colX, y },
      color: COLORS.BORDER_LIGHT,
      thickness: 1,
    });
  });

  return y;
};

/**
 * Render fare summary
 */
export const renderFareSummary = (page, fonts, pricing, yPos) => {
  const { regular, bold } = fonts;
  let y = yPos - SPACING.SECTION;

  // Section title
  page.drawText("Fare Summary", {
    x: PAGE.MARGIN + 10,
    y,
    size: FONT_SIZE.HEADING,
    font: bold,
    color: COLORS.TEXT_PRIMARY,
  });

  y -= SPACING.BLOCK + 5;

  const currency = safeText(pricing.currency, "SAR");

  const fareItems = [
    {
      label: "Base Fare",
      amount: formatCurrency(pricing.baseFare || 0, currency),
    },
    {
      label: "Taxes & Fees",
      amount: formatCurrency(pricing.taxes || 0, currency),
    },
    {
      label: "Additional Services",
      amount: formatCurrency(pricing.ssrAmount || 0, currency),
    },
  ];

  const startX = PAGE.MARGIN + 10;

  // Fare items
  fareItems.forEach((item) => {
    page.drawText(item.label, {
      x: startX,
      y,
      size: FONT_SIZE.BODY,
      font: regular,
      color: COLORS.TEXT_SECONDARY,
    });

    page.drawText(item.amount, {
      x: PAGE.WIDTH - PAGE.MARGIN - 120,
      y,
      size: FONT_SIZE.BODY,
      font: bold,
      color: COLORS.TEXT_PRIMARY,
    });

    y -= SPACING.LINE + 2;
  });

  // Divider line
  y -= 5;
  page.drawLine({
    start: { x: startX, y },
    end: { x: PAGE.WIDTH - PAGE.MARGIN - 10, y },
    color: COLORS.BORDER_MEDIUM,
    thickness: 1.5,
  });

  y -= SPACING.LINE;

  // Total
  const totalAmount = pricing.total || pricing.totalPrice || 0;

  page.drawText("TOTAL AMOUNT", {
    x: startX,
    y,
    size: FONT_SIZE.TITLE,
    font: bold,
    color: COLORS.TEXT_PRIMARY,
  });

  page.drawText(formatCurrency(totalAmount, currency), {
    x: PAGE.WIDTH - PAGE.MARGIN - 120,
    y,
    size: FONT_SIZE.TITLE,
    font: bold,
    color: COLORS.PRIMARY,
  });

  return y;
};

/**
 * Render important notes
 */
export const renderNotes = (page, fonts, notes, yPos) => {
  const { regular, bold } = fonts;
  let y = yPos - SPACING.SECTION;

  if (!notes || notes.length === 0) return y;

  // Section title
  page.drawText("Important Notes", {
    x: PAGE.MARGIN + 10,
    y,
    size: FONT_SIZE.HEADING,
    font: bold,
    color: COLORS.TEXT_PRIMARY,
  });

  y -= SPACING.BLOCK;

  notes.forEach((note, index) => {
    const lines = wrapText(note, 85);
    const boxHeight = lines.length * 11 + 14;

    // Note box
    page.drawRectangle({
      x: PAGE.MARGIN + 10,
      y: y - boxHeight,
      width: PAGE.INNER_WIDTH - 20,
      height: boxHeight,
      color: COLORS.BG_WARNING,
      borderColor: COLORS.BORDER_LIGHT,
      borderWidth: 1,
    });

    // Note text
    let lineY = y - 12;
    lines.forEach((line) => {
      page.drawText(line, {
        x: PAGE.MARGIN + 20,
        y: lineY,
        size: FONT_SIZE.SMALL,
        font: regular,
        color: COLORS.TEXT_PRIMARY,
      });
      lineY -= 11;
    });

    y -= boxHeight + 8;
  });

  return y;
};

/**
 * Render footer with contact and website
 */
export const renderFooter = (page, fonts, companyData) => {
  const { regular } = fonts;
  const company = { ...COMPANY_INFO, ...companyData };

  const footerY = PAGE.MARGIN - 10;

  // Footer text
  const footerText = `For assistance, contact us: ${company.phone} | ${company.email}`;

  page.drawText(footerText, {
    x: PAGE.MARGIN + 10,
    y: footerY,
    size: FONT_SIZE.TINY,
    font: regular,
    color: COLORS.TEXT_LIGHT,
  });
};

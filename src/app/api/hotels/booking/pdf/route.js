/**
 * Hotel Booking PDF Generation API
 * POST /api/hotels/booking/pdf
 *
 * Generates beautiful professional hotel booking invoice PDFs
 */

import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import { PAGE, COMPANY_INFO, COLORS } from "../../../../../config/pdf.config.js";

// Runtime configuration
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helper functions
const safeText = (text) => {
  if (!text) return "";
  let safe = String(text);
  
  // Convert Arabic-Indic digits (٠-٩) to Western digits (0-9)
  const arabicIndicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  arabicIndicDigits.forEach((arabicDigit, index) => {
    safe = safe.replace(new RegExp(arabicDigit, 'g'), index.toString());
  });
  
  // Convert Persian/Arabic digits (۰-۹) to Western digits (0-9)
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  persianDigits.forEach((persianDigit, index) => {
    safe = safe.replace(new RegExp(persianDigit, 'g'), index.toString());
  });
  
  // Remove or replace Arabic characters with ASCII equivalents
  // Keep only ASCII printable characters (0x20-0x7E)
  safe = safe.replace(/[^\x20-\x7E]/g, "");
  
  return safe;
};

const formatDate = (dateString, locale = "en") => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return safeText(dateString);
    // Always use English locale for PDF to avoid encoding issues
    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    return safeText(formatted);
  } catch {
    return safeText(dateString);
  }
};

const formatCurrency = (amount, currency = "SAR") => {
  if (amount === null || amount === undefined) return "0.00";
  const numeric = Number(amount);
  const safeAmount = Number.isFinite(numeric) ? numeric : 0;
  return `${currency} ${safeAmount.toFixed(2)}`;
};

// Helper to draw a box with border
const drawBox = (page, x, y, width, height, bgColor = null, borderColor = null) => {
  if (bgColor) {
    page.drawRectangle({
      x,
      y: y - height,
      width,
      height,
      color: bgColor,
    });
  }
  if (borderColor) {
    page.drawRectangle({
      x,
      y: y - height,
      width,
      height,
      borderColor,
      borderWidth: 1,
    });
  }
};

// Helper to draw a line
const drawLine = (page, x1, y1, x2, y2, color, width = 1) => {
  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness: width,
    color,
  });
};

/**
 * POST handler - Generate PDF for hotel booking
 */
export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const bookingDetails = body?.bookingDetails || body?.retrieveResponse || body;
    const locale = body?.locale || "en";

    // Validate booking data
    if (!bookingDetails || (!bookingDetails.TransactionId && !bookingDetails.TransactionID)) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required booking data. Please provide TransactionId.",
        },
        { status: 400 }
      );
    }

    // Merge company information
    const companyData = {
      ...COMPANY_INFO,
      ...(body?.company || {}),
    };

    // Create PDF document
    const pdfDoc = await PDFDocument.create();

    // Embed fonts
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fonts = {
      regular: helvetica,
      bold: helveticaBold,
    };

    // Add first page
    let page = pdfDoc.addPage([PAGE.WIDTH, PAGE.HEIGHT]);
    let currentY = PAGE.HEIGHT - PAGE.MARGIN;

    // Color scheme for beautiful invoice
    const primaryBlue = rgb(0.0, 0.4, 0.8);
    const primaryGreen = COLORS.PRIMARY;
    const accentColor = rgb(0.2, 0.5, 0.9);
    const textDark = rgb(0.1, 0.1, 0.1);
    const textGray = rgb(0.4, 0.4, 0.4);
    const bgLight = rgb(0.97, 0.98, 1.0);
    const bgSection = rgb(0.95, 0.97, 1.0);
    const borderColor = rgb(0.85, 0.85, 0.85);
    const successGreen = rgb(0.13, 0.7, 0.32);

    // ============================================
    // BEAUTIFUL HEADER WITH GRADIENT EFFECT
    // ============================================
    const headerHeight = 120;
    const headerY = PAGE.HEIGHT - PAGE.MARGIN;
    
    // Header background with gradient effect (simulated with rectangles)
    page.drawRectangle({
      x: 0,
      y: headerY - headerHeight,
      width: PAGE.WIDTH,
      height: headerHeight,
      color: primaryBlue,
    });

    // Logo section
    try {
      const logoPath = path.join(process.cwd(), companyData.logoPath);
      const logoBytes = await readFile(logoPath);
      let logoImage;
      try {
        logoImage = await pdfDoc.embedPng(logoBytes);
      } catch {
        try {
          logoImage = await pdfDoc.embedJpg(logoBytes);
        } catch {
          // Logo not supported
        }
      }

      if (logoImage) {
        const logoMaxWidth = 120;
        const logoMaxHeight = 50;
        const scale = Math.min(
          logoMaxWidth / logoImage.width,
          logoMaxHeight / logoImage.height
        );
        page.drawImage(logoImage, {
          x: PAGE.MARGIN + 20,
          y: headerY - 60,
          width: logoImage.width * scale,
          height: logoImage.height * scale,
        });
      }
    } catch (error) {
      // Logo not found, continue without it
    }

    // Company info (right side in header)
    page.drawText(safeText(companyData.name), {
      x: PAGE.WIDTH - PAGE.MARGIN - 200,
      y: headerY - 25,
      size: 16,
      font: fonts.bold,
      color: rgb(1, 1, 1),
    });
    page.drawText(safeText(companyData.address || ""), {
      x: PAGE.WIDTH - PAGE.MARGIN - 200,
      y: headerY - 42,
      size: 9,
      font: fonts.regular,
      color: rgb(0.95, 0.95, 0.95),
    });
    page.drawText(safeText(companyData.phone || ""), {
      x: PAGE.WIDTH - PAGE.MARGIN - 200,
      y: headerY - 57,
      size: 9,
      font: fonts.regular,
      color: rgb(0.95, 0.95, 0.95),
    });
    if (companyData.email) {
      page.drawText(safeText(companyData.email), {
        x: PAGE.WIDTH - PAGE.MARGIN - 200,
        y: headerY - 72,
        size: 9,
        font: fonts.regular,
        color: rgb(0.95, 0.95, 0.95),
      });
    }

    // Invoice title
    page.drawText("HOTEL BOOKING INVOICE", {
      x: PAGE.MARGIN + 20,
      y: headerY - 100,
      size: 20,
      font: fonts.bold,
      color: rgb(1, 1, 1),
    });

    currentY = headerY - headerHeight - 30;

    // ============================================
    // BOOKING REFERENCE SECTION (Beautiful Box)
    // ============================================
    const hotelInfo = bookingDetails.HotelInfo || {};
    const transactionId = bookingDetails.TransactionId || bookingDetails.TransactionID || "-";
    const bookingConfirmationId = bookingDetails.BookingConfirmationId || "-";
    const tui = bookingDetails.TUI || "-";
    const bookingStatus = bookingDetails.BookingStatus || bookingDetails.CurrentStatus || "Confirmed";

    const refBoxHeight = 90;
    const refBoxY = currentY;
    
    // Reference box with shadow effect (simulated with multiple rectangles)
    drawBox(page, PAGE.MARGIN, refBoxY, PAGE.INNER_WIDTH, refBoxHeight, bgSection, borderColor);

    // Section title
    page.drawText("BOOKING REFERENCE", {
      x: PAGE.MARGIN + 15,
      y: refBoxY - 15,
      size: 11,
      font: fonts.bold,
      color: primaryBlue,
    });

    // Reference details in two columns
    let refY = refBoxY - 35;
    const leftCol = PAGE.MARGIN + 15;
    const rightCol = PAGE.MARGIN + 280;

    // Left column
    page.drawText("Transaction ID:", {
      x: leftCol,
      y: refY,
      size: 9,
      font: fonts.bold,
      color: textGray,
    });
    page.drawText(safeText(transactionId), {
      x: leftCol + 90,
      y: refY,
      size: 9,
      font: fonts.regular,
      color: textDark,
    });

    refY -= 15;
    page.drawText("Booking Confirmation:", {
      x: leftCol,
      y: refY,
      size: 9,
      font: fonts.bold,
      color: textGray,
    });
    page.drawText(safeText(bookingConfirmationId), {
      x: leftCol + 90,
      y: refY,
      size: 9,
      font: fonts.regular,
      color: textDark,
    });

    // Right column
    refY = refBoxY - 35;
    page.drawText("Status:", {
      x: rightCol,
      y: refY,
      size: 9,
      font: fonts.bold,
      color: textGray,
    });
    page.drawText(safeText(bookingStatus), {
      x: rightCol + 50,
      y: refY,
      size: 9,
      font: fonts.bold,
      color: successGreen,
    });

    refY -= 15;
    page.drawText("TUI:", {
      x: rightCol,
      y: refY,
      size: 9,
      font: fonts.bold,
      color: textGray,
    });
    page.drawText(safeText(tui.substring(0, 30)), {
      x: rightCol + 50,
      y: refY,
      size: 8,
      font: fonts.regular,
      color: textDark,
    });

    currentY = refBoxY - refBoxHeight - 25;

    // ============================================
    // HOTEL & GUEST INFORMATION (Two Column Layout)
    // ============================================
    const infoBoxHeight = 140;
    const infoBoxY = currentY;
    const colWidth = (PAGE.INNER_WIDTH - 20) / 2;

    // Hotel Information Box (Left)
    drawBox(page, PAGE.MARGIN, infoBoxY, colWidth, infoBoxHeight, bgLight, borderColor);
    
    page.drawText("HOTEL INFORMATION", {
      x: PAGE.MARGIN + 15,
      y: infoBoxY - 15,
      size: 11,
      font: fonts.bold,
      color: primaryBlue,
    });

    const hotelAddress = hotelInfo.HotelAddress || {};
    const fullAddress = [
      hotelAddress.AddressLine1,
      hotelAddress.AddressLine2,
      hotelAddress.City,
      hotelAddress.State,
      hotelAddress.Country,
      hotelAddress.ZIP,
    ]
      .filter(Boolean)
      .join(", ");

    let hotelY = infoBoxY - 35;
    page.drawText(safeText(hotelInfo.Name || "Hotel Name"), {
      x: PAGE.MARGIN + 15,
      y: hotelY,
      size: 10,
      font: fonts.bold,
      color: textDark,
    });
    hotelY -= 18;

    if (hotelInfo.StarRating) {
      const starCount = parseInt(hotelInfo.StarRating) || 0;
      const stars = "*".repeat(starCount);
      page.drawText(`${stars} ${safeText(hotelInfo.StarRating)} Star`, {
        x: PAGE.MARGIN + 15,
        y: hotelY,
        size: 9,
        font: fonts.regular,
        color: rgb(1, 0.65, 0),
      });
      hotelY -= 15;
    }

    if (fullAddress) {
      page.drawText(safeText(fullAddress), {
        x: PAGE.MARGIN + 15,
        y: hotelY,
        size: 8,
        font: fonts.regular,
        color: textGray,
      });
      hotelY -= 12;
    }

    if (hotelInfo.Phone) {
      page.drawText(`Phone: ${safeText(hotelInfo.Phone)}`, {
        x: PAGE.MARGIN + 15,
        y: hotelY,
        size: 8,
        font: fonts.regular,
        color: textGray,
      });
    }

    // Guest Information Box (Right)
    const contactInfo = bookingDetails.ContactInfo || {};
    const guestBoxX = PAGE.MARGIN + colWidth + 20;
    drawBox(page, guestBoxX, infoBoxY, colWidth, infoBoxHeight, bgLight, borderColor);
    
    page.drawText("GUEST INFORMATION", {
      x: guestBoxX + 15,
      y: infoBoxY - 15,
      size: 11,
      font: fonts.bold,
      color: primaryBlue,
    });

    let guestY = infoBoxY - 35;
    const contactName = [contactInfo.Title, contactInfo.FName, contactInfo.LName]
      .filter(Boolean)
      .join(" ");
    
    if (contactName) {
      page.drawText(safeText(contactName), {
        x: guestBoxX + 15,
        y: guestY,
        size: 10,
        font: fonts.bold,
        color: textDark,
      });
      guestY -= 18;
    }

    if (contactInfo.Email) {
      page.drawText(safeText(contactInfo.Email), {
        x: guestBoxX + 15,
        y: guestY,
        size: 8,
        font: fonts.regular,
        color: textGray,
      });
      guestY -= 12;
    }

    if (contactInfo.Mobile) {
      const phoneText = contactInfo.MobileCountryCode 
        ? `${contactInfo.MobileCountryCode} ${contactInfo.Mobile}`
        : contactInfo.Mobile;
      page.drawText(safeText(phoneText), {
        x: guestBoxX + 15,
        y: guestY,
        size: 8,
        font: fonts.regular,
        color: textGray,
      });
    }

    currentY = infoBoxY - infoBoxHeight - 25;

    // ============================================
    // DATES SECTION (Beautiful Cards)
    // ============================================
    const dateBoxHeight = 70;
    const dateBoxY = currentY;
    const dateBoxWidth = (PAGE.INNER_WIDTH - 20) / 2;

    // Check-in Card
    drawBox(page, PAGE.MARGIN, dateBoxY, dateBoxWidth, dateBoxHeight, rgb(0.9, 0.95, 1.0), borderColor);
    page.drawText("CHECK-IN", {
      x: PAGE.MARGIN + 15,
      y: dateBoxY - 15,
      size: 9,
      font: fonts.bold,
      color: textGray,
    });
    page.drawText(formatDate(bookingDetails.CheckInDate, locale), {
      x: PAGE.MARGIN + 15,
      y: dateBoxY - 35,
      size: 14,
      font: fonts.bold,
      color: primaryBlue,
    });
    if (bookingDetails.CheckInTime) {
      page.drawText(safeText(bookingDetails.CheckInTime), {
        x: PAGE.MARGIN + 15,
        y: dateBoxY - 52,
        size: 8,
        font: fonts.regular,
        color: textGray,
      });
    }

    // Check-out Card
    const checkoutBoxX = PAGE.MARGIN + dateBoxWidth + 20;
    drawBox(page, checkoutBoxX, dateBoxY, dateBoxWidth, dateBoxHeight, rgb(0.9, 1.0, 0.95), borderColor);
    page.drawText("CHECK-OUT", {
      x: checkoutBoxX + 15,
      y: dateBoxY - 15,
      size: 9,
      font: fonts.bold,
      color: textGray,
    });
    page.drawText(formatDate(bookingDetails.CheckOutDate, locale), {
      x: checkoutBoxX + 15,
      y: dateBoxY - 35,
      size: 14,
      font: fonts.bold,
      color: successGreen,
    });
    if (bookingDetails.CheckOutTime) {
      page.drawText(safeText(bookingDetails.CheckOutTime), {
        x: checkoutBoxX + 15,
        y: dateBoxY - 52,
        size: 8,
        font: fonts.regular,
        color: textGray,
      });
    }

    currentY = dateBoxY - dateBoxHeight - 25;

    // ============================================
    // ROOMS & GUESTS DETAILS (Table Style)
    // ============================================
    const rooms = bookingDetails.Rooms || [];
    if (rooms.length > 0) {
      page.drawText("ROOM DETAILS", {
        x: PAGE.MARGIN,
        y: currentY,
        size: 12,
        font: fonts.bold,
        color: primaryBlue,
      });
      currentY -= 20;

      rooms.forEach((room, index) => {
        if (currentY < 150) {
          const newPage = pdfDoc.addPage([PAGE.WIDTH, PAGE.HEIGHT]);
          page = newPage;
          currentY = PAGE.HEIGHT - PAGE.MARGIN - 50;
        }

        const roomBoxHeight = 80 + (room.Guests?.length || 0) * 15;
        const roomBoxY = currentY;

        // Room box
        drawBox(page, PAGE.MARGIN, roomBoxY, PAGE.INNER_WIDTH, roomBoxHeight, bgLight, borderColor);

        // Room header
        page.drawText(`Room ${index + 1}: ${safeText(room.Name || "-")}`, {
          x: PAGE.MARGIN + 15,
          y: roomBoxY - 15,
          size: 11,
          font: fonts.bold,
          color: primaryBlue,
        });

        let roomY = roomBoxY - 35;
        
        // Room details
        const details = [];
        if (room.NumberOfAdults) details.push(`${room.NumberOfAdults} Adult(s)`);
        if (room.NumberOfChildren > 0) details.push(`${room.NumberOfChildren} Child(ren)`);
        if (room.Refundable === "True") details.push("Refundable");
        if (room.RoomBoardBasis?.[0]) details.push(room.RoomBoardBasis[0].name);

        if (details.length > 0) {
          page.drawText(details.join(" • "), {
            x: PAGE.MARGIN + 15,
            y: roomY,
            size: 8,
            font: fonts.regular,
            color: textGray,
          });
          roomY -= 15;
        }

        // Guests
        if (room.Guests && room.Guests.length > 0) {
          room.Guests.forEach((guest) => {
            const guestName = [guest.Title, guest.FirstName, guest.LastName]
              .filter(Boolean)
              .join(" ");
            page.drawText(`Guest: ${safeText(guestName)}`, {
              x: PAGE.MARGIN + 15,
              y: roomY,
              size: 8,
              font: fonts.regular,
              color: textDark,
            });
            roomY -= 12;
          });
        }

        // Room rate
        if (room.RoomRates && room.RoomRates.length > 0) {
          const rate = room.RoomRates[0];
          roomY -= 5;
          drawLine(page, PAGE.MARGIN + 15, roomY, PAGE.MARGIN + PAGE.INNER_WIDTH - 15, roomY, borderColor, 0.5);
          roomY -= 12;
          
          page.drawText("Rate Details:", {
            x: PAGE.MARGIN + 15,
            y: roomY,
            size: 8,
            font: fonts.bold,
            color: textGray,
          });
          roomY -= 12;
          
          if (rate.BaseRate) {
            page.drawText(`Base Rate: ${formatCurrency(rate.BaseRate, "SAR")}`, {
              x: PAGE.MARGIN + 25,
              y: roomY,
              size: 8,
              font: fonts.regular,
              color: textDark,
            });
            roomY -= 10;
          }
          
          if (rate.ServiceCharge > 0) {
            page.drawText(`Service Charge: ${formatCurrency(rate.ServiceCharge, "SAR")}`, {
              x: PAGE.MARGIN + 25,
              y: roomY,
              size: 8,
              font: fonts.regular,
              color: textDark,
            });
            roomY -= 10;
          }
          
          page.drawText(`Total: ${formatCurrency(rate.TotalRate, "SAR")}`, {
            x: PAGE.MARGIN + 25,
            y: roomY,
            size: 9,
            font: fonts.bold,
            color: primaryBlue,
          });
        }

        currentY = roomBoxY - roomBoxHeight - 15;
      });
    }

    // ============================================
    // PAYMENT SUMMARY (Highlighted Box)
    // ============================================
    if (currentY < 120) {
      const newPage = pdfDoc.addPage([PAGE.WIDTH, PAGE.HEIGHT]);
      page = newPage;
      currentY = PAGE.HEIGHT - PAGE.MARGIN - 50;
    }

    const paymentBoxHeight = 100;
    const paymentBoxY = currentY;
    
    // Payment summary box with accent color
    drawBox(page, PAGE.MARGIN, paymentBoxY, PAGE.INNER_WIDTH, paymentBoxHeight, rgb(0.95, 0.98, 1.0), primaryBlue);

    page.drawText("PAYMENT SUMMARY", {
      x: PAGE.MARGIN + 15,
      y: paymentBoxY - 15,
      size: 12,
      font: fonts.bold,
      color: primaryBlue,
    });

    let paymentY = paymentBoxY - 40;
    const grossFare = bookingDetails.GrossFare || bookingDetails.GrossAmount || 0;
    const netFare = bookingDetails.NetFare || bookingDetails.NetAmount || 0;

    // Payment details
    page.drawText("Gross Fare:", {
      x: PAGE.MARGIN + 15,
      y: paymentY,
      size: 10,
      font: fonts.regular,
      color: textGray,
    });
    page.drawText(formatCurrency(grossFare, "SAR"), {
      x: PAGE.MARGIN + PAGE.INNER_WIDTH - 150,
      y: paymentY,
      size: 10,
      font: fonts.regular,
      color: textDark,
    });

    paymentY -= 20;
    drawLine(page, PAGE.MARGIN + 15, paymentY, PAGE.MARGIN + PAGE.INNER_WIDTH - 15, paymentY, borderColor, 1);
    paymentY -= 20;

    // Total (highlighted)
    page.drawText("TOTAL AMOUNT:", {
      x: PAGE.MARGIN + 15,
      y: paymentY,
      size: 12,
      font: fonts.bold,
      color: textDark,
    });
    page.drawText(formatCurrency(netFare, "SAR"), {
      x: PAGE.MARGIN + PAGE.INNER_WIDTH - 150,
      y: paymentY,
      size: 14,
      font: fonts.bold,
      color: successGreen,
    });

    paymentY -= 15;
    page.drawText(`Payment Status: ${safeText(bookingDetails.PaymentStatus || "Paid")}`, {
      x: PAGE.MARGIN + 15,
      y: paymentY,
      size: 9,
      font: fonts.regular,
      color: textGray,
    });

    currentY = paymentBoxY - paymentBoxHeight - 25;

    // ============================================
    // FOOTER
    // ============================================
    const footerY = 50;
    drawLine(page, PAGE.MARGIN, footerY + 20, PAGE.MARGIN + PAGE.INNER_WIDTH, footerY + 20, borderColor, 0.5);
    
    const generatedDate = new Date().toLocaleDateString("en-US");
    page.drawText(
      safeText(`Generated on ${generatedDate}`),
      {
        x: PAGE.MARGIN,
        y: footerY,
        size: 8,
        font: fonts.regular,
        color: textGray,
      }
    );
    page.drawText(
      safeText(companyData.name),
      {
        x: PAGE.WIDTH - PAGE.MARGIN - 150,
        y: footerY,
        size: 8,
        font: fonts.regular,
        color: textGray,
      }
    );
    page.drawText(
      safeText("Thank you for your booking!"),
      {
        x: PAGE.MARGIN + PAGE.INNER_WIDTH / 2 - 80,
        y: footerY,
        size: 8,
        font: fonts.regular,
        color: primaryBlue,
      }
    );

    // ============================================
    // GENERATE AND RETURN PDF
    // ============================================

    const pdfBytes = await pdfDoc.save();
    const fileName = `hotel-booking-invoice-${transactionId}.pdf`;

    // Set response headers
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
    headers.set("Content-Length", String(pdfBytes.length));

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("[Hotel Booking PDF Generation Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate hotel booking PDF",
      },
      { status: 500 }
    );
  }
}

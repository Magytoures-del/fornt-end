/**
 * PDF Ticket Generation API
 * POST /api/tickets/pdf
 *
 * Generates professional flight ticket PDFs
 */

import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { PAGE, COMPANY_INFO } from "../../../../config/pdf.config.js";
import {
  renderHeader,
  renderBookingInfo,
  renderFlightHeader,
  renderAirlineInfo,
  renderBaggageInfo,
  renderFlightTable,
  renderPassengers,
  renderFareSummary,
  renderNotes,
  renderFooter,
} from "../../../../utils/pdfRenderer.js";

// Runtime configuration
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST handler - Generate PDF ticket
 */
export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const booking = body?.bookingData || body;

    // Validate booking data
    if (!booking || !booking.bookingId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required booking data. Please provide bookingId.",
        },
        { status: 400 }
      );
    }

    // Merge company information
    const companyData = {
      ...COMPANY_INFO,
      ...(body?.company || {}),
      ...(booking?.company || {}),
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
    const page = pdfDoc.addPage([PAGE.WIDTH, PAGE.HEIGHT]);

    // ============================================
    // RENDER PDF SECTIONS
    // ============================================

    // 1. Header with logo and company info
    let currentY = await renderHeader(page, fonts, companyData, pdfDoc);

    // 2. Booking reference section
    currentY = renderBookingInfo(page, fonts, booking);

    // 3. Flight details
    const flights = normalizeFlights(booking);

    if (flights.length > 0) {
      flights.forEach((flight, index) => {
        const direction = index === 0 ? "ONWARD" : "RETURN";

        // Flight header (route, date, duration)
        currentY = renderFlightHeader(page, fonts, flight, direction, currentY);

        // Airline info and PNR
        currentY = renderAirlineInfo(page, fonts, flight, currentY);

        // Baggage information boxes
        currentY = renderBaggageInfo(page, fonts, flight, currentY);

        // Flight details table
        currentY = renderFlightTable(page, fonts, flight, currentY);
      });
    }

    // 4. Passenger information
    const passengers = normalizePassengers(booking);

    if (passengers.length > 0) {
      currentY = renderPassengers(page, fonts, passengers, currentY);
    }

    // 5. Fare summary
    const pricing = normalizePricing(booking);
    currentY = renderFareSummary(page, fonts, pricing, currentY);

    // 6. Important notes
    const notes = normalizeNotes(booking);
    if (notes.length > 0) {
      currentY = renderNotes(page, fonts, notes, currentY);
    }

    // 7. Footer
    renderFooter(page, fonts, companyData);

    // ============================================
    // GENERATE AND RETURN PDF
    // ============================================

    const pdfBytes = await pdfDoc.save();
    const fileName = `ticket-${booking.bookingId}.pdf`;

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
    console.error("[PDF Generation Error]:", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate PDF ticket",
        details:
          process.env.NODE_ENV === "development"
            ? {
                message: error.message,
                stack: error.stack,
              }
            : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - Method not allowed
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed. Use POST with booking data.",
      example: {
        bookingData: {
          bookingId: "FM123456",
          bookingDate: "2025-10-03",
          status: "CONFIRMED",
          flights: [
            {
              fromCity: "Riyadh",
              toCity: "Dubai",
              departureTime: "2025-10-15T14:30:00",
              arrivalTime: "2025-10-15T17:45:00",
              flightNumber: "SV123",
              airline: "Saudi Arabian Airlines",
            },
          ],
          passengers: [
            {
              fullName: "Mr. John Doe",
              type: "Adult",
              ticketNumber: "TKT123456",
            },
          ],
          pricing: {
            baseFare: 500,
            taxes: 150,
            total: 650,
            currency: "SAR",
          },
        },
      },
    },
    { status: 405 }
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Normalize flight data to array format
 */
function normalizeFlights(booking) {
  if (Array.isArray(booking.flights) && booking.flights.length > 0) {
    return booking.flights;
  }

  if (booking.flight) {
    return [booking.flight];
  }

  // Fallback: try to construct from booking root
  if (booking.fromCity && booking.toCity) {
    return [
      {
        fromCity: booking.fromCity,
        toCity: booking.toCity,
        from: booking.from,
        to: booking.to,
        fromCode: booking.fromCode,
        toCode: booking.toCode,
        departureTime: booking.departureTime,
        arrivalTime: booking.arrivalTime,
        flightNumber: booking.flightNumber,
        airline: booking.airline,
        pnr: booking.pnr,
      },
    ];
  }

  return [];
}

/**
 * Normalize passenger data to array format
 */
function normalizePassengers(booking) {
  if (Array.isArray(booking.passengers) && booking.passengers.length > 0) {
    return booking.passengers;
  }

  if (booking.passengerInfo) {
    return Array.isArray(booking.passengerInfo)
      ? booking.passengerInfo
      : [booking.passengerInfo];
  }

  if (booking.passenger) {
    return [booking.passenger];
  }

  return [];
}

/**
 * Normalize pricing data
 */
function normalizePricing(booking) {
  if (booking.pricing) {
    return {
      baseFare: booking.pricing.baseFare || 0,
      taxes: booking.pricing.taxes || 0,
      ssrAmount: booking.pricing.ssrAmount || 0,
      total: booking.pricing.total || booking.pricing.totalPrice || 0,
      currency: booking.pricing.currency || "SAR",
    };
  }

  // Fallback to root level
  return {
    baseFare: booking.baseFare || 0,
    taxes: booking.taxes || 0,
    ssrAmount: booking.ssrAmount || 0,
    total: booking.total || booking.totalPrice || 0,
    currency: booking.currency || "SAR",
  };
}

/**
 * Normalize notes to array format
 */
function normalizeNotes(booking) {
  const notes = [];

  // Default important note
  notes.push(
    "Important: Transit Visa is required if traveling through two Schengen countries or having two stops in the same country."
  );

  notes.push(
    "Please arrive at the airport at least 3 hours before international departure."
  );

  // Add custom notes from booking
  if (booking.notes) {
    if (Array.isArray(booking.notes)) {
      notes.push(...booking.notes);
    } else {
      notes.push(booking.notes);
    }
  }

  if (booking.note) {
    notes.push(booking.note);
  }

  return notes;
}

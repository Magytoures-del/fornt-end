/**
 * Hotel Booking Voucher Download API
 * GET /api/hotels/booking/[transactionID]/voucher
 *
 * Downloads the booking voucher for a given transaction ID
 */

import { NextResponse } from "next/server";
import axios from "axios";

// Runtime configuration
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET handler for voucher download
 * @param {Request} request - The incoming request
 * @param {Object} context - Route context containing params
 */
export async function GET(request, { params }) {
  try {
    const { transactionID } = await params;

    if (!transactionID) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://apib2c.flymoonsa.com";

    // Fetch voucher from backend API
    const response = await axios.get(
      `${baseUrl}/api/hotels/booking/${transactionID}/voucher`,
      {
        responseType: "arraybuffer", // Handle binary data (PDF, etc.)
      }
    );

    // Determine content type from response headers or default to PDF
    const contentType =
      response.headers["content-type"] ||
      response.headers["Content-Type"] ||
      "application/pdf";

    // Return the voucher file with appropriate headers
    return new NextResponse(response.data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="hotel-booking-voucher-${transactionID}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error fetching voucher:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to fetch voucher";

    return NextResponse.json(
      { error: errorMessage },
      { status: error?.response?.status || 500 }
    );
  }
}

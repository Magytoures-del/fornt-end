import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get("term");
    const lan = searchParams.get("lan") || "ar-AE";

    // Validate required parameters
    if (!term) {
      return NextResponse.json(
        { error: "Missing required parameter: term" },
        { status: 400 }
      );
    }

    const res = await axios.get(
      "https://api.tequila.kiwi.com/locations/query",
      {
        params: {
          term: term,
          locale: lan,
          location_types: "city",
          limit: 5,
          active_only: true,
        },
        headers: {
          accept: "application/json",
          apikey: "DzzphWUXkgDUThzrRUWVHwr0ccQqRpNu",
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: res.data.locations,
      message: "Location search completed successfully.",
    });
  } catch (error) {
    console.error("Location search error:", error);
    return NextResponse.json(
      {
        error: "Failed to search locations",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}


import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const lan = searchParams.get("lan") || "ar-AE";

    // Validate required parameters
    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    const res = await axios.get("https://api.tequila.kiwi.com/locations/id", {
      params: {
        id,
        locale: lan,
        limit: 1,
        active_only: true,
      },
      headers: {
        accept: "application/json",
        apikey: "DzzphWUXkgDUThzrRUWVHwr0ccQqRpNu",
      },
    });

    return NextResponse.json({
      success: true,
      data: res.data.locations[0],
      message: "City retrieved successfully.",
    });
  } catch (error) {
    console.error("Get city by ID error:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve city",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}


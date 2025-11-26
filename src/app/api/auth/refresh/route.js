import axios from "axios";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3300";

export async function POST(request) {
  try {
    // Get authorization token from headers
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    // Proxy request to backend
    const response = await axios.post(
      `${BACKEND_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json({
      success: true,
      token: response.data.token,
      message: response.data.message || "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Token refresh API error:", error);
    const status = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.message || error.message || "Token refresh failed";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status }
    );
  }
}


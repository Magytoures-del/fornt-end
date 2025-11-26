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
    try {
      await axios.post(
        `${BACKEND_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      // Log but don't fail if backend logout fails
      console.warn("Backend logout failed:", error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout API error:", error);
    // Still return success as logout should clear local storage anyway
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  }
}


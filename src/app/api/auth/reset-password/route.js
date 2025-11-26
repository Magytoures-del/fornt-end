import axios from "axios";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3300";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    // Validate required fields
    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Token and new password are required" },
        { status: 400 }
      );
    }

    // Proxy request to backend
    const response = await axios.post(`${BACKEND_URL}/auth/reset-password`, {
      token,
      newPassword,
    });

    return NextResponse.json({
      success: true,
      message: response.data.message || "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password API error:", error);
    const status = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.message || error.message || "Password reset failed";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status }
    );
  }
}


import axios from "axios";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3300";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Proxy request to backend
    const response = await axios.post(`${BACKEND_URL}/auth/forgot-password`, {
      email,
    });

    return NextResponse.json({
      success: true,
      message: response.data.message || "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password API error:", error);
    const status = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Password reset request failed";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status }
    );
  }
}


import axios from "axios";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3300";

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Proxy request to backend
    const response = await axios.post(`${BACKEND_URL}/users/register`, body);

    return NextResponse.json({
      success: true,
      message: response.data.message || "Registration successful",
      token: response.data.token,
      user: response.data.user,
    });
  } catch (error) {
    console.error("Registration API error:", error);
    const status = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.message || error.message || "Registration failed";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status }
    );
  }
}


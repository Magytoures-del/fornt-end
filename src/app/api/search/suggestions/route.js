import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        suggestions: [],
      });
    }

    // Suggestions logic will be implemented here
    // This will provide autocomplete suggestions

    return NextResponse.json({
      success: true,
      suggestions: [],
      query,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

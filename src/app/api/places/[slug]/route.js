import { NextResponse } from "next/server";
import { getDestinationById } from "@/services/apiOffers";
import { cookies } from "next/headers";

export async function GET(request, { params }) {
  try {
    // Next.js 13+ params might be a promise
    const { slug } = await params;
    
    // Get language from cookies or query params
    const cookieStore = cookies();
    const languageFromCookie = cookieStore.get("i18next")?.value || 
                               cookieStore.get("language")?.value || 
                               "ar";
    
    // Also check query params as fallback
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("lang") || languageFromCookie;
    
    // Ensure we only return supported languages
    const validLanguage = language === "en" ? "en" : "ar";
    
    const result = await getDestinationById(slug, validLanguage);
    
    if (!result || result.error) {
      return NextResponse.json(
        { error: result?.error || "Destination not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch destination" },
      { status: 500 }
    );
  }
}


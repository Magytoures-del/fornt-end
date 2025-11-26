import axios from "axios";

export async function GET(request, { params }) {
  console.log("Hotel details content GET request received");
  try {
    const { searchId, hotelId } = await params;

    // Validate required parameters
    if (!searchId) {
      return Response.json(
        {
          success: false,
          error: "Missing required parameter: searchId",
        },
        { status: 400 }
      );
    }

    if (!hotelId) {
      return Response.json(
        {
          success: false,
          error: "Missing required parameter: hotelId",
        },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://apib2c.flymoonsa.com";

    // Extract query parameters (e.g., priceProvider)
    const { searchParams } = new URL(request.url);
    const priceProvider = searchParams.get("priceProvider");

    // Build query string if priceProvider exists
    let queryString = "";
    if (priceProvider) {
      queryString = `?priceProvider=${encodeURIComponent(priceProvider)}`;
    }

    // Forward the request to the backend API with query parameters
    const response = await axios.get(
      `${baseUrl}/api/hotels/details/${searchId}/${hotelId}/content${queryString}`
    );

    console.log("Hotel details content response:", response.data);

    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Hotel details content GET error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to fetch hotel details content";

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
